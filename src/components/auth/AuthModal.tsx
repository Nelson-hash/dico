import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ResetPasswordForm from './ResetPasswordForm';

type AuthTab = 'login' | 'register' | 'reset';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AuthTab;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialTab = 'login' 
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const { user, isLoading } = useAuth();

  // Close modal if user is logged in
  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex space-x-4">
            <button
              className={`pb-2 font-medium ${
                activeTab === 'login'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`pb-2 font-medium ${
                activeTab === 'register'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'login' && (
            <LoginForm onForgotPassword={() => setActiveTab('reset')} />
          )}
          
          {activeTab === 'register' && (
            <RegisterForm />
          )}
          
          {activeTab === 'reset' && (
            <ResetPasswordForm onBackToLogin={() => setActiveTab('login')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
