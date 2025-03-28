import { FC } from "react";

interface WebcamViewProps {
  webcamRef: React.RefObject<any>;
}

export const WebcamView: FC<WebcamViewProps> = ({ webcamRef }) => {
  return (
    <div id="webcamSection" className="px-6 pb-6 flex flex-col items-center">
      <div className="w-full max-w-md relative">
        <div 
          id="webcamContainer" 
          className="w-full aspect-square border-4 border-[#1976d2] dark:border-[#90caf9] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          aria-label="Webcam feed for currency detection"
          ref={(el) => {
            if (el && webcamRef.current && webcamRef.current.canvas) {
              // If the webcam canvas exists, remove any placeholder and add the canvas
              el.innerHTML = '';
              if (webcamRef.current.canvas.parentNode !== el) {
                el.appendChild(webcamRef.current.canvas);
              }
            }
          }}
        >
          {/* Placeholder shown until webcam canvas is loaded */}
          <p id="webcamPlaceholder" className="text-center p-4 text-gray-500 dark:text-gray-400">
            <span className="material-icons text-5xl mb-2">videocam</span><br />
            Webcam feed will appear here
          </p>
        </div>
        
        {/* Camera Guide Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="border-2 border-dashed border-[#388e3c] dark:border-[#81c784] w-4/5 h-2/3 rounded opacity-70"></div>
        </div>
      </div>
      
      {/* Helper Text */}
      <p className="mt-4 text-center text-lg">
        <span className="material-icons align-middle text-[#388e3c] dark:text-[#81c784]">help_outline</span>
        Hold a currency note centered in the frame
      </p>
    </div>
  );
};
