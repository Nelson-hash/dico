import React from 'react';
import { BookOpen } from 'lucide-react';

const LoadingScreen: React.FC = () => {
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
