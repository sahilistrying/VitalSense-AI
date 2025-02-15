import { PredictionResult } from "../types/health";
import { getDiseasesBySymptoms } from "../data/diseases";
import { getDoctorsBySpecialty } from "../data/doctors";

export const predictConditions = (
  selectedSymptoms: string[],
): PredictionResult => {
  const diseaseMatches = getDiseasesBySymptoms(selectedSymptoms);

  // Get the top prediction
  const topMatch = diseaseMatches[0];
  
  // Get alternative predictions
  const alternativePredictions = diseaseMatches.slice(1, 5).map(match => ({
    disease: match.disease.name,
    specialist: match.disease.specialistType,
    triage: match.disease.urgency.toUpperCase(),
    probability: match.probability / 100 // Convert percentage to decimal
  }));

  return {
    disease: topMatch.disease.name,
    specialist: topMatch.disease.specialistType,
    triage: topMatch.disease.urgency.toUpperCase(),
    confidence: topMatch.probability / 100, // Convert percentage to decimal
    topPredictions: [
      {
        disease: topMatch.disease.name,
        specialist: topMatch.disease.specialistType,
        triage: topMatch.disease.urgency.toUpperCase(),
        probability: topMatch.probability / 100
      },
      ...alternativePredictions
    ]
  };
};

export const getTriageColor = (
  urgency: "low" | "medium" | "high" | "emergency",
) => {
  switch (urgency) {
    case "emergency":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export const getTriageTextColor = (
  urgency: "low" | "medium" | "high" | "emergency",
) => {
  switch (urgency) {
    case "emergency":
      return "text-red-700";
    case "high":
      return "text-orange-700";
    case "medium":
      return "text-yellow-700";
    case "low":
      return "text-green-700";
    default:
      return "text-gray-700";
  }
};

export const formatSymptomName = (symptomId: string) => {
  return symptomId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const calculateRiskScore = (
  symptoms: string[],
  age: number,
  gender: string,
) => {
  // Simple risk calculation based on symptoms and demographics
  let riskScore = 0;

  // Age factor
  if (age > 65) riskScore += 2;
  else if (age > 45) riskScore += 1;

  // Symptom severity
  const highRiskSymptoms = [
    "chest_pain",
    "shortness_breath",
    "seizures",
    "confusion",
    "coughing_blood",
  ];
  const moderateRiskSymptoms = ["fever", "severe_headache", "abdominal_pain"];

  symptoms.forEach((symptom) => {
    if (highRiskSymptoms.includes(symptom)) riskScore += 3;
    else if (moderateRiskSymptoms.includes(symptom)) riskScore += 2;
    else riskScore += 1;
  });

  return Math.min(riskScore, 10); // Cap at 10
};

export const generateHealthSummary = (
  prediction: PredictionResult,
  symptoms: string[],
) => {
  const topCondition = prediction.diseases[0];

  if (!topCondition) {
    return "Based on your symptoms, we recommend consulting with a healthcare provider for proper evaluation.";
  }

  return `Based on your symptoms, there's a ${topCondition.probability}% likelihood of ${topCondition.disease.name}. ${prediction.triage.recommendation} Consider consulting with a ${prediction.recommendedSpecialists[0] || "healthcare provider"}.`;
};
