
import React, { useState, useEffect } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');

  // Persistency
  useEffect(() => {
    const savedPrompts = localStorage.getItem('pe_prompts');
    const savedPosts = localStorage.getItem('pe_posts');
    const savedCourses = localStorage.getItem('pe_courses');
    
    if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
    else {
      setPrompts(INITIAL_PROMPTS);
      localStorage.setItem('pe_prompts', JSON.stringify(INITIAL_PROMPTS));
    }

    if (savedCourses) setCourses(JSON.parse(savedCourses));
    else {
      setCourses(INITIAL_COURSES);
      localStorage.setItem('pe_courses', JSON.stringify(INITIAL_COURSES));
    }

    if (savedPosts) setPosts(JSON.parse(savedPosts));
    else {
      const initialPosts = [
        { id: '1', author: 'سپهر', content: 'امروز اولین خروجی رو از Sora گرفتم، محشر بود!', likes: 24, date: '۱۰ دقیقه پیش' },
        { id: '2', author: 'مریم', content: 'بهترین مدل برای کدزنی پایتون چیه؟', likes: 12, date: '۱ ساعت پیش' }
      ];
      setPosts(initialPosts);
      localStorage.setItem('pe_posts', JSON.stringify(initialPosts));
    }
  }, []);

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
      p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p
    );
    setPrompts(updated);
    localStorage.setItem('pe_prompts', JSON.stringify(updated));
  };

  const handleSave = (id: string) => {
    const updated = prompts.map(p => 
      p.id === id ? { ...p, isSaved: !p.isSaved } : p
    );
    setPrompts(updated);
    localStorage.setItem('pe_prompts', JSON.stringify(updated));
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
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('pe_posts', JSON.stringify(updated));
    showToast('پست با موفقیت ارسال شد');
  };

  // CRUD for Prompts
  const savePrompt = (prompt: Prompt) => {
    let updated;
    const exists = prompts.find(p => p.id === prompt.id);
    if (exists) {
      updated = prompts.map(p => p.id === prompt.id ? prompt : p);
      showToast('پرامپت ویرایش شد');
    } else {
      updated = [prompt, ...prompts];
      showToast('پرامپت جدید اضافه شد');
    }
    setPrompts(updated);
    localStorage.setItem('pe_prompts', JSON.stringify(updated));
  };

  const deletePrompt = (id: string) => {
    const updated = prompts.filter(p => p.id !== id);
    setPrompts(updated);
    localStorage.setItem('pe_prompts', JSON.stringify(updated));
    showToast('پرامپت حذف شد');
  };

  // CRUD for Courses
  const saveCourse = (course: Course) => {
    let updated;
    const exists = courses.find(c => c.id === course.id);
    if (exists) {
      updated = courses.map(c => c.id === course.id ? course : c);
      showToast('آموزش ویرایش شد');
    } else {
      updated = [course, ...courses];
      showToast('آموزش جدید اضافه شد');
    }
    setCourses(updated);
    localStorage.setItem('pe_courses', JSON.stringify(updated));
  };

  const deleteCourse = (id: string) => {
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);
    localStorage.setItem('pe_courses', JSON.stringify(updated));
    showToast('آموزش حذف شد');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={navigateTo} trendingPrompts={prompts.slice(0, 8)} onLike={handleLike} onSave={handleSave} />;
      case 'explore': return <Explore prompts={prompts} onLike={handleLike} onSave={handleSave} showToast={showToast} />;
      case 'education': return <Education courses={courses} />;
      case 'community': return <Community posts={posts} onAddPost={addPost} />;
      case 'saved': return <Saved prompts={prompts.filter(p => p.isSaved)} onLike={handleLike} onSave={handleSave} showToast={showToast} />;
      case 'admin': return <Admin prompts={prompts} posts={posts} courses={courses} onDeletePrompt={deletePrompt} onSavePrompt={savePrompt} onDeleteCourse={deleteCourse} onSaveCourse={saveCourse} onNavigate={navigateTo} />;
      default: return <Home onNavigate={navigateTo} trendingPrompts={prompts.slice(0, 8)} onLike={handleLike} onSave={handleSave} />;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar onNavigate={navigateTo} onSearch={setSearchQuery} canGoBack={pageHistory.length > 1} onBack={goBack} />
      
      <main className="max-w-7xl mx-auto px-4 pt-16 animate-in fade-in duration-500">
        {renderPage()}
      </main>

      <BottomNav currentPage={currentPage} onNavigate={navigateTo} />
      
      {toast.visible && <Toast message={toast.message} />}
    </div>
  );
};

export default App;
