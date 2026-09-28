import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import {
  parseCourseCatalogText,
  CourseCatalogItem,
  CourseCatalogReport,
  generateCourseListsBookmarklet,
  getCourseListsConsoleScript
} from '../../engines/courseCatalogParser';
import { BookOpen, Sparkles, CheckCircle2, GitMerge, Copy, ExternalLink, HelpCircle, ShieldAlert } from 'lucide-react';

interface CourseCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMergeCatalog: (items: CourseCatalogItem[]) => void;
}

export const CourseCatalogModal: React.FC<CourseCatalogModalProps> = ({
  isOpen,
  onClose,
  onMergeCatalog
}) => {
  const [inputText, setInputText] = useState('');
  const [report, setReport] = useState<CourseCatalogReport | null>(null);
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const [copiedScript, setCopiedScript] = useState(false);

  const handleParse = () => {
    if (!inputText.trim()) return;
    const res = parseCourseCatalogText(inputText);
    setReport(res);
    setSelectedCodes(new Set(res.items.map(item => item.code)));
  };

  const handleToggleItem = (code: string) => {
    const next = new Set(selectedCodes);
    if (next.has(code)) {
      next.delete(code);
    } else {
      next.add(code);
    }
    setSelectedCodes(next);
  };

  const handleSelectAll = () => {
    if (!report) return;
    setSelectedCodes(new Set(report.items.map(item => item.code)));
  };

  const handleDeselectAll = () => {
    setSelectedCodes(new Set());
  };

  const handleApply = () => {
    if (!report || selectedCodes.size === 0) return;
    const toMerge = report.items.filter(item => selectedCodes.has(item.code));
    onMergeCatalog(toMerge);
    alert(`✅ Đã ghép thành công thông tin HP Điều kiện & Trọng số cho ${toMerge.length} học phần!`);
    onClose();
  };

  // Mẫu dữ liệu chuẩn khớp 100% ảnh chụp trang CourseLists.aspx của người dùng
  const handleLoadSample = () => {
    const sample = `Mã học phần\tTên học phần\tThời lượng\tSố tín chỉ\tTC học phí\tViện quản lý\tHP điều kiện\tTên tiếng anh\tTrọng số
ET2050\tLý thuyết mạch\t3(3-0-1-6)\t3\t4.5\tTDDT\t(MI1111,MI1121,MI1131,PH1122)/(MI1111,MI1121,MI1131,PH1121)/(MI1111,MI1121,MI1131,PH1120)\tCircuit Theory\t0.7
ET2050E\tLý thuyết mạch\t3(3-0-1-6)\t3\t4.5\tTDDT\t(MI1111,MI1121,MI1131,PH1122)/(MI1111,MI1121,MI1131,PH1121)\tCircuit Theory\t0.6
ET2050Q\tLý thuyết mạch\t3(3-0-1-6)\t3\t4.5\tTDDT\t(MI1111,MI1121,MI1131,PH1120)\tElectrical Circuit Theory\t0.7
ET3250\tThông tin số\t3(3-0-1-6)\t3\t4.5\tTDDT\t(ET2000,MI2020)\tDigital Communications\t0.7
ET3241\tĐiện tử tương tự II\t2(2-0-1-4)\t2\t3.0\tTDDT\t(ET2010)\tAnalog Electronics II\t0.7
ET3300\tKỹ thuật vi xử lý\t3(3-0-1-6)\t3\t4.5\tTDDT\t(ET2020)\tMicroprocessor Engineering\t0.7`;
    setInputText(sample);
  };

  const handleCopyConsoleScript = () => {
    navigator.clipboard.writeText(getCourseListsConsoleScript());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cào & Ghép Học Phần Tiên Quyết (CourseLists.aspx)"
      subtitle="Bóc tách chính xác HP điều kiện, TC học phí, thời lượng và trọng số từ cổng đào tạo SIS"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Source Link & Guidance Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-600/15 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Nguồn chính thức: ctt-sis.hust.edu.vn/pub/CourseLists.aspx
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Hệ thống tự động phân tích điều kiện phức tạp (AND / OR) và trọng số CK/QT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="https://ctt-sis.hust.edu.vn/pub/CourseLists.aspx"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
            >
              <span>Mở trang SIS</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={handleCopyConsoleScript}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-100 dark:hover:bg-blue-600/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 font-medium transition-colors"
              title="Sao chép lệnh F12 để chạy trực tiếp trên trang CourseLists"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedScript ? 'Đã sao chép F12!' : 'Lệnh F12 Script'}</span>
            </button>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Dán nội dung bảng từ CourseLists.aspx (hoặc chuỗi JSON):</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs font-semibold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1 bg-red-50 dark:bg-red-600/10 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mẫu CourseLists (Lý thuyết mạch ET2050)</span>
              </button>
            </div>
          </div>

          {/* Quick Search / Code Input */}
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Tra cứu nhanh:</span>
            {['ET2050', 'ET2000', 'ET2010', 'ET3250', 'ET3300', 'ET3241'].map(quickCode => (
              <button
                key={quickCode}
                type="button"
                onClick={() => {
                  setInputText(quickCode);
                  const res = parseCourseCatalogText(quickCode);
                  setReport(res);
                  setSelectedCodes(new Set(res.items.map(i => i.code)));
                }}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-600/30 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-300 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                +{quickCode}
              </button>
            ))}
          </div>

          <textarea
            rows={5}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Dán toàn bộ bảng từ trang https://ctt-sis.hust.edu.vn/pub/CourseLists.aspx vào đây (hoặc chỉ cần gõ mã môn như ET2050)...
Ví dụ: ET2050 [Tab] Lý thuyết mạch [Tab] 3(3-0-1-6) [Tab] 3 [Tab] 4.5 [Tab] TDDT [Tab] (MI1111,MI1121,MI1131,PH1122)/(MI1111,MI1121,MI1131,PH1121) [Tab] Circuit Theory [Tab] 0.7"
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl p-3 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setInputText('');
                setReport(null);
                setSelectedCodes(new Set());
              }}
              disabled={!inputText}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors"
            >
              Xóa ô nhập
            </button>
            <button
              onClick={handleParse}
              disabled={!inputText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-red-950/20 transition-colors"
            >
              <span>Phân Tích Dữ Liệu</span>
            </button>
          </div>
        </div>

        {/* Results Preview Table */}
        {report && (
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-slate-900 dark:text-white">
                  Đã nhận diện: <strong className="text-emerald-600 dark:text-emerald-400">{report.items.length}</strong> học phần
                  (Đã chọn ghép: <strong className="text-red-600 dark:text-amber-400">{selectedCodes.size}</strong>)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700"
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[300px] rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 sticky top-0 text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-slate-800 z-10">
                  <tr>
                    <th className="p-2.5 text-center w-8">Chọn</th>
                    <th className="p-2.5">Mã HP</th>
                    <th className="p-2.5">Tên Học Phần</th>
                    <th className="p-2.5 text-center">TC / Học Phí</th>
                    <th className="p-2.5 text-center">Trọng số CK</th>
                    <th className="p-2.5">HP Điều Kiện (Tiên quyết / Học trước)</th>
                    <th className="p-2.5">Tên Tiếng Anh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                  {report.items.map(item => {
                    const isSelected = selectedCodes.has(item.code);
                    return (
                      <tr
                        key={item.code}
                        onClick={() => handleToggleItem(item.code)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-900/40 opacity-60'
                        }`}
                      >
                        <td className="p-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-red-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                          />
                        </td>
                        <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white text-xs whitespace-nowrap">
                          {item.code}
                        </td>
                        <td className="p-2.5">
                          <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                          {item.duration && (
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">{item.duration}</span>
                          )}
                        </td>
                        <td className="p-2.5 text-center font-mono whitespace-nowrap">
                          <span className="text-slate-900 dark:text-white font-bold">{item.credits} TC</span>
                          {item.tuitionCredits && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 block">({item.tuitionCredits} TC học phí)</span>
                          )}
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          CK: {item.weightCk}
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-normal">QT: {item.weightQt}</span>
                        </td>
                        <td className="p-2.5 max-w-xs">
                          {item.conditionString ? (
                            <div className="space-y-1">
                              <span className="inline-block px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 font-mono text-[11px] font-bold break-all">
                                {item.conditionString}
                              </span>
                              {item.distinctPrerequisites.length > 0 && (
                                <div className="flex flex-wrap gap-1 text-[10px]">
                                  <span className="text-slate-500 dark:text-slate-400">Gồm:</span>
                                  {item.distinctPrerequisites.map(p => (
                                    <span key={p} className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">Không có HP điều kiện</span>
                          )}
                        </td>
                        <td className="p-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                          {item.englishName || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Merge Action Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Dữ liệu sẽ được cập nhật trực tiếp vào cây tiên quyết và giao diện đăng ký học phần.
              </span>
              <button
                type="button"
                onClick={handleApply}
                disabled={selectedCodes.size === 0}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-red-950/20 transition-colors"
              >
                <GitMerge className="w-4 h-4" />
                <span>Ghép với Danh Mục Học Phần ({selectedCodes.size})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
