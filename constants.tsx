
import { Prompt, Course, Category } from './types';

export const CATEGORIES: Category[] = ['تصویر', 'ویدیو', 'متن', 'موسیقی', 'کد'];

// Helper to generate 50+ prompts
const generatePrompts = (): Prompt[] => {
  const categories: Category[] = ['تصویر', 'ویدیو', 'متن', 'موسیقی', 'کد'];
  const authors = ['آرتین', 'سارا', 'هوشمند', 'سایه', 'سپهر', 'مهسا'];
  
  return Array.from({ length: 55 }).map((_, i) => ({
    id: `p-${i}`,
    title: `پرامپت حرفه‌ای شماره ${i + 1}`,
    description: `یک پرامپت استثنایی برای تولید ${categories[i % 5]} با کیفیت خیره کننده.`,
    promptText: `Create a highly detailed ${categories[i % 5]} of a futuristic cyberpunk city with neon lights, volumetric fog, and ultra-realistic textures --ar 16:9 --v 6.0`,
    imageUrl: `https://picsum.photos/seed/${i + 100}/600/${800 + (i % 3) * 100}`,
    category: categories[i % 5],
    likes: Math.floor(Math.random() * 500),
    savesCount: Math.floor(Math.random() * 200),
    author: authors[i % authors.length],
    isLiked: false,
    isSaved: false
  }));
};

export const INITIAL_PROMPTS = generatePrompts();

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'کسب درآمد دلاری از میدجورنی',
    description: 'چگونه تصاویر خود را در بازارگاه‌های جهانی به فروش برسانیم؟',
    thumbnail: 'https://picsum.photos/seed/course1/400/250',
    difficulty: 'متوسط',
    duration: '۱۲ ساعت'
  },
  {
    id: 'c2',
    title: 'فریلنسینگ با ChatGPT',
    description: 'تبدیل شدن به یک متخصص تولید محتوا با هوش مصنوعی.',
    thumbnail: 'https://picsum.photos/seed/course2/400/250',
    difficulty: 'مبتدی',
    duration: '۸ ساعت'
  },
  {
    id: 'c3',
    title: 'ساخت ویدیوهای وایرال با Runway Gen-2',
    description: 'آموزش کامل ساخت تیزرهای تبلیغاتی سینمایی.',
    thumbnail: 'https://picsum.photos/seed/course3/400/250',
    difficulty: 'پیشرفته',
    duration: '۱۵ ساعت'
  }
];
