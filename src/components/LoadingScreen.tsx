import React from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';

interface LoadingScreenProps {
  showResetButton?: boolean;
  onReset?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  showResetButton = false, 
  onReset 
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-purple-600 text-white z-50">
      <div className="animate-pulse">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="h-16 w-16 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-center">
          UrbanSlang
        </h1>
        <p className="text-purple-200 mt-2 text-center">
          Loading the dictionary of the streets...
        </p>
      </div>
      
      <div className="w-48 h-1 bg-white/20 rounded-full mt-8 overflow-hidden">
        <div 
          className="h-full bg-white rounded-full" 
          style={{ 
            width: '30%', 
            animation: 'loading 1.5s infinite'
          }}
        ></div>
      </div>
      
      {showResetButton && (
        <div className="mt-8">
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-white text-purple-700 px-4 py-2 rounded-md font-medium hover:bg-purple-100 transition-colors"
          >
            <RefreshCw size={18} />
            Loading taking too long? Click to reset
          </button>
          <p className="text-purple-200 text-sm mt-3 text-center">
            If you continue to see this screen, there might be an issue connecting to our database.
          </p>
        </div>
      )}
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
