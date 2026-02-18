
import React, { useEffect } from 'react';
import { Prompt } from '../types';

interface PromptModalProps {
  prompt: Prompt;
  onClose: () => void;
  onLike: () => void;
  onSave: () => void;
  showToast: (msg: string) => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ prompt, onClose, onLike, onSave, showToast }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt.promptText);
    showToast('پرامپت کپی شد!');
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl relative flex flex-col md:flex-row custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="md:w-1/2 bg-black flex items-center justify-center">
          <img src={prompt.imageUrl} alt={prompt.title} className="w-full h-full object-contain" />
        </div>

        <div className="md:w-1/2 p-6 md:p-8 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-violet-600/20 text-violet-400 text-xs px-2 py-1 rounded-full">{prompt.category}</span>
              <span className="text-gray-400 text-xs">منتشر شده توسط {prompt.author}</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">{prompt.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{prompt.description}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 relative group">
            <h4 className="text-xs text-gray-500 mb-2 uppercase tracking-widest">پرامپت اصلی</h4>
            <code className="text-sm text-violet-300 block break-words font-mono">
              {prompt.promptText}
            </code>
            <button 
              onClick={copyPrompt}
              className="mt-4 w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-copy"></i>
              کپی پرامپت
            </button>
          </div>

          <div className="flex items-center justify-around border-t border-white/10 pt-4 mt-auto">
            <button 
              onClick={onLike}
              className={`flex flex-col items-center gap-1 ${prompt.isLiked ? 'text-red-500' : 'text-gray-400'}`}
            >
              <i className={`fa-solid fa-heart text-2xl ${prompt.isLiked ? 'animate-bounce' : ''}`}></i>
              <span className="text-xs">{prompt.likes} لایک</span>
            </button>
            <button 
              onClick={onSave}
              className={`flex flex-col items-center gap-1 ${prompt.isSaved ? 'text-violet-500' : 'text-gray-400'}`}
            >
              <i className="fa-solid fa-bookmark text-2xl"></i>
              <span className="text-xs">ذخیره</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-400">
              <i className="fa-solid fa-share-nodes text-2xl"></i>
              <span className="text-xs">اشتراک</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
