import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import { PredictionResponse } from "@/lib/predictionService";

interface PredictionResultProps {
  prediction: PredictionResponse | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onNewAnalysis: () => void;
  selectedSymptomsCount: number;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  prediction,
  isLoading,
  error,
  onRetry,
  onNewAnalysis,
  selectedSymptomsCount,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Activity className="h-8 w-8 text-primary animate-pulse" />
              <div className="absolute inset-0 h-8 w-8 border-2 border-primary/30 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Analyzing Your Symptoms</h3>
              <p className="text-muted-foreground">
                Our AI is processing {selectedSymptomsCount} symptoms to provide
                an accurate assessment...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-destructive">
                Analysis Failed
              </h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={onRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={onNewAnalysis}>New Analysis</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No prediction yet
  if (!prediction) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <Stethoscope className="h-8 w-8 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Ready for Analysis</h3>
              <p className="text-muted-foreground">
                Select your symptoms and click "Analyze Symptoms" to get your
                health assessment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state with prediction
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-50 border-green-200";
    if (confidence >= 0.6)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-orange-600 bg-orange-50 border-orange-200";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.6) return "Moderate Confidence";
    return "Low Confidence";
  };

  const confidencePercentage = Math.round(prediction.confidence * 100);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Prediction Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl">
                Health Assessment Complete
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Based on analysis of {prediction.selected_symptoms_count}{" "}
                selected symptoms
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Predicted Disease */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-primary">
              {prediction.prediction}
            </h2>

            <div className="flex items-center justify-center space-x-4">
              <Badge
                variant="secondary"
                className={`px-4 py-2 text-sm font-medium border ${getConfidenceColor(prediction.confidence)}`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {getConfidenceLabel(prediction.confidence)} (
                {confidencePercentage}%)
              </Badge>
            </div>
          </div>

          {/* Confidence Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm text-gray-900">
              Analysis Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">
                  Symptoms Analyzed:
                </span>
                <span className="ml-2 font-medium">
                  {prediction.symptoms_processed} / 377
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Confidence Level:</span>
                <span className="ml-2 font-medium">
                  {confidencePercentage}%
                </span>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    prediction.confidence >= 0.8
                      ? "bg-green-500"
                      : prediction.confidence >= 0.6
                        ? "bg-yellow-500"
                        : "bg-orange-500"
                  }`}
                  style={{ width: `${confidencePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Important:</strong> This assessment is for informational
          purposes only and should not replace professional medical advice.
          Please consult with a healthcare provider for proper diagnosis and
          treatment.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onNewAnalysis} size="lg" className="flex-1 max-w-xs">
          <RefreshCw className="h-4 w-4 mr-2" />
          New Symptom Analysis
        </Button>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p>
                <strong>Consult a Healthcare Professional:</strong> Schedule an
                appointment with a doctor to discuss your symptoms and get a
                proper diagnosis.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p>
                <strong>Monitor Your Symptoms:</strong> Keep track of any
                changes in your symptoms, their severity, and when they occur.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p>
                <strong>Emergency Care:</strong> Seek immediate medical
                attention if you experience severe symptoms or if your condition
                worsens.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
