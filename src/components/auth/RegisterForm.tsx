import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { signUp, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    
    // Validate form
    if (!email || !password || !confirmPassword) {
      setFormError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    // Sign up
    try {
      await signUp(email, password);
      setSuccessMessage('Registration successful! Check your email to confirm your account.');
      
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Error will be handled by the Auth context
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create an account</h2>
      
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
        <label htmlFor="register-email" className="block text-gray-700 font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="register-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          placeholder="Enter your email"
          required
          disabled={!!successMessage}
        />
      </div>
      
      <div>
        <label htmlFor="register-password" className="block text-gray-700 font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          placeholder="Create a password"
          required
          disabled={!!successMessage}
        />
        <p className="text-xs text-gray-500 mt-1">
          Must be at least 6 characters
        </p>
      </div>
      
      <div>
        <label htmlFor="confirm-password" className="block text-gray-700 font-medium mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          placeholder="Confirm your password"
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
        {isLoading ? 'Registering...' : 'Register'}
      </button>
      
      <p className="text-sm text-gray-600 text-center">
        By registering, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
};

export default RegisterForm;
