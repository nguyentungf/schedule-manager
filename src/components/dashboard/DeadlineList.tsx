import React, { useState, useMemo } from 'react';
import { Deadline } from '../../types/deadline';
import { DeadlineCountdownCard } from './DeadlineCountdownCard';
import { Plus, CalendarCheck, Search } from 'lucide-react';

interface DeadlineListProps {
  deadlines: Deadline[];
  onToggleComplete: (id: string) => void;
  onEditDeadline: (deadline: Deadline) => void;
  onDeleteDeadline: (id: string) => void;
  onOpenAddModal: () => void;
}

export const DeadlineList: React.FC<DeadlineListProps> = ({
  deadlines,
  onToggleComplete,
  onEditDeadline,
  onDeleteDeadline,
  onOpenAddModal
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lọc và sắp xếp deadline
  const filteredDeadlines = useMemo(() => {
    return deadlines
      .filter(d => {
        // Lọc theo trạng thái
        if (statusFilter === 'active' && d.completed) return false;
        if (statusFilter === 'completed' && !d.completed) return false;

        // Lọc theo môn học
        if (courseFilter !== 'all' && d.courseCode !== courseFilter) return false;

        // Lọc theo loại
        if (typeFilter !== 'all' && d.type !== typeFilter) return false;

        // Lọc theo từ khóa tìm kiếm
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = d.title.toLowerCase().includes(q);
          const matchCourse = d.courseName.toLowerCase().includes(q) || d.courseCode.toLowerCase().includes(q);
          if (!matchTitle && !matchCourse) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Chưa hoàn thành lên trước
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Sắp xếp thời gian hạn nộp tăng dần (sắp tới trước)
        return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
      });
  }, [deadlines, statusFilter, courseFilter, typeFilter, searchQuery]);

  // Lấy danh sách các môn có trong deadlines
  const availableCourses = useMemo(() => {
    const codeMap = new Map<string, string>();
    deadlines.forEach(d => {
      codeMap.set(d.courseCode, d.courseName);
    });
    return Array.from(codeMap.entries());
  }, [deadlines]);

  return (
    <div className="space-y-4">
      {/* Action Bar & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white dark:bg-[#131b2e] p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700/70 shadow-sm">
        {/* Left: Status Toggle & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'active'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Đang làm ({deadlines.filter(d => !d.completed).length})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tất cả ({deadlines.length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Đã xong ({deadlines.filter(d => d.completed).length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên bài, môn..."
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500 w-44 sm:w-56"
            />
          </div>
        </div>

        {/* Right: Dropdowns & Add Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter by Course */}
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="all">Tất cả môn học</option>
            {availableCourses.map(([code, name]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>

          {/* Filter by Type */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="all">Tất cả loại bài</option>
            <option value="project">Đồ án</option>
            <option value="assignment">Bài tập lớn</option>
            <option value="lab">Thí nghiệm / Lab</option>
            <option value="exam">Thi kết thúc</option>
          </select>

          {/* Add Deadline Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-900/20 border border-red-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Deadline</span>
          </button>
        </div>
      </div>

      {/* Deadlines Grid */}
      {filteredDeadlines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeadlines.map(deadline => (
            <DeadlineCountdownCard
              key={deadline.id}
              deadline={deadline}
              onToggleComplete={onToggleComplete}
              onEdit={onEditDeadline}
              onDelete={onDeleteDeadline}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#131b2e]/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mx-auto flex items-center justify-center text-slate-500 dark:text-slate-400 mb-3">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Không có deadline nào</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            {statusFilter === 'active'
              ? 'Tuyệt vời! Bạn không còn deadline nào đang chờ giải quyết hoặc các bộ lọc không khớp.'
              : 'Chưa có deadline nào trong danh sách. Hãy nhấn nút bên dưới để tạo bài tập mới!'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Deadline Mới</span>
          </button>
        </div>
      )}
    </div>
  );
};
