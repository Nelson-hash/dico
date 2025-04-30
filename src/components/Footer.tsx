import React from 'react';
import { BookOpen, Github, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">UrbanSlang</span>
            </div>
            <p className="text-sm text-gray-400">
              The dictionary of the streets, where slang finds definition and meaning.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="/trending" className="text-gray-400 hover:text-white transition-colors">Trending</a></li>
              <li><a href="/random" className="text-gray-400 hover:text-white transition-colors">Random</a></li>
              <li><a href="/submit" className="text-gray-400 hover:text-white transition-colors">Submit</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="/guidelines" className="text-gray-400 hover:text-white transition-colors">Guidelines</a></li>
              <li><a href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/top-contributors" className="text-gray-400 hover:text-white transition-colors">Top Contributors</a></li>
              <li><a href="/badges" className="text-gray-400 hover:text-white transition-colors">Badges</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center text-gray-500">
          <p>© {new Date().getFullYear()} UrbanSlang. All rights reserved.</p>
          <p className="mt-1">This is a clone project created for demonstration purposes only.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;