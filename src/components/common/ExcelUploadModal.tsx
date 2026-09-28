import React, { useState, useRef } from 'react';
import { Modal } from './Modal';
import { Course } from '../../types/course';
import { ScheduleItem } from '../../types/schedule';
import {
  parseCoursesFromExcel,
  parseScheduleFromExcel,
  downloadCoursesExcelTemplate,
  downloadScheduleExcelTemplate,
  ExcelImportReport
} from '../../engines/excelEngine';
import { FileSpreadsheet, Download, Upload, CheckCircle2, AlertCircle, FileUp, Sparkles } from 'lucide-react';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'courses' | 'schedule';
  onImportCourses?: (courses: Course[], overwrite: boolean) => void;
  onImportSchedule?: (schedule: ScheduleItem[], overwrite: boolean) => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  mode,
  onImportCourses,
  onImportSchedule
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ExcelImportReport | null>(null);
  const [parsedCourses, setParsedCourses] = useState<Course[]>([]);
  const [parsedSchedule, setParsedSchedule] = useState<ScheduleItem[]>([]);
  const [overwrite, setOverwrite] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsLoading(true);

    try {
      if (mode === 'courses') {
        const result = await parseCoursesFromExcel(selectedFile);
        setParsedCourses(result.courses);
        setReport(result.report);
      } else {
        const result = await parseScheduleFromExcel(selectedFile);
        setParsedSchedule(result.schedule);
        setReport(result.report);
      }
    } catch (err: any) {
      alert('Không thể đọc file Excel: ' + (err.message || 'Định dạng file không hợp lệ'));
      setFile(null);
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (mode === 'courses' && onImportCourses) {
      if (parsedCourses.length === 0) return;
      onImportCourses(parsedCourses, overwrite);
      alert(`✅ Đã nhập thành công ${parsedCourses.length} học phần từ file Excel!`);
      handleClose();
    } else if (mode === 'schedule' && onImportSchedule) {
      if (parsedSchedule.length === 0) return;
      onImportSchedule(parsedSchedule, overwrite);
      alert(`✅ Đã nhập thành công ${parsedSchedule.length} lớp học phần vào Thời khóa biểu!`);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setReport(null);
    setParsedCourses([]);
    setParsedSchedule([]);
    setOverwrite(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  const isCourseMode = mode === 'courses';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isCourseMode ? 'Cấu Hình Danh Mục Học Phần Bằng Excel' : 'Cấu Hình Thời Khóa Biểu Bằng Excel'}
      subtitle={
        isCourseMode
          ? 'Tự thiết lập danh sách môn, điều kiện tiên quyết và điểm số bằng file Excel cá nhân (.xlsx, .csv)'
          : 'Nhập lịch học, tiết học, phòng học và chuỗi tuần học trực tiếp từ bảng tính Excel'
      }
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Banner with Template Download */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-600/15 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Chưa có file mẫu chuẩn? Tải ngay file mẫu Excel HUST
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                File mẫu đã điền sẵn cấu trúc cột và dữ liệu minh họa chuẩn quy chế
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={isCourseMode ? downloadCoursesExcelTemplate : downloadScheduleExcelTemplate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex-shrink-0 shadow-md shadow-emerald-950/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải File Mẫu Excel (.xlsx)</span>
          </button>
        </div>

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            file
              ? 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/10'
              : 'border-slate-300 dark:border-slate-700 hover:border-red-500/60 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-600/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 mb-3">
            <FileUp className="w-6 h-6" />
          </div>

          {file ? (
            <div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm block">
                📄 {file.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                {(file.size / 1024).toFixed(1)} KB • Nhấp để chọn file khác
              </span>
            </div>
          ) : (
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm block">
                Nhấp vào đây hoặc kéo thả file Excel (.xlsx, .xls, .csv)
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                Hệ thống tự động đọc tiêu đề các cột tiếng Việt có dấu hoặc không dấu
              </span>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-center text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang đọc và phân tích cấu trúc bảng tính...</span>
          </div>
        )}

        {/* Preview Results Table */}
        {report && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-slate-900 dark:text-white">
                  Đã nhận diện thành công: <strong className="text-emerald-600 dark:text-emerald-400">{report.successCount}</strong> {isCourseMode ? 'học phần' : 'lớp TKB'}
                </span>
              </div>

              {/* Mode overwrite toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                <input
                  type="checkbox"
                  checked={overwrite}
                  onChange={e => setOverwrite(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  {isCourseMode ? 'Thay thế toàn bộ danh mục cũ' : 'Xóa trắng TKB cũ trước khi thêm'}
                </span>
              </label>
            </div>

            {/* Courses Preview */}
            {isCourseMode && parsedCourses.length > 0 && (
              <div className="overflow-x-auto max-h-[240px] rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-900 sticky top-0 text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5">Mã HP</th>
                      <th className="p-2.5">Tên Học Phần</th>
                      <th className="p-2.5 text-center">TC</th>
                      <th className="p-2.5 text-center">Năm / Kỳ</th>
                      <th className="p-2.5">HP Điều Kiện</th>
                      <th className="p-2.5 text-center">Trọng số CK/QT</th>
                      <th className="p-2.5 text-center">Điểm số</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                    {parsedCourses.slice(0, 50).map(c => (
                      <tr key={c.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="p-2 font-mono font-bold text-slate-900 dark:text-white">{c.code}</td>
                        <td className="p-2 text-slate-800 dark:text-slate-200">{c.name}</td>
                        <td className="p-2 text-center font-mono">{c.credits}</td>
                        <td className="p-2 text-center font-mono text-amber-600 dark:text-amber-400">K{c.term}</td>
                        <td className="p-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {c.conditionString || 'Không'}
                        </td>
                        <td className="p-2 text-center font-mono text-blue-600 dark:text-blue-400">
                          {c.weightCk} / {c.weightQt}
                        </td>
                        <td className="p-2 text-center font-mono">
                          {c.gradeLetter ? (
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {c.gradeLetter} ({c.gradeScale4})
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Schedule Preview */}
            {!isCourseMode && parsedSchedule.length > 0 && (
              <div className="overflow-x-auto max-h-[240px] rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-900 sticky top-0 text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5">Mã Lớp</th>
                      <th className="p-2.5">Mã HP</th>
                      <th className="p-2.5">Tên Học Phần</th>
                      <th className="p-2.5 text-center">Thứ</th>
                      <th className="p-2.5 text-center">Tiết</th>
                      <th className="p-2.5">Phòng</th>
                      <th className="p-2.5">Tuần Học</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                    {parsedSchedule.slice(0, 50).map((s, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="p-2 font-mono font-bold text-slate-900 dark:text-white">{s.classCode}</td>
                        <td className="p-2 font-mono text-slate-700 dark:text-slate-300">{s.courseCode}</td>
                        <td className="p-2 text-slate-800 dark:text-slate-200">{s.courseName}</td>
                        <td className="p-2 text-center font-mono text-red-600 dark:text-red-400">
                          {s.dayOfWeek === 8 ? 'CN' : `T${s.dayOfWeek}`}
                        </td>
                        <td className="p-2 text-center font-mono">
                          {s.startPeriod} - {s.endPeriod}
                        </td>
                        <td className="p-2 font-mono text-amber-700 dark:text-amber-300">{s.room}</td>
                        <td className="p-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">{s.weeks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Action Submit */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {overwrite
                  ? '⚠️ Chế độ ghi đè: Dữ liệu cũ sẽ được thay thế hoàn toàn bằng bảng tính mới.'
                  : '✓ Chế độ ghép: Hệ thống sẽ bổ sung các mục mới vào dữ liệu hiện có.'}
              </span>
              <button
                type="button"
                onClick={handleApply}
                disabled={isCourseMode ? parsedCourses.length === 0 : parsedSchedule.length === 0}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-red-900/20 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>
                  Nhập Vào Hệ Thống (
                  {isCourseMode ? parsedCourses.length : parsedSchedule.length})
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
