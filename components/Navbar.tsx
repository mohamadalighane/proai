
import React from 'react';
import { Page } from '../types';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  onSearch: (query: string) => void;
  canGoBack: boolean;
  onBack: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onSearch, canGoBack, onBack }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 h-16 flex items-center px-4 md:px-8 justify-between">
      <div className="flex items-center gap-2">
        {canGoBack && (
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all ml-2"
          >
            <i className="fa-solid fa-arrow-right text-gray-400"></i>
          </button>
        )}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-pink-500 rounded-xl flex items-center justify-center neon-glow">
            <i className="fa-solid fa-eye text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block">
            پرامپت‌آی
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
        <i className="fa-solid fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input 
          type="text" 
          placeholder="جستجو در پرامپت‌ها..."
          className="w-full bg-white/5 border border-white/10 rounded-full py-2 pr-10 pl-4 focus:outline-none focus:ring-2 ring-violet-500/50 transition-all"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('admin')}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <i className="fa-solid fa-user-shield text-violet-400"></i>
        </button>
        <button className="sm:hidden text-2xl text-white">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
