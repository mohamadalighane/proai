
import React from 'react';
import { Course } from '../types';

interface EducationProps {
  courses: Course[];
}

const Education: React.FC<EducationProps> = ({ courses }) => {
  return (
    <div className="space-y-12 pb-10">
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-500">آکادمی پرامپت‌آی</h1>
        <p className="text-gray-400">یاد بگیرید چطور از قدرت هوش مصنوعی برای کسب درآمد واقعی استفاده کنید.</p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="glass rounded-[2rem] overflow-hidden border border-white/10 hover:border-violet-500/50 transition-all group">
            <div className="relative h-48 overflow-hidden">
              <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-violet-400 border border-violet-500/30">
                {course.difficulty}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold group-hover:text-violet-400 transition-colors">{course.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{course.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <i className="fa-regular fa-clock"></i>
                  {course.duration} آموزش
                </span>
                <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl transition-all font-bold">
                  شروع یادگیری
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="glass p-8 md:p-12 rounded-[3rem] border border-white/10 text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-violet-600/20 rounded-2xl flex items-center justify-center text-violet-500 text-3xl">
          <i className="fa-solid fa-money-bill-trend-up"></i>
        </div>
        <h2 className="text-2xl font-bold">مشاوره اختصاصی کسب درآمد</h2>
        <p className="max-w-xl mx-auto text-gray-400">اگر می‌خواهید نقشه راه اختصاصی خود را برای ورود به بازار هوش مصنوعی داشته باشید، با کارشناسان ما در تماس باشید.</p>
        <button className="bg-white text-black px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
          درخواست مشاوره
        </button>
      </section>
    </div>
  );
};

export default Education;
