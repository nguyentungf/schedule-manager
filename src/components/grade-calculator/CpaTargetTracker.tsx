import React, { useState, useMemo } from 'react';
import { Course } from '../../types/course';
import { calculateCpa, analyzeCpaTarget } from '../../engines/hustGradeEngine';
import { Target, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CpaTargetTrackerProps {
  courses: Course[];
  initialTargetCpa: number;
  totalCurriculumCredits: number;
  onUpdateTargetCpa: (target: number) => void;
}

export const CpaTargetTracker: React.FC<CpaTargetTrackerProps> = ({
  courses,
  initialTargetCpa,
  totalCurriculumCredits,
  onUpdateTargetCpa
}) => {
  const [targetInput, setTargetInput] = useState<number>(initialTargetCpa);

  const { cpa, totalAccumulatedCredits } = useMemo(() => calculateCpa(courses), [courses]);

  const analysis = useMemo(() => {
    return analyzeCpaTarget(cpa, totalAccumulatedCredits, totalCurriculumCredits, targetInput);
  }, [cpa, totalAccumulatedCredits, totalCurriculumCredits, targetInput]);

  const handleSliderChange = (newTarget: number) => {
    setTargetInput(newTarget);
    onUpdateTargetCpa(newTarget);
  };

  return (
    <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Mục Tiêu Tốt Nghiệp & Dự Toán CPA (Target Tracker)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mô phỏng mức GPA tối thiểu cần đạt ở các kỳ còn lại để chạm mốc Bằng Giỏi / Xuất Sắc
            </p>
          </div>
        </div>

        {/* Target Presets */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleSliderChange(3.2)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
              targetInput === 3.2
                ? 'bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border-emerald-500'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bằng Giỏi (3.20)
          </button>
          <button
            onClick={() => handleSliderChange(3.6)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
              targetInput === 3.6
                ? 'bg-red-600/20 text-red-700 dark:text-red-400 border-red-500'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Xuất Sắc (3.60)
          </button>
        </div>
      </div>

      {/* Target Setting Slider */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Thiết lập CPA Mục tiêu:</span>
          <span className="font-mono text-base font-black text-amber-600 dark:text-amber-400">{targetInput.toFixed(2)} / 4.00</span>
        </div>
        <div className="relative pt-6 pb-2">
          {/* Floating indicator */}
          <div 
            className="absolute top-0 -translate-x-1/2 px-2 py-0.5 rounded-md bg-amber-500 text-black font-mono text-xs font-black shadow-md pointer-events-none transition-all"
            style={{ left: `${Math.max(4, Math.min(96, ((targetInput - 2.5) / 1.5) * 100))}%` }}
          >
            {targetInput.toFixed(2)}
          </div>
          <input
            type="range"
            min="2.5"
            max="4.0"
            step="0.05"
            value={targetInput}
            onChange={e => handleSliderChange(parseFloat(e.target.value))}
            className="w-full accent-amber-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
          />
          {/* Exact ratio ticks */}
          <div className="relative w-full h-4 mt-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <span className="absolute left-0">2.50 (Khá)</span>
            <span className="absolute left-[46.67%] -translate-x-1/2 text-emerald-600 dark:text-emerald-400 font-bold">3.20 (Giỏi)</span>
            <span className="absolute left-[73.33%] -translate-x-1/2 text-red-600 dark:text-red-400 font-bold">3.60 (Xuất sắc)</span>
            <span className="absolute right-0">4.00 (Tuyệt đối)</span>
          </div>
        </div>
      </div>

      {/* Analysis Output Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 dark:bg-slate-900/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
            CPA Hiện Tại
          </span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{cpa.toFixed(2)}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ 4.00</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Đã học: {totalAccumulatedCredits} tín chỉ</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
            Tín Chỉ Còn Lại
          </span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{analysis.remainingCredits}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">tín</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Tổng CTĐT: {totalCurriculumCredits} tín</p>
        </div>

        <div className={`p-3.5 rounded-xl border ${
          analysis.isAchievable
            ? analysis.requiredRemainingGpa > 3.6
              ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/40 text-amber-800 dark:text-amber-300'
              : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
            : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300'
        }`}>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
            GPA Trung Bình Cần Đạt
          </span>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl font-black">
              {analysis.isAchievable ? analysis.requiredRemainingGpa.toFixed(2) : '> 4.00'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ kỳ</span>
          </div>
          <p className="text-[11px] mt-1 font-semibold">
            {analysis.isAchievable ? 'Có thể đạt được' : 'Bất khả thi về toán học'}
          </p>
        </div>
      </div>

      {/* Strategic Advice Message */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
        analysis.isAchievable
          ? 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300'
      }`}>
        {analysis.isAchievable ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <strong className="font-bold text-slate-900 dark:text-white block mb-0.5">Nhận định chiến lược lộ trình:</strong>
          {analysis.message}
        </div>
      </div>
    </div>
  );
};
