
import React, { useState } from 'react';
import { Prompt } from '../types';
import PromptModal from './PromptModal';

interface PromptCardProps {
  prompt: Prompt;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  showToast: (msg: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onLike, onSave, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="masonry-item relative group cursor-pointer overflow-hidden rounded-2xl bg-white/5 border border-white/10"
        onClick={() => setIsModalOpen(true)}
      >
        <img 
          src={prompt.imageUrl} 
          alt={prompt.title} 
          className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-sm font-bold text-white mb-1">{prompt.title}</h3>
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span>{prompt.author}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-heart text-red-500"></i>
                {prompt.likes}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute top-2 left-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            className={`w-8 h-8 rounded-full flex items-center justify-center glass ${prompt.isLiked ? 'text-red-500' : 'text-white'}`}
            onClick={(e) => { e.stopPropagation(); onLike(prompt.id); }}
          >
            <i className="fa-solid fa-heart"></i>
          </button>
          <button 
            className={`w-8 h-8 rounded-full flex items-center justify-center glass ${prompt.isSaved ? 'text-violet-500' : 'text-white'}`}
            onClick={(e) => { e.stopPropagation(); onSave(prompt.id); }}
          >
            <i className="fa-solid fa-bookmark"></i>
          </button>
        </div>
        
        <div className="absolute top-2 right-2 glass px-2 py-1 rounded text-[10px] text-white">
          {prompt.category}
        </div>
      </div>

      {isModalOpen && (
        <PromptModal 
          prompt={prompt} 
          onClose={() => setIsModalOpen(false)} 
          onLike={() => onLike(prompt.id)}
          onSave={() => onSave(prompt.id)}
          showToast={showToast}
        />
      )}
    </>
  );
};

export default PromptCard;
