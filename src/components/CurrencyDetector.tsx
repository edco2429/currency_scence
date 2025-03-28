import { FC, createContext, useState, useRef, useCallback } from "react";
import { WebcamView } from "./WebcamView";
import { ResultsDisplay } from "./ResultsDisplay";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

// Define the detection status type
export type StatusType = {
  message: string;
  type: "info" | "success" | "error" | "warning";
};

// Define prediction result type
export type PredictionResult = {
  className: string;
  probability: number;
};

// Define the context shape
type DetectorContextType = {
  status: StatusType;
  isDetecting: boolean;
  startDetection: () => void;
  stopDetection: () => void;
  predictions: PredictionResult[];
  detectedCurrency: string;
};

// Create the context with default values
export const DetectorContext = createContext<DetectorContextType>({
  status: { message: "Ready to identify Indian currency notes. Press Start to begin.", type: "info" },
  isDetecting: false,
  startDetection: () => {},
  stopDetection: () => {},
  predictions: [],
  detectedCurrency: ""
});

// The main component
export const CurrencyDetector: FC = () => {
  // State for detection status
  const [status, setStatus] = useState<StatusType>({
    message: "Ready to identify Indian currency notes. Press Start to begin.",
    type: "info"
  });

  // State for detection status
  const [isDetecting, setIsDetecting] = useState(false);
  
  // State for predictions
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  
  // State for currently detected currency
  const [detectedCurrency, setDetectedCurrency] = useState("");

  // References for TensorFlow model and webcam
  const modelRef = useRef<any>(null);
  const webcamRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  
  // Teachable Machine model URL
  const modelURL = "https://teachablemachine.withgoogle.com/models/P9W9Ta1SH/";
  
  // Last detected time for cooldown
  const lastDetectedTimeRef = useRef<number>(0);
  
  // Speech synthesis hook
  const { speak } = useSpeechSynthesis();

  // Function to start the detection
  const startDetection = useCallback(async () => {
    try {
      setStatus({
        message: "Loading model and initializing webcam...",
        type: "info"
      });

      // Load the model
      const modelURLPath = modelURL + "model.json";
      const metadataURLPath = modelURL + "metadata.json";
      
      // @ts-ignore - tmImage is loaded from external script
      modelRef.current = await tmImage.load(modelURLPath, metadataURLPath);
      
      // Setup webcam
      const flip = true; // Flip camera for more intuitive use
      // @ts-ignore - tmImage is loaded from external script
      webcamRef.current = new tmImage.Webcam(300, 300, flip);
      
      try {
        await webcamRef.current.setup();
        await webcamRef.current.play();
        
        // Initialize predictions array based on model classes
        const maxPredictions = modelRef.current.getTotalClasses();
        setPredictions(Array(maxPredictions).fill({ className: "", probability: 0 }));
        
        // Start the detection loop
        setIsDetecting(true);
        loop();
        
        setStatus({
          message: "Camera active. Point camera at an Indian currency note.",
          type: "success"
        });
        
        speak("Currency detection started. Point camera at an Indian currency note.");
      } catch (webcamError) {
        console.error("Webcam access error:", webcamError);
        setStatus({
          message: "Unable to access camera. Please ensure camera permissions are granted.",
          type: "error"
        });
        resetDetection();
      }
    } catch (modelError) {
      console.error("Model loading error:", modelError);
      setStatus({
        message: "Failed to load the detection model. Please check your connection and try again.",
        type: "error"
      });
      resetDetection();
    }
  }, [speak]);

  // Function to stop detection
  const stopDetection = useCallback(() => {
    if (webcamRef.current) {
      webcamRef.current.stop();
      webcamRef.current = null;
    }
    
    if (animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    resetDetection();
    setStatus({
      message: "Detection stopped. Press Start to begin again.",
      type: "info"
    });
  }, []);

  // Reset detection state
  const resetDetection = () => {
    setIsDetecting(false);
    setPredictions([]);
    setDetectedCurrency("");
  };

  // Main detection loop
  const loop = useCallback(() => {
    if (!webcamRef.current || !modelRef.current) return;
    
    webcamRef.current.update();
    predict();
    animationRef.current = window.requestAnimationFrame(loop);
  }, []);

  // Make predictions with the model
  const predict = useCallback(async () => {
    if (!modelRef.current || !webcamRef.current) return;
    
    try {
      // Get predictions from the model
      const prediction = await modelRef.current.predict(webcamRef.current.canvas);
      
      // Find highest confidence prediction
      let highestConfidence = 0;
      let highestClass = "";
      
      // Map predictions to state
      const newPredictions = prediction.map((pred: any) => {
        const probability = parseFloat(pred.probability.toFixed(2));
        
        // Check if this is the highest confidence
        if (probability > highestConfidence) {
          highestConfidence = probability;
          highestClass = pred.className;
        }
        
        return {
          className: pred.className,
          probability: probability
        };
      });
      
      // Update predictions state
      setPredictions(newPredictions);
      
      // Confidence threshold for detection
      const CONFIDENCE_THRESHOLD = 0.7;
      
      // Only announce if confidence is high enough and different from last detection
      // Also add a cooldown to prevent rapid announcements
      const now = Date.now();
      const timeSinceLastDetection = now - lastDetectedTimeRef.current;
      const COOLDOWN_PERIOD = 2000; // 2 seconds cooldown
      
      if (highestConfidence > CONFIDENCE_THRESHOLD && 
          highestClass !== detectedCurrency && 
          timeSinceLastDetection > COOLDOWN_PERIOD) {
        setDetectedCurrency(highestClass);
        speak(highestClass);
        lastDetectedTimeRef.current = now;
      }
    } catch (error) {
      console.error("Prediction error:", error);
    }
  }, [detectedCurrency, speak]);

  return (
    <DetectorContext.Provider value={{
      status,
      isDetecting,
      startDetection,
      stopDetection,
      predictions,
      detectedCurrency
    }}>
      <main className="w-full max-w-2xl bg-white dark:bg-[#1e1e1e] rounded-lg shadow-md overflow-hidden">
        {/* Action Buttons */}
        <div className="p-6 flex flex-col sm:flex-row gap-4 justify-center">
          {!isDetecting ? (
            <button 
              id="startButton" 
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#1976d2] hover:bg-[#1565c0] dark:bg-[#90caf9] dark:hover:bg-[#64b5f6] dark:text-[#121212] text-white text-xl font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1976d2] dark:focus:ring-[#90caf9] transition-colors"
              aria-label="Start currency detection"
              onClick={startDetection}
            >
              <span className="material-icons">videocam</span>
              Start Detection
            </button>
          ) : (
            <button 
              id="stopButton" 
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#d32f2f] hover:bg-[#c62828] dark:bg-[#ef5350] dark:hover:bg-[#e57373] dark:text-[#121212] text-white text-xl font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d32f2f] dark:focus:ring-[#ef5350] transition-colors"
              aria-label="Stop currency detection"
              onClick={stopDetection}
            >
              <span className="material-icons">videocam_off</span>
              Stop Detection
            </button>
          )}
        </div>
        
        {/* Webcam View */}
        {isDetecting && <WebcamView webcamRef={webcamRef} />}
        
        {/* Results Display */}
        {isDetecting && <ResultsDisplay />}
      </main>
    </DetectorContext.Provider>
  );
};
