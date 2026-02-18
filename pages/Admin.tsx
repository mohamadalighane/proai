
import React, { useState, useRef } from 'react';
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
}

const Admin: React.FC<AdminProps> = ({ prompts, posts, courses, onDeletePrompt, onSavePrompt, onDeleteCourse, onSaveCourse, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({ user: '', pass: '', code: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'prompts' | 'courses' | 'community' | 'tools'>('stats');
  
  // CRUD states
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Image states for uploads
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

  const openPromptEdit = (p: Prompt | null) => {
    setEditingPrompt(p);
    setTempPromptImage(p?.imageUrl || '');
    setShowPromptForm(true);
  };

  const openCourseEdit = (c: Course | null) => {
    setEditingCourse(c);
    setTempCourseImage(c?.thumbnail || '');
    setShowCourseForm(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="glass p-8 rounded-3xl w-full max-w-md border border-white/10 animate-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-violet-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl">
              <i className="fa-solid fa-lock"></i>
            </div>
            <h2 className="text-2xl font-bold">ورود به پنل مدیریت</h2>
            <p className="text-sm text-gray-500">مرحله {step} از ۳</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {step === 1 && (
              <div className="space-y-2">
                <label className="text-xs text-gray-400">نام کاربری</label>
                <input autoFocus type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 ring-violet-500/50" onChange={(e) => setCredentials({ ...credentials, user: e.target.value })} />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-2">
                <label className="text-xs text-gray-400">رمز عبور</label>
                <input autoFocus type="password" placeholder="AdminPrompt2026!" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 ring-violet-500/50" onChange={(e) => setCredentials({ ...credentials, pass: e.target.value })} />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-2">
                <label className="text-xs text-gray-400">کد امنیتی (4819)</label>
                <input autoFocus type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 ring-violet-500/50" onChange={(e) => setCredentials({ ...credentials, code: e.target.value })} />
              </div>
            )}
            <button className="w-full bg-violet-600 py-3 rounded-xl font-bold hover:bg-violet-700 transition-colors">
              {step === 3 ? 'ورود به پنل' : 'ادامه'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <i className="fa-solid fa-chart-line text-violet-500"></i>
          داشبورد مدیریت
        </h1>
        <div className="flex flex-wrap gap-2">
          {['stats', 'prompts', 'courses', 'community', 'tools'].map((tab: any) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-violet-600' : 'glass'}`}
            >
              {tab === 'stats' ? 'آمار' : tab === 'prompts' ? 'پرامپت‌ها' : tab === 'courses' ? 'آموزش‌ها' : tab === 'community' ? 'انجمن' : 'ابزارها'}
            </button>
          ))}
          <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2 glass hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-bold transition-all">خروج</button>
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-3xl border border-white/10 space-y-2">
            <span className="text-gray-400 text-sm">کل پرامپت‌ها</span>
            <div className="text-3xl font-black">{prompts.length}</div>
          </div>
          <div className="glass p-6 rounded-3xl border border-white/10 space-y-2">
            <span className="text-gray-400 text-sm">آموزش‌ها</span>
            <div className="text-3xl font-black">{courses.length}</div>
          </div>
          <div className="glass p-6 rounded-3xl border border-white/10 space-y-2">
            <span className="text-gray-400 text-sm">مجموع لایک‌ها</span>
            <div className="text-3xl font-black">{prompts.reduce((acc, p) => acc + (p.likes || 0), 0)}</div>
          </div>
          <div className="glass p-6 rounded-3xl border border-white/10 space-y-2">
            <span className="text-gray-400 text-sm">پست‌ها</span>
            <div className="text-3xl font-black">{posts.length}</div>
          </div>
        </div>
      )}

      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">لیست پرامپت‌ها</h2>
            <button 
              onClick={() => openPromptEdit(null)}
              className="bg-violet-600 px-4 py-2 rounded-xl text-sm font-bold"
            >
              + افزودن پرامپت
            </button>
          </div>
          
          {showPromptForm && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
              <div className="glass p-8 rounded-[2rem] w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-6">{editingPrompt ? 'ویرایش پرامپت' : 'افزودن پرامپت جدید'}</h3>
                <form onSubmit={handlePromptSubmit} className="space-y-4">
                  <input name="title" defaultValue={editingPrompt?.title} placeholder="عنوان" className="w-full bg-white/5 border border-white/10 rounded-xl p-3" required />
                  <textarea name="description" defaultValue={editingPrompt?.description} placeholder="توضیحات کوتاه" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-20" required />
                  <textarea name="promptText" defaultValue={editingPrompt?.promptText} placeholder="متن پرامپت (انگلیسی)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-32 font-mono" dir="ltr" required />
                  
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block mb-1">تصویر پرامپت</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-24 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                        {tempPromptImage ? (
                          <img src={tempPromptImage} className="w-full h-full object-cover" />
                        ) : (
                          <i className="fa-solid fa-image text-gray-600 text-2xl"></i>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input 
                          type="file" 
                          hidden 
                          ref={promptFileInputRef}
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'prompt')}
                        />
                        <button 
                          type="button" 
                          onClick={() => promptFileInputRef.current?.click()}
                          className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-bold transition-all"
                        >
                          <i className="fa-solid fa-upload ml-2"></i> انتخاب فایل از سیستم
                        </button>
                        <input name="imageUrl" defaultValue={editingPrompt?.imageUrl} placeholder="یا آدرس اینترنتی تصویر..." className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <select name="category" defaultValue={editingPrompt?.category} className="bg-white/5 border border-white/10 rounded-xl p-3 text-white">
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                    </select>
                    <input name="author" defaultValue={editingPrompt?.author} placeholder="نویسنده" className="bg-white/5 border border-white/10 rounded-xl p-3" />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <button type="submit" className="flex-1 bg-violet-600 py-3 rounded-xl font-bold">ذخیره</button>
                    <button type="button" onClick={() => setShowPromptForm(false)} className="flex-1 glass py-3 rounded-xl font-bold">انصراف</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="glass rounded-3xl overflow-hidden border border-white/10 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4">عنوان</th>
                  <th className="p-4">دسته</th>
                  <th className="p-4">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {prompts.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold">{p.title}</td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4 flex items-center gap-3">
                      <button onClick={() => openPromptEdit(p)} className="text-violet-400 hover:text-violet-300"><i className="fa-solid fa-pen"></i></button>
                      <button onClick={() => onDeletePrompt(p.id)} className="text-red-400 hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">مدیریت آموزش‌ها</h2>
            <button 
              onClick={() => openCourseEdit(null)}
              className="bg-violet-600 px-4 py-2 rounded-xl text-sm font-bold"
            >
              + افزودن آموزش
            </button>
          </div>

          {showCourseForm && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
              <div className="glass p-8 rounded-[2rem] w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-6">{editingCourse ? 'ویرایش آموزش' : 'افزودن آموزش جدید'}</h3>
                <form onSubmit={handleCourseSubmit} className="space-y-4">
                  <input name="title" defaultValue={editingCourse?.title} placeholder="عنوان دوره" className="w-full bg-white/5 border border-white/10 rounded-xl p-3" required />
                  <textarea name="description" defaultValue={editingCourse?.description} placeholder="توضیحات دوره" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-20" required />
                  
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block mb-1">کاور آموزش</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-16 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                        {tempCourseImage ? (
                          <img src={tempCourseImage} className="w-full h-full object-cover" />
                        ) : (
                          <i className="fa-solid fa-graduation-cap text-gray-600 text-2xl"></i>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input 
                          type="file" 
                          hidden 
                          ref={courseFileInputRef}
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'course')}
                        />
                        <button 
                          type="button" 
                          onClick={() => courseFileInputRef.current?.click()}
                          className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-bold transition-all"
                        >
                          <i className="fa-solid fa-upload ml-2"></i> آپلود از سیستم
                        </button>
                        <input name="thumbnail" defaultValue={editingCourse?.thumbnail} placeholder="یا آدرس اینترنتی کاور..." className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <select name="difficulty" defaultValue={editingCourse?.difficulty} className="bg-white/5 border border-white/10 rounded-xl p-3 text-white">
                      <option value="مبتدی" className="bg-gray-900">مبتدی</option>
                      <option value="متوسط" className="bg-gray-900">متوسط</option>
                      <option value="پیشرفته" className="bg-gray-900">پیشرفته</option>
                    </select>
                    <input name="duration" defaultValue={editingCourse?.duration} placeholder="مدت زمان (مثلا ۱۰ ساعت)" className="bg-white/5 border border-white/10 rounded-xl p-3" required />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <button type="submit" className="flex-1 bg-violet-600 py-3 rounded-xl font-bold">ذخیره</button>
                    <button type="button" onClick={() => setShowCourseForm(false)} className="flex-1 glass py-3 rounded-xl font-bold">انصراف</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {courses.map(course => (
              <div key={course.id} className="glass p-4 rounded-2xl flex items-center justify-between border border-white/10">
                <div className="flex gap-4 items-center">
                  <img src={course.thumbnail} className="w-16 h-12 object-cover rounded-lg" />
                  <div>
                    <h4 className="font-bold">{course.title}</h4>
                    <span className="text-xs text-gray-500">{course.difficulty} | {course.duration}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => openCourseEdit(course)} className="text-violet-400 p-2"><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => onDeleteCourse(course.id)} className="text-red-400 p-2"><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'community' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">پست‌های انجمن</h2>
          {posts.map(post => (
            <div key={post.id} className="glass p-4 rounded-2xl flex justify-between items-center border border-white/10">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold">{post.author[0]}</div>
                <div>
                  <h4 className="font-bold text-sm">{post.author}</h4>
                  <p className="text-xs text-gray-400 line-clamp-1">{post.content}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{post.date}</span>
                <button className="text-red-400 hover:text-red-500 p-2"><i className="fa-solid fa-ban"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tools' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">ابزارهای مدیریتی</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="glass p-6 rounded-3xl text-right hover:bg-red-500/10 transition-colors border border-red-500/20">
              <i className="fa-solid fa-trash-can text-red-500 mb-2 block text-2xl"></i>
              <h4 className="font-bold text-red-400">پاکسازی کل داده‌ها</h4>
              <p className="text-xs text-gray-500">تمامی پرامپت‌ها و تنظیمات به حالت اولیه باز می‌گردند.</p>
            </button>
            <button className="glass p-6 rounded-3xl text-right hover:bg-violet-500/10 transition-colors border border-violet-500/20">
              <i className="fa-solid fa-file-export text-violet-500 mb-2 block text-2xl"></i>
              <h4 className="font-bold text-violet-400">خروجی اکسل (JSON)</h4>
              <p className="text-xs text-gray-500">دریافت فایل پشتیبان از تمام پرامپت‌ها.</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;