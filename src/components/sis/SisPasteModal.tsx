import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { parseSisText, ParsedCourseResult, ParseReport, ParsedStudentInfo } from '../../engines/sisParser';
import { Upload, CheckCircle2, Sparkles, UserCheck, Filter, GitFork, ShieldAlert, Award } from 'lucide-react';

interface SisPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMergeCourses: (courses: ParsedCourseResult[], studentInfo?: ParsedStudentInfo) => void;
}

export const SisPasteModal: React.FC<SisPasteModalProps> = ({
  isOpen,
  onClose,
  onMergeCourses
}) => {
  const [pastedText, setPastedText] = useState('');
  const [report, setReport] = useState<ParseReport | null>(null);
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const [syncStudentInfo, setSyncStudentInfo] = useState(true);

  // Bộ lọc thông minh theo yêu cầu người dùng
  const [filterExcludePE, setFilterExcludePE] = useState(true); // Bỏ qua Thể chất (PE)
  const [filterExcludeGraduate, setFilterExcludeGraduate] = useState(true); // Bỏ qua Kỹ sư & Thạc sĩ
  const [filterSupportOnlyLearned, setFilterSupportOnlyLearned] = useState(true); // Khối Bổ trợ: chỉ lấy môn đã học
  const [filterModuleOnlyLearned, setFilterModuleOnlyLearned] = useState(true); // Khối Module chuyên ngành (đầu 4): chỉ lấy môn đã học
  const [filterExcludeEnglish, setFilterExcludeEnglish] = useState(false); // Bỏ qua Tiếng Anh (FL*) nếu đã có chứng chỉ

  const applyFiltersToCourses = (
    courses: ParsedCourseResult[],
    excludePE: boolean,
    excludeGrad: boolean,
    supportOnlyLearned: boolean,
    moduleOnlyLearned: boolean,
    excludeEng: boolean
  ): Set<string> => {
    const selected = new Set<string>();
    courses.forEach(c => {
      // 1. Loại bỏ Thể chất nếu bật lọc
      if (excludePE && c.isPhysicalEducation) return;
      // 2. Loại bỏ Kỹ sư & Thạc sĩ nếu bật lọc
      if (excludeGrad && c.isGraduateOrEngineer) return;
      // 3. Khối Bổ trợ tự chọn: nếu bật lọc thì chỉ chọn môn đã học
      if (supportOnlyLearned && c.isElectiveSupport && !c.isLearned) return;
      // 4. Khối Module chuyên ngành (mã đầu 4): chỉ chọn môn đã học, tránh phình tất cả module
      if (moduleOnlyLearned && c.isModuleCourse && !c.isLearned) return;
      // 5. Bỏ qua Ngoại ngữ nếu đã có chứng chỉ miễn
      if (excludeEng && c.isEnglishCourse) return;

      selected.add(c.code);
    });
    return selected;
  };

  const handleParse = () => {
    if (!pastedText.trim()) return;
    const res = parseSisText(pastedText);
    setReport(res);
    // Tự động áp dụng bộ lọc chuẩn
    const initialSelected = applyFiltersToCourses(
      res.courses,
      filterExcludePE,
      filterExcludeGraduate,
      filterSupportOnlyLearned,
      filterModuleOnlyLearned,
      filterExcludeEnglish
    );
    setSelectedCodes(initialSelected);
  };

  const handleFilterToggle = (type: 'PE' | 'GRAD' | 'SUPPORT' | 'MODULE' | 'ENGLISH') => {
    if (!report) return;
    let nextPE = filterExcludePE;
    let nextGrad = filterExcludeGraduate;
    let nextSupp = filterSupportOnlyLearned;
    let nextMod = filterModuleOnlyLearned;
    let nextEng = filterExcludeEnglish;

    if (type === 'PE') {
      nextPE = !filterExcludePE;
      setFilterExcludePE(nextPE);
    } else if (type === 'GRAD') {
      nextGrad = !filterExcludeGraduate;
      setFilterExcludeGraduate(nextGrad);
    } else if (type === 'SUPPORT') {
      nextSupp = !filterSupportOnlyLearned;
      setFilterSupportOnlyLearned(nextSupp);
    } else if (type === 'MODULE') {
      nextMod = !filterModuleOnlyLearned;
      setFilterModuleOnlyLearned(nextMod);
    } else if (type === 'ENGLISH') {
      nextEng = !filterExcludeEnglish;
      setFilterExcludeEnglish(nextEng);
    }

    const updated = applyFiltersToCourses(report.courses, nextPE, nextGrad, nextSupp, nextMod, nextEng);
    setSelectedCodes(updated);
  };

  const handleToggleCourse = (code: string) => {
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
    setSelectedCodes(new Set(report.courses.map(c => c.code)));
  };

  const handleDeselectAll = () => {
    setSelectedCodes(new Set());
  };

  const handleSelectLearnedOnly = () => {
    if (!report) return;
    const learned = report.courses.filter(c => c.isLearned || c.gradeLetter || (c.gradeScale4 !== null && c.gradeScale4 > 0));
    setSelectedCodes(new Set(learned.map(c => c.code)));
  };

  const handleSelectStandardBachelor = () => {
    if (!report) return;
    setFilterExcludePE(true);
    setFilterExcludeGraduate(true);
    setFilterSupportOnlyLearned(true);
    setFilterModuleOnlyLearned(true);
    const standard = applyFiltersToCourses(report.courses, true, true, true, true, filterExcludeEnglish);
    setSelectedCodes(standard);
  };

  const handleApply = () => {
    if (!report || selectedCodes.size === 0) return;
    const toImport = report.courses.filter(c => selectedCodes.has(c.code));
    onMergeCourses(toImport, syncStudentInfo ? report.studentInfo : undefined);

    const infoMsg = report.studentInfo && syncStudentInfo
      ? ` và đồng bộ chuyên ngành sang ${report.studentInfo.major}`
      : '';
    alert(`✅ Đã đồng bộ thành công ${toImport.length} học phần vào Dashboard${infoMsg}!`);
    onClose();
  };

  // Mẫu văn bản chuẩn khớp 100% bố cục trang QLĐT mới (qldt.hust.edu.vn)
  const handleLoadSampleQldt = () => {
    const sample = `Chương trình đào tạo: ET1 - Kỹ thuật Điện tử - Viễn thông (2023)
STT\tMÃ HỌC PHẦN\tTÊN HỌC PHẦN\tPhân loại Module/HP\tSố TC\tECTS\tBắt buộc\tĐã học\tĐiểm HP(Bậc)\tKết quả\tXem chi tiết HP
1\tET3250\tThông tin số\tCơ sở và cốt lõi ngành (Basic and Core of Engineering) (49TC)\t3\t4.67\tX\t\t\t\tXem chi tiết
2\tET3241\tĐiện tử tương tự II\tCơ sở và cốt lõi ngành (Basic and Core of Engineering) (49TC)\t2\t3.25\tX\t\t\t\tXem chi tiết
3\tET3300\tKỹ thuật vi xử lý\tCơ sở và cốt lõi ngành (Basic and Core of Engineering) (49TC)\t3\t4.67\tX\t\t\t\tXem chi tiết
4\tET2022\tTechnical Writing and Presentation\tKiến thức bổ trợ (9TC)\t3\t4.67\tX\tX\tA\tĐạt\tXem chi tiết
5\tEM1010\tQuản trị học đại cương\tKiến thức bổ trợ (9TC)\t2\t3.25\t\tX\tB+\tĐạt\tXem chi tiết
6\tED3280\tTâm lý học ứng dụng\tKiến thức bổ trợ (9TC)\t2\t3.25\t\t\t\t\tXem chi tiết
7\tED3220\tKỹ năng mềm\tKiến thức bổ trợ (9TC)\t2\t3.25\t\tX\tA\tĐạt\tXem chi tiết
8\tET3262\tTư duy công nghệ và thiết kế kỹ thuật\tKiến thức bổ trợ (9TC)\t2\t3.25\t\t\t\t\tXem chi tiết
9\tPE1010\tGiáo dục thể chất 1\tGiáo dục thể chất\t0\t0\tX\tX\tĐạt\tĐạt\tXem chi tiết
10\tET5100\tHệ thống nhúng nâng cao\tModule định hướng Kỹ sư chuyên sâu\t3\t4.5\tX\t\t\t\tXem chi tiết`;
    setPastedText(sample);
  };

  const handleLoadSampleSis = () => {
    const sample = `Chương trình 1845 - Kỹ thuật Điện tử - Viễn thông 2024 cho sinh viên 202414443 Nguyễn Quang Tùng
Mã loại HP: 7 (Count=1, Tổng TC: 6, Tổng đạt: )
Loại HP: Đồ án/Khóa luận Tốt nghiệp (Count=1, Tổng TC: 6, Tổng đạt: )
ET4900\tĐồ án tốt nghiệp cử nhân\t8\tfalse\t6\t\t\tĐồ án tốt nghiệp cử nhân (6TC)\t\t\tTDDT
Mã loại HP: 210 (Count=6, Tổng TC: 13, Tổng đạt: 9)
Loại HP: Lý luận chính trị + Pháp luật đại cương (Count=6, Tổng TC: 13, Tổng đạt: 9)
SSH1111\tTriết học Mác - Lênin\t1\ttrue\t3\t3\tSSH1111\tLý luận chính trị + Pháp luật đại cương (Laws and politics) (13TC)\tA\t4\tKML
SSH1121\tKinh tế chính trị Mác - Lênin\t2\ttrue\t2\t2\tSSH1121\tLý luận chính trị + Pháp luật đại cương (Laws and politics) (13TC)\tA\t4\tKML
SSH1131\tChủ nghĩa xã hội khoa học\t3\ttrue\t2\t2\tSSH1131\tLý luận chính trị + Pháp luật đại cương (Laws and politics) (13TC)\tA\t4\tKML
EM1170\tPháp luật đại cương\t2\ttrue\t2\t2\tEM1170\tLý luận chính trị + Pháp luật đại cương (Laws and politics) (13TC)\tA\t4\tKKTVQL`;
    setPastedText(sample);
  };

  const isAllSelected = Boolean(report && report.courses.length > 0 && selectedCodes.size === report.courses.length);
  const selectedCredits = report
    ? report.courses.filter(c => selectedCodes.has(c.code)).reduce((sum, c) => sum + c.credits, 0)
    : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cổng Nhập Dữ Liệu QLĐT & SIS HUST Thông Minh"
      subtitle="Bóc tách tự động bảng điểm, chương trình đào tạo và học phần tiên quyết từ qldt.hust.edu.vn & sis.hust.edu.vn"
      maxWidth="max-w-5xl"
    >
      <div className="space-y-4">
        {/* Instructions & Portals */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1.5">
          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-red-600" />
            <span>Hỗ trợ cả 2 cổng đào tạo của Đại học Bách Khoa Hà Nội:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70">
              <strong className="text-amber-600 dark:text-amber-400 block mb-0.5">1. Cổng mới: qldt.hust.edu.vn</strong>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Vào <strong>Học tập</strong> → <strong>Chương trình đào tạo</strong> → nhấn Ctrl+A → Ctrl+C → dán vào đây.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70">
              <strong className="text-blue-600 dark:text-blue-400 block mb-0.5">2. Cổng cũ: sis.hust.edu.vn</strong>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Vào <strong>Tra cứu kết quả học tập</strong> → copy bảng điểm hoặc dùng Bookmarklet để lấy JSON.
              </p>
            </div>
          </div>
        </div>

        {/* Textarea */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Dán nội dung bảng từ QLĐT / SIS hoặc chuỗi JSON:
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSampleQldt}
                className="text-xs text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mẫu QLĐT (ET1 - 2023)</span>
              </button>
              <button
                type="button"
                onClick={handleLoadSampleSis}
                className="text-xs text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mẫu SIS CTT</span>
              </button>
            </div>
          </div>
          <textarea
            rows={4}
            value={pastedText}
            onChange={e => {
              setPastedText(e.target.value);
              setReport(null);
            }}
            placeholder="Dán toàn bộ văn bản hoặc chuỗi JSON từ trang QLĐT / SIS vào đây..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleParse}
            disabled={!pastedText.trim()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 text-white shadow-md shadow-zinc-900/20 dark:shadow-none transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Phân Tích & Bóc Tách Dữ Liệu</span>
          </button>
        </div>

        {/* Detected Student / Major Header Banner */}
        {report?.studentInfo && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-red-200 dark:border-red-500/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-600/20 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 dark:text-white text-sm">
                    {report.studentInfo.name || report.studentInfo.programName}
                  </strong>
                  {report.studentInfo.studentId && (
                    <span className="font-mono text-slate-500 dark:text-slate-400">({report.studentInfo.studentId})</span>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-red-400 font-bold border border-red-200 dark:border-red-500/30">
                    {report.studentInfo.major}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  {report.studentInfo.programName} • {report.studentInfo.cohort} (Nguồn: {report.sourceType})
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={syncStudentInfo}
                onChange={e => setSyncStudentInfo(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
              />
              <span>Tự động cập nhật hồ sơ & đổi ngành sang {report.studentInfo.major}</span>
            </label>
          </div>
        )}

        {/* Smart Filtering Options & Selection Toolbar */}
        {report && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {/* Smart Filter Toggles */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-200">
                <Filter className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>Bộ lọc thông minh làm sạch chương trình đào tạo:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600">
                  <input
                    type="checkbox"
                    checked={filterExcludePE}
                    onChange={() => handleFilterToggle('PE')}
                    className="w-4 h-4 rounded text-red-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span>Bỏ qua Thể chất (PE không tính tín CPA)</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600">
                  <input
                    type="checkbox"
                    checked={filterExcludeGraduate}
                    onChange={() => handleFilterToggle('GRAD')}
                    className="w-4 h-4 rounded text-red-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span>Bỏ qua Kỹ sư & Thạc sĩ (chỉ lấy Cử nhân)</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600">
                  <input
                    type="checkbox"
                    checked={filterSupportOnlyLearned}
                    onChange={() => handleFilterToggle('SUPPORT')}
                    className="w-4 h-4 rounded text-red-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span>Khối Bổ trợ: chỉ lấy môn đã học (9TC)</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600">
                  <input
                    type="checkbox"
                    checked={filterModuleOnlyLearned}
                    onChange={() => handleFilterToggle('MODULE')}
                    className="w-4 h-4 rounded text-red-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span>Module chuyên ngành (mã đầu 4): chỉ lấy môn đã học</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600">
                  <input
                    type="checkbox"
                    checked={filterExcludeEnglish}
                    onChange={() => handleFilterToggle('ENGLISH')}
                    className="w-4 h-4 rounded text-red-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span>Bỏ qua Tiếng Anh (FL* nếu có chứng chỉ)</span>
                </label>
              </div>
            </div>

            {/* Selection Controls Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-slate-100 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Đã chọn: <strong className="text-emerald-600 dark:text-emerald-400">{selectedCodes.size}</strong>/{report.courses.length} học phần ({selectedCredits} tín)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSelectStandardBachelor}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-50 dark:bg-red-600/20 hover:bg-red-100 dark:hover:bg-red-600/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30 transition-colors"
                  title="Áp dụng chuẩn Cử nhân: bỏ PE, bỏ Kỹ sư, chỉ lấy môn bổ trợ đã học"
                >
                  Khung Cử nhân chuẩn
                </button>
                <button
                  type="button"
                  onClick={handleSelectLearnedOnly}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Chỉ môn đã học
                </button>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>

            {/* Courses Table with Prerequisites and Tagging */}
            <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase sticky top-0 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-2.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={isAllSelected ? handleDeselectAll : handleSelectAll}
                        className="w-3.5 h-3.5 rounded text-red-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                        title="Chọn tất cả / Bỏ chọn tất cả"
                      />
                    </th>
                    <th className="p-2.5">Mã HP</th>
                    <th className="p-2.5">Tên Học Phần</th>
                    <th className="p-2.5">Phân Loại Module</th>
                    <th className="p-2.5 text-center">TC</th>
                    <th className="p-2.5 text-center">Bắt buộc</th>
                    <th className="p-2.5 text-center">Đã học</th>
                    <th className="p-2.5">Môn Tiên Quyết</th>
                    <th className="p-2.5 text-center">Điểm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                  {report.courses.map((item, idx) => {
                    const isSelected = selectedCodes.has(item.code);
                    return (
                      <tr
                        key={idx}
                        onClick={() => handleToggleCourse(item.code)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-red-50 dark:bg-red-600/10 hover:bg-red-100 dark:hover:bg-red-600/15' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-60'
                        }`}
                      >
                        <td className="p-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-3.5 h-3.5 rounded text-red-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                          />
                        </td>
                        <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white">{item.code}</td>
                        <td className="p-2.5 font-sans text-slate-800 dark:text-slate-200">
                          {item.name}
                          {item.isPhysicalEducation && (
                            <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                              Thể chất (PE)
                            </span>
                          )}
                          {item.isGraduateOrEngineer && (
                            <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30">
                              Kỹ sư / Thạc sĩ
                            </span>
                          )}
                          {item.isElectiveSupport && (
                            <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30">
                              Bổ trợ (9TC)
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                          {item.category || '-'}
                        </td>
                        <td className="p-2.5 font-mono text-center text-slate-700 dark:text-slate-300">
                          {item.credits}
                          {item.ects && <span className="text-[10px] text-slate-500 block">({item.ects} ECTS)</span>}
                        </td>
                        <td className="p-2.5 text-center">
                          {item.isRequired ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                              Bắt buộc
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800">
                              Tự chọn
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-center">
                          {item.isLearned ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                              Đã học
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Chưa</span>
                          )}
                        </td>
                        <td className="p-2.5">
                          {item.prerequisites && item.prerequisites.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.prerequisites.map((p, pIdx) => (
                                <span
                                  key={pIdx}
                                  className="px-1.5 py-0.2 rounded font-mono text-[10px] font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono text-center font-bold">
                          {item.gradeLetter ? (
                            <span className="text-amber-600 dark:text-amber-400">{item.gradeLetter}</span>
                          ) : item.gradeScale4 !== null ? (
                            <span className="text-emerald-600 dark:text-emerald-400">{item.gradeScale4.toFixed(1)}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">
                * Tự động tra cứu và liên kết cây tiên quyết chuẩn Bách Khoa cho từng môn học.
              </span>
              <button
                type="button"
                onClick={handleApply}
                disabled={selectedCodes.size === 0}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 text-white shadow-lg shadow-zinc-900/20 dark:shadow-none transition-colors"
              >
                Đồng Bộ {selectedCodes.size} Học Phần Vào Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
