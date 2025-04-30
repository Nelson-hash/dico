import React, { useState } from 'react';
import { useDictionary } from '../context/DictionaryContext';
import { useAuth } from '../context/AuthContext';
import { Search, BookOpen, Menu, X, User, LogOut } from 'lucide-react';
import AuthModal from './auth/AuthModal';

const Header: React.FC = () => {
  const { setSearchQuery, getRandomWord, isLoading } = useDictionary();
  const { user, signOut } = useAuth();
  
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setSearchQuery(searchValue);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleRandomWord = async () => {
    await getRandomWord();
    setIsMobileMenuOpen(false);
  };
  
  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 bg-white shadow-md z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-400 bg-clip-text text-transparent">
                  UrbanSlang
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                Home
              </a>
              <button
                onClick={handleRandomWord}
                disabled={isLoading}
                className={`text-gray-600 hover:text-purple-600 transition-colors font-medium ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Random
              </button>
              <a
                href="/submit"
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                Submit
              </a>
              <a
                href="/trending"
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                Trending
              </a>
              
              {user ? (
                <div className="relative group">
                  <button className="flex items-center text-gray-600 hover:text-purple-600 transition-colors font-medium">
                    <User className="h-5 w-5 mr-1" />
                    <span className="truncate max-w-[120px]">
                      {user.email?.split('@')[0]}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors"
                >
                  Login / Register
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 hover:text-purple-600"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search for slang..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full p-3 pl-10 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white rounded-full px-4 py-1.5 hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Define
              </button>
            </form>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4 absolute left-4 right-4 z-20">
              <nav className="flex flex-col space-y-4">
                <a
                  href="/"
                  className="text-gray-600 hover:text-purple-600 transition-colors font-medium p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <button
                  onClick={handleRandomWord}
                  disabled={isLoading}
                  className={`text-gray-600 hover:text-purple-600 transition-colors font-medium p-2 text-left ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Random
                </button>
                <a
                  href="/submit"
                  className="text-gray-600 hover:text-purple-600 transition-colors font-medium p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Submit
                </a>
                <a
                  href="/trending"
                  className="text-gray-600 hover:text-purple-600 transition-colors font-medium p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Trending
                </a>
                
                {user ? (
                  <>
                    <div className="border-t border-gray-200 my-2 pt-2"></div>
                    <div className="flex items-center text-gray-600 p-2">
                      <User className="h-5 w-5 mr-2" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center text-red-600 hover:text-red-800 transition-colors font-medium p-2"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors"
                    >
                      Login / Register
                    </button>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
