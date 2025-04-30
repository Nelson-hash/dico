import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

interface ResetPasswordFormProps {
  onBackToLogin: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { resetPassword, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    
    // Validate form
    if (!email) {
      setFormError('Email is required');
      return;
    }
    
    // Send reset password email
    try {
      await resetPassword(email);
      setSuccessMessage('Password reset link has been sent to your email');
      setEmail('');
    } catch (err) {
      // Error will be handled by the Auth context
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button
        type="button"
        onClick={onBackToLogin}
        className="flex items-center text-purple-600 mb-4 hover:text-purple-800 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to login
      </button>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset your password</h2>
      <p className="text-gray-600 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      {formError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          {formError}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md">
          {successMessage}
        </div>
      )}
      
      <div>
        <label htmlFor="reset-email" className="block text-gray-700 font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="reset-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          placeholder="Enter your email"
          required
          disabled={!!successMessage}
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !!successMessage}
        className={`w-full py-2 px-4 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors ${
          (isLoading || !!successMessage) ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Sending...' : 'Send reset link'}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
