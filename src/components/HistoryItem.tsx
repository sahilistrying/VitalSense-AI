import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stethoscope, MessageSquare, Calendar } from "lucide-react";

interface HistoryItemProps {
  historyItem: {
    id: string;
    type: string;
    timestamp: number;
    symptoms?: string[];
    disease?: string;
    specialist?: string;
    triage?: string;
    confidence?: number;
    followUp?: {
      required: boolean;
      completed: boolean;
      date?: number;
    };
  };
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ historyItem }) => {
  const getTriageColor = (triage: string) => {
    switch (triage.toLowerCase()) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "urgent":
        return "bg-orange-100 text-orange-800";
      case "routine":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format triage label for display
  const formatTriage = (triage: string) => {
    switch (triage.toLowerCase()) {
      case "routine":
        return "Non-Urgent";
      case "urgent":
        return "Urgent";
      case "emergency":
        return "Emergency";
      default:
        return triage;
    }
  };

  const renderContent = () => {
    switch (historyItem.type) {
      case "symptom_check":
        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Symptom Check</span>
            </div>
            <div className="space-y-2">
              {historyItem.symptoms && (
                <div className="flex flex-wrap gap-1">
                  {historyItem.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="secondary">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              )}
              {historyItem.disease && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Predicted:</span>
                  <Badge variant="outline">{historyItem.disease}</Badge>
                </div>
              )}
              {historyItem.specialist && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Specialist:</span>
                  <Badge variant="outline">{historyItem.specialist}</Badge>
                </div>
              )}
              {historyItem.triage && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Triage:</span>
                  <Badge className={getTriageColor(historyItem.triage)}>
                    {formatTriage(historyItem.triage)}
                  </Badge>
                </div>
              )}
            </div>
          </>
        );
      case "chat":
        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              <span className="font-medium">AI Chat</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {historyItem.symptoms?.join(", ")}
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {renderContent()}
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(historyItem.timestamp, "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {historyItem.type === "chat" && (
              <Link to="/assistant">
                <Button variant="outline" size="sm">
                  Continue Chat
                </Button>
              </Link>
            )}
          </div>
        </div>
        {historyItem.followUp?.required && !historyItem.followUp.completed && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Follow-up Required</Badge>
                {historyItem.followUp.date && (
                  <span className="text-sm text-muted-foreground">
                    Due: {format(historyItem.followUp.date, "MMM d, yyyy")}
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm">
                Schedule Follow-up
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
