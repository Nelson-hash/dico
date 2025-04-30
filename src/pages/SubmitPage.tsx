import React from 'react';
import SubmitForm from '../components/SubmitForm';

const SubmitPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Submit a Definition</h1>
          <p className="text-gray-600">
            Help us grow our slang dictionary by adding new words and definitions. Your contribution matters!
          </p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-purple-800 mb-3">Submission Guidelines</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Be clear and concise in your definitions</li>
            <li>Provide an authentic example of how the word is used</li>
            <li>Add relevant tags to help others find your definition</li>
            <li>No hate speech, discriminatory language, or personal attacks</li>
            <li>Don't submit copyrighted content without permission</li>
            <li>Offensive content is allowed only if it's an accurate definition of slang</li>
          </ul>
        </div>
        
        <SubmitForm />
      </div>
    </div>
  );
};

export default SubmitPage;