import React from 'react';
import { Award, BookOpen, Clock, Target, AlertTriangle } from 'lucide-react';
import { Course } from '../../types/course';
import { Deadline } from '../../types/deadline';
import { SemesterHistory } from '../../types/grade';
import { calculateCpa } from '../../engines/hustGradeEngine';

interface KpiCardsProps {
  courses: Course[];
  deadlines: Deadline[];
  semesterHistory: SemesterHistory[];
  targetCpa: number;
  totalCurriculumCredits: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  courses,
  deadlines,
  semesterHistory,
  targetCpa,
  totalCurriculumCredits
}) => {
  const { cpa, totalAccumulatedCredits } = calculateCpa(courses);

  // Xếp loại học lực theo quy chế Bách Khoa
  const getAcademicRank = (cpaVal: number) => {
    if (cpaVal >= 3.6) return { label: 'Xuất sắc', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
    if (cpaVal >= 3.2) return { label: 'Giỏi', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (cpaVal >= 2.5) return { label: 'Khá', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    if (cpaVal >= 2.0) return { label: 'Trung bình', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Kém (Cảnh báo)', color: 'text-red-500 bg-red-900/20 border-red-700/50' };
  };

  const rank = getAcademicRank(cpa);

  // Tính số deadline khẩn cấp (< 24h)
  const now = new Date().getTime();
  const urgentCount = deadlines.filter(d => {
    if (d.completed) return false;
    const diff = new Date(d.dueAt).getTime() - now;
    return diff > 0 && diff <= 24 * 60 * 60 * 1000;
  }).length;

  const warningCount = deadlines.filter(d => {
    if (d.completed) return false;
    const diff = new Date(d.dueAt).getTime() - now;
    return diff > 24 * 60 * 60 * 1000 && diff <= 72 * 60 * 60 * 1000;
  }).length;

  // Lấy ĐRL kỳ gần nhất
  const latestSemester = semesterHistory.length > 0 ? semesterHistory[semesterHistory.length - 1] : null;
  const drl = latestSemester ? latestSemester.drl : 85;

  const getDrlRank = (score: number) => {
    if (score >= 90) return 'Xuất sắc';
    if (score >= 80) return 'Tốt';
    if (score >= 65) return 'Khá';
    if (score >= 50) return 'Trung bình';
    return 'Yếu';
  };

  const percentCredits = Math.min(100, Math.round((totalAccumulatedCredits / totalCurriculumCredits) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* KPI 1: CPA Toàn Khóa */}
      <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-4 relative overflow-hidden shadow-sm dark:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CPA Tích Lũy</span>
          <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{cpa.toFixed(2)}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">/ 4.00</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs">
          <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${rank.color}`}>
            {rank.label}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Mục tiêu: <strong className="text-red-600 dark:text-red-400">{targetCpa.toFixed(2)}</strong>
          </span>
        </div>
      </div>

      {/* KPI 2: Tín Chỉ Tích Lũy */}
      <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-4 relative overflow-hidden shadow-sm dark:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tín Chỉ Hoàn Thành</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{totalAccumulatedCredits}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">/ {totalCurriculumCredits} tín</span>
        </div>
        <div className="mt-2.5">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentCredits}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Tiến độ CTĐT</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{percentCredits}%</span>
          </div>
        </div>
      </div>

      {/* KPI 3: Điểm Rèn Luyện */}
      <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-4 relative overflow-hidden shadow-sm dark:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Điểm Rèn Luyện</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{drl}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">/ 100</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs">
          <span className="px-2 py-0.5 rounded-md font-bold text-[11px] border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10">
            {getDrlRank(drl)}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Kỳ gần nhất: <strong className="text-slate-700 dark:text-slate-300">{latestSemester?.termId || 'Hiện tại'}</strong>
          </span>
        </div>
      </div>

      {/* KPI 4: Deadlines Cần Xử Lý */}
      <div className={`bg-white dark:bg-[#131b2e] border rounded-2xl p-4 relative overflow-hidden shadow-sm dark:shadow-lg transition-all ${
        urgentCount > 0 ? 'border-red-400 dark:border-red-500/60 shadow-red-950/10 dark:shadow-red-950/30' : 'border-slate-200 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Deadline Nguy Cấp</span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            urgentCount > 0
              ? 'bg-red-50 dark:bg-red-500/20 border border-red-300 dark:border-red-500 text-red-600 dark:text-red-400 animate-pulse'
              : 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          }`}>
            {urgentCount > 0 ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-black font-mono tracking-tight ${urgentCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {urgentCount}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">bài cần nộp trong 24h</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Sắp đến hạn (dưới 3 ngày):</span>
          <strong className="text-amber-600 dark:text-amber-400 font-mono text-sm">+{warningCount}</strong>
        </div>
      </div>
    </div>
  );
};
