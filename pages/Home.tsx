
import React from 'react';
import { Prompt, Page } from '../types';
import PromptCard from '../components/PromptCard';

interface HomeProps {
  onNavigate: (p: Page) => void;
  trendingPrompts: Prompt[];
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, trendingPrompts, onLike, onSave }) => {
  return (
    <div className="space-y-12 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] p-8 md:p-16 hero-gradient border border-white/10 min-h-[500px] flex flex-col justify-center">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-600/30 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-600/20 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            دنیای <span className="text-violet-500">پرامپت‌ها</span> در دستان شما
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            بیش از ۱۰۰۰ پرامپت بهینه شده برای Midjourney، ChatGPT و Stable Diffusion. 
            خلاقیت خود را با هوش مصنوعی به سطح جدیدی ببرید.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('explore')}
              className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
            >
              شروع جستجو
            </button>
            <button 
              onClick={() => onNavigate('education')}
              className="glass px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-colors"
            >
              آموزش درآمدزایی
            </button>
          </div>
        </div>

        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:block animate-float">
          <div className="w-64 h-80 glass rounded-3xl overflow-hidden shadow-2xl border-2 border-violet-500/30">
            <img src="https://picsum.photos/seed/hero/400/600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <i className="fa-solid fa-shapes text-violet-500"></i>
          دسته‌بندی‌ها
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {['تصویر', 'ویدیو', 'متن', 'موسیقی', 'کد'].map((cat, i) => (
            <div 
              key={cat} 
              className="glass p-6 rounded-3xl text-center cursor-pointer hover:bg-violet-600 transition-all group border border-white/10"
              onClick={() => onNavigate('explore')}
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20">
                <i className={`fa-solid ${i === 0 ? 'fa-image' : i === 1 ? 'fa-video' : i === 2 ? 'fa-pen-nib' : i === 3 ? 'fa-music' : 'fa-code'} text-xl`}></i>
              </div>
              <span className="font-bold">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-fire text-orange-500"></i>
            ترندینگ هفته
          </h2>
          <button onClick={() => onNavigate('explore')} className="text-violet-400 hover:text-violet-300 transition-colors text-sm font-bold">مشاهده همه</button>
        </div>
        <div className="masonry-grid">
          {trendingPrompts.map(p => (
            <PromptCard key={p.id} prompt={p} onLike={onLike} onSave={onSave} showToast={() => {}} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
