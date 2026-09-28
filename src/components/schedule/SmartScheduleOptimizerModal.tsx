import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Course } from '../../types/course';
import { StudentInfo } from '../../types/state';
import { ScheduleItem, ScheduleStrategyType, GeneratedSchedulePlan } from '../../types/schedule';
import {
  recommendCoursesForNextTerm,
  RecommendationStrategy,
  RecommendedCourseItem
} from '../../engines/courseRecommenderEngine';
import {
  generateMultiStrategySchedulePlans,
  SAMPLE_HUST_CLASS_OFFERINGS
} from '../../engines/scheduleSolverEngine';
import { exportScheduleToExcel } from '../../engines/excelEngine';
import {
  Sparkles,
  SlidersHorizontal,
  Calendar,
  Sun,
  Sunset,
  Coffee,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Check,
  ChevronRight,
  Info,
  Clock,
  Layers,
  BookOpen
} from 'lucide-react';

interface SmartScheduleOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  allCourses: Course[];
  studentInfo: StudentInfo;
  onApplySchedule: (items: ScheduleItem[]) => void;
}

export const SmartScheduleOptimizerModal: React.FC<SmartScheduleOptimizerModalProps> = ({
  isOpen,
  onClose,
  allCourses,
  studentInfo,
  onApplySchedule
}) => {
  const [activeStep, setActiveStep] = useState<'recommend' | 'solve' | 'preview'>('recommend');

  // --- State gợi ý học máy ---
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [targetCredits, setTargetCredits] = useState(18);
  const [strategy, setStrategy] = useState<RecommendationStrategy>('balanced');
  const [selectedCourseCodes, setSelectedCourseCodes] = useState<Set<string>>(new Set());

  // --- State xếp thời khóa biểu ---
  const [scheduleStrategy, setScheduleStrategy] = useState<ScheduleStrategyType>('balanced');
  const [selectedPlan, setSelectedPlan] = useState<GeneratedSchedulePlan | null>(null);

  // 1. Chạy thuật toán Học Máy gợi ý học phần
  const aiRecommendation = useMemo(() => {
    return recommendCoursesForNextTerm(allCourses, studentInfo, {
      targetCredits,
      strategy,
      targetTerm: Math.min(8, (studentInfo.currentTerm || 2) + 1)
    });
  }, [allCourses, studentInfo, targetCredits, strategy]);

  // Đồng bộ các môn được chọn ban đầu từ gợi ý AI
  React.useEffect(() => {
    if (selectedCourseCodes.size === 0 && aiRecommendation.recommended.length > 0) {
      setSelectedCourseCodes(new Set(aiRecommendation.recommended.map(r => r.course.code)));
    }
  }, [aiRecommendation.recommended]);

  const toggleSelectCourse = (code: string) => {
    const next = new Set(selectedCourseCodes);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setSelectedCourseCodes(next);
  };

  // 2. Chạy thuật toán Backtracking xếp lớp cho các môn đã chọn
  const solverResults = useMemo(() => {
    const codes = Array.from(selectedCourseCodes);
    return generateMultiStrategySchedulePlans(codes, SAMPLE_HUST_CLASS_OFFERINGS);
  }, [selectedCourseCodes]);

  // Cập nhật selected plan khi có kết quả mới
  React.useEffect(() => {
    if (solverResults.topPick && !selectedPlan) {
      setSelectedPlan(solverResults.topPick);
    }
  }, [solverResults.topPick]);

  // Lọc phương án theo chiến thuật đang chọn
  const currentStrategyPlans = solverResults.plansByStrategy[scheduleStrategy] || [];

  const handleApply = (plan: GeneratedSchedulePlan) => {
    onApplySchedule(plan.items);
    alert(`✅ Đã áp dụng thành công ${plan.items.length} lớp học của "${plan.name}" vào Thời Khóa Biểu chính!`);
    onClose();
  };

  const handleExportExcel = async (plan: GeneratedSchedulePlan) => {
    await exportScheduleToExcel(plan.items, `TKB_Ky_Toi_${plan.strategy}.xlsx`);
  };

  const selectedTotalCredits = useMemo(() => {
    let sum = 0;
    allCourses.forEach(c => {
      if (selectedCourseCodes.has(c.code)) sum += c.credits;
    });
    return sum;
  }, [allCourses, selectedCourseCodes]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Soạn Thời Khóa Biểu Tự Động & Gợi Ý Học Máy"
      subtitle="Thuật toán Backtracking không trùng tiết • Chiến thuật vừa sức có giờ nghỉ ngơi • Xuất Excel"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Step Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep('recommend')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeStep === 'recommend'
                  ? 'bg-red-600 text-white shadow-md shadow-zinc-900/20 dark:shadow-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Chọn Môn & Gợi Ý AI</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {selectedCourseCodes.size} môn ({selectedTotalCredits} TC)
              </span>
            </button>

            <button
              onClick={() => setActiveStep('solve')}
              disabled={selectedCourseCodes.size === 0}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                activeStep === 'solve'
                  ? 'bg-red-600 text-white shadow-md shadow-zinc-900/20 dark:shadow-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>2. Chiến Thuật Xếp Lớp</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {solverResults.allPlans.length} phương án
              </span>
            </button>

            {selectedPlan && (
              <button
                onClick={() => setActiveStep('preview')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeStep === 'preview'
                    ? 'bg-red-600 text-white shadow-md shadow-zinc-900/20 dark:shadow-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>3. Xem Lịch Tuần</span>
              </button>
            )}
          </div>
        </div>

        {/* =========================================================
            BƯỚC 1: GỢI Ý HỌC MÁY & CHỌN MÔN KỲ TỚI
           ========================================================= */}
        {activeStep === 'recommend' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* AI Summary Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-600/10 via-rose-600/5 to-transparent border border-red-200 dark:border-red-900/40 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Mô hình đề xuất học phần kỳ tới</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[10px] font-mono">
                      Kỳ {(studentInfo.currentTerm || 2) + 1}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {aiRecommendation.summaryMessage}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      aiRecommendation.averageDifficulty >= 3.7 && aiRecommendation.averageDifficulty <= 4.3
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : aiRecommendation.averageDifficulty > 4.3
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    }`}>
                      <span>★ Độ khó TB: {aiRecommendation.averageDifficulty}/5.0</span>
                      {aiRecommendation.averageDifficulty >= 3.7 && aiRecommendation.averageDifficulty <= 4.3 && (
                        <span className="text-[10px] font-semibold">(Chuẩn vàng 3.7 - 4.3★)</span>
                      )}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                      ⚡ Tín chỉ: {aiRecommendation.totalCredits} TC
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                      ⏳ Tải học: ~{aiRecommendation.estimatedWorkloadHours}h/tuần
                    </span>
                  </div>
                </div>
              </div>

              {/* Toggle Custom Mode */}
              <button
                type="button"
                onClick={() => setIsCustomMode(!isCustomMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                  isCustomMode
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isCustomMode ? 'Đang Tùy Chỉnh' : 'Tùy Chỉnh Tiêu Chí'}</span>
              </button>
            </div>

            {/* Custom Mode Controls */}
            {isCustomMode && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Số tín chỉ mục tiêu kỳ tới: <span className="text-red-600 dark:text-red-400 font-mono">{targetCredits} TC</span>
                  </label>
                  <input
                    type="range"
                    min={12}
                    max={24}
                    step={1}
                    value={targetCredits}
                    onChange={e => setTargetCredits(parseInt(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>12 TC (Tối thiểu)</span>
                    <span>18 TC (Chuẩn)</span>
                    <span>24 TC (Tối đa)</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Chiến lược học tập:
                  </label>
                  <select
                    value={strategy}
                    onChange={e => setStrategy(e.target.value as RecommendationStrategy)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-red-600"
                  >
                    <option value="balanced">Cân bằng vừa sức (Nghỉ ngơi khoa học)</option>
                    <option value="fast_track">Tăng tốc tốt nghiệp (Ưu tiên mở khóa)</option>
                    <option value="high_gpa">Bảo toàn & Cải thiện CPA (Giảm tải môn khó)</option>
                    <option value="core_first">Tập trung môn cốt lõi ngành</option>
                  </select>
                </div>
              </div>
            )}

            {/* Recommended Courses Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white px-1">
                <span>Danh sách học phần đề xuất cho kỳ tới:</span>
                <span className="text-slate-500 font-normal">
                  Đã chọn {selectedCourseCodes.size} môn ({selectedTotalCredits} TC)
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800/80">
                {aiRecommendation.recommended.map((item, idx) => {
                  const isChecked = selectedCourseCodes.has(item.course.code);
                  return (
                    <div
                      key={item.course.code}
                      onClick={() => toggleSelectCourse(item.course.code)}
                      className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-red-50/50 dark:bg-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/30'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div
                          className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 pointer-events-none"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-red-600 dark:text-red-400 text-xs">
                              {item.course.code}
                            </span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {item.course.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span>{item.priorityReason}</span>
                            <span>•</span>
                            <span>Kỳ {item.course.term || 1}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                          {item.course.credits} TC
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.difficultyTag === 'extreme'
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300'
                              : item.difficultyTag === 'hard'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                          }`}
                        >
                          {item.course.difficulty ? `${item.course.difficulty.toFixed(1)}★` : 'Vừa sức'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Proceed Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={selectedCourseCodes.size === 0}
                onClick={() => setActiveStep('solve')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs shadow-md shadow-zinc-900/20 dark:shadow-none transition-all active:scale-95 disabled:opacity-40"
              >
                <span>Chuyển Sang Soạn Thời Khóa Biểu ({selectedCourseCodes.size} môn)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            BƯỚC 2: SOẠN TKB & CHIẾN THUẬT XẾP LỚP (BACKTRACKING)
           ========================================================= */}
        {activeStep === 'solve' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* 4 Strategy Filter Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setScheduleStrategy('balanced')}
                className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                  scheduleStrategy === 'balanced'
                    ? 'border-red-600 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 shadow-sm ring-1 ring-red-600'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Coffee className="w-4 h-4 mt-0.5 text-red-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">1. Vừa Sức & Nghỉ Ngơi</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Nghỉ trưa, chia đều</span>
                </div>
              </button>

              <button
                onClick={() => setScheduleStrategy('morning')}
                className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                  scheduleStrategy === 'morning'
                    ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 shadow-sm ring-1 ring-amber-600'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Sun className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">2. Học Buổi Sáng</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Tiết 1-6, trống chiều</span>
                </div>
              </button>

              <button
                onClick={() => setScheduleStrategy('afternoon')}
                className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                  scheduleStrategy === 'afternoon'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 shadow-sm ring-1 ring-purple-600'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Sunset className="w-4 h-4 mt-0.5 text-purple-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">3. Học Buổi Chiều</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Tiết 7-12, trống sáng</span>
                </div>
              </button>

              <button
                onClick={() => setScheduleStrategy('compact')}
                className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                  scheduleStrategy === 'compact'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Zap className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">4. Gom Ngày Nghỉ</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Tối đa ngày rảnh</span>
                </div>
              </button>
            </div>

            {/* Generated Plans List */}
            <div className="space-y-3">
              {currentStrategyPlans.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  Không tìm thấy tổ hợp lớp nào phù hợp cho chiến thuật này mà không trùng tiết. Hãy thử chọn chiến thuật khác!
                </div>
              ) : (
                currentStrategyPlans.map((plan, pIdx) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  return (
                    <div
                      key={plan.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-red-600 bg-red-50/40 dark:bg-red-950/20 shadow-md ring-1 ring-red-600'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      {/* Plan Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {plan.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Điểm Vừa Sức: {plan.restScore}/100
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {plan.description}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPlan(plan);
                              setActiveStep('preview');
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Xem Lịch Tuần</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleExportExcel(plan)}
                            className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
                            title="Xuất file Excel gồm mã lớp, tên môn, tiết học, tuần học"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Xuất Excel</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApply(plan)}
                            className="px-4 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold shadow-md shadow-zinc-900/20 dark:shadow-none transition-all flex items-center gap-1 active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Chọn TKB Này</span>
                          </button>
                        </div>
                      </div>

                      {/* Classes Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-3">
                        {plan.items.map(item => (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-red-600 dark:text-red-400">
                                {item.courseCode}
                              </span>
                              <span className="font-mono text-slate-400 text-[11px]">
                                Lớp: {item.classCode}
                              </span>
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {item.courseName}
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 pt-0.5">
                              <span className="font-semibold text-amber-700 dark:text-amber-400">
                                Thứ {item.dayOfWeek} (Tiết {item.startPeriod}-{item.endPeriod})
                              </span>
                              <span className="font-mono text-slate-500">
                                {item.room}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            BƯỚC 3: XEM TRỰC QUAN LỊCH TUẦN & XÁC NHẬN
           ========================================================= */}
        {activeStep === 'preview' && selectedPlan && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {selectedPlan.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedPlan.items.length} lớp học • {selectedPlan.studyDaysCount} ngày đến trường • Điểm vừa sức: {selectedPlan.restScore}/100
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExportExcel(selectedPlan)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Xuất File Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApply(selectedPlan)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold shadow-md shadow-zinc-900/20 dark:shadow-none transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Xác Nhận Chọn TKB Này</span>
                </button>
              </div>
            </div>

            {/* Weekly Schedule Mini Grid */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="min-w-[650px] grid grid-cols-7 gap-2 text-center text-xs">
                {[2, 3, 4, 5, 6, 7, 8].map(d => {
                  const dayItems = selectedPlan.items.filter(item => item.dayOfWeek === d);
                  return (
                    <div key={d} className="space-y-2">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white text-xs">
                        {d === 8 ? 'Chủ Nhật' : `Thứ ${d}`}
                      </div>

                      <div className="space-y-1.5 min-h-[220px]">
                        {dayItems.length === 0 ? (
                          <div className="p-3 text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl h-full flex items-center justify-center">
                            Trống
                          </div>
                        ) : (
                          dayItems.map(item => (
                            <div
                              key={item.id}
                              className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-left text-[11px] space-y-0.5 shadow-xs"
                            >
                              <span className="font-mono font-bold text-red-600 dark:text-red-400 block truncate">
                                {item.courseCode}
                              </span>
                              <span className="font-semibold text-slate-900 dark:text-white block truncate">
                                {item.courseName}
                              </span>
                              <span className="text-amber-700 dark:text-amber-400 font-medium block">
                                Tiết {item.startPeriod}-{item.endPeriod}
                              </span>
                              <span className="text-slate-400 font-mono text-[10px] block truncate">
                                {item.room} • {item.classCode}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
