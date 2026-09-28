import React, { useState, useEffect, useMemo } from 'react';
import { Course, CourseStatus, LetterGrade } from '../../types/course';
import { Modal } from '../common/Modal';
import { buildDependencyGraph } from '../../engines/dagEngine';
import { calculateCourseFinalGrade } from '../../engines/hustGradeEngine';
import { KNOWN_HUST_COURSE_CATALOG } from '../../engines/courseCatalogParser';
import { Network, AlertTriangle, CheckCircle2, ShieldAlert, Edit3, Eye, Trash2, Sparkles, Award } from 'lucide-react';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  allCourses: Course[];
  onUpdateCourse: (courseId: string, updates: Partial<Course>) => void;
  onAddCourse?: (course: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
  isNewCourse?: boolean;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  isOpen,
  onClose,
  course,
  allCourses,
  onUpdateCourse,
  onAddCourse,
  onDeleteCourse,
  isNewCourse = false
}) => {
  // Toggle chế độ sửa thông tin học phần
  const [isEditMode, setIsEditMode] = useState<boolean>(isNewCourse);

  // Form state cho thông tin học phần
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [credits, setCredits] = useState<number>(3);
  const [term, setTerm] = useState<number>(1);
  const [weightQt, setWeightQt] = useState<number>(0.3);
  const [weightCk, setWeightCk] = useState<number>(0.7);
  const [difficulty, setDifficulty] = useState<number>(3.0);
  const [prereqInput, setPrereqInput] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [isRequired, setIsRequired] = useState<boolean>(true);

  // Form state cho điểm số & trạng thái
  const [status, setStatus] = useState<CourseStatus>('unlocked');
  const [gradeQt, setGradeQt] = useState<string>('');
  const [gradeCk, setGradeCk] = useState<string>('');
  const [isRetake, setIsRetake] = useState<boolean>(false);

  useEffect(() => {
    if (course) {
      setIsEditMode(isNewCourse);
      setCode(course.code || '');
      setName(course.name || '');
      setCredits(course.credits || 3);
      setTerm(course.term || 1);
      setWeightQt(course.weightQt ?? 0.3);
      setWeightCk(course.weightCk ?? 0.7);
      setDifficulty(course.difficulty ?? 3.0);
      setPrereqInput((course.prerequisites || []).join(', '));
      setCategoryName(course.categoryName || '');
      setIsRequired(course.isRequired ?? true);

      setStatus(course.status || 'unlocked');
      setGradeQt(course.gradeQt !== null && course.gradeQt !== undefined ? String(course.gradeQt) : '');
      setGradeCk(course.gradeCk !== null && course.gradeCk !== undefined ? String(course.gradeCk) : '');
      setIsRetake(course.isRetake || false);
    }
  }, [course, isNewCourse]);

  // Trọng số Quá trình thay đổi -> Cuối kỳ tự động = 1 - QT
  const handleWeightQtChange = (val: number) => {
    setWeightQt(val);
    setWeightCk(Math.round((1 - val) * 10) / 10);
  };

  // TÍNH TOÁN ĐIỂM CHỮ TỰ ĐỘNG THEO THỜI GIAN THỰC (Bao gồm điểm chữ A+ khi >= 9.5)
  const autoGrade = useMemo(() => {
    const qt = gradeQt.trim() !== '' ? parseFloat(gradeQt) : null;
    const ck = gradeCk.trim() !== '' ? parseFloat(gradeCk) : null;
    if (qt === null || ck === null || isNaN(qt) || isNaN(ck)) return null;

    return calculateCourseFinalGrade(qt, ck, weightQt, weightCk);
  }, [gradeQt, gradeCk, weightQt, weightCk]);

  if (!course) return null;

  // Lấy thông tin DAG từ engine an toàn, chống crash
  const nodeInfo = useMemo(() => {
    try {
      if (!course || !allCourses) return null;
      const graph = buildDependencyGraph(allCourses);
      return graph.get(course.code) || null;
    } catch (e) {
      console.warn('Lỗi khi tính toán DAG trong CourseDetailModal:', e);
      return null;
    }
  }, [allCourses, course]);

  const directPrereqs = nodeInfo ? nodeInfo.directPrerequisites : (course.prerequisites || []);
  const directDependents = nodeInfo ? nodeInfo.directDependents : [];
  const criticality = nodeInfo ? nodeInfo.criticalityIndex : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const qtNum = gradeQt.trim() !== '' ? parseFloat(gradeQt) : null;
    const ckNum = gradeCk.trim() !== '' ? parseFloat(gradeCk) : null;

    let finalLetter: LetterGrade | null = null;
    let finalScale4: number | null = null;
    let newStatus = status;

    if (autoGrade) {
      finalLetter = autoGrade.letter;
      finalScale4 = autoGrade.scale4;
      newStatus = autoGrade.passed ? 'passed' : 'failed';
    }

    const cleanPrereqs = prereqInput
      .split(',')
      .map(p => p.trim().toUpperCase())
      .filter(p => p.length >= 4);

    if (isNewCourse) {
      if (!code.trim() || !name.trim()) {
        alert('Vui lòng nhập đầy đủ Mã học phần và Tên học phần!');
        return;
      }

      const newCourseData: Course = {
        id: course.id || ('custom_' + Date.now()),
        code: code.trim().toUpperCase(),
        name: name.trim(),
        credits: Number(credits) || 3,
        term: Number(term) || 1,
        weightQt,
        weightCk,
        difficulty: Number(difficulty) || 3.0,
        prerequisites: cleanPrereqs,
        categoryName: categoryName.trim() || undefined,
        isRequired,
        status: newStatus,
        gradeQt: qtNum,
        gradeCk: ckNum,
        gradeLetter: finalLetter,
        gradeScale4: finalScale4,
        isRetake
      };

      if (onAddCourse) {
        onAddCourse(newCourseData);
      }
    } else {
      onUpdateCourse(course.id, {
        code: code.trim().toUpperCase() || course.code,
        name: name.trim() || course.name,
        credits: Number(credits) || course.credits,
        term: Number(term) || course.term,
        weightQt,
        weightCk,
        difficulty: Number(difficulty) || course.difficulty,
        prerequisites: cleanPrereqs,
        categoryName: categoryName.trim() || course.categoryName,
        isRequired,
        status: newStatus,
        gradeQt: qtNum,
        gradeCk: ckNum,
        gradeLetter: finalLetter,
        gradeScale4: finalScale4,
        isRetake
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa học phần [${course.code} - ${course.name}] khỏi danh mục không?`)) {
      if (onDeleteCourse) {
        onDeleteCourse(course.id);
      }
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNewCourse ? 'Thêm Học Phần Mới Vào CTĐT' : `${course.code || code} - ${course.name || name}`}
      subtitle={
        isNewCourse
          ? 'Tự thiết lập thông tin học phần, số tín chỉ, trọng số và điều kiện tiên quyết'
          : `Kỳ học ${term} • ${credits} Tín chỉ • Trọng số: QT ${Math.round(weightQt * 100)}% / CK ${Math.round(weightCk * 100)}%`
      }
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Top Control Bar: Toggle Chế Độ Sửa / Xem */}
        {!isNewCourse && (
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
              <span>Chế độ:</span>
              <strong className={isEditMode ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-900 dark:text-slate-200'}>
                {isEditMode ? 'Đang sửa thông tin học phần' : 'Đang xem thông tin & tiên quyết'}
              </strong>
            </span>

            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                isEditMode
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
              }`}
            >
              {isEditMode ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem Quan Hệ Tiên Quyết</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa Thông Tin Học Phần</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* SECTION 1: EDIT FORM THÔNG TIN HỌC PHẦN (Khi bật Toggle hoặc khi Thêm mới) */}
        {isEditMode && (
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3 animate-in fade-in duration-150">
            <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              Thông Tin Cơ Bản Học Phần
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Mã học phần <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="VD: ET3230"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-mono font-bold"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Tên học phần <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="VD: Kỹ thuật thông tin quang"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Số tín chỉ (TC)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={credits}
                  onChange={e => setCredits(parseInt(e.target.value) || 1)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Kỳ học đề xuất
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={term}
                  onChange={e => setTerm(parseInt(e.target.value) || 1)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Trọng số QT
                </label>
                <select
                  value={weightQt}
                  onChange={e => handleWeightQtChange(parseFloat(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
                >
                  <option value={0.3}>0.3 (Cuối kỳ 0.7)</option>
                  <option value={0.4}>0.4 (Cuối kỳ 0.6)</option>
                  <option value={0.5}>0.5 (Cuối kỳ 0.5)</option>
                  <option value={0.2}>0.2 (Cuối kỳ 0.8)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Độ khó (1 - 5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={difficulty}
                  onChange={e => setDifficulty(parseFloat(e.target.value) || 3.0)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Học phần tiên quyết (Cách nhau bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={prereqInput}
                  onChange={e => setPrereqInput(e.target.value)}
                  placeholder="VD: ET2000, ET2050, MI1111"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Khối kiến thức / Phân loại
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                  placeholder="VD: Cốt lõi ngành, Bổ trợ, Chuyên ngành..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="requiredCheckbox"
                checked={isRequired}
                onChange={e => setIsRequired(e.target.checked)}
                className="rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="requiredCheckbox" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                Học phần bắt buộc tốt nghiệp (Không tích nghĩa là môn tự chọn theo định hướng)
              </label>
            </div>
          </div>
        )}

        {/* SECTION 2: XEM BẢN ĐỒ TIÊN QUYẾT & METADATA (Khi ở chế độ xem) */}
        {!isEditMode && !isNewCourse && (
          <>
            {/* Criticality Warning Banner */}
            {criticality >= 3 && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Môn học Then chốt (Critical Node):</strong> Có{' '}
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{criticality}</span> môn học phía sau phụ thuộc vào môn này. Nếu nợ môn này, bạn sẽ bị chặn đăng ký hàng loạt môn học tiếp theo!
                </div>
              </div>
            )}

            {/* Course Catalog Metadata */}
            {(course.conditionString || course.tuitionCredits || course.englishName || course.duration) && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                {course.englishName && (
                  <div className="text-slate-700 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400">Tên tiếng Anh:</span> <strong className="text-slate-900 dark:text-white">{course.englishName}</strong>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  {course.duration && <span>Thời lượng: <strong className="text-slate-900 dark:text-white">{course.duration}</strong></span>}
                  {course.tuitionCredits && <span>TC học phí: <strong className="text-amber-700 dark:text-amber-400">{course.tuitionCredits}</strong></span>}
                  <span>Trọng số: QT {Math.round(weightQt * 100)}% / CK {Math.round(weightCk * 100)}%</span>
                </div>
                {course.conditionString && (
                  <div className="pt-1">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] block mb-0.5">Biểu thức HP điều kiện SIS:</span>
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono text-[11px] font-bold">
                      {course.conditionString}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* DAG Relations Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Môn Tiên Quyết */}
              <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                  <Network className="w-3.5 h-3.5" />
                  Môn Tiên quyết Cần có ({directPrereqs.length})
                </h5>
                {directPrereqs.length > 0 ? (
                  <ul className="space-y-1.5">
                    {directPrereqs.map(pCode => {
                      const prereqCourse = allCourses.find(c => c.code === pCode);
                      const isPassed = prereqCourse && prereqCourse.status === 'passed';
                      const pName = prereqCourse?.name || KNOWN_HUST_COURSE_CATALOG[pCode]?.name || '';
                      return (
                        <li key={pCode} className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-1.5 truncate mr-2 min-w-0">
                            <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px] border border-slate-300 dark:border-slate-700">
                              {pCode}
                            </span>
                            <span className="text-xs text-slate-700 dark:text-slate-300 truncate" title={pName}>
                              {pName ? `- ${pName}` : ''}
                            </span>
                          </div>
                          {isPassed ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px] flex-shrink-0 font-medium">
                              <CheckCircle2 className="w-3 h-3" /> Đã qua ({prereqCourse?.gradeLetter || 'Đạt'})
                            </span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 text-[11px] flex-shrink-0 font-medium">
                              <ShieldAlert className="w-3 h-3" /> Chưa đạt
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">Không yêu cầu môn tiên quyết.</p>
                )}
              </div>

              {/* Môn Phụ Thuộc Bị Khóa Nếu Trượt */}
              <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                <h5 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-2">
                  <Network className="w-3.5 h-3.5" />
                  Môn Bị Khóa Nếu Trượt ({directDependents.length})
                </h5>
                {directDependents.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {directDependents.map(dCode => {
                      const depCourse = allCourses.find(c => c.code === dCode);
                      const dName = depCourse?.name || KNOWN_HUST_COURSE_CATALOG[dCode]?.name || '';
                      return (
                        <div
                          key={dCode}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 text-[11px]"
                        >
                          <span className="font-mono font-bold text-blue-900 dark:text-white bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded border border-blue-300 dark:border-blue-700/50">
                            {dCode}
                          </span>
                          <span className="text-blue-800 dark:text-blue-200 truncate" title={dName}>
                            {dName ? `- ${dName}` : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">Không có môn nào phụ thuộc trực tiếp.</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* SECTION 3: FORM NHẬP ĐIỂM SỐ & TỰ ĐỘNG TÍNH ĐIỂM CHỮ (BỔ SUNG A+ KHI >= 9.5) */}
        <form onSubmit={handleSave} className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              Điểm Số & Trạng Thái Học Tập
            </h5>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Công thức: {Math.round(weightQt * 100)}% QT + {Math.round(weightCk * 100)}% CK
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Trạng thái học
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as CourseStatus)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
              >
                <option value="unlocked">Mở (Chưa học)</option>
                <option value="in_progress">Đang học kỳ này</option>
                <option value="passed">Đã qua môn</option>
                <option value="failed">Nợ môn (Trượt F)</option>
                <option value="locked">Bị khóa (Chưa đủ tiên quyết)</option>
                <option value="planned">Đã lên kế hoạch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Điểm quá trình
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={gradeQt}
                onChange={e => setGradeQt(e.target.value)}
                placeholder="VD: 9.5"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Điểm cuối kỳ
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={gradeCk}
                onChange={e => setGradeCk(e.target.value)}
                placeholder="VD: 9.5"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          {/* BẢNG HIỂN THỊ KẾT QUẢ ĐIỂM CHỮ TỰ ĐỘNG TÍNH TOÁN NGAY TRONG CHI TIẾT */}
          {autoGrade ? (
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
              autoGrade.letter === 'A+'
                ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300'
                : autoGrade.passed
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-lg border ${
                  autoGrade.letter === 'A+'
                    ? 'bg-amber-100 dark:bg-amber-500/30 border-amber-400 text-amber-800 dark:text-amber-300 shadow-sm'
                    : autoGrade.passed
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-500/20 border-rose-400 text-rose-800 dark:text-rose-300'
                }`}>
                  {autoGrade.letter}
                </div>

                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    {autoGrade.letter === 'A+' && <Award className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-bounce" />}
                    <span>
                      {autoGrade.letter === 'A+'
                        ? 'Điểm Chữ A+ (Xuất Sắc Tuyệt Đối >= 9.5)'
                        : `Điểm Chữ ${autoGrade.letter} (${autoGrade.passed ? 'Đạt' : 'Không đạt'})`}
                    </span>
                  </div>
                  <div className="text-[11px] opacity-80 font-mono mt-0.5">
                    Tổng kết: <strong>{autoGrade.total10}</strong>/10 • Thang 4: <strong>{autoGrade.scale4}</strong>/4.0
                    {parseFloat(gradeCk) < 3.0 && ' • Cảnh báo điểm liệt CK < 3.0!'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  autoGrade.passed ? 'bg-emerald-100 dark:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-600/30 text-rose-800 dark:text-rose-300'
                }`}>
                  {autoGrade.passed ? 'Tự động qua môn' : 'Tự động báo nợ môn'}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 italic text-center">
              Nhập cả Điểm Quá Trình và Điểm Cuối Kỳ để hệ thống tự động tính điểm tổng kết và quy đổi sang điểm chữ (A+, A, B+, B, C+, C, D+, D, F).
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="retakeCheckbox"
              checked={isRetake}
              onChange={e => setIsRetake(e.target.checked)}
              className="rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="retakeCheckbox" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              Đây là môn học lại cải thiện điểm (Chỉ tính điểm cao nhất vào CPA, không nhân đôi số tín)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
            <div>
              {!isNewCourse && onDeleteCourse && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-white bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-600 dark:hover:bg-rose-600/20 border border-rose-200 dark:border-rose-500/30 transition-colors"
                  title="Xóa học phần này khỏi danh mục"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Học Phần</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-900/20 transition-colors"
              >
                {isNewCourse ? 'Thêm Vào CTĐT' : 'Lưu Kết Quả & Thông Tin'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
