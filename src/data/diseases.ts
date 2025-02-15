import { Disease } from "../types/health";

export const diseases: Disease[] = [
  {
    id: "common_cold",
    name: "Common Cold",
    description: "A viral infection of the upper respiratory tract.",
    commonSymptoms: [
      "runny_nose",
      "stuffy_nose",
      "sneezing",
      "sore_throat",
      "cough",
      "fatigue",
    ],
    rareSymptoms: ["fever", "headache"],
    urgency: "low",
    specialistType: "General Practitioner",
  },
  {
    id: "influenza",
    name: "Influenza (Flu)",
    description: "A viral infection that attacks the respiratory system.",
    commonSymptoms: [
      "fever",
      "chills",
      "muscle_pain",
      "fatigue",
      "cough",
      "headache",
    ],
    rareSymptoms: ["nausea", "vomiting", "diarrhea"],
    urgency: "medium",
    specialistType: "General Practitioner",
  },
  {
    id: "pneumonia",
    name: "Pneumonia",
    description: "An infection that inflames air sacs in one or both lungs.",
    commonSymptoms: [
      "fever",
      "chills",
      "cough",
      "shortness_breath",
      "chest_pain",
      "fatigue",
    ],
    rareSymptoms: ["confusion", "nausea", "vomiting"],
    urgency: "high",
    specialistType: "Pulmonologist",
  },
  {
    id: "bronchitis",
    name: "Bronchitis",
    description: "Inflammation of the lining of bronchial tubes.",
    commonSymptoms: ["cough", "fatigue", "shortness_breath", "chest_pain"],
    rareSymptoms: ["fever", "chills"],
    urgency: "medium",
    specialistType: "Pulmonologist",
  },
  {
    id: "asthma",
    name: "Asthma",
    description:
      "A condition in which airways narrow and swell and may produce extra mucus.",
    commonSymptoms: ["shortness_breath", "chest_pain", "wheezing", "cough"],
    rareSymptoms: ["anxiety", "fatigue"],
    urgency: "medium",
    specialistType: "Pulmonologist",
  },
  {
    id: "heart_attack",
    name: "Heart Attack",
    description: "Occurs when blood flow to part of the heart is blocked.",
    commonSymptoms: [
      "chest_pain",
      "shortness_breath",
      "nausea",
      "cold_hands_feet",
    ],
    rareSymptoms: ["back_pain", "jaw_pain", "dizziness"],
    urgency: "emergency",
    specialistType: "Cardiologist",
  },
  {
    id: "hypertension",
    name: "Hypertension",
    description: "High blood pressure, often called the silent killer.",
    commonSymptoms: ["high_blood_pressure", "headache"],
    rareSymptoms: ["dizziness", "blurred_vision", "shortness_breath"],
    urgency: "medium",
    specialistType: "Cardiologist",
  },
  {
    id: "diabetes_type2",
    name: "Type 2 Diabetes",
    description:
      "A chronic condition affecting the way the body processes blood sugar.",
    commonSymptoms: [
      "excessive_thirst",
      "frequent_urination",
      "excessive_hunger",
      "fatigue",
    ],
    rareSymptoms: ["blurred_vision", "wounds_heal_slowly", "weight_loss"],
    urgency: "medium",
    specialistType: "Endocrinologist",
  },
  {
    id: "gastroenteritis",
    name: "Gastroenteritis",
    description:
      "Inflammation of the stomach and intestines, typically from infection.",
    commonSymptoms: [
      "nausea",
      "vomiting",
      "diarrhea",
      "abdominal_pain",
      "stomach_cramps",
    ],
    rareSymptoms: ["fever", "headache", "fatigue"],
    urgency: "medium",
    specialistType: "Gastroenterologist",
  },
  {
    id: "migraine",
    name: "Migraine",
    description:
      "A severe recurring headache often accompanied by other symptoms.",
    commonSymptoms: ["headache", "nausea", "blurred_vision"],
    rareSymptoms: ["vomiting", "dizziness", "numbness"],
    urgency: "medium",
    specialistType: "Neurologist",
  },
  {
    id: "depression",
    name: "Depression",
    description:
      "A mental health disorder characterized by persistent sadness.",
    commonSymptoms: [
      "depression",
      "fatigue",
      "sleep_problems",
      "loss_appetite",
    ],
    rareSymptoms: ["concentration_problems", "weight_loss", "irritability"],
    urgency: "medium",
    specialistType: "Psychiatrist",
  },
  {
    id: "anxiety_disorder",
    name: "Anxiety Disorder",
    description:
      "A mental health disorder characterized by excessive worry or fear.",
    commonSymptoms: ["anxiety", "rapid_heartbeat", "sweating", "tremors"],
    rareSymptoms: ["shortness_breath", "dizziness", "nausea"],
    urgency: "medium",
    specialistType: "Psychiatrist",
  },
  {
    id: "arthritis",
    name: "Arthritis",
    description:
      "Inflammation of one or more joints, causing pain and stiffness.",
    commonSymptoms: ["joint_pain", "stiffness", "swollen_joints"],
    rareSymptoms: ["fatigue", "fever", "weight_loss"],
    urgency: "low",
    specialistType: "Rheumatologist",
  },
  {
    id: "allergic_reaction",
    name: "Allergic Reaction",
    description:
      "An immune system response to a substance that is usually harmless.",
    commonSymptoms: ["rash", "itching", "sneezing", "runny_nose"],
    rareSymptoms: ["shortness_breath", "swollen_joints", "nausea"],
    urgency: "medium",
    specialistType: "Allergist",
  },
  {
    id: "kidney_stones",
    name: "Kidney Stones",
    description:
      "Hard deposits of minerals and salts that form inside kidneys.",
    commonSymptoms: ["abdominal_pain", "painful_urination", "blood_urine"],
    rareSymptoms: ["nausea", "vomiting", "fever"],
    urgency: "high",
    specialistType: "Urologist",
  },
  {
    id: "stroke",
    name: "Stroke",
    description:
      "Occurs when blood supply to part of the brain is interrupted.",
    commonSymptoms: ["confusion", "numbness", "blurred_vision", "headache"],
    rareSymptoms: ["dizziness", "difficulty_speaking"],
    urgency: "emergency",
    specialistType: "Neurologist",
  },
];

export const getDiseaseById = (id: string) => {
  return diseases.find((disease) => disease.id === id);
};

export const getDiseasesBySymptoms = (selectedSymptoms: string[]) => {
  return diseases
    .map((disease) => {
      const matchingSymptoms = selectedSymptoms.filter(
        (symptom) =>
          disease.commonSymptoms.includes(symptom) ||
          disease.rareSymptoms.includes(symptom),
      );

      const commonMatches = selectedSymptoms.filter((symptom) =>
        disease.commonSymptoms.includes(symptom),
      );

      const rareMatches = selectedSymptoms.filter((symptom) =>
        disease.rareSymptoms.includes(symptom),
      );

      // Calculate probability based on matching symptoms
      const totalSymptoms =
        disease.commonSymptoms.length + disease.rareSymptoms.length;
      const commonWeight = 0.8;
      const rareWeight = 0.3;

      const score =
        (commonMatches.length * commonWeight +
          rareMatches.length * rareWeight) /
        (disease.commonSymptoms.length * commonWeight +
          disease.rareSymptoms.length * rareWeight);

      return {
        disease,
        probability: Math.min(Math.round(score * 100), 95), // Cap at 95%
        matchingSymptoms,
      };
    })
    .filter((result) => result.matchingSymptoms.length > 0)
    .sort((a, b) => b.probability - a.probability);
};
