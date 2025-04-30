import React from 'react';
import { Word } from '../types';
import { useDictionary } from '../context/DictionaryContext';
import { ArrowRight } from 'lucide-react';

interface RelatedWordsProps {
  excludeWordId: string;
}

const RelatedWords: React.FC<RelatedWordsProps> = ({ excludeWordId }) => {
  const { words, setCurrentWord } = useDictionary();
  
  // Get 5 random words for related section (excluding current word)
  const getRelatedWords = (): Word[] => {
    const otherWords = words.filter(word => word.id !== excludeWordId);
    return otherWords.sort(() => 0.5 - Math.random()).slice(0, 5);
  };
  
  const relatedWords = getRelatedWords();

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Related Words</h3>
      <ul className="space-y-2">
        {relatedWords.map(word => (
          <li key={word.id}>
            <button
              onClick={() => setCurrentWord(word)}
              className="w-full text-left p-2 rounded-md hover:bg-white hover:shadow-sm transition-all flex justify-between items-center group"
            >
              <span className="font-medium text-gray-700">{word.word}</span>
              <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedWords;