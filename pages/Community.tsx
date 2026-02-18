
import React, { useState } from 'react';
import { Post } from '../types';

interface CommunityProps {
  posts: Post[];
  onAddPost: (content: string) => void;
}

const Community: React.FC<CommunityProps> = ({ posts, onAddPost }) => {
  const [newPost, setNewPost] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    onAddPost(newPost);
    setNewPost('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div className="glass p-6 rounded-3xl border border-white/10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-pencil text-violet-500"></i>
          ارسال پست جدید
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="امروز چه چیزی خلق کردید؟"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:ring-2 ring-violet-500/50 transition-all resize-none"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-gray-400 text-xl">
              <button type="button" className="hover:text-violet-500"><i className="fa-solid fa-image"></i></button>
              <button type="button" className="hover:text-violet-500"><i className="fa-solid fa-link"></i></button>
            </div>
            <button 
              type="submit"
              disabled={!newPost.trim()}
              className="bg-violet-600 disabled:bg-gray-700 text-white px-8 py-2 rounded-xl font-bold transition-all"
            >
              انتشار
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="glass p-6 rounded-3xl border border-white/10 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {post.author[0]}
              </div>
              <div>
                <h4 className="font-bold text-sm">{post.author}</h4>
                <span className="text-[10px] text-gray-500">{post.date}</span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">{post.content}</p>
            <div className="flex items-center gap-6 border-t border-white/5 pt-4">
              <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                <i className="fa-regular fa-heart"></i>
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors">
                <i className="fa-regular fa-comment"></i>
                <span className="text-sm">پاسخ</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
