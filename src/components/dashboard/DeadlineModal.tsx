import React, { useState, useEffect } from 'react';
import { Deadline, DeadlineType } from '../../types/deadline';
import { Course } from '../../types/course';
import { Modal } from '../common/Modal';

interface DeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deadlineData: Omit<Deadline, 'id'>) => void;
  editingDeadline?: Deadline | null;
  courses: Course[];
}

export const DeadlineModal: React.FC<DeadlineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingDeadline,
  courses
}) => {
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [type, setType] = useState<DeadlineType>('assignment');
  const [dueAt, setDueAt] = useState('');
  const [notes, setNotes] = useState('');
  const [docUrl, setDocUrl] = useState('');

  // Format datetime-local string (YYYY-MM-DDTHH:mm)
  const formatDateTimeLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${y}-${m}-${d}T${h}:${min}`;
  };

  useEffect(() => {
    if (editingDeadline) {
      setTitle(editingDeadline.title);
      setCourseCode(editingDeadline.courseCode);
      setCourseName(editingDeadline.courseName);
      setType(editingDeadline.type);
      setDueAt(formatDateTimeLocal(new Date(editingDeadline.dueAt)));
      setNotes(editingDeadline.notes || '');
      setDocUrl(editingDeadline.docUrl || '');
    } else {
      // Giá trị mặc định: hạn nộp vào 23:59 sau 3 ngày
      const defaultDue = new Date();
      defaultDue.setDate(defaultDue.getDate() + 3);
      defaultDue.setHours(23, 59, 0, 0);

      const defaultCourse = courses.find(c => c.status === 'in_progress') || courses[0];

      setTitle('');
      setCourseCode(defaultCourse ? defaultCourse.code : 'IT4060');
      setCourseName(defaultCourse ? defaultCourse.name : 'Lập trình Web');
      setType('assignment');
      setDueAt(formatDateTimeLocal(defaultDue));
      setNotes('');
      setDocUrl('');
    }
  }, [editingDeadline, isOpen, courses]);

  const handleCourseChange = (code: string) => {
    setCourseCode(code);
    const found = courses.find(c => c.code === code);
    if (found) {
      setCourseName(found.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseCode.trim() || !dueAt) {
      alert('Vui lòng điền đầy đủ tiêu đề, môn học và hạn nộp!');
      return;
    }

    const assignedDate = editingDeadline
      ? editingDeadline.assignedAt
      : new Date().toISOString();

    onSave({
      title: title.trim(),
      courseCode: courseCode.trim().toUpperCase(),
      courseName: courseName.trim() || courseCode.trim().toUpperCase(),
      type,
      assignedAt: assignedDate,
      dueAt: new Date(dueAt).toISOString(),
      notes: notes.trim(),
      docUrl: docUrl.trim(),
      completed: editingDeadline ? editingDeadline.completed : false,
      completedAt: editingDeadline ? editingDeadline.completedAt : null
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingDeadline ? 'Chỉnh Sửa Deadline' : 'Tạo Deadline Mới'}
      subtitle="Thiết lập thời gian và theo dõi hạn nộp bài tập / đồ án"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên bài tập */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tiêu đề bài tập / đồ án <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ví dụ: Báo cáo Đồ án tuần 5, BTL Cấu trúc dữ liệu..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Môn học & Loại bài */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Môn học <span className="text-red-500">*</span>
            </label>
            <select
              value={courseCode}
              onChange={e => handleCourseChange(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
            >
              {courses.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phân loại bài tập
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value as DeadlineType)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
            >
              <option value="project">Đồ án môn học / KLTN</option>
              <option value="assignment">Bài tập lớn (BTL)</option>
              <option value="lab">Thí nghiệm / Thực hành Lab</option>
              <option value="exam">Thi kết thúc học phần</option>
            </select>
          </div>
        </div>

        {/* Hạn nộp datetime-local */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Ngày và Giờ nộp bài <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            required
            value={dueAt}
            onChange={e => setDueAt(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Đồng hồ sẽ đếm lùi thời gian thực và phát cảnh báo đỏ rực khi còn dưới 24 giờ.
          </p>
        </div>

        {/* Link tài liệu / Nơi nộp */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Đường dẫn tài liệu / Nộp bài (Tùy chọn)
          </label>
          <input
            type="url"
            value={docUrl}
            onChange={e => setDocUrl(e.target.value)}
            placeholder="https://teams.microsoft.com/... hoặc Drive / GitHub"
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono text-xs"
          />
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Ghi chú chi tiết yêu cầu
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Yêu cầu nộp file zip, kèm video demo, chuẩn bị slide thuyết trình..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 shadow-md shadow-zinc-900/20 dark:shadow-none transition-colors"
          >
            {editingDeadline ? 'Lưu Thay Đổi' : 'Tạo Deadline'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
