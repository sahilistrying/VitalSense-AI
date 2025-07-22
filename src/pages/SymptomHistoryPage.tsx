import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SymptomHistory } from "@/components/SymptomHistory";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { getHealthHistory } from "@/lib/authService";

interface SymptomCheck {
  id: string;
  type: string;
  timestamp: string;
  symptoms: string[];
  disease: string;
  specialist: string;
  triage: string;
  confidence: number;
}

export const SymptomHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState<SymptomCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) {
        setError('Please sign in to view your history');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getHealthHistory(user.id);
        // Filter only symptom checks and sort by timestamp
        const symptomChecks = data
          .filter((item: any) => item.type === 'symptom_check')
          .sort((a: any, b: any) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        setHistory(symptomChecks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user?.id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
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
              <span className="text-foreground">Symptom Check History</span>
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-6">Symptom Check History</h1>
            
            {history.length > 0 ? (
              <SymptomHistory history={history} />
            ) : (
              <p className="text-gray-600">No symptom check history found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 