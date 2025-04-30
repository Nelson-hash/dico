import React from 'react';
import { DictionaryProvider } from './context/DictionaryContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import SubmitPage from './pages/SubmitPage';
import TrendingPage from './pages/TrendingPage';

function App() {
  const [activePage, setActivePage] = React.useState('home');
  const [hasSearched, setHasSearched] = React.useState(false);
  
  // Simple routing based on URL
  React.useEffect(() => {
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
    };
  }, []);
  
  // Listen for search events
  React.useEffect(() => {
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

  return (
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
  );
}

export default App;