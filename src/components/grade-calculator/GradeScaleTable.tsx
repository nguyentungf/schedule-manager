import React from 'react';
import { HUST_GRADE_SCALES } from '../../engines/hustGradeEngine';
import { BookOpen } from 'lucide-react';

export const GradeScaleTable: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Quy Chuẩn Thang Điểm Đại Học Bách Khoa Hà Nội
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Theo Quy chế Đào tạo Đại học chính quy - ĐHBK Hà Nội
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3">Thang 10 (D_hp)</th>
              <th className="p-3">Điểm Chữ</th>
              <th className="p-3">Thang 4</th>
              <th className="p-3">Xếp loại</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
            {HUST_GRADE_SCALES.map(scale => (
              <tr key={scale.letter} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-3 font-mono text-slate-700 dark:text-slate-200">
                  {scale.min10.toFixed(1)} - {scale.max10.toFixed(1)}
                </td>
                <td className="p-3 font-mono font-bold text-sm text-red-600 dark:text-red-400">
                  {scale.letter}
                </td>
                <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                  {scale.scale4.toFixed(1)}
                </td>
                <td className="p-3 text-slate-500 dark:text-slate-400">
                  {scale.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
        <p>• <strong>Điều kiện qua môn:</strong> Điểm thi cuối kỳ D_ck ≥ 3.0 và Điểm học phần D_hp ≥ 4.0.</p>
        <p>• <strong>Học cải thiện:</strong> Khi học lại để cải thiện điểm chữ D, D+, C, C+, công thức CPA tính điểm cao nhất trong các lần học.</p>
      </div>
    </div>
  );
};
