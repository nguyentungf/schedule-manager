import React, { useState, useMemo } from 'react';
import { Course } from '../../types/course';
import { SemesterHistory } from '../../types/grade';
import { recommendNextSemesterCourses, evaluateStudyPlan } from '../../engines/studyPlanner';
import { trainOlsModel, predictNextSemesterGpa } from '../../engines/olsRegression';
import { buildDependencyGraph, isCourseEligible } from '../../engines/dagEngine';
import { calculateCpa } from '../../engines/hustGradeEngine';
import { RegressionPredictor } from './RegressionPredictor';
import { SensitivityInsight } from './SensitivityInsight';
import { KNOWN_HUST_COURSE_CATALOG } from '../../engines/courseCatalogParser';
import { CheckSquare, Square, RefreshCw, AlertTriangle, Star, Target, Trash2, CheckCircle2, Clock, Search } from 'lucide-react';

interface StudyPlannerViewProps {
  courses: Course[];
  semesterHistory: SemesterHistory[];
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  courses,
  semesterHistory
}) => {
  // Lấy danh sách các môn đã qua
  const passedCodes = useMemo(() => {
    return new Set(
      courses
        .filter(c => c.status === 'passed' && (c.gradeScale4 ?? 0) > 0)
        .map(c => c.code)
    );
  }, [courses]);

  // Xây dựng DAG đồ thị phụ thuộc
  const graph = useMemo(() => buildDependencyGraph(courses), [courses]);

  // Lấy TẤT CẢ các môn chưa đạt (không ở trạng thái 'passed')
  const candidateCourses = useMemo(() => {
    return courses.filter(c => c.status !== 'passed');
  }, [courses]);

  // Danh sách các môn hiện đang ở trạng thái 'in_progress'
  const inProgressCourses = useMemo(() => {
    return candidateCourses.filter(c => c.status === 'in_progress');
  }, [candidateCourses]);

  // Gợi ý ban đầu theo Heuristic Knapsack
  const initialRecommended = useMemo(() => {
    return recommendNextSemesterCourses(courses, [14, 20]);
  }, [courses]);

  // State các môn đang được tick chọn (ưu tiên môn đang học nếu có, hoặc gợi ý knapsack)
  const [selectedCourseCodes, setSelectedCourseCodes] = useState<Set<string>>(() => {
    if (inProgressCourses.length > 0) {
      return new Set(inProgressCourses.map(c => c.code));
    }
    return new Set(initialRecommended.map(c => c.code));
  });

  const [drlScore, setDrlScore] = useState<number>(85);
  const [filterSearch, setFilterSearch] = useState<string>('');

  // Danh sách các course object đang được chọn
  const selectedCourses = useMemo(() => {
    return courses.filter(c => selectedCourseCodes.has(c.code));
  }, [courses, selectedCourseCodes]);

  // Đánh giá kế hoạch (tổng tín, độ khó TB, cảnh báo tải)
  const planSummary = useMemo(() => {
    return evaluateStudyPlan(selectedCourses);
  }, [selectedCourses]);

  // Huấn luyện mô hình OLS
  const olsModel = useMemo(() => {
    return trainOlsModel(semesterHistory);
  }, [semesterHistory]);

  // GPA kỳ trước và CPA hiện tại
  const prevGpa = semesterHistory.length > 0 ? semesterHistory[semesterHistory.length - 1].gpa : 3.2;
  const { cpa } = useMemo(() => calculateCpa(courses), [courses]);

  // Dự báo GPA cho cấu hình đang chọn
  const prediction = useMemo(() => {
    return predictNextSemesterGpa(
      olsModel,
      planSummary.totalCredits,
      planSummary.avgDifficulty,
      prevGpa,
      drlScore,
      cpa
    );
  }, [olsModel, planSummary, prevGpa, drlScore, cpa]);

  const toggleCourse = (code: string) => {
    const updated = new Set(selectedCourseCodes);
    if (updated.has(code)) {
      updated.delete(code);
    } else {
      updated.add(code);
    }
    setSelectedCourseCodes(updated);
  };

  const handleResetToRecommendation = () => {
    setSelectedCourseCodes(new Set(initialRecommended.map(c => c.code)));
  };

  const handleSelectAll = () => {
    setSelectedCourseCodes(new Set(candidateCourses.map(c => c.code)));
  };

  const handleSelectAllInProgress = () => {
    setSelectedCourseCodes(new Set(inProgressCourses.map(c => c.code)));
  };

  const handleClearData = () => {
    setSelectedCourseCodes(new Set());
  };

  const isAllSelected = candidateCourses.length > 0 && selectedCourseCodes.size === candidateCourses.length;

  // Lọc theo từ khóa tìm kiếm
  const displayedCandidates = useMemo(() => {
    if (!filterSearch.trim()) return candidateCourses;
    const q = filterSearch.toLowerCase();
    return candidateCourses.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
  }, [candidateCourses, filterSearch]);

  return (
    <div className="space-y-6">
      {/* Top Section: Regression Predictor */}
      <RegressionPredictor
        prediction={prediction}
        model={olsModel}
        credits={planSummary.totalCredits}
        avgDifficulty={planSummary.avgDifficulty}
        prevGpa={prevGpa}
        drl={drlScore}
      />

      {/* Main Course Picker & Simulation */}
      <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-4">
        {/* Header & Reset Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Bảng Gợi Ý Học Phần Kỳ Tới (Smart Course Recommendation)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tick chọn / bỏ chọn môn để mô phỏng sự biến thiên của tải tín chỉ và GPA dự báo theo thời gian thực ({candidateCourses.length} môn chưa đạt)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <Target className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span className="text-slate-600 dark:text-slate-400">ĐRL:</span>
              <input
                type="number"
                min="50"
                max="100"
                value={drlScore}
                onChange={e => setDrlScore(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                className="w-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-900 dark:text-white font-mono font-bold text-center focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Nút Chọn Toàn Bộ Học Phần Đang Học */}
            <button
              type="button"
              onClick={handleSelectAllInProgress}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-100 dark:hover:bg-blue-600/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-xs font-bold transition-colors"
              title="Chọn tất cả các học phần đang ở trạng thái Đang học (in-progress)"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Đang học ({inProgressCourses.length})</span>
            </button>

            {/* Nút Chọn Tất Cả */}
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
              title="Chọn toàn bộ các môn học chưa qua trong CTĐT"
            >
              Chọn tất cả ({candidateCourses.length})
            </button>

            {/* Nút Clear Data / Bỏ chọn tất cả */}
            <button
              type="button"
              onClick={handleClearData}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800/40 transition-colors"
              title="Xóa sạch lựa chọn môn học hiện tại (Clear data)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Data</span>
            </button>

            {/* Nút Gợi ý Knapsack */}
            <button
              type="button"
              onClick={handleResetToRecommendation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span>Gợi ý Knapsack</span>
            </button>
          </div>
        </div>

        {/* Search filter input */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
              placeholder="Tìm kiếm môn học theo mã hoặc tên..."
              className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 font-medium"
            />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Đã chọn: <strong className="text-red-600 dark:text-red-400 font-bold">{selectedCourseCodes.size}</strong> môn ({planSummary.totalCredits} TC)
          </span>
        </div>

        {/* Warnings Banner if Overloaded / Underloaded */}
        {planSummary.warnings.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs space-y-1">
            {planSummary.warnings.map((w, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        {/* Candidates Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={isAllSelected ? handleClearData : handleSelectAll}
                    title={isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    className="flex items-center justify-center mx-auto hover:opacity-80 transition-opacity"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-red-600 dark:text-red-500" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>
                </th>
                <th className="p-3">Mã HP</th>
                <th className="p-3 min-w-[200px]">Tên Học Phần & Tiên Quyết</th>
                <th className="p-3 text-center">Trạng Thái</th>
                <th className="p-3 text-center">Tín Chỉ</th>
                <th className="p-3 text-center">Độ Khó</th>
                <th className="p-3 text-center">Kỳ</th>
                <th className="p-3 text-center">Mở Khóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {displayedCandidates.map(course => {
                const isSelected = selectedCourseCodes.has(course.code);
                const nodeInfo = graph.get(course.code);
                const critIndex = nodeInfo ? nodeInfo.criticalityIndex : 0;

                return (
                  <tr
                    key={course.id}
                    onClick={() => toggleCourse(course.code)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-red-50 dark:bg-red-600/10 hover:bg-red-100/70 dark:hover:bg-red-600/15' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3 text-center">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-red-600 dark:text-red-500 mx-auto" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 dark:text-slate-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {course.code}
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-200">
                      <div className="font-semibold text-slate-900 dark:text-white">{course.name}</div>
                      {course.conditionString ? (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-[10px] font-mono text-amber-800 dark:text-amber-300">
                          HP ĐK: {course.conditionString}
                        </span>
                      ) : (course.prerequisites && course.prerequisites.length > 0) ? (
                        <div className="flex flex-wrap items-center gap-1 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                          <span className="font-semibold">Tiên quyết:</span>
                          {course.prerequisites.map(p => {
                            const pCourse = courses.find(c => c.code === p);
                            const pName = pCourse?.name || KNOWN_HUST_COURSE_CATALOG[p]?.name || '';
                            return (
                              <span key={p} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 font-mono text-[10px] border border-slate-200 dark:border-slate-700" title={pName}>
                                <strong>{p}</strong>{pName ? ` - ${pName}` : ''}
                              </span>
                            );
                          })}
                        </div>
                      ) : null}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      {course.status === 'in_progress' ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-[10px] font-bold">
                          Đang học
                        </span>
                      ) : course.status === 'failed' ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 text-[10px] font-bold">
                          Nợ môn (F)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[10px]">
                          Chưa học
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {course.credits} tín
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-mono text-amber-600 dark:text-amber-400">
                        <Star className="w-3 h-3 fill-amber-500" />
                        {course.difficulty.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      Kỳ {course.term || 1}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      {critIndex > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                          +{critIndex} môn
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">Không có</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Sensitivity Insights */}
      <SensitivityInsight
        prediction={prediction}
        selectedCredits={planSummary.totalCredits}
        avgDifficulty={planSummary.avgDifficulty}
      />
    </div>
  );
};
