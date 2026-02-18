
import React from 'react';
import { Page } from '../types';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  onSearch: (query: string) => void;
  canGoBack: boolean;
  onBack: () => void;
  isSyncing?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onSearch, canGoBack, onBack, isSyncing }) => {
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

      <div className="flex items-center gap-4">
        {isSyncing && (
          <div className="flex items-center gap-2 text-violet-400 text-xs font-bold animate-pulse">
            <i className="fa-solid fa-cloud-arrow-up"></i>
            <span className="hidden sm:inline">در حال همگام‌سازی...</span>
          </div>
        )}
        <button 
          onClick={() => onNavigate('admin')}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors relative"
        >
          <i className="fa-solid fa-user-shield text-violet-400"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
