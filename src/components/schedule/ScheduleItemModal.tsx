import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ScheduleItem } from '../../types/schedule';
import { HUST_PERIOD_TIMES } from '../../types/schedule';
import { getPeriodsTimeString, isWeekMatching } from '../../engines/scheduleEngine';

interface ScheduleItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<ScheduleItem, 'id'>) => void;
  editingItem?: ScheduleItem | null;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

export const ScheduleItemModal: React.FC<ScheduleItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem
}) => {
  const [classCode, setClassCode] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<number>(2);
  const [startPeriod, setStartPeriod] = useState<number>(1);
  const [endPeriod, setEndPeriod] = useState<number>(3);
  const [room, setRoom] = useState('');
  const [weeks, setWeeks] = useState('2-9, 11-18');
  const [teacher, setTeacher] = useState('');
  const [color, setColor] = useState('#ef4444');

  useEffect(() => {
    if (editingItem) {
      setClassCode(editingItem.classCode);
      setCourseCode(editingItem.courseCode);
      setCourseName(editingItem.courseName);
      setDayOfWeek(editingItem.dayOfWeek);
      setStartPeriod(editingItem.startPeriod);
      setEndPeriod(editingItem.endPeriod);
      setRoom(editingItem.room);
      setWeeks(editingItem.weeks || '2-9, 11-18');
      setTeacher(editingItem.teacher || '');
      setColor(editingItem.color || '#ef4444');
    } else {
      setClassCode('');
      setCourseCode('');
      setCourseName('');
      setDayOfWeek(2);
      setStartPeriod(1);
      setEndPeriod(3);
      setRoom('');
      setWeeks('2-9, 11-18');
      setTeacher('');
      setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    }
  }, [editingItem, isOpen]);

  // Chuyển danh sách số tuần thành chuỗi dải tuần chuẩn (VD: 2-9, 11-18)
  const numbersToRanges = (nums: number[]): string => {
    if (nums.length === 0) return '';
    const sorted = Array.from(new Set(nums)).sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = sorted[0];
    let prev = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      const curr = sorted[i];
      if (curr === prev + 1) {
        prev = curr;
      } else {
        ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
        start = curr;
        prev = curr;
      }
    }
    ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
    return ranges.join(', ');
  };

  const toggleWeekPill = (w: number) => {
    const active = new Set<number>();
    for (let i = 1; i <= 18; i++) {
      if (isWeekMatching(weeks, i)) active.add(i);
    }
    if (active.has(w)) {
      active.delete(w);
    } else {
      active.add(w);
    }
    setWeeks(numbersToRanges(Array.from(active)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim() || !room.trim()) {
      alert('Vui lòng điền mã học phần, tên học phần và phòng học!');
      return;
    }

    onSave({
      classCode: classCode.trim() || '140000',
      courseCode: courseCode.trim().toUpperCase(),
      courseName: courseName.trim(),
      dayOfWeek,
      startPeriod,
      endPeriod: Math.max(startPeriod, endPeriod),
      room: room.trim().toUpperCase(),
      weeks: weeks.trim() || '1-18',
      teacher: teacher.trim(),
      type: 'lecture',
      color
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Chỉnh Sửa Lớp Học Phần TKB' : 'Thêm Lớp Học Phần Mới'}
      subtitle="Quản lý thời gian, địa điểm phòng học và tuần học chuẩn HUST"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mã Lớp Học (5 - 7 số)
            </label>
            <input
              type="text"
              value={classCode}
              onChange={e => setClassCode(e.target.value)}
              placeholder="VD: 145620"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mã Học Phần <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={courseCode}
              onChange={e => setCourseCode(e.target.value)}
              placeholder="VD: IT3080, EE2000..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tên Học Phần <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={courseName}
            onChange={e => setCourseName(e.target.value)}
            placeholder="VD: Mạng máy tính, Mạch điện 1..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Thứ Trong Tuần
            </label>
            <select
              value={dayOfWeek}
              onChange={e => setDayOfWeek(parseInt(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
            >
              <option value={2}>Thứ Hai (T2)</option>
              <option value={3}>Thứ Ba (T3)</option>
              <option value={4}>Thứ Tư (T4)</option>
              <option value={5}>Thứ Năm (T5)</option>
              <option value={6}>Thứ Sáu (T6)</option>
              <option value={7}>Thứ Bảy (T7)</option>
              <option value={8}>Chủ Nhật (CN)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tiết Bắt Đầu
            </label>
            <select
              value={startPeriod}
              onChange={e => {
                const s = parseInt(e.target.value);
                setStartPeriod(s);
                if (endPeriod < s) setEndPeriod(s + 2);
              }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
            >
              {HUST_PERIOD_TIMES.map(p => (
                <option key={p.period} value={p.period}>
                  Tiết {p.period} ({p.startTime})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tiết Kết Thúc
            </label>
            <select
              value={endPeriod}
              onChange={e => setEndPeriod(parseInt(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
            >
              {HUST_PERIOD_TIMES.map(p => (
                <option key={p.period} value={p.period} disabled={p.period < startPeriod}>
                  Tiết {p.period} ({p.endTime})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Period Time Display Notice */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between font-mono">
          <span className="text-slate-500 dark:text-slate-400">Khung giờ:</span>
          <span className="font-bold text-red-600 dark:text-red-400">
            {getPeriodsTimeString(startPeriod, endPeriod)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phòng Học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={room}
              onChange={e => setRoom(e.target.value)}
              placeholder="VD: D9-401, TC-201..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tuần Học <span className="text-slate-500 dark:text-slate-400 font-normal">(Tuần 10 thi GK, Tuần 19 thi CK)</span>
            </label>
            <input
              type="text"
              value={weeks}
              onChange={e => setWeeks(e.target.value)}
              placeholder="VD: 2-9, 11-18 hoặc 2-8, 12-18(chẵn)"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>
        </div>

        {/* Interactive Week Pills Grid & Presets */}
        <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Chọn nhanh từng tuần học lặp lại (Tuần 1 - 18):
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              (Bấm số tuần để bật/tắt)
            </span>
          </div>

          {/* 18 Week Pills */}
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-1 text-center">
            {Array.from({ length: 18 }, (_, i) => i + 1).map(w => {
              const isSelected = isWeekMatching(weeks, w);
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => toggleWeekPill(w)}
                  className={`py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={`Tuần ${w}${w === 10 ? ' (Tuần thi giữa kỳ)' : ''}`}
                >
                  {w}{w === 10 ? '*' : ''}
                </button>
              );
            })}
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setWeeks('2-9, 11-18')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                weeks === '2-9, 11-18'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Cả kỳ (2-9, 11-18)
            </button>
            <button
              type="button"
              onClick={() => setWeeks('2,4,6,8,12,14,16,18')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                weeks === '2,4,6,8,12,14,16,18' || weeks.includes('chẵn')
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tuần chẵn (2-8, 12-18)
            </button>
            <button
              type="button"
              onClick={() => setWeeks('3,5,7,9,11,13,15,17')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                weeks === '3,5,7,9,11,13,15,17' || weeks.includes('lẻ')
                  ? 'bg-red-700 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tuần lẻ (3-9, 11-17)
            </button>
            <button
              type="button"
              onClick={() => setWeeks('1-18')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                weeks === '1-18'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tất cả (1-18)
            </button>
            <button
              type="button"
              onClick={() => setWeeks('4-8')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                weeks === '4-8'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Thí nghiệm 4-8
            </button>
            <button
              type="button"
              onClick={() => setWeeks('12-16')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                weeks === '12-16'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Thí nghiệm 12-16
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Giảng Viên Giảng Dạy (Tùy chọn)
          </label>
          <input
            type="text"
            value={teacher}
            onChange={e => setTeacher(e.target.value)}
            placeholder="VD: PGS. TS. Nguyễn Văn A..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Màu Thẻ Nhận Diện
          </label>
          <div className="flex items-center gap-2">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-red-500 dark:ring-white shadow-lg' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Hủy Bỏ
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 shadow-md transition-all active:scale-[0.98]"
          >
            {editingItem ? 'Lưu Thay Đổi' : 'Thêm Vào TKB'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
