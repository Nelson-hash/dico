import React from 'react';
import { useDictionary } from '../context/DictionaryContext';
import WordCard from '../components/WordCard';
import { TrendingUp, Clock, Siren as Fire } from 'lucide-react';

const TrendingPage: React.FC = () => {
  const { words } = useDictionary();
  
  // For demo purposes, we'll just use the mock data and pretend some are trending
  const trendingToday = words.slice(0, 6);
  const trendingThisWeek = words.slice(3, 9);
  const trendingThisMonth = words.slice(2, 8);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Trending Words</h1>
        <p className="text-gray-600">
          Discover what's popular in the world of slang right now.
        </p>
      </div>
      
      {/* Trending Today */}
      <section className="mb-12">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 text-red-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Trending Today</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingToday.map(word => (
            <WordCard key={word.id} word={word} isTrending={true} />
          ))}
        </div>
      </section>
      
      {/* Trending This Week */}
      <section className="mb-12">
        <div className="flex items-center mb-4">
          <Clock className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Trending This Week</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingThisWeek.map(word => (
            <WordCard key={word.id} word={word} />
          ))}
        </div>
      </section>
      
      {/* Trending This Month */}
      <section className="mb-12">
        <div className="flex items-center mb-4">
          <Fire className="h-6 w-6 text-orange-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Trending This Month</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingThisMonth.map(word => (
            <WordCard key={word.id} word={word} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TrendingPage;