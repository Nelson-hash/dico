import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Word } from '../types';
import * as supabaseService from '../services/supabaseService';
import { useAuth } from './AuthContext';
// Import mock data as fallback
import { mockWords, getRandomWord as getMockRandomWord, getWordOfTheDay as getMockWordOfTheDay, getTrendingWords as getMockTrendingWords } from '../utils/mockData';

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
  const [useSupabase, setUseSupabase] = useState(true); // Flag to determine if we should use Supabase or mock data

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      
      // Added try/catch for each call with fallback to mock data
      try {
        if (useSupabase) {
          try {
            // Try Supabase first - if it fails, we'll use mock data
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
            console.error('Error loading data from Supabase, falling back to mock data:', err);
            setUseSupabase(false); // Switch to mock data for subsequent calls
            
            // Use mock data instead
            setWordOfTheDay(getMockWordOfTheDay());
            setTrendingWords(getMockTrendingWords());
            setWords(mockWords);
          }
        } else {
          // Use mock data directly
          setWordOfTheDay(getMockWordOfTheDay());
          setTrendingWords(getMockTrendingWords());
          setWords(mockWords);
        }
      } catch (err) {
        setError('Failed to load initial data');
        console.error('Error loading initial data:', err);
        
        // As a last resort, use mock data
        setWordOfTheDay(getMockWordOfTheDay());
        setTrendingWords(getMockTrendingWords());
        setWords(mockWords);
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
      
      if (useSupabase) {
        try {
          const results = await supabaseService.searchWords(query);
          setSearchResults(results);
        } catch (err) {
          console.error('Error searching in Supabase, falling back to mock data:', err);
          // Fall back to mock search
          const mockResults = mockWords.filter(word => 
            word.word.toLowerCase().includes(query.toLowerCase()) ||
            word.definitions.some(def => 
              def.meaning.toLowerCase().includes(query.toLowerCase()) ||
              def.example.toLowerCase().includes(query.toLowerCase())
            )
          );
          setSearchResults(mockResults);
        }
      } else {
        // Use mock search
        const mockResults = mockWords.filter(word => 
          word.word.toLowerCase().includes(query.toLowerCase()) ||
          word.definitions.some(def => 
            def.meaning.toLowerCase().includes(query.toLowerCase()) ||
            def.example.toLowerCase().includes(query.toLowerCase())
          )
        );
        setSearchResults(mockResults);
      }
    } catch (err) {
      setError('Failed to search');
      console.error('Error searching words:', err);
      // Set empty results as fallback
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get a random word
  const handleRandomWord = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (useSupabase) {
        try {
          const randomWord = await supabaseService.getRandomWord();
          setCurrentWord(randomWord);
        } catch (err) {
          console.error('Error getting random word from Supabase, falling back to mock data:', err);
          // Fall back to mock random word
          setCurrentWord(getMockRandomWord());
        }
      } else {
        // Use mock random word
        setCurrentWord(getMockRandomWord());
      }
    } catch (err) {
      setError('Failed to get random word');
      console.error('Error getting random word:', err);
      // Fall back to first word as last resort
      setCurrentWord(mockWords[0]);
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
      if (useSupabase) {
        try {
          await supabaseService.voteOnDefinition(definitionId, user.id, vote);
        } catch (err) {
          console.error('Error voting in Supabase, using local state only:', err);
          // Continue with local state update only
        }
      }
      
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
      if (useSupabase) {
        try {
          await supabaseService.submitWord(word, {
            ...definition,
            author_id: user.id
          });
          
          // Refresh trending words after submission
          const trending = await supabaseService.getTrendingWords();
          setTrendingWords(trending);
        } catch (err) {
          console.error('Error submitting to Supabase, using mock data:', err);
          // Fall back to mock data
          // Just update local state for demo purposes
          const newWord: Word = {
            id: `mock-${Date.now()}`,
            word: word,
            created_at: new Date().toISOString(),
            definitions: [
              {
                id: `def-${Date.now()}`,
                word_id: `mock-${Date.now()}`,
                meaning: definition.meaning,
                example: definition.example,
                author_id: user.id,
                created_at: new Date().toISOString(),
                upvotes: 0,
                downvotes: 0,
                tags: definition.tags
              }
            ]
          };
          
          setWords([newWord, ...words]);
          setTrendingWords([newWord, ...trendingWords.slice(0, -1)]);
        }
      } else {
        // Use mock data
        // Just update local state for demo purposes
        const newWord: Word = {
          id: `mock-${Date.now()}`,
          word: word,
          created_at: new Date().toISOString(),
          definitions: [
            {
              id: `def-${Date.now()}`,
              word_id: `mock-${Date.now()}`,
              meaning: definition.meaning,
              example: definition.example,
              author_id: user.id,
              created_at: new Date().toISOString(),
              upvotes: 0,
              downvotes: 0,
              tags: definition.tags
            }
          ]
        };
        
        setWords([newWord, ...words]);
        setTrendingWords([newWord, ...trendingWords.slice(0, -1)]);
      }
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
