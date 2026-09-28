import React from 'react';
import { GraduationCap, Award, Calendar, BookOpen, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  studentName: string;
  studentId: string;
  majorName: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  studentName,
  studentId,
  majorName
}) => {
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#dc2626] via-[#b91c1c] to-[#991b1b] p-6 sm:p-8 text-white shadow-xl shadow-red-950/15">
      {/* Decorative Subtle Background Accents */}
      <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute right-40 -bottom-10 w-48 h-48 rounded-full bg-red-400/20 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left Text Content */}
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20">
              <Calendar className="w-3.5 h-3.5 text-red-200" />
              <span>{dateFormatted} • Tuần 3 (Kỳ 2024.1)</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
            Welcome back, {studentName || 'Bách Khoa'}!
          </h2>

          <p className="text-xs sm:text-sm text-red-100 font-medium leading-relaxed">
            Luôn chủ động cập nhật thời khóa biểu, mục tiêu CPA và quan hệ học phần tiên quyết tại Cổng thông tin học tập thông minh ĐHBK Hà Nội.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md font-mono font-bold text-white border border-white/30">
              MSSV: {studentId || '20210000'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md font-semibold text-white border border-white/30 truncate max-w-xs">
              {majorName || 'Kỹ thuật Điện tử - Viễn thông'}
            </span>
          </div>
        </div>

        {/* Right Visual Artwork / Badge Container */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
            {/* Soft Glowing Backing */}
            <div className="absolute inset-0 rounded-full bg-white/10 blur-lg" />
            
            {/* Center Graduation Artwork */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 flex flex-col items-center justify-center shadow-2xl p-4 text-center transform hover:rotate-3 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-white text-red-600 flex items-center justify-center shadow-lg shadow-red-950/20 mb-2">
                <GraduationCap className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-white">
                HUST PORTAL
              </span>
              <span className="text-[9px] text-red-200 font-mono font-medium">
                Thành công & Xuất sắc
              </span>
            </div>

            {/* Floating Accents */}
            <div className="absolute -top-2 right-2 w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg transform -rotate-12">
              <Award className="w-4 h-4" />
            </div>
            <div className="absolute -bottom-1 left-2 w-7 h-7 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center shadow-lg transform rotate-12">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
