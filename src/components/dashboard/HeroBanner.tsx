import React from 'react';
import { GraduationCap, Award, Calendar, BookOpen, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  studentName: string;
  studentId: string;
  majorName: string;
  onHide?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  studentName,
  studentId,
  majorName,
  onHide
}) => {
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('vi-VN', {
    weekday: 'long',
    month: 'numeric',
    day: 'numeric'
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#dc2626] via-[#b91c1c] to-[#991b1b] p-5 sm:p-6 text-white shadow-lg shadow-red-950/15">
      {/* Decorative Subtle Background Accents */}
      <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute right-40 -bottom-10 w-48 h-48 rounded-full bg-red-400/20 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Content */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/20 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20">
              <Calendar className="w-3 h-3 text-red-200" />
              <span>{dateFormatted}</span>
            </span>
            {onHide && (
              <button
                type="button"
                onClick={onHide}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-medium text-white/90 border border-white/15 transition-colors"
                title="Ẩn thẻ lời chào khỏi Dashboard"
              >
                <span>Ẩn lời chào</span>
              </button>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {studentName ? `Xin chào, ${studentName}` : 'Xin chào Sinh Viên Bách Khoa!'}
          </h2>

          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
            <span className="px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-md font-mono font-bold text-white border border-white/30">
              {studentId || 'K68'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-md font-semibold text-white border border-white/30 truncate max-w-xs">
              {majorName || 'Đại học Bách Khoa Hà Nội'}
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
