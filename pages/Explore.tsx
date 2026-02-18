
import React, { useState, useMemo } from 'react';
import { Prompt, Category } from '../types';
import { CATEGORIES } from '../constants';
import PromptCard from '../components/PromptCard';

interface ExploreProps {
  prompts: Prompt[];
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  showToast: (msg: string) => void;
}

const Explore: React.FC<ExploreProps> = ({ prompts, onLike, onSave, showToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'همه'>('همه');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return prompts.filter(p => {
      const matchCat = selectedCategory === 'همه' || p.category === selectedCategory;
      const matchSearch = p.title.includes(search) || p.description.includes(search) || p.promptText.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [prompts, selectedCategory, search]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-6 rounded-[2rem] border border-white/10">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
          <button 
            onClick={() => setSelectedCategory('همه')}
            className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all ${selectedCategory === 'همه' ? 'bg-violet-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
          >
            همه
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-violet-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <i className="fa-solid fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="جستجوی پیشرفته..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pr-10 pl-4 focus:outline-none ring-2 ring-transparent focus:ring-violet-500/50 transition-all"
          />
        </div>
      </div>

      <div className="masonry-grid">
        {filtered.map(p => (
          <PromptCard key={p.id} prompt={p} onLike={onLike} onSave={onSave} showToast={showToast} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <i className="fa-solid fa-face-frown text-6xl text-gray-600 mb-4"></i>
          <h3 className="text-xl font-bold text-gray-500">پرامپتی با این مشخصات پیدا نشد</h3>
        </div>
      )}
    </div>
  );
};

export default Explore;
