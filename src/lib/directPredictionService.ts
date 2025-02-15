import * as tf from "@tensorflow/tfjs";

interface DiseaseMappings {
  disease_to_specialist: { [key: string]: string };
  disease_to_triage: { [key: string]: string };
}

interface PredictionResult {
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

// Direct ML prediction service for browser-based inference
export class DirectPredictionService {
  private model: tf.LayersModel | null = null;
  private diseaseLabels: string[] = [];
  private diseaseMappings: DiseaseMappings | null = null;
  private isLoaded = false;

  /**
   * Load the TensorFlow.js model and disease labels
   * Note: You need to convert your pickle files to web-compatible formats
   */
  async loadModel(): Promise<boolean> {
    try {
      // Load the model topology
      const modelResponse = await fetch("/model.json");
      const modelJson = await modelResponse.json();

      // Load the weights file
      const weightsResponse = await fetch("/group1-shard1of1.bin");
      const weightsBuffer = await weightsResponse.arrayBuffer();
      const weightsData = new Float32Array(weightsBuffer);

      // Create weight tensors
      const weights = [
        // First dense layer
        tf.tensor2d(weightsData.slice(0, 377 * 512), [377, 512]),  // kernel
        tf.tensor1d(weightsData.slice(377 * 512, 377 * 512 + 512)), // bias
        
        // Second dense layer
        tf.tensor2d(weightsData.slice(377 * 512 + 512, 377 * 512 + 512 + 512 * 256), [512, 256]), // kernel
        tf.tensor1d(weightsData.slice(377 * 512 + 512 + 512 * 256, 377 * 512 + 512 + 512 * 256 + 256)), // bias
        
        // Third dense layer
        tf.tensor2d(weightsData.slice(377 * 512 + 512 + 512 * 256 + 256, 377 * 512 + 512 + 512 * 256 + 256 + 256 * 773), [256, 773]), // kernel
        tf.tensor1d(weightsData.slice(377 * 512 + 512 + 512 * 256 + 256 + 256 * 773)) // bias
      ];

      // Create model from topology
      const model = tf.sequential();
      
      // Add layers with proper configuration
      model.add(tf.layers.dense({
        units: 512,
        activation: 'relu',
        inputShape: [377],
        kernelInitializer: 'glorotUniform',
        biasInitializer: 'zeros'
      }));
      
      model.add(tf.layers.dense({
        units: 256,
        activation: 'relu',
        kernelInitializer: 'glorotUniform',
        biasInitializer: 'zeros'
      }));
      
      model.add(tf.layers.dense({
        units: 773,
        activation: 'softmax',
        kernelInitializer: 'glorotUniform',
        biasInitializer: 'zeros'
      }));

      // Set the weights
      model.setWeights(weights);
      
      this.model = model;
      
      // Load disease labels
      const labelsResponse = await fetch("/label_map.json");
      this.diseaseLabels = await labelsResponse.json();

      // Load disease mappings
      const mappingsResponse = await fetch("/disease_mappings.json");
      this.diseaseMappings = await mappingsResponse.json();

      // Verify model weights are loaded
      const loadedWeights = this.model.getWeights();
      console.log("Model weights loaded:", loadedWeights.length > 0);
      console.log("Weight shapes:", loadedWeights.map(w => w.shape));

      // Print model summary
      console.log("Model summary:");
      this.model.summary();

      // Verify weights are non-zero
      loadedWeights.forEach((weight, index) => {
        const weightData = weight.dataSync();
        const nonZeroCount = Array.from(weightData).filter(x => x !== 0).length;
        console.log(`Layer ${index} weights: ${nonZeroCount} non-zero values out of ${weightData.length}`);
      });

      this.isLoaded = true;
      console.log("✅ Model, labels, and mappings loaded successfully");
      return true;
    } catch (error) {
      console.error("❌ Error loading model:", error);
      this.isLoaded = false;
      return false;
    }
  }

  /**
   * Predict disease from selected symptoms
   */
  async predictDisease(selectedSymptoms: string[]): Promise<PredictionResult> {
    if (!this.isLoaded || !this.model || !this.diseaseMappings) {
      throw new Error("Model or mappings not loaded. Call loadModel() first.");
    }

    console.log("Selected symptoms:", selectedSymptoms);

    // Initialize symptoms array with 377 zeros
    const symptomsArray = new Float32Array(377).fill(0);

    // Update array based on selected symptoms
    selectedSymptoms.forEach((symptomId) => {
      if (symptomId.startsWith("symptom_")) {
        const symptomIndex = parseInt(symptomId.split("_")[1]) - 1; // Convert to 0-based index
        if (symptomIndex >= 0 && symptomIndex < 377) {
          symptomsArray[symptomIndex] = 1;
        }
      }
    });

    console.log("Symptoms array (first 10 elements):", Array.from(symptomsArray).slice(0, 10));
    console.log("Number of active symptoms:", symptomsArray.filter(x => x === 1).length);

    try {
      // Create a 2D tensor with proper shape [1, 377]
      const inputTensor = tf.tensor2d([Array.from(symptomsArray)], [1, 377]);
      console.log("Input tensor shape:", inputTensor.shape);

      // Make prediction
      const predictions = this.model.predict(inputTensor) as tf.Tensor;
      console.log("Raw predictions shape:", predictions.shape);

      // Get raw prediction values before softmax
      const rawValues = await predictions.data();
      console.log("Raw prediction values (first 5):", Array.from(rawValues).slice(0, 5));

      // Apply softmax to get proper probabilities
      const softmaxPredictions = tf.softmax(predictions);
      const predictionValues = await softmaxPredictions.data();
      
      // Get top 5 predictions with their probabilities
      const topPredictions = Array.from(predictionValues)
        .map((val, idx) => {
          const disease = this.diseaseLabels[idx];
          return {
            disease,
            specialist: this.diseaseMappings?.disease_to_specialist[disease] || "Unknown Specialist",
            triage: this.diseaseMappings?.disease_to_triage[disease] || "Unknown Triage",
            probability: val
          };
        })
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 5);

      console.log("Top 5 predictions with probabilities:", topPredictions);

      // Get predicted class index using argmax
      const predictedClassTensor = tf.argMax(softmaxPredictions, 1);
      const predictedClass = await predictedClassTensor.data();

      // Clean up tensors to prevent memory leaks
      inputTensor.dispose();
      predictions.dispose();
      softmaxPredictions.dispose();
      predictedClassTensor.dispose();

      // Get disease name and related information
      const diseaseIndex = predictedClass[0];
      const diseaseName = this.diseaseLabels[diseaseIndex] || "Unknown Disease";
      const specialist = this.diseaseMappings.disease_to_specialist[diseaseName] || "Unknown Specialist";
      const triage = this.diseaseMappings.disease_to_triage[diseaseName] || "Unknown Triage";
      const confidence = predictionValues[diseaseIndex];

      console.log("Final prediction:", {
        disease: diseaseName,
        specialist,
        triage,
        confidence
      });

      return {
        disease: diseaseName,
        specialist,
        triage,
        confidence,
        topPredictions
      };
    } catch (error) {
      console.error("Prediction error:", error);
      throw new Error(`Prediction failed: ${error}`);
    }
  }

  /**
   * Check if model is ready for predictions
   */
  isReady(): boolean {
    return this.isLoaded && this.model !== null && this.diseaseMappings !== null;
  }

  /**
   * Get model info
   */
  getModelInfo() {
    if (!this.model) return null;

    return {
      inputShape: this.model.inputs[0].shape,
      outputShape: this.model.outputs[0].shape,
      totalParams: this.model.countParams(),
      numDiseases: this.diseaseLabels.length,
    };
  }
}

// Singleton instance
export const directPredictionService = new DirectPredictionService();
