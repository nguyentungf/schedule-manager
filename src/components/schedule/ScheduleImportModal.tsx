import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ScheduleItem } from '../../types/schedule';
import { parseSisScheduleText, getPeriodsTimeString } from '../../engines/scheduleEngine';
import { Upload, CheckCircle2, Sparkles } from 'lucide-react';

interface ScheduleImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSchedule: (items: ScheduleItem[]) => void;
}

export const ScheduleImportModal: React.FC<ScheduleImportModalProps> = ({
  isOpen,
  onClose,
  onImportSchedule
}) => {
  const [pastedText, setPastedText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<ScheduleItem[]>([]);
  const [isParsed, setIsParsed] = useState(false);

  const handleParse = () => {
    if (!pastedText.trim()) return;
    const items = parseSisScheduleText(pastedText);
    setParsedPreview(items);
    setIsParsed(true);
  };

  const handleApply = () => {
    if (parsedPreview.length === 0) return;
    onImportSchedule(parsedPreview);
    alert(`✅ Đã đồng bộ thành công ${parsedPreview.length} lớp học vào Thời khóa biểu!`);
    onClose();
  };

  const handleLoadSample = () => {
    const sample = `145620\tIT4060\tLập trình Web & Ứng dụng\tThứ 2\t1-3\tD9-401\t1-18
145621\tIT4409\tTrí tuệ nhân tạo\tThứ 3\t7-9\tB1-302\t1-18
145622\tIT3120\tPhân tích thiết kế hệ thống\tThứ 4\t3-5\tD3-501\t1-18
145623\tIT4015\tNhập môn An toàn thông tin\tThứ 5\t7-9\tD5-301\t1-18
145624\tIT4060\tThực hành Web Lab\tThứ 6\t1-4\tB1-602\t2-16(chẵn)`;
    setPastedText(sample);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nhập Thời Khóa Biểu Tự Động Từ SIS HUST"
      subtitle="Bóc tách tự động mã lớp, mã HP, thứ, tiết, phòng học và tuần học từ sis.hust.edu.vn"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Instructions */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1.5">
          <p className="font-semibold text-slate-900 dark:text-white">Cách thực hiện:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-500 dark:text-slate-400">
            <li>Đăng nhập <span className="font-mono text-red-600 dark:text-red-400">sis.hust.edu.vn</span>.</li>
            <li>Vào mục <strong>Đăng ký học tập</strong> $\rightarrow$ <strong>Thời khóa biểu sinh viên</strong>.</li>
            <li>Chọn toàn bộ bảng TKB (<kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-mono text-[11px]">Ctrl + A</kbd> $\rightarrow$ <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-mono text-[11px]">Ctrl + C</kbd>).</li>
            <li>Dán vào khung bên dưới và bấm nút <strong>Phân Tích TKB</strong>.</li>
          </ol>
        </div>

        {/* Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Dán nội dung bảng TKB vào đây:
            </label>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dán TKB mẫu</span>
            </button>
          </div>
          <textarea
            rows={5}
            value={pastedText}
            onChange={e => {
              setPastedText(e.target.value);
              setIsParsed(false);
            }}
            placeholder="Dán toàn bộ văn bản hoặc bảng TKB từ SIS vào đây..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleParse}
            disabled={!pastedText.trim()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 text-white shadow transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Phân Tích TKB</span>
          </button>
        </div>

        {/* Preview Table */}
        {isParsed && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Nhận diện thành công {parsedPreview.length} lớp học phần!
              </span>
              <button
                type="button"
                onClick={handleApply}
                disabled={parsedPreview.length === 0}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 shadow transition-colors"
              >
                Lưu Vào Thời Khóa Biểu
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase sticky top-0">
                  <tr>
                    <th className="p-2.5">Mã Lớp</th>
                    <th className="p-2.5">Mã HP</th>
                    <th className="p-2.5">Tên Học Phần</th>
                    <th className="p-2.5">Thứ</th>
                    <th className="p-2.5">Tiết</th>
                    <th className="p-2.5">Phòng</th>
                    <th className="p-2.5">Tuần</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium font-mono">
                  {parsedPreview.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-slate-900 dark:text-white">{item.classCode}</td>
                      <td className="p-2.5 text-red-600 dark:text-red-400">{item.courseCode}</td>
                      <td className="p-2.5 font-sans text-slate-700 dark:text-slate-200 truncate max-w-xs">{item.courseName}</td>
                      <td className="p-2.5 text-amber-600 dark:text-amber-300">T{item.dayOfWeek}</td>
                      <td className="p-2.5 text-slate-700 dark:text-slate-300">{item.startPeriod}-{item.endPeriod}</td>
                      <td className="p-2.5 text-emerald-600 dark:text-emerald-400">{item.room}</td>
                      <td className="p-2.5 text-slate-500 dark:text-slate-400">{item.weeks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
