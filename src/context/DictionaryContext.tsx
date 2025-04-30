import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Word, Definition } from '../types';
import { mockWords, getRandomWord, getWordOfTheDay, getTrendingWords, searchWords } from '../utils/mockData';
import { supabase } from '../lib/supabase';

interface DictionaryContextType {
  words: Word[];
  currentWord: Word | null;
  searchResults: Word[];
  wordOfTheDay: Word;
  trendingWords: Word[];
  searchQuery: string;
  setCurrentWord: (word: Word) => void;
  setSearchQuery: (query: string) => void;
  getRandomWord: () => void;
  voteOnDefinition: (wordId: string, definitionId: string, vote: 'up' | 'down') => void;
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

export const DictionaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [words, setWords] = useState<Word[]>(mockWords);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [wordOfTheDay, setWordOfTheDay] = useState<Word>(getWordOfTheDay());
  const [trendingWords, setTrendingWords] = useState<Word[]>(getTrendingWords());

  const handleSearchQuery = async (query: string) => {
    setSearchQuery(query);
    // Ready for Supabase integration
    const results = searchWords(query);
    setSearchResults(results);
  };

  const handleRandomWord = async () => {
    // Ready for Supabase integration
    const randomWord = getRandomWord();
    setCurrentWord(randomWord);
  };

  const handleVoteOnDefinition = async (wordId: string, definitionId: string, vote: 'up' | 'down') => {
    // Ready for Supabase integration
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
  };

  const value = {
    words,
    currentWord,
    searchResults,
    wordOfTheDay,
    trendingWords,
    searchQuery,
    setCurrentWord,
    setSearchQuery: handleSearchQuery,
    getRandomWord: handleRandomWord,
    voteOnDefinition: handleVoteOnDefinition
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