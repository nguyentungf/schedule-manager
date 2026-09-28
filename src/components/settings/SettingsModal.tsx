import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StudentInfo, DashboardSettings, CustomGradeScaleSettings, ThemePalette } from '../../types/state';
import { Course } from '../../types/course';
import { AVAILABLE_MAJORS } from '../../data/curricula';
import { User, Sliders, Palette, Check, RefreshCw, ShieldAlert, Trash2, GraduationCap } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentInfo: StudentInfo;
  settings: DashboardSettings;
  allCourses?: Course[];
  onUpdateStudentInfo: (updates: Partial<StudentInfo>) => void;
  onUpdateSettings: (updates: Partial<DashboardSettings>) => void;
  onUpdateGradeScales: (scales: CustomGradeScaleSettings) => void;
  onToggleEnglishExemption?: (exempt: boolean) => void;
  onUpdateEnglishExemptions?: (courses: string[]) => void;
  onPurgeAllData?: () => void;
  onResetToSampleData?: () => void;
}

const COMMON_ENGLISH_COURSES = [
  { code: 'FL1010', name: 'Tiếng Anh I', credits: 3 },
  { code: 'FL1020', name: 'Tiếng Anh II', credits: 3 },
  { code: 'FL1030', name: 'Tiếng Anh III', credits: 3 },
  { code: 'FL2010', name: 'Tiếng Anh IV', credits: 3 },
  { code: 'FL2020', name: 'Tiếng Anh Chuyên Ngành', credits: 2 }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  studentInfo,
  settings,
  allCourses = [],
  onUpdateStudentInfo,
  onUpdateSettings,
  onUpdateGradeScales,
  onToggleEnglishExemption,
  onUpdateEnglishExemptions,
  onPurgeAllData,
  onResetToSampleData
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'scales' | 'ui' | 'danger'>('profile');
  const [sudoConfirmText, setSudoConfirmText] = useState('');

  // Local state for profile
  const [profileForm, setProfileForm] = useState<StudentInfo>({ ...studentInfo });

  // Danh sách các mã môn tiếng Anh được miễn
  const [exemptEnglishCourses, setExemptEnglishCourses] = useState<string[]>(() => {
    if (studentInfo.exemptEnglishCourses && studentInfo.exemptEnglishCourses.length > 0) {
      return [...studentInfo.exemptEnglishCourses];
    }
    if (studentInfo.exemptEnglish) {
      return ['FL1010', 'FL1020'];
    }
    return [];
  });

  // Local state for grade scales
  const [scalesForm, setScalesForm] = useState<CustomGradeScaleSettings>({
    ...settings.gradeScales
  });

  // Local state for UI settings
  const [uiForm, setUiForm] = useState({
    theme: settings.theme,
    themePalette: settings.themePalette || 'crimson',
    soundEnabled: settings.soundEnabled,
    urgentThresholdHours: settings.urgentThresholdHours || 24,
    warningThresholdHours: settings.warningThresholdHours || 72
  });

  const handleToggleCourseExemption = (code: string) => {
    if (exemptEnglishCourses.includes(code)) {
      setExemptEnglishCourses(exemptEnglishCourses.filter(c => c !== code));
    } else {
      setExemptEnglishCourses([...exemptEnglishCourses, code]);
    }
  };

  const applyPresetIeltsHigh = () => {
    setExemptEnglishCourses(['FL1010', 'FL1020', 'FL1030', 'FL2010']);
  };

  const applyPresetIeltsMid = () => {
    setExemptEnglishCourses(['FL1010', 'FL1020']);
  };

  const applyPresetClear = () => {
    setExemptEnglishCourses([]);
  };

  const handleSave = () => {
    onUpdateStudentInfo({
      ...profileForm,
      exemptEnglishCourses,
      exemptEnglish: exemptEnglishCourses.length > 0
    });
    onUpdateGradeScales(scalesForm);
    onUpdateSettings(uiForm);

    if (onUpdateEnglishExemptions) {
      onUpdateEnglishExemptions(exemptEnglishCourses);
    } else if (onToggleEnglishExemption) {
      onToggleEnglishExemption(exemptEnglishCourses.length > 0);
    }

    alert('✅ Cài đặt hệ thống đã được lưu thành công!');
    onClose();
  };

  const handleResetScalesToDefault = () => {
    setScalesForm({
      minA: 8.5,
      minBPlus: 8.0,
      minB: 7.0,
      minCPlus: 6.5,
      minC: 5.5,
      minDPlus: 5.0,
      minD: 4.0,
      failFinalExamMin: 3.0
    });
  };

  const handleMajorSelect = (code: string) => {
    const found = AVAILABLE_MAJORS.find(m => m.code === code);
    setProfileForm({
      ...profileForm,
      major: code,
      majorName: found ? found.name : code
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cài Đặt Hệ Thống (System Settings)"
      subtitle="Tùy biến tài khoản, giao diện và ngưỡng quy đổi thang điểm 4 - 10"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('profile')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeSubTab === 'profile'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Tài Khoản Sinh Viên</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('scales')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeSubTab === 'scales'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Thang Điểm 4 - 10</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('ui')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeSubTab === 'ui'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Bảng Màu Giao Diện</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('danger')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeSubTab === 'danger'
                ? 'bg-rose-700 text-white shadow'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Vùng Đỏ (Reset)</span>
          </button>
        </div>

        {/* TAB 1: Profile & Major */}
        {activeSubTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Họ và tên sinh viên
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mã số sinh viên (MSSV)
                </label>
                <input
                  type="text"
                  value={profileForm.studentId}
                  onChange={e => setProfileForm({ ...profileForm, studentId: e.target.value })}
                  placeholder="VD: 20210001"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ngành / Chương trình đào tạo (Đại học Bách Khoa Hà Nội)
                </label>
                <select
                  value={profileForm.major}
                  onChange={e => handleMajorSelect(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-medium cursor-pointer"
                >
                  {AVAILABLE_MAJORS.map(m => (
                    <option key={m.code} value={m.code}>
                      {m.name} ({m.faculty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lớp quản lý / Khóa
                </label>
                <input
                  type="text"
                  value={profileForm.classCode}
                  onChange={e => setProfileForm({ ...profileForm, classCode: e.target.value })}
                  placeholder="VD: Kỹ thuật Máy tính 01-K66"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Khóa sinh viên
                </label>
                <input
                  type="text"
                  value={profileForm.cohort}
                  onChange={e => setProfileForm({ ...profileForm, cohort: e.target.value })}
                  placeholder="VD: K66, K67, K68..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Học kỳ hiện tại (1 - 10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={profileForm.currentTerm}
                  onChange={e => setProfileForm({ ...profileForm, currentTerm: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mục tiêu CPA tốt nghiệp (thang 4.0)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="2.0"
                  max="4.0"
                  value={profileForm.targetCpa}
                  onChange={e => setProfileForm({ ...profileForm, targetCpa: parseFloat(e.target.value) || 3.2 })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-red-600 dark:text-amber-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono font-bold"
                />
              </div>

              {/* Tùy chọn học phần tiếng Anh / Ngoại ngữ được miễn */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>Miễn Học Phần Ngoại Ngữ / Tiếng Anh (IELTS, TOEIC...)</span>
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tích chọn các môn tiếng Anh bạn được miễn. Môn được miễn sẽ tự động qua môn và không tính nợ tín chỉ.
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={applyPresetIeltsHigh}
                      className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-semibold hover:bg-emerald-100"
                    >
                      IELTS ≥ 6.5
                    </button>
                    <button
                      type="button"
                      onClick={applyPresetIeltsMid}
                      className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 text-[10px] font-semibold hover:bg-blue-100"
                    >
                      IELTS 5.5-6.0
                    </button>
                    <button
                      type="button"
                      onClick={applyPresetClear}
                      className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold hover:bg-slate-300"
                    >
                      Học Đầy Đủ
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {COMMON_ENGLISH_COURSES.map(course => {
                    const isExempt = exemptEnglishCourses.includes(course.code);
                    return (
                      <label
                        key={course.code}
                        className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isExempt
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-semibold'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isExempt}
                            onChange={() => handleToggleCourseExemption(course.code)}
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                          />
                          <div>
                            <span className="text-xs font-mono font-bold block">{course.code}</span>
                            <span className="text-[10px] opacity-80">{course.name} ({course.credits} TC)</span>
                          </div>
                        </div>
                        {isExempt && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                            Miễn
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Custom Grade Scales */}
        {activeSubTab === 'scales' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Tùy chỉnh ngưỡng điểm thang 10 tối thiểu để đạt các điểm chữ theo quy chế từng khóa/hệ:
              </span>
              <button
                type="button"
                onClick={handleResetScalesToDefault}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Mặc định HUST</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-red-600 dark:text-red-400 block mb-1">Điểm A (4.0)</span>
                <input
                  type="number"
                  step="0.1"
                  value={scalesForm.minA}
                  onChange={e => setScalesForm({ ...scalesForm, minA: parseFloat(e.target.value) || 8.5 })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mb-1">Điểm B+ (3.5)</span>
                <input
                  type="number"
                  step="0.1"
                  value={scalesForm.minBPlus}
                  onChange={e => setScalesForm({ ...scalesForm, minBPlus: parseFloat(e.target.value) || 8.0 })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block mb-1">Điểm B (3.0)</span>
                <input
                  type="number"
                  step="0.1"
                  value={scalesForm.minB}
                  onChange={e => setScalesForm({ ...scalesForm, minB: parseFloat(e.target.value) || 7.0 })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 block mb-1">Điểm C+ (2.5)</span>
                <input
                  type="number"
                  step="0.1"
                  value={scalesForm.minCPlus}
                  onChange={e => setScalesForm({ ...scalesForm, minCPlus: parseFloat(e.target.value) || 6.5 })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Điểm C (2.0)</span>
                <input
                  type="number"
                  step="0.1"
                  value={scalesForm.minC}
                  onChange={e => setScalesForm({ ...scalesForm, minC: parseFloat(e.target.value) || 5.5 })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-500 block mb-1">Điểm Liệt Cuối Kỳ</span>
                <input
                  type="number"
                  step="0.1"
                  value={scalesForm.failFinalExamMin}
                  onChange={e => setScalesForm({ ...scalesForm, failFinalExamMin: parseFloat(e.target.value) || 3.0 })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-rose-600 dark:text-rose-400 font-mono font-bold"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              * Điểm học phần dưới ngưỡng D (hoặc điểm thi cuối kỳ dưới điểm liệt) sẽ bị xếp loại F (0.0).
            </p>
          </div>
        )}

        {/* TAB 3: UI & 6 Theme Palettes */}
        {activeSubTab === 'ui' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Chế độ Nền (Light / Dark)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUiForm({ ...uiForm, theme: 'light' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    uiForm.theme === 'light'
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-white font-bold ring-1 ring-red-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <strong className="block text-xs text-slate-900 dark:text-white">Giao diện Sáng (Light Clean)</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Nền trắng xám hiện đại, tương phản WCAG AAA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUiForm({ ...uiForm, theme: 'dark' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    uiForm.theme === 'dark' || uiForm.theme === 'crimson'
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-white font-bold ring-1 ring-red-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <strong className="block text-xs text-slate-900 dark:text-white">Giao diện Tối (Deep Night)</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Dịu mắt ban đêm, bảo vệ thị lực</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                6 Bộ Bảng Màu Đa Dạng (Chuẩn Impeccable Design)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'crimson', name: 'Crimson HUST', desc: 'Đỏ Bách Khoa rực lửa', color: '#dc2626' },
                  { id: 'ocean', name: 'Deep Ocean', desc: 'Xanh biển sâu công nghệ', color: '#0284c7' },
                  { id: 'emerald', name: 'Lush Emerald', desc: 'Xanh ngọc bích thiên nhiên', color: '#059669' },
                  { id: 'amethyst', name: 'Royal Amethyst', desc: 'Tím thạch anh hoàng gia', color: '#7c3aed' },
                  { id: 'amber', name: 'Sunset Amber', desc: 'Vàng hổ phách ấm áp', color: '#d97706' },
                  { id: 'oled', name: 'Monochrome OLED', desc: 'Đen tuyền tiết kiệm pin', color: '#38bdf8' },
                ].map(palette => {
                  const isSelected = (uiForm.themePalette || 'crimson') === palette.id;
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => setUiForm({ ...uiForm, themePalette: palette.id as ThemePalette })}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-red-500 bg-red-50/50 dark:bg-slate-800/80 shadow-md ring-1 ring-red-500'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0" style={{ backgroundColor: palette.color }} />
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{palette.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400 ml-auto shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                        {palette.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white block">Hiệu ứng pháo hoa Confetti</strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Bắn pháo hoa ăn mừng khi đánh dấu hoàn thành deadline</span>
              </div>
              <input
                type="checkbox"
                checked={uiForm.soundEnabled}
                onChange={e => setUiForm({ ...uiForm, soundEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-red-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ngưỡng deadline Nguy cấp (Giờ)
                </label>
                <input
                  type="number"
                  min="6"
                  max="48"
                  value={uiForm.urgentThresholdHours}
                  onChange={e => setUiForm({ ...uiForm, urgentThresholdHours: parseInt(e.target.value) || 24 })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ngưỡng deadline Sắp đến hạn (Giờ)
                </label>
                <input
                  type="number"
                  min="24"
                  max="120"
                  value={uiForm.warningThresholdHours}
                  onChange={e => setUiForm({ ...uiForm, warningThresholdHours: parseInt(e.target.value) || 72 })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Danger Zone (Vùng Đỏ Nguy Hiểm & Sudo Confirm) */}
        {activeSubTab === 'danger' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-300 dark:border-rose-500/40 text-xs space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                <Trash2 className="w-4 h-4" />
                <span>Xóa Toàn Bộ Dữ Liệu & Làm Sạch Database</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Thao tác này sẽ xóa sạch hoàn toàn tất cả môn học, điểm số, lịch trình và danh sách deadline đã lưu trong trình duyệt. Toàn bộ hệ thống sẽ trở về trạng thái cơ sở dữ liệu trống tinh 100%.
              </p>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/60 space-y-2">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Nhập chính xác cụm từ <strong className="text-rose-600 font-mono">XOA DU LIEU</strong> để xác nhận:
                </label>
                <input
                  type="text"
                  value={sudoConfirmText}
                  onChange={e => setSudoConfirmText(e.target.value)}
                  placeholder="XOA DU LIEU"
                  className="w-full bg-rose-50/50 dark:bg-slate-800 border border-rose-300 dark:border-rose-700 rounded-lg px-3 py-2 text-xs text-rose-700 dark:text-rose-300 font-mono uppercase tracking-wider focus:outline-none"
                />
                <button
                  type="button"
                  disabled={sudoConfirmText.trim().toUpperCase() !== 'XOA DU LIEU'}
                  onClick={() => {
                    if (onPurgeAllData) {
                      onPurgeAllData();
                      alert('🧹 Đã xóa sạch toàn bộ dữ liệu!');
                      onClose();
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xác Nhận Xóa Sạch Database</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-900/20 transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Lưu Thay Đổi</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
