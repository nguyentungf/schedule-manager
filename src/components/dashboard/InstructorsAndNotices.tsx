import React from 'react';
import { Deadline } from '../../types/deadline';
import { ScheduleItem } from '../../types/schedule';
import { Bell, Clock, AlertTriangle, CheckCircle2, Plus, ArrowRight, UserCheck, Calendar } from 'lucide-react';

interface InstructorsAndNoticesProps {
  deadlines: Deadline[];
  schedule: ScheduleItem[];
  onToggleComplete: (id: string) => void;
  onOpenAddDeadline: () => void;
  onEditDeadline: (deadline: Deadline) => void;
}

export const InstructorsAndNotices: React.FC<InstructorsAndNoticesProps> = ({
  deadlines,
  schedule,
  onToggleComplete,
  onOpenAddDeadline,
  onEditDeadline
}) => {
  // Sắp xếp deadlines theo hạn chót gần nhất
  const sortedDeadlines = [...deadlines]
    .filter(d => !d.completed)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">

      {/* 2. Daily Notice & Deadlines */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-red-600" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Thông Báo & Hạn Chót (Daily Notice)
            </h4>
          </div>

          <button
            type="button"
            onClick={onOpenAddDeadline}
            className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm</span>
          </button>
        </div>

        {sortedDeadlines.length === 0 ? (
          <div className="py-6 text-center text-slate-500 dark:text-slate-400 text-xs italic">
            Không có hạn chót nào sắp tới. Bạn đã hoàn thành tất cả nhiệm vụ! 🎉
          </div>
        ) : (
          <div className="space-y-3">
            {sortedDeadlines.map(deadline => {
              const diffMs = new Date(deadline.dueAt).getTime() - Date.now();
              const diffHours = Math.round(diffMs / (1000 * 60 * 60));
              const isUrgent = diffHours > 0 && diffHours <= 24;

              return (
                <div
                  key={deadline.id}
                  onClick={() => onEditDeadline(deadline)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isUrgent
                      ? 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 hover:border-rose-300'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] font-bold text-red-600 dark:text-red-400">
                        {deadline.courseCode || 'HUST'}
                      </span>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-snug line-clamp-1 mt-0.5">
                        {deadline.title}
                      </h5>
                    </div>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onToggleComplete(deadline.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors flex-shrink-0"
                      title="Đánh dấu hoàn thành"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>

                  {deadline.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {deadline.notes}
                    </p>
                  )}

                  <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(deadline.dueAt).toLocaleDateString('vi-VN')}
                    </span>

                    <span className="font-bold text-red-600 dark:text-red-400 hover:underline">
                      Xem chi tiết →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
