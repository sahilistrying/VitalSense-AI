import React from "react";
import { format } from "date-fns";

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

interface SymptomHistoryProps {
  history: SymptomCheck[];
}

export const SymptomHistory: React.FC<SymptomHistoryProps> = ({ history }) => {
  const getTriageColor = (triage: string) => {
    switch (triage.toLowerCase()) {
      case "emergency":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptoms</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialist</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Triage</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {history.map((check) => (
            <tr key={check.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(check.timestamp), "MMM d, yyyy h:mm a")}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div className="flex flex-wrap gap-1">
                  {check.symptoms.map((symptom) => (
                    <span key={symptom} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {symptom}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {check.disease}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {check.specialist}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTriageColor(check.triage)}`}>
                  {formatTriage(check.triage)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 