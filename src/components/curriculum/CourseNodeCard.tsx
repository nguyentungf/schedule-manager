import React from 'react';
import { Course } from '../../types/course';
import { Lock, CheckCircle2, Clock, AlertOctagon, Star } from 'lucide-react';

interface CourseNodeCardProps {
  course: Course;
  isHighlightedPrereq: boolean;
  isHighlightedDependent: boolean;
  isSelected: boolean;
  onSelect: (course: Course) => void;
  onOpenDetail: (course: Course) => void;
}

export const CourseNodeCard: React.FC<CourseNodeCardProps> = ({
  course,
  isHighlightedPrereq,
  isHighlightedDependent,
  isSelected,
  onSelect,
  onOpenDetail
}) => {
  // Trạng thái hiển thị
  const getStatusBadge = () => {
    switch (course.status) {
      case 'passed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            {course.gradeLetter || 'Đã qua'}
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-300 dark:border-blue-500/30">
            <Clock className="w-3 h-3" />
            Đang học
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-300 dark:border-rose-500/30">
            <AlertOctagon className="w-3 h-3" />
            Nợ môn (F)
          </span>
        );
      case 'locked':
        return (
          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">
            <Lock className="w-3 h-3" />
            Bị khóa
          </span>
        );
      case 'unlocked':
      default:
        return (
          <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">
            Mở
          </span>
        );
    }
  };

  // Xác định viền card theo tương tác đồ thị & độ khó & học lại
  const getHighlightStyle = () => {
    // 1. Học phần học lại (isRetake): Tô màu đỏ đậm nổi bật
    if (course.isRetake) {
      if (isSelected) {
        return 'border-red-600 bg-red-900/60 ring-2 ring-red-500 shadow-lg text-white';
      }
      return 'border-red-700 bg-red-950/80 hover:bg-red-900/70 shadow-md ring-1 ring-red-600 text-white';
    }

    if (isSelected) {
      return 'border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/30 ring-2 ring-red-500/50 shadow-md';
    }
    if (isHighlightedPrereq) {
      return 'border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/30 ring-2 ring-amber-400/50 shadow-md animate-pulse';
    }
    if (isHighlightedDependent) {
      return 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-400/50 shadow-md';
    }

    // 2. Độ khó >= 4.5 sao: Tô màu đỏ nhạt
    if (course.difficulty && course.difficulty >= 4.5) {
      return 'border-red-300 dark:border-red-800/80 bg-red-50/75 dark:bg-red-950/30 hover:bg-red-100/80 dark:hover:bg-red-950/50 shadow-sm';
    }

    // 3. Độ khó >= 4.0 và < 4.5 sao: Tô màu vàng nhạt
    if (course.difficulty && course.difficulty >= 4.0 && course.difficulty < 4.5) {
      return 'border-amber-300 dark:border-amber-800/80 bg-amber-50/75 dark:bg-amber-950/30 hover:bg-amber-100/80 dark:hover:bg-amber-950/50 shadow-sm';
    }

    return 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e] hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-[#162037] shadow-sm';
  };

  return (
    <div
      onClick={() => onSelect(course)}
      className={`rounded-xl border p-3 cursor-pointer transition-all duration-150 relative flex flex-col justify-between ${getHighlightStyle()}`}
    >
      {/* Top Banner Tag if Highlighted or Retake */}
      {course.isRetake && (
        <div className="absolute -top-2.5 right-2 px-1.5 py-0.2 rounded bg-red-700 text-white text-[9px] font-black uppercase tracking-wider shadow">
          Học lại
        </div>
      )}
      {isHighlightedPrereq && (
        <div className="absolute -top-2.5 left-2 px-1.5 py-0.2 rounded bg-amber-500 text-slate-900 text-[9px] font-extrabold uppercase tracking-wider shadow">
          Tiên quyết cần có
        </div>
      )}
      {isHighlightedDependent && (
        <div className="absolute -top-2.5 right-2 px-1.5 py-0.2 rounded bg-blue-500 text-white text-[9px] font-extrabold uppercase tracking-wider shadow">
          Môn bị phụ thuộc
        </div>
      )}

      <div>
        {/* Header: Code & Status */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white tracking-wide">
            {course.code}
          </span>
          {getStatusBadge()}
        </div>

        {/* Course Name */}
        <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug mb-2" title={course.name}>
          {course.name}
        </h5>
      </div>

      {/* Meta Footer: Credits, Difficulty, Action */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{course.credits} tín</span>
          <span>•</span>
          <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400/90 font-mono text-[10px]">
            <Star className="w-2.5 h-2.5 fill-amber-500" />
            {course.difficulty.toFixed(1)}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(course);
          }}
          className="text-[10px] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium px-1.5 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
};
