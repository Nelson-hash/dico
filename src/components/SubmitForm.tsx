import React, { useState } from 'react';

const SubmitForm: React.FC = () => {
  const [formData, setFormData] = useState({
    word: '',
    definition: '',
    example: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.word.trim()) {
      newErrors.word = 'Word is required';
    }
    
    if (!formData.definition.trim()) {
      newErrors.definition = 'Definition is required';
    } else if (formData.definition.length < 20) {
      newErrors.definition = 'Definition should be at least 20 characters';
    }
    
    if (!formData.example.trim()) {
      newErrors.example = 'Example is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        word: '',
        definition: '',
        example: '',
        tags: ''
      });
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit a New Definition</h2>
      
      {isSubmitted ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Thanks for your submission!</p>
          <p className="text-sm">Your definition has been submitted for review.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="word" className="block text-gray-700 font-medium mb-2">
              Word or Phrase
            </label>
            <input
              type="text"
              id="word"
              name="word"
              value={formData.word}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                errors.word ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter the slang word or phrase"
            />
            {errors.word && <p className="text-red-500 text-sm mt-1">{errors.word}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="definition" className="block text-gray-700 font-medium mb-2">
              Definition
            </label>
            <textarea
              id="definition"
              name="definition"
              value={formData.definition}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                errors.definition ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Provide a clear and concise definition"
            />
            {errors.definition && <p className="text-red-500 text-sm mt-1">{errors.definition}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="example" className="block text-gray-700 font-medium mb-2">
              Example Usage
            </label>
            <textarea
              id="example"
              name="example"
              value={formData.example}
              onChange={handleChange}
              rows={2}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                errors.example ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Provide an example sentence using this word or phrase"
            />
            {errors.example && <p className="text-red-500 text-sm mt-1">{errors.example}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              placeholder="Separate tags with commas (e.g., funny, internet, social media)"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-purple-600 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Definition'}
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            By submitting, you agree to our content guidelines and terms of service.
            All submissions are reviewed before publication.
          </p>
        </form>
      )}
    </div>
  );
};

export default SubmitForm;