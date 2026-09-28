import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { parseSisText, ParsedCourseResult, ParsedStudentInfo } from '../../engines/sisParser';
import { ScheduleItem } from '../../types/schedule';
import { KNOWN_HUST_COURSE_CATALOG } from '../../engines/courseCatalogParser';
import {
  Clipboard,
  Trash2,
  Sparkles,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Layers,
  Check,
  AlertCircle
} from 'lucide-react';

interface RawTextImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCourses: (courses: ParsedCourseResult[], studentInfo?: ParsedStudentInfo) => void;
  onImportSchedule?: (items: ScheduleItem[]) => void;
}

export const RawTextImportModal: React.FC<RawTextImportModalProps> = ({
  isOpen,
  onClose,
  onImportCourses,
  onImportSchedule
}) => {
  const [rawText, setRawText] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'schedule'>('courses');
  const [importMode, setImportMode] = useState<'merge' | 'overwrite'>('merge');

  // Parser dữ liệu từ văn bản thô
  const parsedData = React.useMemo(() => {
    if (!rawText.trim()) return null;

    // 1. Nhận diện học phần & sinh viên qua engine sisParser
    const courseReport = parseSisText(rawText);

    // 2. Nhận diện thời khóa biểu nếu có
    const lines = rawText.split(/\r?\n/);
    const scheduleItems: ScheduleItem[] = [];
    const seenSchedIds = new Set<string>();

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Tìm mã lớp (5-7 chữ số)
      const classCodeMatch = trimmed.match(/\b([1-9][0-9]{4,6})\b/);
      const courseCodeMatch = trimmed.match(/\b([A-Z]{2,4}[0-9]{4})\b/);
      const dayMatch = trimmed.match(/(?:Thứ\s*|T)([2-7])|\b(Chủ\s*nhật|CN)\b/i);
      const periodMatch = trimmed.match(/(?:Tiết\s*)?([1-9]|1[0-2])\s*[-–]\s*([1-9]|1[0-2])/i);
      const roomMatch = trimmed.match(/\b([A-Z][0-9]{1,2}-[0-9]{3}[A-Z]?|[A-Z]{1,2}[0-9]{3,4})\b/i);

      if (classCodeMatch && (courseCodeMatch || (dayMatch && periodMatch))) {
        const classCode = classCodeMatch[1];
        const courseCode = courseCodeMatch ? courseCodeMatch[1] : '';
        const dayOfWeek = dayMatch ? (dayMatch[1] ? parseInt(dayMatch[1]) : 8) : 2;
        const startPeriod = periodMatch ? parseInt(periodMatch[1]) : 1;
        const endPeriod = periodMatch ? parseInt(periodMatch[2]) : 3;
        const room = roomMatch ? roomMatch[1] : 'HUST';

        const weekMatch = trimmed.match(/\b([0-9]{1,2}\s*[-–]\s*[0-9]{1,2}(?:,\s*[0-9]{1,2}\s*[-–]\s*[0-9]{1,2})*)\b/);
        const weeks = weekMatch ? weekMatch[1] : '1-16';

        let courseName = '';
        if (courseCode) {
          courseName = KNOWN_HUST_COURSE_CATALOG[courseCode]?.name || '';
        }
        if (!courseName) {
          const parts = trimmed.split(/\t+|\s{2,}/).map(c => c.trim()).filter(Boolean);
          const nameCol = parts.find(c => c !== classCode && c !== courseCode && !/^[0-9-]+$/.test(c) && !/Thứ|Tiết/i.test(c));
          courseName = nameCol || (courseCode ? `Học phần ${courseCode}` : `Lớp ${classCode}`);
        }

        const id = `sched_${classCode}_${dayOfWeek}_${startPeriod}`;
        if (!seenSchedIds.has(id)) {
          seenSchedIds.add(id);
          scheduleItems.push({
            id,
            classCode,
            courseCode: courseCode || classCode,
            courseName,
            dayOfWeek,
            startPeriod,
            endPeriod,
            room,
            weeks
          });
        }
      }
    });

    const totalLines = lines.length;
    const recognizedLines = courseReport.courses.length + scheduleItems.length;
    const ignoredLines = Math.max(0, totalLines - recognizedLines);

    return {
      courseReport,
      scheduleItems,
      totalLines,
      ignoredLines
    };
  }, [rawText]);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setRawText(text);
      } else {
        alert('Bộ nhớ tạm (Clipboard) đang trống!');
      }
    } catch {
      alert('Không thể đọc từ bộ nhớ tạm. Hãy dùng phím Ctrl + V để dán trực tiếp vào ô bên dưới!');
    }
  };

  const handleApplyImport = () => {
    if (!parsedData) return;

    if (activeTab === 'courses' || parsedData.courseReport.courses.length > 0) {
      onImportCourses(parsedData.courseReport.courses, parsedData.courseReport.studentInfo);
    }

    if ((activeTab === 'schedule' || parsedData.scheduleItems.length > 0) && onImportSchedule) {
      onImportSchedule(parsedData.scheduleItems);
    }

    alert(`✅ Đã đồng bộ thành công ${parsedData.courseReport.courses.length} học phần và ${parsedData.scheduleItems.length} tiết thời khóa biểu!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tự Động Nhận Diện Dữ Liệu Từ Văn Bản Thô"
      subtitle="Chỉ cần Ctrl + A trang web SIS/QLĐT và dán vào đây - Bộ lọc AI tự động lọc sạch toàn bộ dữ liệu thừa"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Helper instruction alert */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent border border-red-200 dark:border-red-900/40 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-bold text-red-600 dark:text-red-400">Cách sử dụng đơn giản 1 chạm: </span>
            Mở trang web bất kỳ trên điện thoại hoặc máy tính (Bảng điểm SIS, CTĐT QLĐT, Đăng ký lớp, Thời khóa biểu), chọn <strong className="text-slate-900 dark:text-white">Ctrl + A (hoặc Chọn tất cả)</strong>, sao chép và bấm nút <strong className="text-slate-900 dark:text-white">"Dán từ bộ nhớ tạm"</strong>. Ứng dụng sẽ tự động trích xuất thông tin sinh viên, môn học, điểm số và TKB, đồng thời loại bỏ sạch 100% rác HTML.
          </div>
        </div>

        {/* Textarea Input & Action Buttons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Văn bản sao chép từ website (Ctrl + V):</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-900/20 transition-all active:scale-95"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Dán từ bộ nhớ tạm</span>
              </button>

              {rawText && (
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  title="Xóa trắng nội dung"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <textarea
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            rows={7}
            placeholder="Dán toàn bộ nội dung web vào đây (VD: Bảng điểm cá nhân, chương trình đào tạo sinh viên, lịch học tuần...)"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-y"
          />
        </div>

        {/* Live Parsing Result Preview */}
        {parsedData && (
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
            {/* Summary statistics bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {parsedData.courseReport.courses.length} Học phần
                </span>

                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-bold text-xs border border-blue-300 dark:border-blue-800">
                  <Calendar className="w-3.5 h-3.5" />
                  {parsedData.scheduleItems.length} Lớp TKB
                </span>

                <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono">
                  Đã lọc sạch {parsedData.ignoredLines} dòng rác
                </span>
              </div>

              {parsedData.courseReport.studentInfo?.name && (
                <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span>{parsedData.courseReport.studentInfo.name}</span>
                  {parsedData.courseReport.studentInfo.studentId && (
                    <span className="text-slate-400 font-mono">({parsedData.courseReport.studentInfo.studentId})</span>
                  )}
                </div>
              )}
            </div>

            {/* Sub-tabs to preview courses or schedule */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('courses')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'courses'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Danh Sách Môn Học ({parsedData.courseReport.courses.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'schedule'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Thời Khóa Biểu ({parsedData.scheduleItems.length})
              </button>
            </div>

            {/* Courses Table Preview */}
            {activeTab === 'courses' && (
              <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {parsedData.courseReport.courses.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Không tìm thấy thông tin môn học nào trong văn bản đã dán.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 font-mono text-[10px] uppercase sticky top-0">
                      <tr>
                        <th className="p-2.5">Mã Môn</th>
                        <th className="p-2.5">Tên Học Phần</th>
                        <th className="p-2.5">Tín Chỉ</th>
                        <th className="p-2.5">Trạng Thái / Điểm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {parsedData.courseReport.courses.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-2.5 font-mono font-bold text-red-600 dark:text-red-400">{c.code}</td>
                          <td className="p-2.5 text-slate-900 dark:text-white truncate max-w-xs">{c.name}</td>
                          <td className="p-2.5 font-mono text-slate-600 dark:text-slate-300">{c.credits} TC</td>
                          <td className="p-2.5">
                            {c.gradeLetter ? (
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {c.gradeLetter} ({c.gradeScale4?.toFixed(1) || 'Đạt'})
                              </span>
                            ) : c.status === 'in_progress' ? (
                              <span className="text-blue-600 dark:text-blue-400">Đang học</span>
                            ) : (
                              <span className="text-slate-400">Chưa học</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Schedule Table Preview */}
            {activeTab === 'schedule' && (
              <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {parsedData.scheduleItems.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Không tìm thấy lịch học nào trong văn bản đã dán.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 font-mono text-[10px] uppercase sticky top-0">
                      <tr>
                        <th className="p-2.5">Mã Lớp</th>
                        <th className="p-2.5">Tên Học Phần</th>
                        <th className="p-2.5">Thứ & Tiết</th>
                        <th className="p-2.5">Phòng</th>
                        <th className="p-2.5">Tuần</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {parsedData.scheduleItems.map((s, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white">{s.classCode}</td>
                          <td className="p-2.5 text-slate-900 dark:text-white truncate max-w-xs">{s.courseName}</td>
                          <td className="p-2.5 font-mono text-red-600 dark:text-red-400">
                            Thứ {s.dayOfWeek} (Tiết {s.startPeriod}-{s.endPeriod})
                          </td>
                          <td className="p-2.5 font-mono text-slate-600 dark:text-slate-300">{s.room}</td>
                          <td className="p-2.5 font-mono text-slate-400 text-[11px]">{s.weeks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Đóng
          </button>

          <button
            type="button"
            disabled={!parsedData || (parsedData.courseReport.courses.length === 0 && parsedData.scheduleItems.length === 0)}
            onClick={handleApplyImport}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-red-900/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Xác Nhận Nạp Vào Hệ Thống</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

