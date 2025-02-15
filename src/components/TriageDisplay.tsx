import React from "react";
import { AlertTriangle, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PredictionResult } from "@/types/health";
import { getTriageColor, getTriageTextColor } from "@/lib/healthUtils";
import { cn } from "@/lib/utils";

interface TriageDisplayProps {
  triage: PredictionResult["triage"];
  className?: string;
}

export const TriageDisplay: React.FC<TriageDisplayProps> = ({
  triage,
  className,
}) => {
  const getUrgencyIcon = () => {
    switch (triage.urgency) {
      case "emergency":
        return <AlertTriangle className="h-5 w-5" />;
      case "high":
        return <AlertCircle className="h-5 w-5" />;
      case "medium":
        return <Clock className="h-5 w-5" />;
      case "low":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getAlertVariant = () => {
    switch (triage.urgency) {
      case "emergency":
      case "high":
        return "destructive";
      default:
        return "default";
    }
  };

  const getUrgencyMessage = () => {
    switch (triage.urgency) {
      case "emergency":
        return {
          title: "Emergency",
          description:
            "Seek immediate medical attention. Go to the nearest emergency room or call 911.",
        };
      case "high":
        return {
          title: "High Priority",
          description:
            "Schedule an appointment with a healthcare provider within 24-48 hours.",
        };
      case "medium":
        return {
          title: "Medium Priority",
          description:
            "Schedule an appointment with a healthcare provider within a week.",
        };
      case "low":
        return {
          title: "Low Priority",
          description:
            "Monitor symptoms and consult a healthcare provider if they persist or worsen.",
        };
      default:
        return {
          title: "Assessment Complete",
          description:
            "Please consult with a healthcare provider for proper evaluation.",
        };
    }
  };

  const urgencyInfo = getUrgencyMessage();

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-full",
              getTriageColor(triage.urgency),
              "text-white",
            )}
          >
            {getUrgencyIcon()}
          </div>
          <div>
            <CardTitle className="text-lg">Medical Triage Assessment</CardTitle>
            <Badge
              className={cn(
                "capitalize mt-1",
                getTriageColor(triage.urgency),
                "text-white",
              )}
            >
              {triage.urgency} Priority
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Alert variant={getAlertVariant()}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-medium">
            {urgencyInfo.title}: {urgencyInfo.description}
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">Recommendation</h4>
            <p className="text-sm text-muted-foreground">
              {triage.recommendation}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Timeframe</h4>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{triage.timeframe}</span>
            </div>
          </div>
        </div>

        {triage.urgency === "emergency" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-red-900 mb-1">
                  Emergency Action Required
                </h4>
                <p className="text-sm text-red-800">
                  Based on your symptoms, this could be a serious medical
                  condition. Do not delay seeking medical care. If you're
                  experiencing severe symptoms, call 911 or go to the nearest
                  emergency room immediately.
                </p>
              </div>
            </div>
          </div>
        )}

        {triage.urgency === "high" && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-orange-900 mb-1">
                  Prompt Medical Attention Needed
                </h4>
                <p className="text-sm text-orange-800">
                  Your symptoms suggest a condition that requires timely medical
                  evaluation. Please contact your healthcare provider or visit
                  an urgent care center within the next 1-2 days.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-4 p-3 bg-gray-50 rounded-lg">
          <p>
            <strong>Disclaimer:</strong> This assessment is for informational
            purposes only and should not replace professional medical advice.
            Always consult with a qualified healthcare provider for proper
            diagnosis and treatment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
