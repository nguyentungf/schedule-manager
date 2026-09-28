import React, { useState, useEffect, useMemo } from 'react';
import { Course, CourseStatus, LetterGrade } from '../../types/course';
import { Modal } from '../common/Modal';
import { KNOWN_HUST_COURSE_CATALOG } from '../../engines/courseCatalogParser';
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  Save, 
  Filter, 
  Search, 
  Edit3, 
  Layers, 
  Sparkles,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface BatchCourseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onBatchUpdate: (updatedCourses: Course[]) => void;
  onBatchDelete?: (courseIds: string[]) => void;
}

export const BatchCourseEditModal: React.FC<BatchCourseEditModalProps> = ({
  isOpen,
  onClose,
  courses,
  onBatchUpdate,
  onBatchDelete
}) => {
  // Bản sao local của toàn bộ courses để người dùng chỉnh sửa tự do trước khi lưu
  const [editableCourses, setEditableCourses] = useState<Course[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Bulk action inputs
  const [bulkStatus, setBulkStatus] = useState<CourseStatus>('in_progress');
  const [bulkCredits, setBulkCredits] = useState<number>(3);
  const [bulkTerm, setBulkTerm] = useState<number>(1);
  const [bulkWeightQt, setBulkWeightQt] = useState<number>(0.3);

  // Đồng bộ khi modal mở
  useEffect(() => {
    if (isOpen) {
      setEditableCourses(courses.map(c => ({ ...c })));
      setSelectedIds(new Set());
      setSearchQuery('');
      setFilterYear('all');
      setFilterStatus('all');
    }
  }, [isOpen, courses]);

  // Bộ lọc danh sách hiển thị
  const filteredCourses = useMemo(() => {
    return editableCourses.filter(c => {
      // Lọc theo từ khóa (Mã hoặc Tên)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = c.code.toLowerCase().includes(q);
        const matchName = c.name.toLowerCase().includes(q);
        if (!matchCode && !matchName) return false;
      }

      // Lọc theo Năm học (1-5)
      if (filterYear !== 'all') {
        const targetYear = parseInt(filterYear);
        const digitMatch = c.code.match(/[A-Z]{2,4}([1-5])[0-9]{3}/);
        const year = digitMatch ? parseInt(digitMatch[1]) : (c.term ? Math.min(5, Math.max(1, Math.ceil(c.term / 2))) : 1);
        if (year !== targetYear) return false;
      }

      // Lọc theo Trạng thái
      if (filterStatus !== 'all' && c.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [editableCourses, searchQuery, filterYear, filterStatus]);

  // Chọn / Bỏ chọn tất cả dòng hiển thị
  const isAllFilteredSelected = filteredCourses.length > 0 && filteredCourses.every(c => selectedIds.has(c.id));

  const toggleSelectAllFiltered = () => {
    if (isAllFilteredSelected) {
      const updated = new Set(selectedIds);
      filteredCourses.forEach(c => updated.delete(c.id));
      setSelectedIds(updated);
    } else {
      const updated = new Set(selectedIds);
      filteredCourses.forEach(c => updated.add(c.id));
      setSelectedIds(updated);
    }
  };

  const toggleSelectOne = (id: string) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  // Cập nhật từng dòng riêng lẻ
  const handleFieldChange = (id: string, field: keyof Course, value: any) => {
    setEditableCourses(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const updated = { ...c, [field]: value };
        if (field === 'weightQt') {
          updated.weightCk = parseFloat((1 - Number(value)).toFixed(2));
        }
        return updated;
      })
    );
  };

  // Áp dụng đổi trạng thái hàng loạt
  const handleApplyBulkStatus = () => {
    if (selectedIds.size === 0) return;
    setEditableCourses(prev =>
      prev.map(c => (selectedIds.has(c.id) ? { ...c, status: bulkStatus } : c))
    );
  };

  // Áp dụng đổi số tín chỉ hàng loạt
  const handleApplyBulkCredits = () => {
    if (selectedIds.size === 0) return;
    setEditableCourses(prev =>
      prev.map(c => (selectedIds.has(c.id) ? { ...c, credits: bulkCredits } : c))
    );
  };

  // Áp dụng đổi kỳ học hàng loạt
  const handleApplyBulkTerm = () => {
    if (selectedIds.size === 0) return;
    setEditableCourses(prev =>
      prev.map(c => (selectedIds.has(c.id) ? { ...c, term: bulkTerm } : c))
    );
  };

  // Áp dụng đổi trọng số hàng loạt
  const handleApplyBulkWeights = () => {
    if (selectedIds.size === 0) return;
    const wCk = parseFloat((1 - bulkWeightQt).toFixed(2));
    setEditableCourses(prev =>
      prev.map(c => (selectedIds.has(c.id) ? { ...c, weightQt: bulkWeightQt, weightCk: wCk } : c))
    );
  };

  // Xóa các môn đã tick chọn
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.size} học phần đã chọn?`)) {
      const toDelete = Array.from(selectedIds);
      setEditableCourses(prev => prev.filter(c => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
      if (onBatchDelete) {
        onBatchDelete(toDelete);
      }
    }
  };

  // Lưu tất cả thay đổi
  const handleSaveAll = () => {
    onBatchUpdate(editableCourses);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sửa Thông Tin Hàng Loạt Học Phần (Batch Course Editor)"
      subtitle="Chỉnh sửa trực tiếp hàng loạt mã môn, tên môn, tín chỉ, trọng số, kỳ học và trạng thái học tập"
      maxWidth="max-w-6xl"
    >
      <div className="space-y-4 text-xs">
        {/* Toolbar: Filters & Search */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Box */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm mã hoặc tên học phần..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500 font-medium"
              />
            </div>

            {/* Filter by Year */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Năm:</span>
              <select
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả năm</option>
                <option value="1">Năm 1 (1xxx)</option>
                <option value="2">Năm 2 (2xxx)</option>
                <option value="3">Năm 3 (3xxx)</option>
                <option value="4">Năm 4 (4xxx)</option>
                <option value="5">Năm 5 (5xxx)</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Trạng thái:</span>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="passed">Đã qua</option>
                <option value="in_progress">Đang học</option>
                <option value="unlocked">Mở</option>
                <option value="failed">Nợ môn (F)</option>
                <option value="locked">Bị khóa</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">
              Hiển thị: <strong className="text-slate-900 dark:text-white">{filteredCourses.length}</strong> / {editableCourses.length} môn
            </span>
            {selectedIds.size > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-red-50 dark:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 font-bold font-mono text-[11px]">
                Đã chọn: {selectedIds.size} môn
              </span>
            )}
          </div>
        </div>

        {/* Bulk Action Controls Bar (Kích hoạt khi chọn >= 1 môn) */}
        {selectedIds.size > 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="font-bold text-slate-900 dark:text-white text-xs">
                Thao tác hàng loạt cho {selectedIds.size} môn đã chọn:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Đổi trạng thái hàng loạt */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
                <select
                  value={bulkStatus}
                  onChange={e => setBulkStatus(e.target.value as CourseStatus)}
                  className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 focus:outline-none"
                >
                  <option value="passed">Đã qua</option>
                  <option value="in_progress">Đang học</option>
                  <option value="unlocked">Chưa học / Mở</option>
                  <option value="failed">Nợ môn (F)</option>
                  <option value="locked">Bị khóa</option>
                </select>
                <button
                  type="button"
                  onClick={handleApplyBulkStatus}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs shadow transition-colors"
                >
                  Đổi Trạng Thái
                </button>
              </div>

              {/* Đổi số tín chỉ hàng loạt */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={bulkCredits}
                  onChange={e => setBulkCredits(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-1.5 py-1 text-xs font-mono font-bold text-center border border-slate-300 dark:border-slate-700"
                />
                <button
                  type="button"
                  onClick={handleApplyBulkCredits}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Gán Tín Chỉ
                </button>
              </div>

              {/* Đổi kỳ học hàng loạt */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={bulkTerm}
                  onChange={e => setBulkTerm(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-1.5 py-1 text-xs font-mono font-bold text-center border border-slate-300 dark:border-slate-700"
                />
                <button
                  type="button"
                  onClick={handleApplyBulkTerm}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Gán Kỳ
                </button>
              </div>

              {/* Đổi trọng số hàng loạt */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
                <select
                  value={bulkWeightQt}
                  onChange={e => setBulkWeightQt(parseFloat(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 focus:outline-none"
                >
                  <option value={0.3}>QT 0.3 / CK 0.7</option>
                  <option value={0.4}>QT 0.4 / CK 0.6</option>
                  <option value={0.5}>QT 0.5 / CK 0.5</option>
                  <option value={0.2}>QT 0.2 / CK 0.8</option>
                </select>
                <button
                  type="button"
                  onClick={handleApplyBulkWeights}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Gán Trọng Số
                </button>
              </div>

              {/* Nút xóa hàng loạt */}
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-600/20 hover:bg-rose-100 dark:hover:bg-rose-600/30 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 font-bold transition-colors"
                title="Xóa vĩnh viễn các môn đã chọn khỏi khung CTĐT"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa {selectedIds.size} môn</span>
              </button>
            </div>
          </div>
        )}

        {/* Spreadsheet Table */}
        <div className="max-h-[500px] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-inner">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-100 dark:bg-[#131b2e] text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase border-b border-slate-200 dark:border-slate-800 z-10 shadow-sm">
              <tr>
                <th className="p-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAllFiltered}
                    className="flex items-center justify-center mx-auto hover:opacity-80 transition-opacity"
                    title={isAllFilteredSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  >
                    {isAllFilteredSelected ? (
                      <CheckSquare className="w-4 h-4 text-red-600 dark:text-red-500" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>
                </th>
                <th className="p-3 w-28">Mã HP</th>
                <th className="p-3 min-w-[220px]">Tên Học Phần</th>
                <th className="p-3 w-16 text-center">Tín Chỉ</th>
                <th className="p-3 w-16 text-center">Kỳ</th>
                <th className="p-3 w-24 text-center">Trọng số QT</th>
                <th className="p-3 w-24 text-center">Trọng số CK</th>
                <th className="p-3 w-32">Trạng Thái</th>
                <th className="p-3 w-24 text-center">Điểm Chữ</th>
                <th className="p-3 w-12 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500 italic">
                    Không tìm thấy học phần nào khớp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredCourses.map(course => {
                  const isSelected = selectedIds.has(course.id);
                  return (
                    <tr
                      key={course.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-red-50 dark:bg-red-600/10' : 'hover:bg-slate-50 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(course.id)}
                          className="flex items-center justify-center mx-auto"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-red-600 dark:text-red-500" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          )}
                        </button>
                      </td>

                      {/* Mã HP */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={course.code}
                          onChange={e => handleFieldChange(course.id, 'code', e.target.value.toUpperCase())}
                          className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-lg px-2 py-1 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-red-500"
                        />
                      </td>

                      {/* Tên HP */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={course.name}
                          onChange={e => handleFieldChange(course.id, 'name', e.target.value)}
                          className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-red-500"
                        />
                      </td>

                      {/* Tín Chỉ */}
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={course.credits}
                          onChange={e => handleFieldChange(course.id, 'credits', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-12 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-lg px-1 py-1 text-slate-900 dark:text-white font-mono font-bold text-center focus:outline-none focus:border-red-500"
                        />
                      </td>

                      {/* Kỳ Học */}
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={course.term || 1}
                          onChange={e => handleFieldChange(course.id, 'term', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-12 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-lg px-1 py-1 text-slate-900 dark:text-white font-mono font-bold text-center focus:outline-none focus:border-red-500"
                        />
                      </td>

                      {/* Trọng Số QT */}
                      <td className="p-2 text-center">
                        <select
                          value={course.weightQt ?? 0.3}
                          onChange={e => handleFieldChange(course.id, 'weightQt', parseFloat(e.target.value))}
                          className="bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-lg px-1.5 py-1 text-slate-900 dark:text-white text-[11px] font-mono focus:outline-none focus:border-red-500"
                        >
                          <option value={0.2}>0.2 (20%)</option>
                          <option value={0.3}>0.3 (30%)</option>
                          <option value={0.4}>0.4 (40%)</option>
                          <option value={0.5}>0.5 (50%)</option>
                        </select>
                      </td>

                      {/* Trọng Số CK */}
                      <td className="p-2 text-center font-mono font-bold text-slate-600 dark:text-slate-400">
                        {((course.weightCk ?? 0.7) * 100).toFixed(0)}%
                      </td>

                      {/* Trạng Thái */}
                      <td className="p-2">
                        <select
                          value={course.status}
                          onChange={e => handleFieldChange(course.id, 'status', e.target.value as CourseStatus)}
                          className={`w-full rounded-lg px-2 py-1 text-[11px] font-bold border focus:outline-none ${
                            course.status === 'passed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-400'
                              : course.status === 'in_progress'
                              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800/40 text-blue-800 dark:text-blue-400'
                              : course.status === 'failed'
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/40 text-rose-800 dark:text-rose-400'
                              : 'bg-white dark:bg-slate-900/90 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300'
                          }`}
                        >
                          <option value="unlocked">Mở (Chưa học)</option>
                          <option value="in_progress">Đang học</option>
                          <option value="passed">Đã qua</option>
                          <option value="failed">Nợ môn (F)</option>
                          <option value="locked">Bị khóa</option>
                        </select>
                      </td>

                      {/* Điểm Chữ */}
                      <td className="p-2 text-center">
                        <select
                          value={course.gradeLetter || ''}
                          onChange={e => {
                            const val = e.target.value as LetterGrade;
                            handleFieldChange(course.id, 'gradeLetter', val || undefined);
                            if (val === 'A+' || val === 'A') handleFieldChange(course.id, 'gradeScale4', 4.0);
                            else if (val === 'B+') handleFieldChange(course.id, 'gradeScale4', 3.5);
                            else if (val === 'B') handleFieldChange(course.id, 'gradeScale4', 3.0);
                            else if (val === 'C+') handleFieldChange(course.id, 'gradeScale4', 2.5);
                            else if (val === 'C') handleFieldChange(course.id, 'gradeScale4', 2.0);
                            else if (val === 'D+') handleFieldChange(course.id, 'gradeScale4', 1.5);
                            else if (val === 'D') handleFieldChange(course.id, 'gradeScale4', 1.0);
                            else if (val === 'F') handleFieldChange(course.id, 'gradeScale4', 0.0);
                          }}
                          className="bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-lg px-2 py-1 text-slate-900 dark:text-white font-mono font-bold text-center focus:outline-none focus:border-red-500"
                        >
                          <option value="">--</option>
                          <option value="A+">A+ (4.0)</option>
                          <option value="A">A (4.0)</option>
                          <option value="B+">B+ (3.5)</option>
                          <option value="B">B (3.0)</option>
                          <option value="C+">C+ (2.5)</option>
                          <option value="C">C (2.0)</option>
                          <option value="D+">D+ (1.5)</option>
                          <option value="D">D (1.0)</option>
                          <option value="F">F (0.0)</option>
                        </select>
                      </td>

                      {/* Xóa dòng đơn lẻ */}
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn xóa môn ${course.code} - ${course.name}?`)) {
                              setEditableCourses(prev => prev.filter(c => c.id !== course.id));
                              if (onBatchDelete) onBatchDelete([course.id]);
                            }
                          }}
                          className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title="Xóa môn này"
                        >
                          <Trash2 className="w-3.5 h-3.5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setEditableCourses(courses.map(c => ({ ...c })))}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Hoàn Tác Về Ban Đầu</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold shadow-md shadow-zinc-900/20 dark:shadow-none transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Tất Cả Thay Đổi ({editableCourses.length} môn)</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
