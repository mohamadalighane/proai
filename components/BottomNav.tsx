
import React from 'react';
import { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: 'fa-house', label: 'خانه' },
    { id: 'explore', icon: 'fa-compass', label: 'اکسپلور' },
    { id: 'community', icon: 'fa-users', label: 'انجمن' },
    { id: 'education', icon: 'fa-graduation-cap', label: 'آموزش' },
    { id: 'saved', icon: 'fa-bookmark', label: 'ذخیره' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 md:hidden flex justify-around items-center h-16 px-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id as Page)}
          className={`flex flex-col items-center gap-1 transition-all ${currentPage === item.id ? 'text-violet-500 scale-110' : 'text-gray-400'}`}
        >
          <i className={`fa-solid ${item.icon} text-xl`}></i>
          <span className="text-[10px]">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
