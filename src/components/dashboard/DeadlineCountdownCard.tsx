import React, { useState, useEffect } from 'react';
import { Deadline, CountdownInfo, UrgencyLevel } from '../../types/deadline';
import { CheckCircle2, Circle, ExternalLink, Edit2, Trash2 } from 'lucide-react';

interface DeadlineCountdownCardProps {
  deadline: Deadline;
  onToggleComplete: (id: string) => void;
  onEdit: (deadline: Deadline) => void;
  onDelete: (id: string) => void;
}

export const DeadlineCountdownCard: React.FC<DeadlineCountdownCardProps> = ({
  deadline,
  onToggleComplete,
  onEdit,
  onDelete
}) => {
  const [countdown, setCountdown] = useState<CountdownInfo>(() => calculateCountdown(deadline));

  useEffect(() => {
    // Cập nhật thời gian thực mỗi 1 giây
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  function calculateCountdown(item: Deadline): CountdownInfo {
    const now = Date.now();
    const dueTime = new Date(item.dueAt).getTime();
    const assignedTime = new Date(item.assignedAt).getTime();
    const diff = dueTime - now;

    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Tính % thời gian đã trôi qua
    const totalDuration = Math.max(1, dueTime - assignedTime);
    const elapsed = Math.max(0, now - assignedTime);
    const percentElapsed = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

    let urgency: UrgencyLevel = 'safe';
    const isOverdue = diff <= 0;

    if (isOverdue) {
      urgency = 'overdue';
    } else if (diff <= 24 * 60 * 60 * 1000) {
      urgency = 'urgent';
    } else if (diff <= 72 * 60 * 60 * 1000) {
      urgency = 'warning';
    } else {
      urgency = 'safe';
    }

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
      percentElapsed,
      urgency,
      isOverdue
    };
  }

  // Kiểu dáng và màu sắc viền theo cấp độ nguy cấp
  const getCardStyle = () => {
    if (deadline.completed) {
      return 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1322]/70 opacity-70 hover:opacity-95';
    }
    switch (countdown.urgency) {
      case 'urgent':
        return 'border-red-400 dark:border-red-500/80 bg-red-50/60 dark:bg-[#170e17] shadow-sm dark:shadow-lg shadow-red-950/20 ring-1 ring-red-400/30 dark:ring-red-500/30';
      case 'warning':
        return 'border-amber-400 dark:border-amber-500/70 bg-amber-50/60 dark:bg-[#171410] shadow-sm dark:shadow-md';
      case 'safe':
        return 'border-emerald-300 dark:border-emerald-500/40 bg-white dark:bg-[#0f172a] hover:border-emerald-500/70 shadow-sm';
      case 'overdue':
        return 'border-rose-400 dark:border-rose-700 bg-rose-50/70 dark:bg-rose-950/20';
    }
  };

  const getUrgencyBadge = () => {
    if (deadline.completed) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          Đã nộp bài
        </span>
      );
    }
    switch (countdown.urgency) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/40 animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            NGUY CẤP (&lt; 24H)
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
            SẮP HẠN (&lt; 3 NGÀY)
          </span>
        );
      case 'safe':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
            AN TOÀN
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-600/30 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-600">
            QUÁ HẠN
          </span>
        );
    }
  };

  const getTypeLabel = (type: Deadline['type']) => {
    switch (type) {
      case 'project': return { label: 'Đồ án', color: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30' };
      case 'assignment': return { label: 'Bài tập lớn', color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' };
      case 'lab': return { label: 'Thí nghiệm', color: 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30' };
      case 'exam': return { label: 'Thi kết thúc', color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30' };
    }
  };

  const typeInfo = getTypeLabel(deadline.type);

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 relative group flex flex-col justify-between ${getCardStyle()}`}
    >
      <div>
        {/* Header: Course Code & Urgency Badge */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              {deadline.courseCode}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>
          {getUrgencyBadge()}
        </div>

        {/* Title & Notes */}
        <div className="flex items-start gap-2.5 mb-3">
          <button
            onClick={() => onToggleComplete(deadline.id)}
            className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors flex-shrink-0"
            title={deadline.completed ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}
          >
            {deadline.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug line-clamp-2 ${
                deadline.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {deadline.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{deadline.courseName}</p>
            {deadline.notes && (
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 line-clamp-2 bg-slate-100 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                {deadline.notes}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Countdown Box & Progress */}
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        {!deadline.completed ? (
          <div>
            <div className="grid grid-cols-4 gap-1.5 text-center mb-2.5">
              <div className="bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-1">
                <span className="block font-mono text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {countdown.days}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Ngày</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-1">
                <span className="block font-mono text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {String(countdown.hours).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Giờ</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-1">
                <span className="block font-mono text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {String(countdown.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Phút</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-1">
                <span className="block font-mono text-sm sm:text-base font-black text-red-600 dark:text-red-400">
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Giây</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  countdown.urgency === 'urgent'
                    ? 'bg-gradient-to-r from-red-500 to-rose-600'
                    : countdown.urgency === 'warning'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${countdown.percentElapsed}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              <span>Đã trôi qua: {countdown.percentElapsed}%</span>
              <span>Hạn: {new Date(deadline.dueAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(deadline.dueAt).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        ) : (
          <div className="py-2 text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Hoàn thành xuất sắc!</span>
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between mt-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            {deadline.docUrl && (
              <a
                href={deadline.docUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                title="Mở tài liệu / Nơi nộp bài"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="text-[11px]">Tài liệu nộp</span>
              </a>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(deadline)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Chỉnh sửa deadline"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(deadline.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Xóa deadline"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
