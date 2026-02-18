
import React, { useState, useRef, useEffect } from 'react';
import { Prompt, Post, Course, Page, Category, Folder } from '../types';
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
  const [activeTab, setActiveTab] = useState<'stats' | 'prompts' | 'courses' | 'storage' | 'database'>('stats');
  
  // Folder states
  const [selectedFolder, setSelectedFolder] = useState<Category | null>(null);

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
  const promptFileInputRef = useRef<HTMLInputElement>(null);

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
    alert('تنظیمات پایگاه داده ذخیره شد.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempPromptImage(reader.result as string);
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
      isSaved: editingPrompt?.isSaved || false,
      createdAt: editingPrompt?.createdAt || new Date().toISOString()
    };
    onSavePrompt(p);
    setShowPromptForm(false);
    setEditingPrompt(null);
    setTempPromptImage('');
  };

  const folders: Folder[] = CATEGORIES.map(cat => ({
    id: cat,
    name: `پوشه ${cat}ها`,
    type: cat,
    count: prompts.filter(p => p.category === cat).length
  }));

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="glass p-8 rounded-3xl w-full max-w-md border border-white/10 animate-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-violet-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg shadow-violet-500/30">
              <i className="fa-solid fa-folder-tree"></i>
            </div>
            <h2 className="text-2xl font-bold">ورود به مدیریت فایل‌ها</h2>
            <p className="text-xs text-gray-500 mt-2">کنترل متمرکز تمام دیوایس‌ها</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {step === 1 && <input autoFocus type="text" placeholder="نام کاربری" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 ring-violet-500 outline-none" onChange={(e) => setCredentials({ ...credentials, user: e.target.value })} />}
              {step === 2 && <input autoFocus type="password" placeholder="رمز عبور" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 ring-violet-500 outline-none" onChange={(e) => setCredentials({ ...credentials, pass: e.target.value })} />}
              {step === 3 && <input autoFocus type="text" placeholder="کد امنیتی (4819)" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 ring-violet-500 outline-none" onChange={(e) => setCredentials({ ...credentials, code: e.target.value })} />}
            </div>
            <button className="w-full bg-gradient-to-r from-violet-600 to-pink-500 py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg">
              {step === 3 ? 'ورود به سیستم' : 'مرحله بعد'}
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
            <i className="fa-solid fa-database text-violet-500"></i>
            مدیریت دیتابیس و فایل‌ها
          </h1>
          <p className="text-gray-500 text-sm mt-1">پایگاه داده متمرکز با قابلیت دسترسی همگانی</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['stats', 'prompts', 'storage', 'courses', 'database'].map((tab: any) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-violet-600 shadow-lg shadow-violet-500/20' : 'glass hover:bg-white/10'}`}
            >
              {tab === 'stats' ? 'داشبورد' : tab === 'prompts' ? 'لیست پرامپت‌ها' : tab === 'storage' ? 'پوشه‌های رسانه' : tab === 'courses' ? 'آموزش‌ها' : 'تنظیمات ابری'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'storage' && (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
          {!selectedFolder ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map(folder => (
                <div 
                  key={folder.id} 
                  onClick={() => setSelectedFolder(folder.type)}
                  className="glass p-8 rounded-[2.5rem] border border-white/10 cursor-pointer hover:bg-white/10 transition-all group relative overflow-hidden"
                >
                  <div className="absolute -right-4 -bottom-4 text-white/5 text-8xl group-hover:scale-110 transition-transform">
                    <i className={`fa-solid ${folder.type === 'تصویر' ? 'fa-image' : folder.type === 'ویدیو' ? 'fa-video' : 'fa-file-code'}`}></i>
                  </div>
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="w-14 h-14 bg-violet-600/20 rounded-2xl flex items-center justify-center text-violet-500 text-2xl">
                      <i className={`fa-solid ${folder.type === 'تصویر' ? 'fa-image' : folder.type === 'ویدیو' ? 'fa-video' : 'fa-folder'}`}></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{folder.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{folder.count} فایل ذخیره شده</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="glass p-8 rounded-[2.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-gray-600 hover:text-violet-400 hover:border-violet-500/50 cursor-pointer transition-all">
                <i className="fa-solid fa-folder-plus text-4xl"></i>
                <span className="font-bold">ایجاد پوشه جدید</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button onClick={() => setSelectedFolder(null)} className="flex items-center gap-2 text-violet-400 font-bold mb-4">
                <i className="fa-solid fa-arrow-right"></i>
                بازگشت به پوشه‌ها
              </button>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <i className="fa-solid fa-folder-open text-violet-500"></i>
                محتویات پوشه {selectedFolder}ها
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {prompts.filter(p => p.category === selectedFolder).map(p => (
                  <div key={p.id} className="glass rounded-2xl overflow-hidden aspect-square relative group">
                    <img src={p.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingPrompt(p); setTempPromptImage(p.imageUrl); setShowPromptForm(true); }} className="p-2 text-white hover:text-violet-400"><i className="fa-solid fa-pen"></i></button>
                      <button onClick={() => onDeletePrompt(p.id)} className="p-2 text-white hover:text-red-400"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in zoom-in duration-300">
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 text-center space-y-3">
            <i className="fa-solid fa-cloud text-3xl text-blue-500"></i>
            <div className="text-4xl font-black">{prompts.length}</div>
            <div className="text-xs text-gray-500">مجموع رکوردها</div>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 text-center space-y-3">
            <i className="fa-solid fa-folder-tree text-3xl text-violet-500"></i>
            <div className="text-4xl font-black">{folders.length}</div>
            <div className="text-xs text-gray-500">پوشه‌های فعال</div>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 text-center space-y-3">
            <i className="fa-solid fa-hard-drive text-3xl text-pink-500"></i>
            <div className="text-4xl font-black">۸.۴ GB</div>
            <div className="text-xs text-gray-500">حجم اشغال شده ابری</div>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 text-center space-y-3">
            <i className="fa-solid fa-signal text-3xl text-green-500"></i>
            <div className="text-4xl font-black">آنلاین</div>
            <div className="text-xs text-gray-500">وضعیت دیتابیس</div>
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-500">
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <i className="fa-solid fa-link text-violet-400"></i>
              تنظیمات دیتابیس متمرکز
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">این بخش اجازه می‌دهد تمام دیوایس‌ها به یک منبع واحد متصل شوند. اطلاعات پس از ذخیره در ابر، برای تمام کاربران (حتی کاربران جدید) نمایش داده خواهد شد.</p>
            <form onSubmit={handleDbSave} className="space-y-4">
              <input 
                type="text" 
                value={dbConfig.apiUrl}
                onChange={(e) => setDbConfig({...dbConfig, apiUrl: e.target.value})}
                placeholder="آدرس API دیتابیس ابری..." 
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-mono"
                dir="ltr"
              />
              <input 
                type="password" 
                value={dbConfig.apiKey}
                onChange={(e) => setDbConfig({...dbConfig, apiKey: e.target.value})}
                placeholder="کلید دسترسی (API Key)..." 
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-mono"
                dir="ltr"
              />
              <button className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:scale-[1.02] transition-transform">
                بروزرسانی اتصال ابری
              </button>
            </form>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-bold">وضعیت همگام‌سازی فایل‌ها</h3>
              <div className="flex items-center gap-4 p-5 bg-violet-600/10 border border-violet-600/20 rounded-2xl">
                <div className="w-4 h-4 bg-violet-500 rounded-full animate-pulse shadow-lg shadow-violet-500/50"></div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-violet-400">سیستم آماده همگام‌سازی است</div>
                  <div className="text-[10px] text-gray-500 mt-1">آخرین بروزرسانی: لحظاتی پیش</div>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-gray-400">
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-green-500"></i> دسترسی به تمام تصاویر در تمام دیوایس‌ها</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-green-500"></i> ذخیره‌سازی دائمی پرامپت‌ها در پوشه‌های اختصاصی</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-green-500"></i> آپلود مستقیم به دیتابیس مرکزی</li>
              </ul>
            </div>
            
            <button 
              onClick={onSync}
              disabled={isSyncing}
              className={`w-full py-6 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 ${isSyncing ? 'bg-gray-800' : 'bg-gradient-to-tr from-violet-600 to-pink-600 hover:shadow-2xl shadow-violet-500/40'}`}
            >
              {isSyncing ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  درحال آپلود به پوشه‌های ابری...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                  همگام‌سازی کل سیستم
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'prompts' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">مدیریت مستقیم پرامپت‌ها</h2>
            <button onClick={() => { setEditingPrompt(null); setTempPromptImage(''); setShowPromptForm(true); }} className="bg-violet-600 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20">
              <i className="fa-solid fa-plus ml-2"></i>
              پرامپت جدید در دیتابیس
            </button>
          </div>

          <div className="glass rounded-[2rem] overflow-hidden border border-white/10">
            <table className="w-full text-right">
              <thead className="bg-white/5">
                <tr className="text-gray-400 text-xs uppercase">
                  <th className="p-5">فایل</th>
                  <th className="p-5">اطلاعات</th>
                  <th className="p-5">پوشه / دسته</th>
                  <th className="p-5">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {prompts.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-sm" />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-sm">{p.title}</div>
                      <div className="text-[10px] text-gray-500">توسط {p.author}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] px-2 py-1 bg-violet-600/10 text-violet-400 rounded-lg border border-violet-500/20">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingPrompt(p); setTempPromptImage(p.imageUrl); setShowPromptForm(true); }} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-violet-400 hover:bg-violet-500 hover:text-white transition-all"><i className="fa-solid fa-pen-to-square"></i></button>
                        <button onClick={() => onDeletePrompt(p.id)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"><i className="fa-solid fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showPromptForm && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass p-8 rounded-[3rem] w-full max-w-3xl border border-white/10 my-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h3 className="text-2xl font-black">مدیریت فایل و پرامپت</h3>
              <button onClick={() => setShowPromptForm(false)} className="text-gray-500 hover:text-white text-2xl"><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <form onSubmit={handlePromptSubmit} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 mr-2">عنوان فایل در دیتابیس</label>
                  <input name="title" defaultValue={editingPrompt?.title} placeholder="عنوان" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-violet-500 outline-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 mr-2">توضیحات تکمیلی</label>
                  <textarea name="description" defaultValue={editingPrompt?.description} placeholder="توضیحات..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-24 resize-none focus:ring-2 ring-violet-500 outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-xs text-gray-500 mr-2">انتخاب پوشه مقصد</label>
                    <select name="category" defaultValue={editingPrompt?.category} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 ring-violet-500 outline-none appearance-none">
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 mr-2">نام نویسنده فایل</label>
                    <input name="author" defaultValue={editingPrompt?.author} placeholder="مدیریت" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-violet-500 outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 mr-2">متن پرامپت (ذخیره در دیتابیس)</label>
                  <textarea name="promptText" defaultValue={editingPrompt?.promptText} placeholder="Imagine prompt..." className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 h-32 font-mono text-xs text-violet-300" dir="ltr" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 mr-2">ذخیره تصویر در پوشه ابری</label>
                  <div 
                    onClick={() => promptFileInputRef.current?.click()}
                    className="aspect-video w-full rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative group"
                  >
                    {tempPromptImage ? (
                      <>
                        <img src={tempPromptImage} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-xs font-bold">تعویض فایل</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-600 mb-2"></i>
                        <span className="text-xs text-gray-500">انتخاب عکس از کامپیوتر</span>
                      </>
                    )}
                  </div>
                  <input type="file" hidden ref={promptFileInputRef} accept="image/*" onChange={handleFileChange} />
                  <input name="imageUrl" value={tempPromptImage} onChange={(e) => setTempPromptImage(e.target.value)} placeholder="آدرس مستقیم (URL) تصویر..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] font-mono mt-2" dir="ltr" />
                </div>
              </div>

              <div className="md:col-span-2 flex gap-4 pt-4 border-t border-white/5">
                <button type="submit" className="flex-1 bg-violet-600 py-4 rounded-2xl font-black text-lg hover:bg-violet-700 shadow-xl shadow-violet-500/20 transition-all">
                  {editingPrompt ? 'بروزرسانی در تمام دیوایس‌ها' : 'انتشار در دیتابیس مرکزی'}
                </button>
                <button type="button" onClick={() => setShowPromptForm(false)} className="px-8 glass rounded-2xl font-bold">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
