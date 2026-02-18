
import React, { useState, useEffect, useCallback } from 'react';
import { Page, Prompt, Category, Post, Course } from './types';
import { INITIAL_PROMPTS, CATEGORIES, COURSES as INITIAL_COURSES } from './constants';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Education from './pages/Education';
import Community from './pages/Community';
import Saved from './pages/Saved';
import Admin from './pages/Admin';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageHistory, setPageHistory] = useState<Page[]>(['home']);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [isSyncing, setIsSyncing] = useState(false);

  // Load Data from LocalStorage (as cache) and Setup Initial State
  useEffect(() => {
    const savedPrompts = localStorage.getItem('pe_prompts');
    const savedPosts = localStorage.getItem('pe_posts');
    const savedCourses = localStorage.getItem('pe_courses');
    
    setPrompts(savedPrompts ? JSON.parse(savedPrompts) : INITIAL_PROMPTS);
    setCourses(savedCourses ? JSON.parse(savedCourses) : INITIAL_COURSES);
    
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    else {
      const initialPosts = [
        { id: '1', author: 'سپهر', content: 'امروز اولین خروجی رو از Sora گرفتم، محشر بود!', likes: 24, date: '۱۰ دقیقه پیش' },
        { id: '2', author: 'مریم', content: 'بهترین مدل برای کدزنی پایتون چیه؟', likes: 12, date: '۱ ساعت پیش' }
      ];
      setPosts(initialPosts);
    }
  }, []);

  // Sync Data to LocalStorage whenever state changes
  useEffect(() => {
    if (prompts.length > 0) localStorage.setItem('pe_prompts', JSON.stringify(prompts));
    if (courses.length > 0) localStorage.setItem('pe_courses', JSON.stringify(courses));
    if (posts.length > 0) localStorage.setItem('pe_posts', JSON.stringify(posts));
  }, [prompts, courses, posts]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const navigateTo = (page: Page) => {
    if (page === currentPage) return;
    setPageHistory(prev => [...prev, page]);
    setCurrentPage(page);
  };

  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop();
      const prevPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setCurrentPage(prevPage);
    }
  };

  const handleLike = (id: string) => {
    const updated = prompts.map(p => 
      p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : (p.likes || 0) + 1 } : p
    );
    setPrompts(updated);
  };

  const handleSave = (id: string) => {
    const updated = prompts.map(p => 
      p.id === id ? { ...p, isSaved: !p.isSaved } : p
    );
    setPrompts(updated);
    const target = updated.find(p => p.id === id);
    if (target?.isSaved) showToast('به سیو شده‌ها اضافه شد');
  };

  const addPost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: 'کاربر مهمان',
      content,
      likes: 0,
      date: 'لحظاتی پیش'
    };
    setPosts([newPost, ...posts]);
    showToast('پست با موفقیت ارسال شد');
  };

  const savePrompt = (prompt: Prompt) => {
    const exists = prompts.find(p => p.id === prompt.id);
    if (exists) {
      setPrompts(prompts.map(p => p.id === prompt.id ? prompt : p));
      showToast('پرامپت ویرایش شد');
    } else {
      setPrompts([prompt, ...prompts]);
      showToast('پرامپت جدید اضافه شد');
    }
  };

  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
    showToast('پرامپت حذف شد');
  };

  const saveCourse = (course: Course) => {
    const exists = courses.find(c => c.id === course.id);
    if (exists) {
      setCourses(courses.map(c => c.id === course.id ? course : c));
      showToast('آموزش ویرایش شد');
    } else {
      setCourses([course, ...courses]);
      showToast('آموزش جدید اضافه شد');
    }
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
    showToast('آموزش حذف شد');
  };

  // Simulation of Cloud Sync
  const syncWithCloud = async () => {
    setIsSyncing(true);
    // در دنیای واقعی اینجا کد Fetch/Push به دیتابیس قرار می‌گیرد
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    showToast('اطلاعات با موفقیت همگام‌سازی شد');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={navigateTo} trendingPrompts={prompts.slice(0, 8)} onLike={handleLike} onSave={handleSave} />;
      case 'explore': return <Explore prompts={prompts} onLike={handleLike} onSave={handleSave} showToast={showToast} />;
      case 'education': return <Education courses={courses} />;
      case 'community': return <Community posts={posts} onAddPost={addPost} />;
      case 'saved': return <Saved prompts={prompts.filter(p => p.isSaved)} onLike={handleLike} onSave={handleSave} showToast={showToast} />;
      case 'admin': return <Admin 
        prompts={prompts} 
        posts={posts} 
        courses={courses} 
        onDeletePrompt={deletePrompt} 
        onSavePrompt={savePrompt} 
        onDeleteCourse={deleteCourse} 
        onSaveCourse={saveCourse} 
        onNavigate={navigateTo}
        onSync={syncWithCloud}
        isSyncing={isSyncing}
      />;
      default: return <Home onNavigate={navigateTo} trendingPrompts={prompts.slice(0, 8)} onLike={handleLike} onSave={handleSave} />;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar onNavigate={navigateTo} onSearch={() => {}} canGoBack={pageHistory.length > 1} onBack={goBack} isSyncing={isSyncing} />
      
      <main className="max-w-7xl mx-auto px-4 pt-16 animate-in fade-in duration-500">
        {renderPage()}
      </main>

      <BottomNav currentPage={currentPage} onNavigate={navigateTo} />
      
      {toast.visible && <Toast message={toast.message} />}
    </div>
  );
};

export default App;
