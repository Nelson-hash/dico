import React, { useState } from 'react';
import { useDictionary } from '../context/DictionaryContext';
import { Search, BookOpen, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { setSearchQuery, getRandomWord } = useDictionary();
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchValue);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
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
              onClick={getRandomWord}
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
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
                onClick={() => {
                  getRandomWord();
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium p-2 text-left"
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;