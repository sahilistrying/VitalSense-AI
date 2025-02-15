// Disease prediction service for ML backend communication

export interface PredictionRequest {
  symptoms: string[];
}

export interface PredictionResponse {
  prediction: string;
  confidence: number;
  selected_symptoms_count: number;
  symptoms_processed: number;
  status: "success" | "error";
  error?: string;
}

export interface HealthCheckResponse {
  status: string;
  model_loaded: boolean;
  encoder_loaded: boolean;
}

class PredictionService {
  private baseUrl: string;

  constructor() {
    // Use environment variable or default to localhost
    this.baseUrl =
      import.meta.env.VITE_PREDICTION_API_URL || "http://localhost:5000";
  }

  /**
   * Check if the prediction backend is healthy and models are loaded
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Health check error:", error);
      throw new Error("Unable to connect to prediction service");
    }
  }

  /**
   * Predict disease based on selected symptoms
   */
  async predictDisease(
    selectedSymptoms: string[],
  ): Promise<PredictionResponse> {
    try {
      // Validate input
      if (!Array.isArray(selectedSymptoms)) {
        throw new Error("Symptoms must be provided as an array");
      }

      if (selectedSymptoms.length === 0) {
        throw new Error("At least one symptom must be selected");
      }

      // Make prediction request
      const response = await fetch(`${this.baseUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Prediction failed: ${response.status}`,
        );
      }

      const result: PredictionResponse = await response.json();

      // Validate response
      if (result.status === "error") {
        throw new Error(result.error || "Prediction failed");
      }

      return result;
    } catch (error) {
      console.error("Prediction error:", error);

      // Re-throw with user-friendly message
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unable to get disease prediction. Please try again.");
      }
    }
  }

  /**
   * Get information about symptoms format
   */
  async getSymptomsInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/symptoms-info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get symptoms info: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Symptoms info error:", error);
      throw new Error("Unable to get symptoms information");
    }
  }

  /**
   * Convert symptom array to 377-length binary array for debugging
   */
  createSymptomsArray(selectedSymptoms: string[]): number[] {
    const symptomsArray = new Array(377).fill(0);

    selectedSymptoms.forEach((symptomId) => {
      try {
        if (symptomId.startsWith("symptom_")) {
          const symptomIndex = parseInt(symptomId.split("_")[1]);
          const arrayIndex = symptomIndex - 1; // Convert to 0-based index

          if (arrayIndex >= 0 && arrayIndex < 377) {
            symptomsArray[arrayIndex] = 1;
          }
        }
      } catch (error) {
        console.warn(`Invalid symptom ID format: ${symptomId}`);
      }
    });

    return symptomsArray;
  }

  /**
   * Validate that all selected symptoms are in valid format
   */
  validateSymptoms(selectedSymptoms: string[]): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!Array.isArray(selectedSymptoms)) {
      errors.push("Symptoms must be an array");
      return { valid: false, errors };
    }

    if (selectedSymptoms.length === 0) {
      errors.push("At least one symptom must be selected");
      return { valid: false, errors };
    }

    selectedSymptoms.forEach((symptomId) => {
      if (typeof symptomId !== "string") {
        errors.push(`Symptom ID must be a string: ${symptomId}`);
        return;
      }

      if (!symptomId.startsWith("symptom_")) {
        errors.push(`Invalid symptom ID format: ${symptomId}`);
        return;
      }

      try {
        const symptomIndex = parseInt(symptomId.split("_")[1]);
        if (isNaN(symptomIndex) || symptomIndex < 1 || symptomIndex > 377) {
          errors.push(`Symptom index out of range: ${symptomId}`);
        }
      } catch (error) {
        errors.push(`Failed to parse symptom ID: ${symptomId}`);
      }
    });

    return { valid: errors.length === 0, errors };
  }
}

// Export singleton instance
export const predictionService = new PredictionService();

// Export types for use in components
export type { PredictionRequest, PredictionResponse, HealthCheckResponse };
