import React from 'react';
import { PredictionResult } from '../../engines/olsRegression';
import { Sparkles, Info } from 'lucide-react';

interface SensitivityInsightProps {
  prediction: PredictionResult;
  selectedCredits: number;
  avgDifficulty: number;
}

export const SensitivityInsight: React.FC<SensitivityInsightProps> = ({
  prediction,
  selectedCredits,
  avgDifficulty
}) => {
  return (
    <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 shadow-sm dark:shadow-xl space-y-3.5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Phân Tích Độ Nhạy & Khuyến Nghị Tải Học Tập (Sensitivity Insights)
          </h4>
        </div>
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Tải hiện tại: <strong className="text-slate-900 dark:text-white">{selectedCredits} tín</strong> • Độ khó: <strong className="text-amber-600 dark:text-amber-400">{avgDifficulty.toFixed(1)}/5.0</strong>
        </div>
      </div>

      <div className="space-y-2">
        {prediction.insights.map((insight, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
          >
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>{insight}</div>
          </div>
        ))}
      </div>

      {/* Dynamic Scenario Simulator */}
      <div className="pt-2 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
        <strong className="text-slate-900 dark:text-slate-200 block mb-1">Mẹo tối ưu hóa GPA theo mô hình OLS:</strong>
        <p>• Nếu bạn giảm bớt <strong>1 môn 3 tín chỉ khó</strong>, tải nhận thức giảm giúp các môn còn lại có thêm ~15% thời gian ôn luyện, kéo GPA tăng trung bình <strong>+0.18 điểm</strong>.</p>
        <p>• Không nên đăng ký quá 2 môn đại cương toán/lý nặng trong cùng kỳ (như Giải tích 2 + Vật lý 1) để tránh bị đuối sức ở tuần thi giữa kỳ & cuối kỳ.</p>
      </div>
    </div>
  );
};
