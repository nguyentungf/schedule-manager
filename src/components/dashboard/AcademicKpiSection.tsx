import React from 'react';
import { Course } from '../../types/course';
import { calculateCpa, getAcademicClassification } from '../../engines/hustGradeEngine';
import { Award, CheckCircle2, TrendingUp, BookOpen, Layers } from 'lucide-react';

interface AcademicKpiSectionProps {
  courses: Course[];
  totalCurriculumCredits: number;
}

export const AcademicKpiSection: React.FC<AcademicKpiSectionProps> = ({
  courses,
  totalCurriculumCredits
}) => {
  const { cpa } = calculateCpa(courses);
  const classification = getAcademicClassification(cpa);
  const passedCredits = courses.filter(c => c.status === 'passed').reduce((sum, c) => sum + c.credits, 0);
  const failedCredits = courses.filter(c => c.status === 'failed').reduce((sum, c) => sum + c.credits, 0);
  const inProgressCredits = courses.filter(c => c.status === 'in_progress').reduce((sum, c) => sum + c.credits, 0);
  const totalTargetCredits = totalCurriculumCredits || 135;
  const progressPercent = Math.min(100, Math.round((passedCredits / totalTargetCredits) * 100));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span>Tiến Độ Học Tập & Chỉ Số CPA</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 font-bold border border-red-200 dark:border-red-900/40">
            Chính Quy
          </span>
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: CPA Tích Lũy */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Điểm CPA Tích Lũy
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {cpa.toFixed(2)}
              <span className="text-xs font-bold text-slate-400 ml-1">/ 4.0</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Xếp loại: {classification.rank}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Thang 4 chuẩn quy chế ĐHBK Hà Nội
          </div>
        </div>

        {/* Card 2: Tín Chỉ Tích Lũy (Selected Card with HUST Red Outline) */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-5 border-2 border-red-600 shadow-lg shadow-red-500/10 transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-red-600 dark:text-red-400">
              Tín Chỉ Hoàn Thành
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-950/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-red-600 dark:text-red-400 tracking-tight">
              {passedCredits}
              <span className="text-xs font-bold text-slate-400 ml-1">/ {totalTargetCredits} TC</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-300">
              <span>Đạt {progressPercent}% khung CTĐT</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="w-full bg-red-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-red-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Đã tích lũy</span>
            <span className="font-mono font-bold text-red-600">{passedCredits} TC</span>
          </div>
        </div>

        {/* Card 3: Học Kỳ & Điểm Rèn Luyện */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Đang Học & Rèn Luyện
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {inProgressCredits}
              <span className="text-xs font-bold text-slate-400 ml-1">TC đang học</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>85 ĐRL • Xếp loại Tốt</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Nợ môn:</span>
            <span className={`font-mono font-bold ${failedCredits > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
              {failedCredits} TC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
