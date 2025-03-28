import { FC, useContext } from "react";
import { DetectorContext } from "./CurrencyDetector";

export const ResultsDisplay: FC = () => {
  const { predictions, detectedCurrency } = useContext(DetectorContext);
  
  const CONFIDENCE_THRESHOLD = 0.7;
  
  return (
    <div id="resultsSection" className="px-6 pb-6">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="material-icons mr-2 text-[#388e3c] dark:text-[#81c784]">analytics</span>
          Detection Results
        </h2>
        
        <div id="label-container" className="space-y-2">
          {predictions.map((prediction, index) => (
            <div 
              key={index}
              className={`p-3 ${
                prediction.probability > CONFIDENCE_THRESHOLD 
                  ? "bg-[#1976d2] dark:bg-[#64b5f6] text-white dark:text-[#121212]" 
                  : "bg-white dark:bg-gray-700"
              } rounded flex justify-between items-center`}
            >
              <span className="font-medium">{prediction.className}:</span>
              <span className={`font-bold ${
                prediction.probability > CONFIDENCE_THRESHOLD 
                  ? "" 
                  : "text-[#388e3c] dark:text-[#81c784]"
              }`}>
                {prediction.probability.toFixed(2)}
              </span>
            </div>
          ))}
          
          {predictions.length === 0 && (
            <div className="p-3 bg-white dark:bg-gray-700 rounded">
              <span className="font-medium">No predictions available yet</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Audio Feedback Status */}
      {detectedCurrency && (
        <div className="mt-4 p-3 bg-[#388e3c] dark:bg-[#81c784] text-white dark:text-[#121212] rounded-lg flex items-center">
          <span className="material-icons mr-2">volume_up</span>
          <p id="audioFeedback" className="font-medium">Detected: {detectedCurrency}</p>
        </div>
      )}
    </div>
  );
};