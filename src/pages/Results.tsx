import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, Share2, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DiseaseCard } from "@/components/DiseaseCard";
import { TriageDisplay } from "@/components/TriageDisplay";
import { DoctorCard } from "@/components/DoctorCard";
import { useHealth } from "@/context/HealthContext";
import { getDoctorsBySpecialty } from "@/data/doctors";
import { formatSymptomName, generateHealthSummary } from "@/lib/healthUtils";
import { format } from "date-fns";

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedSymptoms,
    currentPrediction,
    addToHistory,
    setSelectedSymptoms,
    setCurrentPrediction,
  } = useHealth();

  useEffect(() => {
    // If no prediction available, redirect to symptom checker
    if (!currentPrediction || selectedSymptoms.length === 0) {
      navigate("/symptoms");
    }
  }, [currentPrediction, selectedSymptoms, navigate]);

  if (!currentPrediction) {
    return null;
  }

  const handleSaveToHistory = () => {
    const historyEntry = {
      date: new Date().toISOString(),
      symptoms: selectedSymptoms,
      prediction: currentPrediction,
      notes: `Symptom check completed on ${format(new Date(), "MMM d, yyyy")}`,
    };

    addToHistory(historyEntry);

    // Reset current session
    setSelectedSymptoms([]);
    setCurrentPrediction(null);

    navigate("/history");
  };

  const handleNewCheck = () => {
    setSelectedSymptoms([]);
    setCurrentPrediction(null);
    navigate("/symptoms");
  };

  const handleBack = () => {
    navigate("/symptoms");
  };

  // Get recommended doctors
  const recommendedDoctors = currentPrediction.recommendedSpecialists
    .flatMap((specialty) => getDoctorsBySpecialty(specialty))
    .slice(0, 3);

  const healthSummary = generateHealthSummary(
    currentPrediction,
    selectedSymptoms,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="h-4 w-px bg-border" />
              <nav className="text-sm text-muted-foreground">
                <span>Dashboard</span>
                <span className="mx-2">/</span>
                <span>Symptom Checker</span>
                <span className="mx-2">/</span>
                <span className="text-foreground">Results</span>
              </nav>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleSaveToHistory} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save to History
              </Button>
            </div>
          </div>

          {/* Summary Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Health Assessment Results</span>
                <Badge>{format(new Date(), "MMM d, yyyy h:mm a")}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    Symptoms Analyzed ({selectedSymptoms.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptomId) => (
                      <Badge key={symptomId} variant="secondary">
                        {formatSymptomName(symptomId)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {healthSummary}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Triage Assessment */}
              <TriageDisplay triage={currentPrediction.triage} />

              {/* Disease Predictions */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Possible Conditions ({currentPrediction.diseases.length})
                </h2>
                <div className="space-y-4">
                  {currentPrediction.diseases.map((result, index) => (
                    <DiseaseCard
                      key={result.disease.id}
                      disease={result.disease}
                      probability={result.probability}
                      matchingSymptoms={result.matchingSymptoms}
                      rank={index + 1}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recommended Specialists */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Specialists</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentPrediction.recommendedSpecialists.map(
                      (specialist, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{specialist}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Recommended Doctors */}
              {recommendedDoctors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Top Doctors</h3>
                    <Link to="/doctors">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recommendedDoctors.slice(0, 2).map((doctor) => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        showDistance={false}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleSaveToHistory} className="w-full">
                    Save Results
                  </Button>
                  <Link to="/assistant" className="block">
                    <Button variant="outline" className="w-full">
                      Ask AI Assistant
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleNewCheck}
                    className="w-full"
                  >
                    New Symptom Check
                  </Button>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-yellow-900 text-sm mb-2">
                    Important Disclaimer
                  </h4>
                  <p className="text-xs text-yellow-800">
                    This assessment is for informational purposes only and
                    should not replace professional medical advice. Always
                    consult with a qualified healthcare provider for proper
                    diagnosis and treatment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
