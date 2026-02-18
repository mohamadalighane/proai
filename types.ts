
export type Category = 'تصویر' | 'ویدیو' | 'متن' | 'موسیقی' | 'کد';

export interface Prompt {
  id: string;
  title: string;
  description: string;
  promptText: string;
  imageUrl: string;
  category: Category;
  likes: number;
  savesCount: number;
  author: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  image?: string;
  likes: number;
  date: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: 'مبتدی' | 'متوسط' | 'پیشرفته';
  duration: string;
}

export type Page = 'home' | 'explore' | 'education' | 'community' | 'saved' | 'admin' | 'login';
