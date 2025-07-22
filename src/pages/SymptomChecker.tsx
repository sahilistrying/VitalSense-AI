import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SymptomSelector } from "@/components/SymptomSelector";
import { useHealth } from "@/context/HealthContext";
import { directPredictionService } from "@/lib/directPredictionService";
import { useAuth } from "@/context/AuthContext";
import { saveHealthHistory } from "@/lib/authService";

export const SymptomChecker: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedSymptoms,
    setSelectedSymptoms,
    setCurrentPrediction,
    isLoading,
    setIsLoading,
    currentPrediction,
  } = useHealth();
  const { user } = useAuth();

  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelReady, setModelReady] = useState(false);
  const [symptomIdToName, setSymptomIdToName] = useState<Record<string, string>>({});

  // Load model on component mount
  useEffect(() => {
    const initializeModel = async () => {
      setModelLoading(true);
      try {
        const success = await directPredictionService.loadModel();
        setModelReady(success);
        if (!success) {
          setError(
            "Failed to load AI model. Please check if model files are available.",
          );
        }
      } catch (err) {
        setError("Error initializing AI model. Please try again later.");
        setModelReady(false);
      } finally {
        setModelLoading(false);
      }
    };

    initializeModel();
  }, []);

  useEffect(() => {
    fetch("/symptom_id_to_name (1).json")
      .then((res) => res.json())
      .then((data) => setSymptomIdToName(data));
  }, []);

  const handleSymptomsChange = (symptoms: string[]) => {
    setSelectedSymptoms(symptoms);
    // Clear previous results when symptoms change
    setPrediction(null);
    setShowResults(false);
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0 || !modelReady) return;

    setIsLoading(true);
    setError(null);
    setCurrentPrediction(null);

    try {
      // Use neural network model to predict disease
      const predictionResult = await directPredictionService.predictDisease(selectedSymptoms);

      // Update the prediction state with the disease name
      setPrediction(predictionResult.disease);
      setShowResults(true);

      // Update context for other components with enhanced information
      setCurrentPrediction({
        symptoms: selectedSymptoms,
        conditions: [
          {
            name: predictionResult.disease,
            probability: predictionResult.confidence,
            severity: predictionResult.triage.toLowerCase(),
            description: `AI-predicted condition based on ${selectedSymptoms.length} selected symptoms.`,
            recommendations: [
              `Recommended specialist: ${predictionResult.specialist}`,
              `Triage level: ${predictionResult.triage}`,
              "Consult with a healthcare professional for proper diagnosis",
              "Monitor your symptoms and note any changes",
            ],
          },
          // Add alternative predictions
          ...predictionResult.topPredictions.slice(1).map(pred => ({
            name: pred.disease,
            probability: pred.probability,
            severity: pred.triage.toLowerCase(),
            description: `Alternative diagnosis with ${(pred.probability * 100).toFixed(1)}% confidence.`,
            recommendations: [
              `Recommended specialist: ${pred.specialist}`,
              `Triage level: ${pred.triage}`,
              "Consider this as a possible alternative diagnosis",
            ],
          })),
        ],
        recommendations: [
          "This is an AI assessment for informational purposes only",
          "Professional medical evaluation is recommended",
          `Primary recommendation: Consult with a ${predictionResult.specialist}`,
          `Urgency level: ${predictionResult.triage}`,
        ],
        timestamp: new Date(),
      });

      // Convert symptom IDs to names using the mapping
      const symptomNames = selectedSymptoms.map(
        (id) => symptomIdToName[id] || id
      );

      // Save to Firebase
      if (user?.id) {
        await saveHealthHistory(user.id, {
          type: 'symptom_check',
          symptoms: symptomNames,
          disease: predictionResult.disease,
          specialist: predictionResult.specialist,
          triage: predictionResult.triage,
          confidence: predictionResult.confidence,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to analyze symptoms. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleNewAnalysis = () => {
    setPrediction(null);
    setError(null);
    setShowResults(false);
    setSelectedSymptoms([]);
  };

  // Model loading state
  if (modelLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>

            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Loading AI Model</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Initializing the neural network model for disease prediction...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analysis loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>

            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Analyzing Your Symptoms
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Processing {selectedSymptoms.length} symptoms through our neural
                network...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <nav className="text-sm text-muted-foreground">
              <span>Dashboard</span>
              <span className="mx-2">/</span>
              <span className="text-foreground">AI Symptom Checker</span>
            </nav>
          </div>

          {/* Model Status Alert */}
          {!modelReady && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                AI model is not available. Please ensure model files are
                properly configured.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results Display */}
          {showResults && prediction && currentPrediction ? (
            <div className="text-center py-16">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold text-primary mb-4">
                  {prediction}
                </h2>

                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="flex items-center gap-2 text-lg">
                    <span className="font-semibold">Recommended Specialist:</span>
                    <span className="text-primary">
                      {currentPrediction.conditions[0]?.recommendations[0]?.replace('Recommended specialist: ', '') || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-lg">
                    <span className="font-semibold">Triage Level:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentPrediction.conditions[0]?.severity === 'emergency' ? 'bg-red-100 text-red-700' :
                      currentPrediction.conditions[0]?.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      currentPrediction.conditions[0]?.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {currentPrediction.conditions[0]?.recommendations[1]?.replace('Triage level: ', '') || 'Unknown'}
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-8">
                  Based on analysis of {selectedSymptoms.length} selected symptoms
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleNewAnalysis} size="lg">
                    New Analysis
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <SymptomSelector
              selectedSymptoms={selectedSymptoms}
              onSymptomsChange={handleSymptomsChange}
              onNext={handleAnalyze}
            />
          )}
        </div>
      </div>
    </div>
  );
};
