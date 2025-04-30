import React, { useState, useEffect } from 'react';
import { DictionaryProvider } from './context/DictionaryContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import SubmitPage from './pages/SubmitPage';
import TrendingPage from './pages/TrendingPage';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simple routing based on URL
  useEffect(() => {
    // Show loading screen for at least 1 second for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    const path = window.location.pathname;
    
    if (path.includes('/submit')) {
      setActivePage('submit');
    } else if (path.includes('/trending')) {
      setActivePage('trending');
    } else {
      setActivePage('home');
    }
    
    // Listen for route changes
    const handleRouteChange = () => {
      const newPath = window.location.pathname;
      
      if (newPath.includes('/submit')) {
        setActivePage('submit');
      } else if (newPath.includes('/trending')) {
        setActivePage('trending');
      } else {
        setActivePage('home');
      }
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      clearTimeout(timer);
    };
  }, []);
  
  // Listen for search events
  useEffect(() => {
    const handleSearch = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const query = searchParams.get('q');
      
      if (query) {
        setHasSearched(true);
      } else {
        setHasSearched(false);
      }
    };
    
    handleSearch();
    window.addEventListener('popstate', handleSearch);
    
    return () => {
      window.removeEventListener('popstate', handleSearch);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <DictionaryProvider>
        <MainLayout>
          {hasSearched ? (
            <SearchResultsPage />
          ) : (
            <>
              {activePage === 'home' && <HomePage />}
              {activePage === 'submit' && <SubmitPage />}
              {activePage === 'trending' && <TrendingPage />}
            </>
          )}
        </MainLayout>
      </DictionaryProvider>
    </AuthProvider>
  );
}

export default App;
