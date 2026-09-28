import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import {
  parseCourseCatalogText,
  CourseCatalogItem,
  CourseCatalogReport,
  KNOWN_HUST_COURSE_CATALOG,
  getCourseListsConsoleScript
} from '../../engines/courseCatalogParser';
import { BUILT_IN_CURRICULA, AVAILABLE_MAJORS, HUST_PREREQUISITE_MAP } from '../../data/curricula';
import { Course } from '../../types/course';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Zap, 
  FileText, 
  Terminal, 
  Copy, 
  ExternalLink, 
  Layers, 
  Check, 
  Plus, 
  Filter
} from 'lucide-react';

interface CourseCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMergeCatalog: (items: CourseCatalogItem[]) => void;
  initialMajorCode?: string;
}

export const CourseCatalogModal: React.FC<CourseCatalogModalProps> = ({
  isOpen,
  onClose,
  onMergeCatalog,
  initialMajorCode = 'IT1'
}) => {
  type Mode = 'preset' | 'search' | 'paste' | 'f12';
  const [activeMode, setActiveMode] = useState<Mode>('preset');

  // Tab 1: Preset Major Sync
  const [selectedMajor, setSelectedMajor] = useState<string>(initialMajorCode || 'IT1');
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  // Tab 2: Smart Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilterTag, setSearchFilterTag] = useState<'all' | 'MI' | 'PH' | 'IT' | 'ET' | 'EE' | 'SSH'>('all');
  const [selectedSearchCodes, setSelectedSearchCodes] = useState<Set<string>>(new Set());

  // Tab 3: Text Paste
  const [inputText, setInputText] = useState('');
  const [pasteReport, setPasteReport] = useState<CourseCatalogReport | null>(null);
  const [selectedPasteCodes, setSelectedPasteCodes] = useState<Set<string>>(new Set());

  // Tab 4: F12 Console
  const [copiedScript, setCopiedScript] = useState(false);

  // Danh mục toàn bộ các môn học chuẩn HUST kết hợp từ tất cả CTĐT
  const allMasterCourses = useMemo(() => {
    const map = new Map<string, CourseCatalogItem>();

    // 1. Nạp từ các CTĐT 9 ngành
    Object.values(BUILT_IN_CURRICULA).forEach(curriculum => {
      curriculum.courses.forEach(c => {
        if (!map.has(c.code)) {
          const prereqs = c.prerequisites || HUST_PREREQUISITE_MAP[c.code] || [];
          map.set(c.code, {
            code: c.code,
            name: c.name,
            credits: c.credits,
            tuitionCredits: Math.round(c.credits * 1.5 * 10) / 10,
            department: c.code.startsWith('IT') ? 'CNTT&TT' : (c.code.startsWith('ET') ? 'Điện tử - VT' : (c.code.startsWith('EE') ? 'Điện - Tự động hóa' : (c.code.startsWith('MI') ? 'Toán ứng dụng' : 'Bách Khoa'))),
            conditionString: prereqs.length > 0 ? `(${prereqs.join(',')})` : 'Không',
            prerequisiteOptions: prereqs.length > 0 ? [prereqs] : [],
            distinctPrerequisites: prereqs,
            englishName: '',
            weightCk: c.weightCk ?? 0.7,
            weightQt: c.weightQt ?? 0.3
          });
        }
      });
    });

    // 2. Nạp thêm từ KNOWN_HUST_COURSE_CATALOG
    Object.values(KNOWN_HUST_COURSE_CATALOG).forEach(item => {
      if (item.code && !map.has(item.code)) {
        map.set(item.code, {
          code: item.code,
          name: item.name || '',
          duration: item.duration,
          credits: item.credits || 3,
          tuitionCredits: item.tuitionCredits || 4.5,
          department: item.department || 'HUST',
          conditionString: item.conditionString || 'Không',
          prerequisiteOptions: item.prerequisiteOptions || [],
          distinctPrerequisites: item.distinctPrerequisites || [],
          englishName: item.englishName,
          weightCk: item.weightCk || 0.7,
          weightQt: item.weightQt || 0.3
        });
      }
    });

    return Array.from(map.values());
  }, []);

  // Lọc học phần cho Tab Tra Cứu
  const filteredSearchCourses = useMemo(() => {
    return allMasterCourses.filter(course => {
      if (searchFilterTag !== 'all') {
        if (!course.code.startsWith(searchFilterTag)) return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        course.code.toLowerCase().includes(q) ||
        course.name.toLowerCase().includes(q) ||
        (course.department && course.department.toLowerCase().includes(q))
      );
    });
  }, [allMasterCourses, searchQuery, searchFilterTag]);

  // Xử lý nạp 1-Chạm theo ngành được chọn
  const handleApplyPresetMajor = () => {
    const targetCurriculum = BUILT_IN_CURRICULA[selectedMajor] || BUILT_IN_CURRICULA['IT1'];
    if (!targetCurriculum) return;

    const items: CourseCatalogItem[] = targetCurriculum.courses.map(c => {
      const prereqs = c.prerequisites || HUST_PREREQUISITE_MAP[c.code] || [];
      return {
        code: c.code,
        name: c.name,
        credits: c.credits,
        tuitionCredits: Math.round(c.credits * 1.5 * 10) / 10,
        department: c.code.startsWith('IT') ? 'CNTT&TT' : (c.code.startsWith('ET') ? 'Điện tử - VT' : (c.code.startsWith('EE') ? 'Điện - Tự động hóa' : (c.code.startsWith('MI') ? 'Toán' : 'HUST'))),
        conditionString: prereqs.length > 0 ? `(${prereqs.join(',')})` : 'Không',
        prerequisiteOptions: prereqs.length > 0 ? [prereqs] : [],
        distinctPrerequisites: prereqs,
        englishName: '',
        weightCk: c.weightCk ?? 0.7,
        weightQt: c.weightQt ?? 0.3
      };
    });

    onMergeCatalog(items);
    setSyncedSuccess(true);
    setTimeout(() => {
      setSyncedSuccess(false);
      onClose();
    }, 1200);
  };

  // Xử lý thêm các môn tra cứu được
  const handleApplySearchSelection = () => {
    if (selectedSearchCodes.size === 0) return;
    const items = allMasterCourses.filter(c => selectedSearchCodes.has(c.code));
    onMergeCatalog(items);
    onClose();
  };

  // Xử lý dán text tự do
  const handleParsePaste = () => {
    if (!inputText.trim()) return;
    const res = parseCourseCatalogText(inputText);
    setPasteReport(res);
    setSelectedPasteCodes(new Set(res.items.map(i => i.code)));
  };

  const handleApplyPaste = () => {
    if (!pasteReport || selectedPasteCodes.size === 0) return;
    const toMerge = pasteReport.items.filter(item => selectedPasteCodes.has(item.code));
    onMergeCatalog(toMerge);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kho Danh Mục Học Phần & Điều Kiện Tiên Quyết"
      subtitle="Đồng bộ nhanh môn tiên quyết, số tín chỉ và trọng số thi không cần thao tác F12 phức tạp"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Navigation Tabs (Mobile-Friendly Pill Bar) */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto select-none">
          <button
            type="button"
            onClick={() => setActiveMode('preset')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all flex-shrink-0 ${
              activeMode === 'preset'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/20 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1-Chạm Đồng Bộ Ngành</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('search')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all flex-shrink-0 ${
              activeMode === 'search'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/20 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Tra Cứu & Thêm Môn ({allMasterCourses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('paste')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all flex-shrink-0 ${
              activeMode === 'paste'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/20 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dán Tự Do</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('f12')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all flex-shrink-0 ${
              activeMode === 'f12'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/20 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>F12 Cào SIS (PC)</span>
          </button>
        </div>

        {/* =========================================================
            TAB 1: 1-CHẠM ĐỒNG BỘ NGÀNH (MOBILE HERO)
           ========================================================= */}
        {activeMode === 'preset' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-transparent border border-red-200/80 dark:border-red-900/40 text-xs">
              <span className="font-bold text-red-600 dark:text-red-400 block mb-0.5">
                ⚡ Tự động nạp toàn bộ học phần & điều kiện tiên quyết cho điện thoại
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Không cần mở F12 hay cào dữ liệu từ trang SIS. Chỉ cần chọn ngành học của bạn dưới đây, hệ thống sẽ tự động ghép toàn bộ cây đào tạo với đầy đủ mã môn, số tín chỉ, học phần tiên quyết và trọng số thi.
              </p>
            </div>

            {/* Major Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {AVAILABLE_MAJORS.map(major => {
                const isSelected = selectedMajor === major.code;
                const curriculum = BUILT_IN_CURRICULA[major.code];
                const count = curriculum ? curriculum.courses.length : 0;
                const totalCredits = curriculum ? curriculum.courses.reduce((s, c) => s + c.credits, 0) : 0;

                return (
                  <button
                    key={major.code}
                    type="button"
                    onClick={() => setSelectedMajor(major.code)}
                    className={`p-3.5 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-500 dark:border-red-700 shadow-md shadow-red-950/15'
                        : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-black ${
                        isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {major.code}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-red-600 dark:text-red-400" />}
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block line-clamp-1">
                      {major.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                      {major.faculty} • <strong className="text-slate-700 dark:text-slate-300">{count} môn</strong> ({totalCredits} TC)
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Action Sync Button */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Đang chọn: {AVAILABLE_MAJORS.find(m => m.code === selectedMajor)?.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Sẽ ghép toàn bộ {BUILT_IN_CURRICULA[selectedMajor]?.courses.length || 0} học phần kèm liên kết tiên quyết
                </span>
              </div>
              <button
                type="button"
                onClick={handleApplyPresetMajor}
                disabled={syncedSuccess}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 disabled:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-red-950/20 transition-all"
              >
                {syncedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                    <span>Đã Đồng Bộ Thành Công!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Đồng Bộ Ngay Vào Danh Mục (1 Chạm)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: TRA CỨU & THÊM MÔN NHANH (SMART SEARCH)
           ========================================================= */}
        {activeMode === 'search' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Search Input & Filter Tags */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Gõ mã hoặc tên môn (VD: ET2050, MI1121, PH1120, Lý thuyết mạch)..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Department Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span className="text-slate-400 text-[10px] uppercase font-bold mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Lọc:
                </span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'MI', label: 'Toán (MI)' },
                  { id: 'PH', label: 'Vật lý (PH)' },
                  { id: 'IT', label: 'CNTT (IT)' },
                  { id: 'ET', label: 'Điện tử (ET)' },
                  { id: 'EE', label: 'Điện (EE)' },
                  { id: 'SSH', label: 'Chính trị (SSH)' }
                ].map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSearchFilterTag(tag.id as any)}
                    className={`px-2.5 py-1 rounded-full font-semibold transition-colors flex-shrink-0 ${
                      searchFilterTag === tag.id
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results List */}
            <div className="max-h-[320px] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900/60">
              {filteredSearchCourses.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Không tìm thấy học phần nào khớp với từ khóa "{searchQuery}"
                </div>
              ) : (
                filteredSearchCourses.slice(0, 50).map(course => {
                  const isChecked = selectedSearchCodes.has(course.code);
                  return (
                    <div
                      key={course.code}
                      onClick={() => {
                        const next = new Set(selectedSearchCodes);
                        if (next.has(course.code)) next.delete(course.code);
                        else next.add(course.code);
                        setSelectedSearchCodes(next);
                      }}
                      className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-red-50/80 dark:bg-red-950/30'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                              {course.code}
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {course.name}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span>{course.credits} TC</span>
                            <span>•</span>
                            <span>Trọng số CK: <strong className="text-red-600 dark:text-red-400">{course.weightCk}</strong></span>
                            <span>•</span>
                            <span className="text-amber-600 dark:text-amber-400 font-semibold truncate max-w-[200px]">
                              {course.distinctPrerequisites.length > 0 ? `Tiên quyết: ${course.distinctPrerequisites.join(', ')}` : 'Không có tiên quyết'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onMergeCatalog([course]);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-600 hover:text-white text-red-700 dark:text-red-300 font-bold text-[11px] border border-red-200 dark:border-red-800 transition-all flex-shrink-0"
                      >
                        + Ghép ngay
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Multi-Select Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-medium">
                Đã chọn: <strong className="text-red-600 dark:text-red-400">{selectedSearchCodes.size}</strong> học phần
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSearchCodes(new Set(filteredSearchCourses.map(c => c.code)))}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={handleApplySearchSelection}
                  disabled={selectedSearchCodes.size === 0}
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-red-950/20 transition-all"
                >
                  Ghép Các Môn Đã Chọn
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: DÁN TỰ DO TỪ BẢNG EXCEL HOẶC CHAT (SMART PASTE)
           ========================================================= */}
        {activeMode === 'paste' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Dán bảng dữ liệu copy từ web trường hoặc bảng tính Excel:
              </span>
              <button
                type="button"
                onClick={() => {
                  const sample = `ET2050\tLý thuyết mạch\t3(3-0-1-6)\t3\t4.5\tTDDT\t(MI1111,MI1121,MI1131,PH1122)/(MI1111,MI1121,MI1131,PH1121)\tCircuit Theory\t0.7
ET3250\tThông tin số\t3(3-0-1-6)\t3\t4.5\tTDDT\t(ET2000,MI2020)\tDigital Communications\t0.7
ET3300\tKỹ thuật vi xử lý\t3(3-0-1-6)\t3\t4.5\tTDDT\t(ET2020)\tMicroprocessor Engineering\t0.7`;
                  setInputText(sample);
                }}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nạp văn bản mẫu</span>
              </button>
            </div>

            <textarea
              rows={5}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Dán các dòng học phần vào đây... Hệ thống tự động nhận diện mã môn, số tín chỉ, môn tiên quyết và trọng số."
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleParsePaste}
                disabled={!inputText.trim()}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold"
              >
                Phân Tích Dữ Liệu
              </button>
            </div>

            {/* Paste Report Preview */}
            {pasteReport && (
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Nhận diện: <strong className="text-emerald-600">{pasteReport.items.length}</strong> học phần
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyPaste}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold"
                  >
                    Ghép Vào Danh Mục
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 4: HƯỚNG DẪN F12 & BOOKMARKLET (DÀNH CHO MÁY TÍNH)
           ========================================================= */}
        {activeMode === 'f12' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <span className="font-bold text-blue-700 dark:text-blue-300 block">
                💻 Hướng Dẫn Cào Trực Tiếp Bằng Trình Duyệt Máy Tính (Chrome / Edge / Firefox)
              </span>
              <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                <li>Mở trang chính thức: <strong className="font-mono text-red-600">ctt-sis.hust.edu.vn/pub/CourseLists.aspx</strong></li>
                <li>Nhấn phím <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">F12</kbd> (hoặc Ctrl+Shift+I) và chọn tab <strong>Console</strong>.</li>
                <li>Dán đoạn mã kịch bản tự động bên dưới rồi nhấn <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Enter</kbd>.</li>
                <li>Toàn bộ dữ liệu bảng sẽ được tự động sao chép vào bộ nhớ tạm (Clipboard), sau đó quay lại ứng dụng để dán.</li>
              </ol>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Mã F12 Console Script tự động:
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(getCourseListsConsoleScript());
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-950/20"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedScript ? 'Đã Sao Chép!' : 'Sao Chép Mã F12'}</span>
              </button>
            </div>

            <pre className="p-3 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[10px] overflow-x-auto max-h-[160px] border border-slate-800">
              {getCourseListsConsoleScript()}
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
};
