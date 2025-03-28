import { FC } from "react";

export const AccessibilityInstructions: FC = () => {
  return (
    <section className="w-full max-w-2xl mt-8 p-6 bg-white dark:bg-[#1e1e1e] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#1976d2] dark:text-[#90caf9]">Accessibility Information</h2>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <span className="material-icons text-[#388e3c] dark:text-[#81c784] mr-3 mt-1">keyboard</span>
          <div>
            <h3 className="font-bold">Keyboard Navigation</h3>
            <p>Use Tab to navigate, Space or Enter to activate buttons. Press S to start detection, Escape to stop.</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <span className="material-icons text-[#388e3c] dark:text-[#81c784] mr-3 mt-1">volume_up</span>
          <div>
            <h3 className="font-bold">Audio Feedback</h3>
            <p>App will announce detected currency notes. Ensure your device volume is turned on.</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <span className="material-icons text-[#388e3c] dark:text-[#81c784] mr-3 mt-1">help_outline</span>
          <div>
            <h3 className="font-bold">Usage Tips</h3>
            <p>Hold the currency note steady, ensure good lighting, and position the note within the dashed guide.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
