import React, { useState, useMemo } from 'react';
import { solveAllTargets } from '../../engines/examSolver';
import { calculateCourseFinalGrade } from '../../engines/hustGradeEngine';
import { Calculator, Sliders, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ExamPredictor: React.FC = () => {
  const [gradeQt, setGradeQt] = useState<number>(7.5);
  const [weightQt, setWeightQt] = useState<number>(0.3);
  const [simulatedExamScore, setSimulatedExamScore] = useState<number>(7.0);

  const weightCk = useMemo(() => Math.round((1 - weightQt) * 10) / 10, [weightQt]);

  // Giải bảng điểm tối thiểu cho các mốc
  const targetResults = useMemo(() => {
    return solveAllTargets(gradeQt, weightQt, weightCk);
  }, [gradeQt, weightQt, weightCk]);

  // Mô phỏng điểm theo slider
  const simulationResult = useMemo(() => {
    return calculateCourseFinalGrade(gradeQt, simulatedExamScore, weightQt, weightCk);
  }, [gradeQt, simulatedExamScore, weightQt, weightCk]);

  return (
    <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-600/15 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Máy Tính Điểm Thi Cuối Kỳ Tối Thiểu (HUST D_ck_min)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tính điểm thi cuối kỳ tối thiểu cần đạt để chạm các mốc A, B+, B, C, D kèm kiểm soát điểm liệt 3.0
          </p>
        </div>
      </div>

      {/* Inputs Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Điểm quá trình (D_qt)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={gradeQt}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setGradeQt(isNaN(val) ? 0 : Math.max(0, Math.min(10, val)));
              }}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold text-base focus:outline-none focus:border-red-500"
            />
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">/ 10</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Trọng số Quá trình / Cuối kỳ
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setWeightQt(0.3)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                weightQt === 0.3
                  ? 'bg-red-50 dark:bg-red-600/20 border-red-300 dark:border-red-500 text-red-600 dark:text-red-300'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              30% - 70%
            </button>
            <button
              type="button"
              onClick={() => setWeightQt(0.4)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                weightQt === 0.4
                  ? 'bg-red-50 dark:bg-red-600/20 border-red-300 dark:border-red-500 text-red-600 dark:text-red-300'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              40% - 60%
            </button>
            <button
              type="button"
              onClick={() => setWeightQt(0.5)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                weightQt === 0.5
                  ? 'bg-red-50 dark:bg-red-600/20 border-red-300 dark:border-red-500 text-red-600 dark:text-red-300'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              50% - 50%
            </button>
          </div>
        </div>

        <div className="sm:col-span-2 md:col-span-1 flex flex-col justify-center">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Công thức tính:</span>
              <span className="font-mono text-slate-900 dark:text-white">D_hp = {weightQt} * D_qt + {weightCk} * D_ck</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Điểm liệt:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">D_ck &lt; 3.0 -&gt; F (Trượt môn)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Table */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
          Bảng Điểm Thi Cuối Kỳ Cần Đạt Theo Từng Mốc Mục Tiêu
        </h4>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Mốc Chữ</th>
                <th className="p-3">Thang 4</th>
                <th className="p-3">Điểm Thi CK Tối Thiểu (D_ck_min)</th>
                <th className="p-3">Độ Khả Thi</th>
                <th className="p-3">Lưu ý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {targetResults.map(res => (
                <tr key={res.letter} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {res.letter}
                  </td>
                  <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                    {res.scale4.toFixed(1)}
                  </td>
                  <td className="p-3 font-mono text-base font-bold">
                    {res.isPossible ? (
                      <span className={res.minFinalScore >= 8.5 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}>
                        {res.minFinalScore.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-500 font-semibold">Bất khả thi (&gt; 10.0)</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        res.feasibility === 'very_easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : res.feasibility === 'moderate'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : res.feasibility === 'hard'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : res.feasibility === 'very_hard'
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {res.feasibilityLabel}
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-slate-400">
                    {res.isFailProne && (
                      <span className="text-amber-400 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Chạm mốc 3.0 điểm liệt
                      </span>
                    )}
                    {!res.isPossible && 'Điểm quá trình quá thấp để đạt mốc này'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Slider Simulation */}
      <div className="bg-slate-50 dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-red-600 dark:text-red-400" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white tracking-tight">
              Thanh Kéo Mô Phỏng Điểm Thi Thực Tế (D_ck)
            </h4>
          </div>
          <div className="font-mono text-xs text-slate-600 dark:text-slate-300">
            Giả định đi thi được: <strong className="text-base text-red-600 dark:text-red-400 font-bold">{simulatedExamScore.toFixed(1)}</strong> / 10
          </div>
        </div>

        {/* Range Slider with Exact 1:1 Percentage Placement */}
        <div className="relative pt-6 pb-2">
          {/* Floating score indicator aligned with slider thumb */}
          <div 
            className="absolute top-0 -translate-x-1/2 px-2 py-0.5 rounded-md bg-red-600 text-white font-mono text-xs font-bold shadow-md pointer-events-none transition-all"
            style={{ left: `${(simulatedExamScore / 10) * 100}%` }}
          >
            {simulatedExamScore.toFixed(1)}
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={simulatedExamScore}
            onChange={e => setSimulatedExamScore(parseFloat(e.target.value))}
            className="w-full accent-red-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
          />
          {/* Exact positioned tick marks matching slider ratio 1:1 */}
          <div className="relative w-full h-4 mt-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <span className="absolute left-0">0.0</span>
            <span className="absolute left-[30%] -translate-x-1/2 text-rose-500 dark:text-rose-400 font-bold">3.0 (Liệt)</span>
            <span className="absolute left-[50%] -translate-x-1/2">5.0</span>
            <span className="absolute left-[85%] -translate-x-1/2 text-amber-500 dark:text-amber-400 font-semibold">8.5 (Mốc A)</span>
            <span className="absolute right-0">10.0</span>
          </div>
        </div>

        {/* Simulation Output Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Điểm Tổng Kết (Thang 10)
            </span>
            <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {simulationResult.total10.toFixed(1)}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Điểm Chữ (Letter)
            </span>
            <span className={`font-mono text-xl sm:text-2xl font-black ${
              simulationResult.letter === 'F' ? 'text-rose-600 dark:text-rose-500' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {simulationResult.letter}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Điểm Thang 4
            </span>
            <span className="font-mono text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
              {simulationResult.scale4.toFixed(1)}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center flex flex-col justify-center items-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Kết Quả
            </span>
            {simulationResult.passed ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Qua Môn
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Trượt Môn (F)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
