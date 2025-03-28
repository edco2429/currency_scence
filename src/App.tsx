import { useEffect } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { StatusIndicator } from "./components/StatusIndicator";
import { CurrencyDetector } from "./components/CurrencyDetector";
import { AccessibilityInstructions } from "./components/AccessibilityInstructions";
import { Footer } from "./components/Footer";
import { useTheme } from "./hooks/useTheme";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { registerShortcuts } = useKeyboardShortcuts();

  useEffect(() => {
    // Setup keyboard shortcuts
    registerShortcuts();
  }, [registerShortcuts]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 transition-colors duration-300 bg-[#f5f5f5] text-[#212121] dark:bg-[#121212] dark:text-[#f5f5f5]">
      {/* Header */}
      <header className="w-full max-w-2xl mb-8 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-center sm:text-left">
          <span className="text-[#1976d2] dark:text-[#90caf9]">Currency</span> Identifier
        </h1>
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </header>

      {/* Status Indicator */}
      <StatusIndicator />
      
      {/* Main Currency Detector Component */}
      <CurrencyDetector />
      
      {/* Accessibility Instructions */}
      <AccessibilityInstructions />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
