
import React, { useState, useRef, useEffect } from 'react';
import { Prompt, Post, Course, Page, Category } from '../types';
import { CATEGORIES } from '../constants';

interface AdminProps {
  prompts: Prompt[];
  posts: Post[];
  courses: Course[];
  onDeletePrompt: (id: string) => void;
  onSavePrompt: (prompt: Prompt) => void;
  onDeleteCourse: (id: string) => void;
  onSaveCourse: (course: Course) => void;
  onNavigate: (p: Page) => void;
  onSync: () => void;
  isSyncing: boolean;
}

const Admin: React.FC<AdminProps> = ({ prompts, posts, courses, onDeletePrompt, onSavePrompt, onDeleteCourse, onSaveCourse, onNavigate, onSync, isSyncing }) => {
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({ user: '', pass: '', code: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'prompts' | 'courses' | 'community' | 'database'>('stats');
  
  // DB Config State
  const [dbConfig, setDbConfig] = useState({
    apiUrl: localStorage.getItem('pe_db_url') || '',
    apiKey: localStorage.getItem('pe_db_key') || ''
  });

  // CRUD states
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [tempPromptImage, setTempPromptImage] = useState<string>('');
  const [tempCourseImage, setTempCourseImage] = useState<string>('');
  const promptFileInputRef = useRef<HTMLInputElement>(null);
  const courseFileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && credentials.user === 'admin') setStep(2);
    else if (step === 2 && credentials.pass === 'AdminPrompt2026!') setStep(3);
    else if (step === 3 && credentials.code === '4819') setIsLoggedIn(true);
    else alert('اطلاعات اشتباه است');
  };

  const handleDbSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pe_db_url', dbConfig.apiUrl);
    localStorage.setItem('pe_db_key', dbConfig.apiKey);
    alert('تنظیمات دیتابیس با موفقیت ذخیره شد. حالا می‌توانید اطلاعات را در ابر همگام‌سازی کنید.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'prompt' | 'course') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'prompt') setTempPromptImage(base64String);
        else setTempCourseImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePromptSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const p: Prompt = {
      id: editingPrompt?.id || Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      promptText: formData.get('promptText') as string,
      imageUrl: tempPromptImage || (formData.get('imageUrl') as string) || `https://picsum.photos/seed/${Math.random()}/600/800`,
      category: formData.get('category') as Category,
      likes: editingPrompt?.likes || 0,
      savesCount: editingPrompt?.savesCount || 0,
      author: formData.get('author') as string || 'مدیریت',
      isLiked: editingPrompt?.isLiked || false,
      isSaved: editingPrompt?.isSaved || false
    };
    onSavePrompt(p);
    setShowPromptForm(false);
    setEditingPrompt(null);
    setTempPromptImage('');
  };

  const handleCourseSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const c: Course = {
      id: editingCourse?.id || Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      thumbnail: tempCourseImage || (formData.get('thumbnail') as string) || `https://picsum.photos/seed/${Math.random()}/400/250`,
      difficulty: formData.get('difficulty') as any,
      duration: formData.get('duration') as string
    };
    onSaveCourse(c);
    setShowCourseForm(false);
    setEditingCourse(null);
    setTempCourseImage('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="glass p-8 rounded-3xl w-full max-w-md border border-white/10 animate-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-violet-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg shadow-violet-500/30">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h2 className="text-2xl font-bold">ورود امن مدیریت</h2>
            <p className="text-xs text-gray-500 mt-2">دسترسی به پایگاه داده مرکزی</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {step === 1 && <input autoFocus type="text" placeholder="نام کاربری (admin)" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 ring-violet-500 outline-none" onChange={(e) => setCredentials({ ...credentials, user: e.target.value })} />}
              {step === 2 && <input autoFocus type="password" placeholder="رمز عبور" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 ring-violet-500 outline-none" onChange={(e) => setCredentials({ ...credentials, pass: e.target.value })} />}
              {step === 3 && <input autoFocus type="text" placeholder="کد تایید (4819)" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 ring-violet-500 outline-none" onChange={(e) => setCredentials({ ...credentials, code: e.target.value })} />}
            </div>
            <button className="w-full bg-gradient-to-r from-violet-600 to-pink-500 py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg">
              {step === 3 ? 'تایید نهایی و ورود' : 'ادامه'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <i className="fa-solid fa-server text-violet-500"></i>
            مدیریت پایگاه داده
          </h1>
          <p className="text-gray-500 text-sm mt-1">کنترل کامل محتوا در تمام دیوایس‌ها</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['stats', 'prompts', 'courses', 'community', 'database'].map((tab: any) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-violet-600 shadow-lg shadow-violet-500/20' : 'glass hover:bg-white/10'}`}
            >
              {tab === 'stats' ? 'داشبورد' : tab === 'prompts' ? 'پرامپت‌ها' : tab === 'courses' ? 'آموزش‌ها' : tab === 'community' ? 'انجمن' : 'تنظیمات ابری'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'database' && (
        <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-500">
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <i className="fa-solid fa-cloud-bolt text-violet-400"></i>
              اتصال به دیتابیس خارجی
            </h3>
            <p className="text-sm text-gray-400">برای اینکه اطلاعات برای همه کاربران در تمام دنیا نمایش داده شود، یک آدرس API از سرویس‌هایی مثل Supabase یا Firebase در اینجا وارد کنید.</p>
            <form onSubmit={handleDbSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 mr-2">Database URL</label>
                <input 
                  type="text" 
                  value={dbConfig.apiUrl}
                  onChange={(e) => setDbConfig({...dbConfig, apiUrl: e.target.value})}
                  placeholder="https://your-project.supabase.co" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 mr-2">API Key (Service Role)</label>
                <input 
                  type="password" 
                  value={dbConfig.apiKey}
                  onChange={(e) => setDbConfig({...dbConfig, apiKey: e.target.value})}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono"
                  dir="ltr"
                />
              </div>
              <button className="w-full bg-white text-black py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform">
                ذخیره تنظیمات ابر
              </button>
            </form>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">وضعیت همگام‌سازی</h3>
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-bold text-sm">برنامه آماده اتصال به ابر است</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">با کلیک روی دکمه زیر، تمام پرامپت‌ها و تصاویر محلی شما به پایگاه داده ابری منتقل می‌شوند تا سایر کاربران بتوانند آن‌ها را ببینند.</p>
            </div>
            
            <button 
              onClick={onSync}
              disabled={isSyncing}
              className={`w-full py-6 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 ${isSyncing ? 'bg-gray-800' : 'bg-gradient-to-tr from-violet-600 to-pink-600 hover:shadow-2xl shadow-violet-500/40'}`}
            >
              {isSyncing ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  درحال انتقال اطلاعات...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                  همگام‌سازی با تمام دیوایس‌ها
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'prompts' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">مدیریت پرامپت‌ها</h2>
            <button onClick={() => { setEditingPrompt(null); setTempPromptImage(''); setShowPromptForm(true); }} className="bg-violet-600 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20">
              <i className="fa-solid fa-plus ml-2"></i>
              افزودن پرامپت جدید
            </button>
          </div>

          <div className="glass rounded-[2rem] overflow-hidden border border-white/10">
            <table className="w-full text-right">
              <thead className="bg-white/5">
                <tr className="text-gray-400 text-xs">
                  <th className="p-5">پیش‌نمایش</th>
                  <th className="p-5">عنوان و نویسنده</th>
                  <th className="p-5">دسته</th>
                  <th className="p-5">لایک</th>
                  <th className="p-5">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {prompts.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <img src={p.imageUrl} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{p.title}</div>
                      <div className="text-[10px] text-gray-500">{p.author}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 bg-white/5 rounded-md">{p.category}</span>
                    </td>
                    <td className="p-4 font-mono text-violet-400">{p.likes}</td>
                    <td className="p-4">
                      <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingPrompt(p); setTempPromptImage(p.imageUrl); setShowPromptForm(true); }} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-violet-400 hover:bg-violet-500 hover:text-white"><i className="fa-solid fa-pen-to-square"></i></button>
                        <button onClick={() => onDeletePrompt(p.id)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white"><i className="fa-solid fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Forms Modals */}
      {showPromptForm && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass p-8 rounded-[3rem] w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black">{editingPrompt ? 'ویرایش پرامپت ابری' : 'انتشار پرامپت جدید'}</h3>
              <button onClick={() => setShowPromptForm(false)} className="text-gray-500 hover:text-white text-2xl"><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <form onSubmit={handlePromptSubmit} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 mr-2">عنوان نمایشی</label>
                  <input name="title" defaultValue={editingPrompt?.title} placeholder="مثلا: منظره سایبرپانک" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-violet-500 outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 mr-2">توضیحات کوتاه</label>
                  <textarea name="description" defaultValue={editingPrompt?.description} placeholder="درباره این خروجی..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-24 resize-none focus:ring-2 ring-violet-500 outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-xs text-gray-500 mr-2">دسته بندی</label>
                    <select name="category" defaultValue={editingPrompt?.category} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 ring-violet-500 outline-none appearance-none">
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 mr-2">نام نویسنده</label>
                    <input name="author" defaultValue={editingPrompt?.author} placeholder="مدیر" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-violet-500 outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 mr-2">متن پرامپت مهندسی شده</label>
                  <textarea name="promptText" defaultValue={editingPrompt?.promptText} placeholder="Imagine prompt..." className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 h-32 font-mono text-xs text-violet-300" dir="ltr" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 mr-2">تصویر شاخص</label>
                  <div 
                    onClick={() => promptFileInputRef.current?.click()}
                    className="aspect-video w-full rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative group"
                  >
                    {tempPromptImage ? (
                      <>
                        <img src={tempPromptImage} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-xs font-bold">تغییر تصویر</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-600 mb-2"></i>
                        <span className="text-xs text-gray-500">انتخاب تصویر از سیستم</span>
                      </>
                    )}
                  </div>
                  <input type="file" hidden ref={promptFileInputRef} accept="image/*" onChange={(e) => handleFileChange(e, 'prompt')} />
                  <input name="imageUrl" value={tempPromptImage} onChange={(e) => setTempPromptImage(e.target.value)} placeholder="یا آدرس اینترنتی (URL)..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] font-mono" dir="ltr" />
                </div>
              </div>

              <div className="md:col-span-2 flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-violet-600 py-4 rounded-2xl font-black text-lg hover:bg-violet-700 shadow-xl shadow-violet-500/20">
                  {editingPrompt ? 'بروزرسانی در دیتابیس' : 'انتشار عمومی در ابر'}
                </button>
                <button type="button" onClick={() => setShowPromptForm(false)} className="px-8 glass rounded-2xl font-bold">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Stats (Minimalist) */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in zoom-in duration-300">
          {[
            { label: 'کل پرامپت‌ها', val: prompts.length, icon: 'fa-images', color: 'text-violet-500' },
            { label: 'آموزش‌های ابری', val: courses.length, icon: 'fa-graduation-cap', color: 'text-blue-500' },
            { label: 'تعاملات (لایک)', val: prompts.reduce((a, b) => a + (b.likes || 0), 0), icon: 'fa-heart', color: 'text-pink-500' },
            { label: 'پست‌های انجمن', val: posts.length, icon: 'fa-comments', color: 'text-orange-500' }
          ].map((s, i) => (
            <div key={i} className="glass p-6 rounded-[2rem] border border-white/10 text-center space-y-2">
              <i className={`fa-solid ${s.icon} text-2xl ${s.color}`}></i>
              <div className="text-3xl font-black font-mono">{s.val}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-tighter">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
