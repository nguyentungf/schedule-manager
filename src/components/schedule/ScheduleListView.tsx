import React, { useState } from 'react';
import { ScheduleItem } from '../../types/schedule';
import { getPeriodsTimeString } from '../../engines/scheduleEngine';
import { Plus, Upload, Trash2, Edit2, Search, MapPin, Calendar, Clock } from 'lucide-react';

interface ScheduleListViewProps {
  schedule: ScheduleItem[];
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onEditItem: (item: ScheduleItem) => void;
  onDeleteItem: (id: string) => void;
}

export const ScheduleListView: React.FC<ScheduleListViewProps> = ({
  schedule,
  onOpenAddModal,
  onOpenImportModal,
  onEditItem,
  onDeleteItem
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchedule = schedule.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.courseName.toLowerCase().includes(q) ||
      item.courseCode.toLowerCase().includes(q) ||
      item.classCode.toLowerCase().includes(q) ||
      item.room.toLowerCase().includes(q)
    );
  });

  const getDayName = (d: number) => {
    return d === 8 ? 'Chủ Nhật' : `Thứ ${d}`;
  };

  const totalPeriodsPerWeek = schedule.reduce(
    (sum, item) => sum + (item.endPeriod - item.startPeriod + 1),
    0
  );

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#131b2e] p-4 rounded-2xl border border-slate-200 dark:border-slate-700/70 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm theo môn, mã lớp, phòng..."
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 w-52 sm:w-64"
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden md:inline">
            Tổng: <strong className="text-slate-900 dark:text-white">{schedule.length} lớp</strong> ({totalPeriodsPerWeek} tiết/tuần)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-100 dark:hover:bg-blue-600/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Nhập TKB SIS</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Lớp Mới</span>
          </button>
        </div>
      </div>

      {/* Class Items Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e] shadow-sm dark:shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3">Mã Lớp</th>
              <th className="p-3">Học Phần</th>
              <th className="p-3">Lịch Học</th>
              <th className="p-3">Phòng Học</th>
              <th className="p-3">Tuần Học</th>
              <th className="p-3">Giảng Viên</th>
              <th className="p-3 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
            {filteredSchedule.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-200">
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5"
                    style={{ backgroundColor: item.color || '#ef4444' }}
                  />
                  {item.classCode}
                </td>
                <td className="p-3">
                  <span className="font-mono font-bold text-red-600 dark:text-red-400 block text-[11px]">
                    {item.courseCode}
                  </span>
                  <span className="text-slate-900 dark:text-white text-xs font-semibold">{item.courseName}</span>
                </td>
                <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                  <strong className="text-amber-600 dark:text-amber-400 block">{getDayName(item.dayOfWeek)}</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {getPeriodsTimeString(item.startPeriod, item.endPeriod)}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <MapPin className="w-3 h-3" />
                    {item.room}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                  {item.weeks}
                </td>
                <td className="p-3 text-slate-500 dark:text-slate-400">
                  {item.teacher || '-'}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Chỉnh sửa lớp"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      title="Xóa lớp"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
