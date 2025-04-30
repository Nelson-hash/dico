import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Word } from '../types';
import * as supabaseService from '../services/supabaseService';
import { useAuth } from './AuthContext';

interface DictionaryContextType {
  words: Word[];
  currentWord: Word | null;
  searchResults: Word[];
  wordOfTheDay: Word | null;
  trendingWords: Word[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  setCurrentWord: (word: Word) => void;
  setSearchQuery: (query: string) => void;
  getRandomWord: () => Promise<void>;
  voteOnDefinition: (wordId: string, definitionId: string, vote: 'up' | 'down') => Promise<void>;
  submitWord: (word: string, definition: { meaning: string; example: string; tags: string[] }) => Promise<void>;
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

export const DictionaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [wordOfTheDay, setWordOfTheDay] = useState<Word | null>(null);
  const [trendingWords, setTrendingWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load word of the day
        const wotd = await supabaseService.getWordOfTheDay();
        setWordOfTheDay(wotd);
        
        // Load trending words
        const trending = await supabaseService.getTrendingWords();
        setTrendingWords(trending);
        
        // Load initial words
        const initialWords = await supabaseService.getWords();
        setWords(initialWords);
      } catch (err) {
        setError('Failed to load initial data');
        console.error('Error loading initial data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Handle search query
  const handleSearchQuery = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setError(null);
    
    try {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      
      // Update URL with search query
      const url = new URL(window.location.href);
      url.searchParams.set('q', query);
      window.history.pushState({}, '', url.toString());
      
      const results = await supabaseService.searchWords(query);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search');
      console.error('Error searching words:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get a random word
  const handleRandomWord = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const randomWord = await supabaseService.getRandomWord();
      setCurrentWord(randomWord);
    } catch (err) {
      setError('Failed to get random word');
      console.error('Error getting random word:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Vote on a definition
  const handleVoteOnDefinition = async (wordId: string, definitionId: string, vote: 'up' | 'down') => {
    if (!user) {
      setError('You must be logged in to vote');
      return;
    }
    
    try {
      await supabaseService.voteOnDefinition(definitionId, user.id, vote);
      
      // Update local state to reflect the vote
      const updatedWords = words.map(word => {
        if (word.id === wordId) {
          const updatedDefinitions = word.definitions.map(def => {
            if (def.id === definitionId) {
              return {
                ...def,
                upvotes: vote === 'up' ? def.upvotes + 1 : def.upvotes,
                downvotes: vote === 'down' ? def.downvotes + 1 : def.downvotes
              };
            }
            return def;
          });
          return { ...word, definitions: updatedDefinitions };
        }
        return word;
      });

      setWords(updatedWords);

      if (currentWord && currentWord.id === wordId) {
        const updatedCurrentWord = updatedWords.find(w => w.id === wordId) || null;
        setCurrentWord(updatedCurrentWord);
      }
    } catch (err) {
      setError('Failed to vote');
      console.error('Error voting on definition:', err);
    }
  };

  // Submit a new word
  const handleSubmitWord = async (word: string, definition: { meaning: string; example: string; tags: string[] }) => {
    if (!user) {
      setError('You must be logged in to submit');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await supabaseService.submitWord(word, {
        ...definition,
        author_id: user.id
      });
      
      // Refresh trending words after submission
      const trending = await supabaseService.getTrendingWords();
      setTrendingWords(trending);
    } catch (err) {
      setError('Failed to submit word');
      console.error('Error submitting word:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    words,
    currentWord,
    searchResults,
    wordOfTheDay,
    trendingWords,
    searchQuery,
    isLoading,
    error,
    setCurrentWord,
    setSearchQuery: handleSearchQuery,
    getRandomWord: handleRandomWord,
    voteOnDefinition: handleVoteOnDefinition,
    submitWord: handleSubmitWord
  };

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
};

export const useDictionary = (): DictionaryContextType => {
  const context = useContext(DictionaryContext);
  if (context === undefined) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
};
