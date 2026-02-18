
import React from 'react';

const Toast: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-violet-600 text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-top duration-300 border border-violet-400/50 backdrop-blur-md">
    <div className="flex items-center gap-2">
      <i className="fa-solid fa-check-circle"></i>
      <span className="text-sm font-bold">{message}</span>
    </div>
  </div>
);

export default Toast;
