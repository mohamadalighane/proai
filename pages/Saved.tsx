
import React from 'react';
import { Prompt } from '../types';
import PromptCard from '../components/PromptCard';

interface SavedProps {
  prompts: Prompt[];
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  showToast: (msg: string) => void;
}

const Saved: React.FC<SavedProps> = ({ prompts, onLike, onSave, showToast }) => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-violet-500 text-2xl">
          <i className="fa-solid fa-bookmark"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold">سیو شده‌های من</h1>
          <p className="text-sm text-gray-400">{prompts.length} پرامپت ذخیره شده</p>
        </div>
      </div>

      {prompts.length > 0 ? (
        <div className="masonry-grid">
          {prompts.map(p => (
            <PromptCard key={p.id} prompt={p} onLike={onLike} onSave={onSave} showToast={showToast} />
          ))}
        </div>
      ) : (
        <div className="glass p-20 rounded-[3rem] border border-white/10 text-center space-y-4">
          <i className="fa-regular fa-bookmark text-6xl text-gray-600"></i>
          <h3 className="text-xl font-bold text-gray-500">لیست سیوهای شما خالی است</h3>
          <p className="text-gray-600">پرامپت‌هایی که دوست دارید را سیو کنید تا اینجا نمایش داده شوند.</p>
        </div>
      )}
    </div>
  );
};

export default Saved;
