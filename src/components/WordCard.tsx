import React from 'react';
import { Word } from '../types';
import { useDictionary } from '../context/DictionaryContext';
import { TrendingUp, Star } from 'lucide-react';

interface WordCardProps {
  word: Word;
  isTrending?: boolean;
  isFeatured?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({ word, isTrending = false, isFeatured = false }) => {
  const { setCurrentWord } = useDictionary();

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleCardClick = () => {
    setCurrentWord(word);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const topDefinition = word.definitions[0];

  return (
    <div 
      className={`
        relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer
        ${isFeatured ? 'bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200' : 'bg-white'}
      `}
      onClick={handleCardClick}
    >
      {/* Badge */}
      {isTrending && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          Trending
        </div>
      )}
      
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded-bl-lg flex items-center">
          <Star className="h-3 w-3 mr-1" />
          Word of the Day
        </div>
      )}
      
      <div className="p-5">
        <h3 className={`font-bold mb-2 ${isFeatured ? 'text-2xl text-purple-700' : 'text-xl text-gray-800'}`}>
          {word.word}
        </h3>
        
        <p className="text-gray-600 mb-3 text-sm">
          {truncateText(topDefinition.meaning, isFeatured ? 250 : 120)}
        </p>
        
        {isFeatured && (
          <div className="bg-purple-100 p-3 rounded-md italic text-gray-700 text-sm mb-3">
            "{truncateText(topDefinition.example, 150)}"
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            by {topDefinition.author}
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-2">
              👍 {topDefinition.upvotes}
            </span>
            <span>
              👎 {topDefinition.downvotes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCard;