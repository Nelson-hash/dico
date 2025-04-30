import React, { useState } from 'react';
import { Definition } from '../types';
import { useDictionary } from '../context/DictionaryContext';
import { ThumbsUp, ThumbsDown, Calendar, User, Tag } from 'lucide-react';

interface DefinitionCardProps {
  definition: Definition;
  wordId: string;
  index: number;
}

const DefinitionCard: React.FC<DefinitionCardProps> = ({ definition, wordId, index }) => {
  const { voteOnDefinition } = useDictionary();
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);

  const handleVote = (type: 'up' | 'down') => {
    if (voted === type) return; // Prevent voting twice in the same direction
    
    voteOnDefinition(wordId, definition.id, type);
    setVoted(type);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          Definition #{index + 1}
        </h3>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-sm text-gray-500">{formatDate(definition.date)}</span>
        </div>
      </div>
      
      <div className="flex items-center mb-3 text-sm text-gray-600">
        <User className="h-4 w-4 mr-1" />
        <span>By {definition.author}</span>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{definition.meaning}</p>
      
      <div className="bg-purple-50 p-4 rounded-md mb-4 border-l-4 border-purple-500">
        <p className="text-gray-700 italic">"{definition.example}"</p>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {definition.tags.map((tag, i) => (
          <div key={i} className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex gap-4">
          <button 
            className={`flex items-center gap-1 ${
              voted === 'up' ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
            } transition-colors`}
            onClick={() => handleVote('up')}
            disabled={voted !== null}
          >
            <ThumbsUp className="h-5 w-5" />
            <span className="font-medium">{definition.upvotes}</span>
          </button>
          
          <button 
            className={`flex items-center gap-1 ${
              voted === 'down' ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
            } transition-colors`}
            onClick={() => handleVote('down')}
            disabled={voted !== null}
          >
            <ThumbsDown className="h-5 w-5" />
            <span className="font-medium">{definition.downvotes}</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {voted && <span className="text-purple-600">Thanks for voting!</span>}
        </div>
      </div>
    </div>
  );
};

export default DefinitionCard;