export interface Symptom {
  id: string;
  name: string;
  category:
    | "general"
    | "respiratory"
    | "digestive"
    | "neurological"
    | "cardiovascular"
    | "musculoskeletal"
    | "dermatological"
    | "psychological";
  severity: "mild" | "moderate" | "severe";
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  commonSymptoms: string[];
  rareSymptoms: string[];
  urgency: "low" | "medium" | "high" | "emergency";
  specialistType: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  location: {
    address: string;
    city: string;
    distance: number;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
  };
  availability: {
    nextAvailable: string;
    schedule: string[];
  };
  image: string;
}

export interface PredictionResult {
  disease: string;
  specialist: string;
  triage: string;
  confidence: number;
  topPredictions: Array<{
    disease: string;
    specialist: string;
    triage: string;
    probability: number;
  }>;
}

export interface HealthHistory {
  id: string;
  type: "symptom_check" | "chat";
  timestamp: string;
  symptoms?: string[];
  disease?: string;
  specialist?: string;
  triage?: string;
  confidence?: number;
  followUp?: {
    required: boolean;
    date?: string;
    completed?: boolean;
  };
  prediction?: PredictionResult;
  selectedDoctor?: Doctor;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}
