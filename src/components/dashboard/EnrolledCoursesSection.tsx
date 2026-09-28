import React from 'react';
import { Course } from '../../types/course';
import { Laptop, BookOpen, Clock, MapPin, ArrowRight, ExternalLink } from 'lucide-react';

interface EnrolledCoursesSectionProps {
  courses: Course[];
  onOpenDetail: (course: Course) => void;
  onNavigateToCurriculum: () => void;
}

export const EnrolledCoursesSection: React.FC<EnrolledCoursesSectionProps> = ({
  courses,
  onOpenDetail,
  onNavigateToCurriculum
}) => {
  // Lấy các môn đang học, nếu chưa có thì lấy các môn kỳ gần nhất
  const inProgress = courses.filter(c => c.status === 'in_progress');
  const displayCourses = inProgress.length > 0 ? inProgress.slice(0, 6) : courses.slice(0, 4);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span>Học Phần Đang Học (Enrolled Courses)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 font-bold font-mono border border-red-200 dark:border-red-900/40">
            {inProgress.length} môn
          </span>
        </h4>

        <button
          onClick={onNavigateToCurriculum}
          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Clean High-Contrast Cards */}
      {displayCourses.length === 0 ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200 dark:border-slate-800 text-xs">
          Chưa có học phần nào được đánh dấu đang học trong kỳ này.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayCourses.map(course => (
            <div
              key={course.id}
              className="bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-center justify-between gap-4 hover:shadow-md hover:border-red-300 dark:hover:border-red-900/50 transition-all group"
            >
              {/* Left Info */}
              <div className="space-y-2.5 min-w-0 flex-1">
                <div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/40">
                    {course.code} • {course.credits} TC
                  </span>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2 mt-1" title={course.name}>
                    {course.name}
                  </h5>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Trọng số: {((course.weightQt ?? 0.3) * 100).toFixed(0)}% QT / {((course.weightCk ?? 0.7) * 100).toFixed(0)}% CK</span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenDetail(course)}
                  className="px-4 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5"
                >
                  <span>Chi tiết</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Right Clean Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Laptop className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400 opacity-90" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
