import React, { useEffect } from 'react';
import { useDictionary } from '../context/DictionaryContext';
import WordCard from '../components/WordCard';

const SearchResultsPage: React.FC = () => {
  const { searchResults, searchQuery, setCurrentWord } = useDictionary();

  // Set first result as current word if there are results
  useEffect(() => {
    if (searchResults.length > 0) {
      setCurrentWord(searchResults[0]);
    }
  }, [searchResults, setCurrentWord]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {searchResults.length > 0 
            ? `Search results for "${searchQuery}"`
            : `No results found for "${searchQuery}"`
          }
        </h1>
        <p className="text-gray-600">
          {searchResults.length > 0 
            ? `Found ${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'}`
            : 'Try a different search term or submit your own definition!'
          }
        </p>
      </div>

      {searchResults.length === 0 ? (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">No Definitions Found</h2>
          <p className="text-gray-700 mb-6">
            The term "{searchQuery}" hasn't been defined yet. Be the first to define it!
          </p>
          <a 
            href="/submit" 
            className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 transition-colors inline-block"
          >
            Submit a Definition
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map(word => (
            <WordCard key={word.id} word={word} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;