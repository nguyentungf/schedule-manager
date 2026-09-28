import React from 'react';
import { PredictionResult, RegressionModelResult } from '../../engines/olsRegression';
import { BrainCircuit, Cpu, Sparkles } from 'lucide-react';

interface RegressionPredictorProps {
  prediction: PredictionResult;
  model: RegressionModelResult;
  credits: number;
  avgDifficulty: number;
  prevGpa: number;
  drl: number;
}

export const RegressionPredictor: React.FC<RegressionPredictorProps> = ({
  prediction,
  model,
  credits,
  avgDifficulty,
  prevGpa,
  drl
}) => {
  return (
    <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Mô Hình Hồi Quy Tuyến Tính Dự Đoán GPA Kỳ Tới (OLS Regression)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30">
                Native Matrix JS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Giải hệ phương trình đa biến bằng phép khử Gauss-Jordan ma trận 5x5 thuần TypeScript
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="hidden sm:block text-right">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block">Trạng thái mô hình:</span>
          <span className={`text-xs font-bold font-mono ${
            model.isColdStart ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {model.isColdStart ? 'Heuristic Baseline' : `OLS Fit (R² = ${model.rSquared})`}
          </span>
        </div>
      </div>

      {/* Main Forecast Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Big Predicted GPA Output */}
        <div className="md:col-span-1 bg-gradient-to-br from-red-50 to-white dark:from-red-950/30 dark:to-slate-900/90 border border-red-200 dark:border-red-500/30 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-sm dark:shadow-lg relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <Sparkles className="w-4 h-4 text-red-500 dark:text-red-400" />
          </div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
            Dự Báo GPA Kỳ Tới
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-4xl sm:text-5xl font-black text-red-600 dark:text-red-400">
              {prediction.predictedGpa.toFixed(2)}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-sm">/ 4.00</span>
          </div>

          <div className="mt-3 px-3 py-1 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs font-mono font-medium">
            Khoảng tin cậy 95%: [{prediction.confidenceLower.toFixed(2)} - {prediction.confidenceUpper.toFixed(2)}]
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Sai số chuẩn: ±{prediction.standardError.toFixed(2)}</span>
        </div>

        {/* Input Vector Variables */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Tín Chỉ Đăng Ký
            </span>
            <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">{credits}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">tín chỉ</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              Độ Khó Trung Bình
            </span>
            <span className="font-mono text-xl font-bold text-amber-600 dark:text-amber-400">{avgDifficulty.toFixed(1)}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">thang 5.0</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              GPA Kỳ Trước
            </span>
            <span className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">{prevGpa.toFixed(2)}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">thang 4.0</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
              ĐRL Dự Kiến
            </span>
            <span className="font-mono text-xl font-bold text-red-600 dark:text-red-400">{drl}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">thang 100</span>
          </div>

          {/* Model Formula Explanation Box */}
          <div className="col-span-2 sm:col-span-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span>
                <strong>Phương thức:</strong> {prediction.formulaDescription}
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              X = [1, {credits}, {avgDifficulty.toFixed(1)}, {prevGpa.toFixed(2)}, {(drl / 100).toFixed(2)}]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
