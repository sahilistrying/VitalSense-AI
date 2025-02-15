import React from "react";
import { AlertTriangle, Info, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Disease } from "@/types/health";
import {
  getTriageColor,
  getTriageTextColor,
  formatSymptomName,
} from "@/lib/healthUtils";
import { cn } from "@/lib/utils";

interface DiseaseCardProps {
  disease: Disease;
  probability: number;
  matchingSymptoms: string[];
  rank: number;
}

export const DiseaseCard: React.FC<DiseaseCardProps> = ({
  disease,
  probability,
  matchingSymptoms,
  rank,
}) => {
  const getUrgencyIcon = () => {
    switch (disease.urgency) {
      case "emergency":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
  };

  const getProbabilityColor = () => {
    if (probability >= 70) return "text-red-600";
    if (probability >= 50) return "text-orange-600";
    if (probability >= 30) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg",
        rank === 1 && "ring-2 ring-primary",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {rank === 1 && (
                <Badge className="bg-primary text-primary-foreground">
                  Most Likely
                </Badge>
              )}
              <Badge
                className={cn(
                  "capitalize",
                  getTriageColor(disease.urgency),
                  "text-white",
                )}
              >
                {disease.urgency} Priority
              </Badge>
            </div>
            <CardTitle className="text-lg">{disease.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getUrgencyIcon()}
            <span className={cn("text-2xl font-bold", getProbabilityColor())}>
              {probability}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Match Confidence</span>
            <span className={cn("text-sm font-medium", getProbabilityColor())}>
              {probability}%
            </span>
          </div>
          <Progress value={probability} className="h-2" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-3">
            {disease.description}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">
            Matching Symptoms ({matchingSymptoms.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {matchingSymptoms.map((symptomId) => (
              <Badge key={symptomId} variant="secondary" className="text-xs">
                {formatSymptomName(symptomId)}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Recommended Specialist</h4>
          <Badge variant="outline" className="text-sm">
            {disease.specialistType}
          </Badge>
        </div>

        {disease.urgency === "emergency" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Emergency: Seek immediate medical attention
              </span>
            </div>
          </div>
        )}

        {disease.urgency === "high" && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                High Priority: See a doctor within 24-48 hours
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
