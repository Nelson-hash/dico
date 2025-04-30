import React, { useState, useEffect } from 'react';
import { DictionaryProvider } from './context/DictionaryContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import SubmitPage from './pages/SubmitPage';
import TrendingPage from './pages/TrendingPage';
import LoadingScreen from './components/LoadingScreen';
import ErrorMessage from './components/ErrorMessage';
import { checkSupabaseConnection } from './lib/supabase';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Add a state to track if we've been loading for too long
  const [loadingTooLong, setLoadingTooLong] = useState(false);
  // Add error state
  const [error, setError] = useState<string | null>(null);
  
  // Simple routing based on URL
  useEffect(() => {
    // Show loading screen for at least 1 second for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // If loading takes more than 5 seconds, show a warning
    const longLoadingTimer = setTimeout(() => {
      if (isLoading) {
        setLoadingTooLong(true);
        console.warn('Loading is taking longer than expected');
      }
    }, 5000);
    
    // Test Supabase connection
    const testConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        console.log('Supabase connection test result:', isConnected);
        if (!isConnected) {
          console.warn('Supabase connection test failed, app will use mock data');
        }
      } catch (error) {
        console.error('Error testing Supabase connection:', error);
        setError('Failed to connect to database. Using mock data instead.');
      }
    };
    
    testConnection();
    
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
      clearTimeout(longLoadingTimer);
    };
  }, [isLoading]);
  
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

  // If we're still loading but it's taking too long, add a reset button
  if (isLoading) {
    return (
      <LoadingScreen 
        showResetButton={loadingTooLong} 
        onReset={() => window.location.reload()} 
      />
    );
  }

  return (
    <AuthProvider>
      <DictionaryProvider>
        <MainLayout>
          {error && (
            <div className="container mx-auto px-4 py-4">
              <ErrorMessage 
                message={error} 
                onRetry={() => window.location.reload()}
              />
            </div>
          )}
          
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
