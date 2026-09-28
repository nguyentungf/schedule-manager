import React, { useState, useMemo } from 'react';
import { Course, CourseStatus } from '../../types/course';
import { CourseNodeCard } from './CourseNodeCard';
import { CourseDetailModal } from './CourseDetailModal';
import { BatchCourseEditModal } from './BatchCourseEditModal';
import { ExcelUploadModal } from '../common/ExcelUploadModal';
import { buildDependencyGraph } from '../../engines/dagEngine';
import { AVAILABLE_MAJORS } from '../../data/curricula';
import { KNOWN_HUST_COURSE_CATALOG } from '../../engines/courseCatalogParser';
import { GitFork, X, GraduationCap, Layers, LayoutGrid, FileSpreadsheet, Plus, Edit3, ArrowRight, ShieldCheck, ShieldAlert, ChevronDown, Check } from 'lucide-react';

interface CurriculumViewProps {
  courses: Course[];
  onUpdateCourse: (courseId: string, updates: Partial<Course>) => void;
  onAddCourse?: (course: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
  onBatchUpdateCourses?: (courses: Course[]) => void;
  onBatchDeleteCourses?: (courseIds: string[]) => void;
  majorCode: string;
  onSelectMajor?: (majorCode: string) => void;
  onImportCoursesFromExcel?: (courses: Course[], overwrite: boolean) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  courses,
  onUpdateCourse,
  onAddCourse,
  onDeleteCourse,
  onBatchUpdateCourses,
  onBatchDeleteCourses,
  majorCode,
  onSelectMajor,
  onImportCoursesFromExcel
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalCourse, setModalCourse] = useState<Course | null>(null);
  const [isNewCourse, setIsNewCourse] = useState(false);
  const [isBatchEditModalOpen, setIsBatchEditModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | CourseStatus>('all');
  const [viewGroupBy, setViewGroupBy] = useState<'year' | 'all'>('year');
  const [isMajorDropdownOpen, setIsMajorDropdownOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  // Xây dựng DAG đồ thị phụ thuộc
  const graph = useMemo(() => buildDependencyGraph(courses), [courses]);

  // Các tập hợp highlight khi click vào 1 môn học
  const { prereqCodes, dependentCodes } = useMemo(() => {
    if (!selectedCourse) {
      return { prereqCodes: new Set<string>(), dependentCodes: new Set<string>() };
    }
    const nodeInfo = graph.get(selectedCourse.code);
    return {
      prereqCodes: new Set(nodeInfo ? nodeInfo.allPrerequisites : []),
      dependentCodes: new Set(nodeInfo ? nodeInfo.allDependents : [])
    };
  }, [selectedCourse, graph]);

  // Nhóm các môn theo Năm học (1 -> 5) dựa vào chữ số đầu của mã (VD: ET3230 là Năm 3)
  const coursesByYear = useMemo(() => {
    const years: Record<number, Course[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    courses.forEach(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return;

      const digitMatch = c.code.match(/[A-Z]{2,4}([1-5])[0-9]{3}/);
      const year = digitMatch ? parseInt(digitMatch[1]) : (c.term ? Math.min(5, Math.max(1, Math.ceil(c.term / 2))) : 1);
      if (years[year]) {
        years[year].push(c);
      } else {
        years[1].push(c);
      }
    });
    return years;
  }, [courses, statusFilter]);

  // Danh sách toàn bộ các môn học theo bộ lọc
  const allFilteredCourses = useMemo(() => {
    return courses.filter(c => statusFilter === 'all' || c.status === statusFilter);
  }, [courses, statusFilter]);

  const handleSelectCourse = (course: Course) => {
    if (selectedCourse?.code === course.code) {
      setSelectedCourse(null);
    } else {
      setSelectedCourse(course);
    }
  };

  const handleOpenAddCourse = () => {
    setIsNewCourse(true);
    setModalCourse({
      id: 'custom_' + Date.now(),
      code: '',
      name: '',
      credits: 3,
      term: 1,
      weightQt: 0.3,
      weightCk: 0.7,
      difficulty: 3.0,
      prerequisites: [],
      status: 'unlocked',
      isRequired: true
    });
  };

  const YEAR_LABELS: Record<number, { title: string; sub: string }> = {
    1: { title: 'Năm thứ 1 (Năm Nhất)', sub: 'Kiến thức đại cương: Toán, Tin học, Vật lý & Ngoại ngữ' },
    2: { title: 'Năm thứ 2 (Năm Hai)', sub: 'Cơ sở ngành cốt lõi: Mạch điện, Tín hiệu, Điện tử tương tự & số' },
    3: { title: 'Năm thứ 3 (Năm Ba)', sub: 'Chuyên ngành định hướng: Vi xử lý, Thông tin số, Cao tần & Quang' },
    4: { title: 'Năm thứ 4 (Năm Tư)', sub: 'Hệ thống ứng dụng, Thực tập doanh nghiệp & Đồ án tốt nghiệp' },
    5: { title: 'Năm thứ 5 (Kỹ sư chuyên sâu / Thạc sĩ)', sub: 'Đào tạo bậc 7 / Khóa luận tốt nghiệp Kỹ sư' }
  };

  return (
    <div className="space-y-5">
      {/* Control Bar */}
      <div className="bg-white dark:bg-[#131b2e] p-4 rounded-2xl border border-slate-200 dark:border-slate-700/70 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: Info & Major Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-600/15 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Khung CTĐT & Cây Tiên Quyết
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedCourse ? (
                  <span className="text-amber-700 dark:text-amber-300 font-medium">
                    Đang xem quan hệ: <strong className="text-slate-900 dark:text-white font-mono">{selectedCourse.code} - {selectedCourse.name}</strong>
                  </span>
                ) : (
                  'Nhấp vào môn học để xem Tiên quyết (vàng cam) và Môn phụ thuộc bị khóa (xanh lam)'
                )}
              </p>
            </div>
          </div>

          {/* Custom Cohesive Major Dropdown Popover */}
          {onSelectMajor && (
            <div className="relative sm:ml-4">
              <button
                type="button"
                onClick={() => setIsMajorDropdownOpen(!isMajorDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 transition-all text-xs font-bold text-slate-800 dark:text-white shadow-xs"
              >
                <GraduationCap className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>{AVAILABLE_MAJORS.find(m => m.code === majorCode)?.name || majorCode}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isMajorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMajorDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsMajorDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-1.5 z-40 w-72 sm:w-80 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                      Chọn Ngành Đào Tạo HUST
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-0.5">
                      {AVAILABLE_MAJORS.map(m => {
                        const isSelected = m.code === majorCode;
                        return (
                          <button
                            key={m.code}
                            type="button"
                            onClick={() => {
                              onSelectMajor(m.code);
                              setIsMajorDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                              isSelected
                                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div>
                              <div className="font-semibold">{m.name}</div>
                              <span className="text-[10px] text-slate-400">{m.faculty}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Group By Toggle, Status Filters, Excel & Clear */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle View Mode: Theo Năm vs Xem Toàn Bộ */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setViewGroupBy('year')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all ${
                viewGroupBy === 'year'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Phân loại tự động theo Năm Học 1 đến 4 dựa vào chữ số đầu mã môn"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Theo Năm Học (1-4)</span>
            </button>
            <button
              onClick={() => setViewGroupBy('all')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all ${
                viewGroupBy === 'all'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Xem toàn bộ danh mục học phần trong một bảng thống nhất"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Xem Toàn Bộ</span>
            </button>
          </div>

          {/* Button Sửa Hàng Loạt */}
          {onBatchUpdateCourses && (
            <button
              onClick={() => setIsBatchEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-100 dark:hover:bg-blue-600/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold transition-colors"
              title="Chỉnh sửa nhanh nhiều môn học cùng lúc trên bảng trực tiếp"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Sửa Hàng Loạt</span>
            </button>
          )}

          {/* Button Thêm Học Phần mới */}
          {onAddCourse && (
            <button
              onClick={handleOpenAddCourse}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold shadow-md shadow-zinc-900/20 dark:shadow-none transition-colors"
              title="Thêm học phần mới vào khung chương trình đào tạo"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Học Phần</span>
            </button>
          )}

          {/* Button Nhập từ Excel / Tải mẫu */}
          {onImportCoursesFromExcel && (
            <button
              onClick={() => setIsExcelModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs font-semibold transition-colors"
              title="Nhập danh mục học phần từ file Excel hoặc tải file mẫu (.xlsx, .csv)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Nhập Excel / Tải mẫu</span>
            </button>
          )}

          {selectedCourse && (
            <button
              onClick={() => setSelectedCourse(null)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Bỏ chọn</span>
            </button>
          )}

          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'all' ? 'bg-red-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter('passed')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'passed' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Đã qua
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'in_progress' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Đang học
            </button>
            <button
              onClick={() => setStatusFilter('failed')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'failed' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Nợ môn
            </button>
          </div>
        </div>
      </div>

      {/* Selected Course Prerequisites & Dependents Relationship Banner (Hiện Mã + Tên Học Phần) */}
      {selectedCourse && (
        <div className="bg-white dark:bg-[#131b2e] border border-amber-300 dark:border-amber-500/40 rounded-2xl p-4 shadow-sm dark:shadow-xl space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-mono font-bold text-xs">
                {selectedCourse.code}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedCourse.name}
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                ({selectedCourse.credits} tín chỉ)
              </span>
            </div>
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 self-start sm:self-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Đóng quan hệ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Cột Môn Tiên Quyết Cần Có */}
            <div className="bg-slate-50 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Môn Tiên Quyết Cần Có ({prereqCodes.size})
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Phải đạt trước khi đăng ký</span>
              </div>
              {prereqCodes.size === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-xs italic">Không yêu cầu học phần tiên quyết nào.</p>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {Array.from(prereqCodes).map(code => {
                    const prereqCourse = courses.find(c => c.code === code);
                    const pName = prereqCourse?.name || KNOWN_HUST_COURSE_CATALOG[code]?.name || '';
                    const isPassed = prereqCourse?.status === 'passed';
                    return (
                      <div
                        key={code}
                        className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                      >
                        <div className="flex items-center gap-2 truncate min-w-0 mr-2">
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono font-bold text-[11px] border border-amber-300 dark:border-amber-500/30 flex-shrink-0">
                            {code}
                          </span>
                          <span className="text-slate-800 dark:text-slate-200 truncate font-medium text-xs" title={pName}>
                            {pName ? `- ${pName}` : ''}
                          </span>
                        </div>
                        {isPassed ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1 flex-shrink-0">
                            <ShieldCheck className="w-3 h-3" /> Đã qua
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 font-bold text-[11px] flex items-center gap-1 flex-shrink-0">
                            <ShieldAlert className="w-3 h-3" /> Chưa đạt
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cột Môn Bị Khóa Nếu Trượt */}
            <div className="bg-slate-50 dark:bg-slate-900/80 border border-blue-200 dark:border-blue-500/20 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5" />
                  Môn Bị Khóa Nếu Trượt Môn Này ({dependentCodes.size})
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Các môn sau phụ thuộc</span>
              </div>
              {dependentCodes.size === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-xs italic">Không có môn học nào phụ thuộc trực tiếp.</p>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {Array.from(dependentCodes).map(code => {
                    const depCourse = courses.find(c => c.code === code);
                    const dName = depCourse?.name || KNOWN_HUST_COURSE_CATALOG[code]?.name || '';
                    return (
                      <div
                        key={code}
                        className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20"
                      >
                        <div className="flex items-center gap-2 truncate min-w-0 mr-2">
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 font-mono font-bold text-[11px] border border-blue-300 dark:border-blue-500/30 flex-shrink-0">
                            {code}
                          </span>
                          <span className="text-slate-800 dark:text-blue-100 truncate font-medium text-xs" title={dName}>
                            {dName ? `- ${dName}` : ''}
                          </span>
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] flex-shrink-0">
                          {depCourse?.credits ? `${depCourse.credits} TC` : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: Group By Year (Năm 1, 2, 3, 4, 5) */}
      {viewGroupBy === 'year' && (
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map(yearNum => {
            const yearCourses = coursesByYear[yearNum] || [];
            if (yearCourses.length === 0) return null;

            const totalCredits = yearCourses.reduce((sum, c) => sum + c.credits, 0);
            const passedCredits = yearCourses
              .filter(c => c.status === 'passed')
              .reduce((sum, c) => sum + c.credits, 0);

            const meta = YEAR_LABELS[yearNum] || { title: `Năm thứ ${yearNum}`, sub: '' };

            return (
              <div key={yearNum} className="bg-white dark:bg-[#0f172a]/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
                {/* Year Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-600/20 text-red-600 dark:text-red-400 font-mono font-bold text-sm flex items-center justify-center border border-red-200 dark:border-red-500/30">
                      Y{yearNum}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        {meta.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {meta.sub}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono font-medium">
                      Tổng: <strong className="text-slate-900 dark:text-white">{totalCredits}</strong> TC
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 font-mono font-medium">
                      Đã qua: <strong>{passedCredits}</strong>/{totalCredits} TC
                    </span>
                  </div>
                </div>

                {/* Course Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {yearCourses.map(course => (
                    <CourseNodeCard
                      key={course.id}
                      course={course}
                      isSelected={selectedCourse?.code === course.code}
                      isHighlightedPrereq={prereqCodes.has(course.code)}
                      isHighlightedDependent={dependentCodes.has(course.code)}
                      onSelect={handleSelectCourse}
                      onOpenDetail={c => {
                        setIsNewCourse(false);
                        setModalCourse(c);
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: Xem Toàn Bộ Danh Mục Học Phần (Unified Grid) */}
      {viewGroupBy === 'all' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0f172a]/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-600/20 text-red-600 dark:text-red-400 font-mono font-bold text-sm flex items-center justify-center border border-red-200 dark:border-red-500/30">
                  ALL
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    Toàn Bộ Danh Mục Học Phần ({allFilteredCourses.length} môn)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Hiển thị tổng thể toàn khóa theo trạng thái và quan hệ tiên quyết
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono font-medium">
                  Tổng: <strong className="text-slate-900 dark:text-white">{allFilteredCourses.reduce((sum, c) => sum + c.credits, 0)}</strong> TC
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 font-mono font-medium">
                  Đã qua: <strong>{allFilteredCourses.filter(c => c.status === 'passed').reduce((sum, c) => sum + c.credits, 0)}</strong> TC
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 font-mono font-medium">
                  Nợ môn: <strong>{allFilteredCourses.filter(c => c.status === 'failed').reduce((sum, c) => sum + c.credits, 0)}</strong> TC
                </span>
              </div>
            </div>

            {allFilteredCourses.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                Không tìm thấy học phần nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {allFilteredCourses.map(course => (
                  <CourseNodeCard
                    key={course.id}
                    course={course}
                    isSelected={selectedCourse?.code === course.code}
                    isHighlightedPrereq={prereqCodes.has(course.code)}
                    isHighlightedDependent={dependentCodes.has(course.code)}
                    onSelect={handleSelectCourse}
                    onOpenDetail={c => {
                      setIsNewCourse(false);
                      setModalCourse(c);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      <CourseDetailModal
        isOpen={!!modalCourse}
        onClose={() => {
          setModalCourse(null);
          setIsNewCourse(false);
        }}
        course={modalCourse}
        allCourses={courses}
        onUpdateCourse={onUpdateCourse}
        onAddCourse={onAddCourse}
        onDeleteCourse={onDeleteCourse}
        isNewCourse={isNewCourse}
      />

      {/* Batch Course Edit Modal */}
      {onBatchUpdateCourses && (
        <BatchCourseEditModal
          isOpen={isBatchEditModalOpen}
          onClose={() => setIsBatchEditModalOpen(false)}
          courses={courses}
          onBatchUpdate={onBatchUpdateCourses}
          onBatchDelete={onBatchDeleteCourses}
        />
      )}

      {/* Excel Upload Modal */}
      {onImportCoursesFromExcel && (
        <ExcelUploadModal
          isOpen={isExcelModalOpen}
          onClose={() => setIsExcelModalOpen(false)}
          mode="courses"
          onImportCourses={onImportCoursesFromExcel}
        />
      )}
    </div>
  );
};
