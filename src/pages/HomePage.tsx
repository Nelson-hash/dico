import React, { useEffect } from 'react';
import { useDictionary } from '../context/DictionaryContext';
import WordCard from '../components/WordCard';
import DefinitionCard from '../components/DefinitionCard';
import RelatedWords from '../components/RelatedWords';

const HomePage: React.FC = () => {
  const { wordOfTheDay, trendingWords, currentWord, setCurrentWord } = useDictionary();

  // Set word of the day as current word if no word is selected
  useEffect(() => {
    if (!currentWord) {
      setCurrentWord(wordOfTheDay);
    }
  }, [currentWord, wordOfTheDay, setCurrentWord]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Current Word Section */}
      {currentWord && (
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-700 to-teal-500 p-8 rounded-t-lg shadow-md">
            <h1 className="text-4xl font-bold text-white mb-2">{currentWord.word}</h1>
            <p className="text-purple-100">
              {currentWord.definitions.length} {currentWord.definitions.length === 1 ? 'definition' : 'definitions'}
            </p>
          </div>
          
          <div className="bg-white p-1 shadow-md">
            <div className="lg:flex">
              <div className="lg:w-3/4 p-5">
                {currentWord.definitions.map((definition, index) => (
                  <DefinitionCard 
                    key={definition.id} 
                    definition={definition} 
                    wordId={currentWord.id} 
                    index={index} 
                  />
                ))}
              </div>
              
              <div className="lg:w-1/4 p-5">
                <RelatedWords excludeWordId={currentWord.id} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Word of the Day */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Word of the Day</h2>
        <WordCard word={wordOfTheDay} isFeatured={true} />
      </section>

      {/* Trending Words */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trending Words</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingWords.map(word => (
            <WordCard key={word.id} word={word} isTrending={true} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;