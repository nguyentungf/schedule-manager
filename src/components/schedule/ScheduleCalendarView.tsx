import React, { useState, useMemo } from 'react';
import { ScheduleItem, HUST_PERIOD_TIMES } from '../../types/schedule';
import { detectScheduleConflicts, isWeekMatching, getPeriodsTimeString } from '../../engines/scheduleEngine';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Layers, 
  Edit2, 
  Trash2, 
  Plus, 
  PenTool, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Sparkles
} from 'lucide-react';

interface ScheduleCalendarViewProps {
  schedule: ScheduleItem[];
  onEditItem: (item: ScheduleItem) => void;
  onDeleteItem: (id: string) => void;
  onAddNewAtSlot?: (dayOfWeek: number, startPeriod: number) => void;
}

const PERIOD_HEIGHT = 60; // Chiều cao cố định mỗi tiết học (px)
const LUNCH_HEIGHT = 28;  // Chiều cao dải phân cách nghỉ trưa (px)

export const ScheduleCalendarView: React.FC<ScheduleCalendarViewProps> = ({
  schedule,
  onEditItem,
  onDeleteItem,
  onAddNewAtSlot
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(3); // Mặc định tuần học chính (Tuần 3)
  const [filterAllWeeks, setFilterAllWeeks] = useState<boolean>(false); // Mặc định hiển thị theo tuần giống Google Calendar
  const [manualMode, setManualMode] = useState<boolean>(false); // Toggle Tự thiết lập TKB

  // Phát hiện xung đột trùng lịch
  const conflicts = useMemo(() => detectScheduleConflicts(schedule), [schedule]);

  // Lọc các môn học theo tuần được chọn
  const activeItems = useMemo(() => {
    if (filterAllWeeks) return schedule;
    return schedule.filter(item => isWeekMatching(item.weeks, selectedWeek));
  }, [schedule, selectedWeek, filterAllWeeks]);

  const days = [
    { day: 2, label: 'Thứ Hai', short: 'Thứ 2' },
    { day: 3, label: 'Thứ Ba', short: 'Thứ 3' },
    { day: 4, label: 'Thứ Tư', short: 'Thứ 4' },
    { day: 5, label: 'Thứ Năm', short: 'Thứ 5' },
    { day: 6, label: 'Thứ Sáu', short: 'Thứ 6' },
    { day: 7, label: 'Thứ Bảy', short: 'Thứ 7' },
    { day: 8, label: 'Chủ Nhật', short: 'CN' }
  ];

  // Tính tọa độ top của tiết học (px)
  const getSlotTop = (period: number) => {
    if (period <= 6) {
      return (period - 1) * PERIOD_HEIGHT;
    }
    return 6 * PERIOD_HEIGHT + LUNCH_HEIGHT + (period - 7) * PERIOD_HEIGHT;
  };

  // Tính chiều cao ô môn học tỷ lệ thuận với số tiết học chiếm dụng
  const getEventHeight = (startPeriod: number, endPeriod: number) => {
    const span = Math.max(1, endPeriod - startPeriod + 1);
    let height = span * PERIOD_HEIGHT - 4;
    // Nếu môn học vắt qua giờ nghỉ trưa (hiếm khi)
    if (startPeriod <= 6 && endPeriod >= 7) {
      height += LUNCH_HEIGHT;
    }
    return Math.max(height, 52);
  };

  // Thuật toán sắp xếp vị trí song song (side-by-side) cho các môn bị trùng lịch / cùng khung giờ giống Google Calendar
  const getDayPositions = (dayOfWeek: number) => {
    const dayItems = activeItems.filter(item => item.dayOfWeek === dayOfWeek);
    const sorted = [...dayItems].sort(
      (a, b) => a.startPeriod - b.startPeriod || (b.endPeriod - b.startPeriod) - (a.endPeriod - a.startPeriod)
    );

    const positions = new Map<string, { col: number; colCount: number }>();
    const columns: ScheduleItem[][] = [];

    for (const item of sorted) {
      let placed = false;
      for (let c = 0; c < columns.length; c++) {
        const lastInCol = columns[c][columns[c].length - 1];
        if (item.startPeriod > lastInCol.endPeriod) {
          columns[c].push(item);
          positions.set(item.id, { col: c, colCount: 0 });
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([item]);
        positions.set(item.id, { col: columns.length - 1, colCount: 0 });
      }
    }

    const totalCols = Math.max(1, columns.length);
    for (const item of dayItems) {
      const pos = positions.get(item.id);
      if (pos) {
        pos.colCount = totalCols;
      }
    }

    return { dayItems, positions };
  };

  const handlePrevWeek = () => {
    setSelectedWeek(prev => Math.max(1, prev - 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(prev => Math.min(18, prev + 1));
  };

  const handleJumpToCurrentWeek = () => {
    setSelectedWeek(3);
    setFilterAllWeeks(false);
  };

  // Thông tin ghi chú của tuần học hiện tại
  const getWeekNote = (w: number) => {
    if (w === 10) return 'Tuần 10: Thi Giữa Kỳ (Midterm)';
    if (w === 19) return 'Tuần 19: Thi Cuối Kỳ / Tuần Dự Trữ';
    if (w >= 2 && w <= 9) return `Tuần ${w}: Nửa đầu học kỳ chính`;
    if (w >= 11 && w <= 18) return `Tuần ${w}: Nửa sau học kỳ chính`;
    return `Tuần ${w}`;
  };

  return (
    <div className="space-y-4">
      {/* Google Calendar Navigation Header */}
      <div className="bg-white dark:bg-[#131b2e] p-4 rounded-2xl border border-slate-200 dark:border-slate-700/70 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm dark:shadow-xl">
        {/* Left: Navigation buttons, Week Title & Today button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleJumpToCurrentWeek}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
              title="Nhảy về tuần học hiện tại"
            >
              Hôm Nay (Tuần 3)
            </button>

            <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5">
              <button
                onClick={handlePrevWeek}
                disabled={selectedWeek <= 1 || filterAllWeeks}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Tuần trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextWeek}
                disabled={selectedWeek >= 18 || filterAllWeeks}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Tuần kế tiếp"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {filterAllWeeks ? 'Thời Khóa Biểu Tổng Thể (Cả Học Kỳ)' : `Thời Khóa Biểu: Tuần ${selectedWeek}`}
              </h3>
              {!filterAllWeeks && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-600/20 text-red-700 dark:text-red-300 font-bold border border-red-200 dark:border-red-500/30">
                  {selectedWeek === 10 ? 'Thi Giữa Kỳ' : selectedWeek === 19 ? 'Thi Cuối Kỳ' : `Tuần ${selectedWeek}/18`}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filterAllWeeks
                ? 'Đang hiển thị tổng hợp tất cả các lớp học phần lặp lại trong toàn khóa'
                : getWeekNote(selectedWeek)}
            </p>
          </div>
        </div>

        {/* Right: Quick Jump, View Toggle & Manual Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dropdown Jump directly to week */}
          {!filterAllWeeks && (
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-600 dark:text-slate-400">Chọn tuần:</span>
              <select
                value={selectedWeek}
                onChange={e => setSelectedWeek(parseInt(e.target.value))}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {Array.from({ length: 18 }, (_, i) => i + 1).map(w => (
                  <option key={w} value={w}>
                    Tuần {w} {w === 10 ? '(Thi GK)' : w >= 2 && w <= 9 ? '(Nửa đầu)' : '(Nửa sau)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Toggle Xem theo tuần vs Toàn bộ kỳ */}
          <button
            onClick={() => setFilterAllWeeks(!filterAllWeeks)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filterAllWeeks
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-md'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{filterAllWeeks ? 'Đang Xem Cả Kỳ' : 'Xem Theo Tuần'}</span>
          </button>

          {/* Toggle Tự thiết lập TKB */}
          <button
            onClick={() => setManualMode(!manualMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              manualMode
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Bật/Tắt chế độ tự nhập và chỉnh sửa trực tiếp trên lịch"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{manualMode ? '✓ Đang Tự Thiết Lập' : 'Tự Thiết Lập TKB'}</span>
          </button>

          {/* Quick Add Class */}
          {onAddNewAtSlot && (
            <button
              onClick={() => onAddNewAtSlot(2, 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold shadow-lg shadow-zinc-900/20 dark:shadow-none transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Lớp</span>
            </button>
          )}
        </div>
      </div>

      {/* Manual Mode Banner */}
      {manualMode && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Chế độ Tự thiết lập TKB đang BẬT:</strong> Nhấp vào bất kỳ ô tiết học trống nào bên dưới để thêm lớp mới, hoặc nhấp vào khối môn học để chỉnh sửa / xóa.
            </span>
          </div>
        </div>
      )}

      {/* Conflicts Banner */}
      {conflicts.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs space-y-1 shadow-lg">
          <div className="font-bold flex items-center gap-2 text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Phát hiện {conflicts.length} trường hợp TRÙNG LỊCH HỌC trên thời khóa biểu:</span>
          </div>
          {conflicts.map((c, i) => (
            <p key={i} className="pl-6 text-[11px] text-rose-700/90 dark:text-rose-200/90 font-medium">
              • {c.message}
            </p>
          ))}
        </div>
      )}

      {/* Google Calendar Time Grid (Fixed Period Height & Proportional Event Scaling) */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm dark:shadow-2xl">
        <div className="min-w-[950px]">
          {/* Calendar Header Row: Time Column + 7 Days of the Week */}
          <div className="grid grid-cols-[85px_repeat(7,1fr)] bg-slate-50 dark:bg-[#131b2e] border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-center sticky top-0 z-20 shadow-xs">
            <div className="p-3 text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 font-mono text-[11px] flex items-center justify-center">
              Tiết / Giờ
            </div>
            {days.map(d => {
              const countToday = activeItems.filter(item => item.dayOfWeek === d.day).length;
              return (
                <div key={d.day} className="p-3 border-r border-slate-200 dark:border-slate-800/60 last:border-r-0">
                  <span className="text-slate-900 dark:text-white block font-bold text-sm tracking-tight">{d.label}</span>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal font-mono">{d.short}</span>
                    {countToday > 0 && (
                      <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-600/30 text-red-700 dark:text-red-300 font-mono text-[10px] flex items-center justify-center font-bold">
                        {countToday}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Body: 8 Columns with Absolute Proportional Event Positioning */}
          <div className="grid grid-cols-[85px_repeat(7,1fr)] relative">
            {/* Column 0: Time & Periods (Sáng 1-6, Nghỉ trưa, Chiều 7-12) */}
            <div className="border-r border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#131b2e]/60 divide-y divide-slate-200 dark:divide-slate-800/60 text-center select-none font-mono">
              {/* Sáng: Tiết 1 - 6 */}
              {HUST_PERIOD_TIMES.slice(0, 6).map(period => (
                <div
                  key={period.period}
                  style={{ height: `${PERIOD_HEIGHT}px` }}
                  className="flex flex-col justify-center items-center p-1 bg-slate-100/40 dark:bg-slate-900/30"
                >
                  <span className="font-bold text-red-600 dark:text-red-400 text-xs">Tiết {period.period}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {period.startTime} - {period.endTime}
                  </span>
                </div>
              ))}

              {/* Dải Nghỉ Trưa Phân Cách Sáng - Chiều */}
              <div
                style={{ height: `${LUNCH_HEIGHT}px` }}
                className="bg-amber-50 dark:bg-slate-900/90 border-y border-amber-200 dark:border-amber-500/30 flex items-center justify-center px-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 tracking-wider"
              >
                <Sun className="w-3 h-3 mr-1 text-amber-600 dark:text-amber-400" />
                <span>NGHỈ TRƯA</span>
              </div>

              {/* Chiều: Tiết 7 - 12 */}
              {HUST_PERIOD_TIMES.slice(6, 12).map(period => (
                <div
                  key={period.period}
                  style={{ height: `${PERIOD_HEIGHT}px` }}
                  className="flex flex-col justify-center items-center p-1 bg-slate-100/40 dark:bg-slate-900/30"
                >
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">Tiết {period.period}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {period.startTime} - {period.endTime}
                  </span>
                </div>
              ))}
            </div>

            {/* Columns 1 - 7: Thứ Hai đến Chủ Nhật */}
            {days.map(d => {
              const { dayItems, positions } = getDayPositions(d.day);

              return (
                <div
                  key={d.day}
                  className="border-r border-slate-200 dark:border-slate-800/60 last:border-r-0 relative"
                  style={{ height: `${6 * PERIOD_HEIGHT + LUNCH_HEIGHT + 6 * PERIOD_HEIGHT}px` }}
                >
                  {/* Background Grid Slots (Fixed height for each period) */}
                  <div className="absolute inset-0 z-0">
                    {/* Sáng: 6 Tiết */}
                    {Array.from({ length: 6 }).map((_, idx) => {
                      const pNum = idx + 1;
                      return (
                        <div
                          key={`morning_${pNum}`}
                          style={{ height: `${PERIOD_HEIGHT}px` }}
                          className={`border-b border-slate-200 dark:border-slate-800/40 relative group ${
                            pNum % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-900/20' : 'bg-transparent'
                          }`}
                        >
                          {manualMode && (
                            <button
                              type="button"
                              onClick={() => onAddNewAtSlot && onAddNewAtSlot(d.day, pNum)}
                              className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center bg-red-600/10 border border-dashed border-red-500/50 text-red-600 dark:text-red-400 text-[10px] font-mono gap-1 transition-opacity z-10"
                              title={`Thêm lớp tại ${d.label}, Tiết ${pNum}`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>Thêm T{pNum}</span>
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* Dải Nghỉ Trưa */}
                    <div
                      style={{ height: `${LUNCH_HEIGHT}px` }}
                      className="bg-amber-50/30 dark:bg-slate-900/70 border-y border-slate-200 dark:border-slate-800/80 flex items-center justify-center text-[10px] text-slate-400 dark:text-slate-500"
                    >
                      <span className="opacity-60 font-mono">11:45 - 12:30</span>
                    </div>

                    {/* Chiều: 6 Tiết */}
                    {Array.from({ length: 6 }).map((_, idx) => {
                      const pNum = idx + 7;
                      return (
                        <div
                          key={`afternoon_${pNum}`}
                          style={{ height: `${PERIOD_HEIGHT}px` }}
                          className={`border-b border-slate-200 dark:border-slate-800/40 relative group ${
                            pNum % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-900/20' : 'bg-transparent'
                          }`}
                        >
                          {manualMode && (
                            <button
                              type="button"
                              onClick={() => onAddNewAtSlot && onAddNewAtSlot(d.day, pNum)}
                              className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center bg-blue-600/10 border border-dashed border-blue-500/50 text-blue-600 dark:text-blue-400 text-[10px] font-mono gap-1 transition-opacity z-10"
                              title={`Thêm lớp tại ${d.label}, Tiết ${pNum}`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>Thêm T{pNum}</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Foreground Course Event Cards (Stretched & scaled proportionally to time occupied) */}
                  <div className="absolute inset-0 pointer-events-none z-10 p-1">
                    {dayItems.map(item => {
                      const pos = positions.get(item.id) || { col: 0, colCount: 1 };
                      const top = getSlotTop(item.startPeriod);
                      const height = getEventHeight(item.startPeriod, item.endPeriod);
                      const spanPeriods = item.endPeriod - item.startPeriod + 1;
                      const widthPercent = 100 / pos.colCount;
                      const leftPercent = pos.col * widthPercent;
                      const color = item.color || '#dc2626';

                      return (
                        <div
                          key={item.id}
                          onClick={() => onEditItem(item)}
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            left: `${leftPercent}%`,
                            width: `calc(${widthPercent}% - 4px)`,
                            borderColor: `${color}40`,
                            borderLeftWidth: '4px',
                            borderLeftColor: color
                          }}
                          className="absolute pointer-events-auto rounded-xl p-2 cursor-pointer shadow-sm dark:shadow-lg hover:shadow-md active:scale-[0.98] transition-all overflow-hidden flex flex-col justify-between group border bg-white/95 dark:bg-[#131b2e]/95 backdrop-blur-xs"
                          title={`${item.courseCode} - ${item.courseName} (${getPeriodsTimeString(item.startPeriod, item.endPeriod)})`}
                        >
                          {/* Card Header: Code Badge + Class Code + Actions */}
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span
                                className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded text-white shadow-xs"
                                style={{ backgroundColor: color }}
                              >
                                {item.courseCode}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                                  {item.classCode}
                                </span>
                                {manualMode && (
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      if (confirm(`Bạn có chắc muốn xóa lớp ${item.courseName} (${item.classCode})?`)) {
                                        onDeleteItem(item.id);
                                      }
                                    }}
                                    className="p-0.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                    title="Xóa lớp này"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Course Name - High contrast in both light and dark modes */}
                            <h5 className="font-bold text-slate-900 dark:text-white text-[11px] leading-snug line-clamp-2" title={item.courseName}>
                              {item.courseName}
                            </h5>
                          </div>

                          {/* Card Meta: Room & Duration */}
                          <div className="pt-1 border-t border-slate-200/80 dark:border-white/10 mt-auto">
                            <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300">
                              <span className="flex items-center gap-1 font-mono text-amber-700 dark:text-amber-300 font-semibold truncate">
                                <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                                {item.room}
                              </span>
                              <span className="font-mono text-slate-500 dark:text-slate-400 font-medium">
                                {spanPeriods} tiết
                              </span>
                            </div>

                            {/* Detailed Time and Weeks (visible when height permits) */}
                            {spanPeriods >= 2 && (
                              <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                                <span>T{item.startPeriod}-T{item.endPeriod}</span>
                                <span className="truncate max-w-[100px]" title={item.weeks}>
                                  Tuần: {item.weeks}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
