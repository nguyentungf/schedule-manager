import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StudentInfo, DashboardSettings, CustomGradeScaleSettings } from '../../types/state';
import { AVAILABLE_MAJORS } from '../../data/curricula';
import { User, Sliders, Palette, Check, RefreshCw, ShieldAlert, Trash2, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentInfo: StudentInfo;
  settings: DashboardSettings;
  onUpdateStudentInfo: (updates: Partial<StudentInfo>) => void;
  onUpdateSettings: (updates: Partial<DashboardSettings>) => void;
  onUpdateGradeScales: (scales: CustomGradeScaleSettings) => void;
  onToggleEnglishExemption?: (exempt: boolean) => void;
  onPurgeAllData?: () => void;
  onResetToSampleData?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  studentInfo,
  settings,
  onUpdateStudentInfo,
  onUpdateSettings,
  onUpdateGradeScales,
  onToggleEnglishExemption,
  onPurgeAllData,
  onResetToSampleData
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'scales' | 'ui' | 'danger'>('profile');
  const [sudoConfirmText, setSudoConfirmText] = useState('');

  // Local state for profile
  const [profileForm, setProfileForm] = useState<StudentInfo>({ ...studentInfo });

  // Local state for grade scales
  const [scalesForm, setScalesForm] = useState<CustomGradeScaleSettings>({
    ...settings.gradeScales
  });

  // Local state for UI settings
  const [uiForm, setUiForm] = useState({
    theme: settings.theme,
    soundEnabled: settings.soundEnabled,
    urgentThresholdHours: settings.urgentThresholdHours,
    warningThresholdHours: settings.warningThresholdHours,
    autoContrast: settings.autoContrast !== false
  });

  const handleSaveAll = () => {
    onUpdateStudentInfo(profileForm);
    onUpdateGradeScales(scalesForm);
    onUpdateSettings(uiForm);
    if (onToggleEnglishExemption && profileForm.exemptEnglish !== undefined) {
      onToggleEnglishExemption(Boolean(profileForm.exemptEnglish));
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
            <span>Giao Diện</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('danger')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              activeSubTab === 'danger'
                ? 'bg-rose-600 text-white shadow'
                : 'text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Vùng Nguy Hiểm</span>
          </button>
        </div>

        {/* TAB 1: Account / Profile */}
        {activeSubTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Họ và tên sinh viên
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
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
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chuyên ngành đào tạo Bách Khoa
                </label>
                <select
                  value={profileForm.major}
                  onChange={e => handleMajorSelect(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
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
                  Lớp sinh viên & Khóa học
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={profileForm.classCode}
                    onChange={e => setProfileForm({ ...profileForm, classCode: e.target.value })}
                    placeholder="Lớp QL: IT1-01"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    value={profileForm.cohort}
                    onChange={e => setProfileForm({ ...profileForm, cohort: e.target.value })}
                    placeholder="Khóa: K66"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kỳ học hiện tại (1 - 8)
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

              {/* Tùy chọn học phần tiếng Anh / Ngoại ngữ */}
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Tùy chọn Học phần Ngoại ngữ / Tiếng Anh (FL*)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Bật tùy chọn này nếu bạn đã nộp chứng chỉ tiếng Anh (IELTS, TOEIC...) để được miễn các học phần FL1010, FL1020...
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={profileForm.exemptEnglish ?? false}
                      onChange={e => setProfileForm({ ...profileForm, exemptEnglish: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <div className="text-[11px] font-mono font-medium">
                  {profileForm.exemptEnglish ? (
                    <span className="text-emerald-600 dark:text-emerald-400">✓ Đang BẬT Miễn Tiếng Anh: Các môn FL được đánh dấu đạt/miễn, không tính vào số tín nợ.</span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400">• Đang TẮT Miễn Tiếng Anh: Sinh viên học và tích lũy các học phần Tiếng Anh theo khung CTĐT chuẩn.</span>
                  )}
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
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Điểm D+ (1.5)</span>
                <input
                  type="number"
                  step="0.1"
                  value={scalesForm.minDPlus}
                  onChange={e => setScalesForm({ ...scalesForm, minDPlus: parseFloat(e.target.value) || 5.0 })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-yellow-600 dark:text-yellow-500 block mb-1">Điểm D (1.0)</span>
                <input
                  type="number"
                  step="0.1"
                  value={scalesForm.minD}
                  onChange={e => setScalesForm({ ...scalesForm, minD: parseFloat(e.target.value) || 4.0 })}
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

        {/* TAB 3: UI & Appearance */}
        {activeSubTab === 'ui' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Chủ đề giao diện (Theme)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setUiForm({ ...uiForm, theme: 'light' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    uiForm.theme === 'light'
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <strong className="block text-xs font-bold text-slate-900 dark:text-white">Light Clean</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Sáng tinh tế, dịu mắt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUiForm({ ...uiForm, theme: 'dark' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    uiForm.theme === 'dark'
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <strong className="block text-xs font-bold text-slate-900 dark:text-white">Deep Slate</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Tông màu Bách Khoa chuẩn</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUiForm({ ...uiForm, theme: 'oled' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    uiForm.theme === 'oled'
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <strong className="block text-xs font-bold text-slate-900 dark:text-white">OLED Black</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Đen tuyền tiết kiệm pin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUiForm({ ...uiForm, theme: 'crimson' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    uiForm.theme === 'crimson'
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <strong className="block text-xs font-bold text-slate-900 dark:text-white">HUST Crimson</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Đỏ rực năng động</span>
                </button>
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

            {/* Auto-Contrast WCAG AAA Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="pr-4">
                <strong className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span>Tự động tương phản màu nền (Auto-Contrast WCAG AAA)</span>
                </strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Tự động tính toán và tối ưu độ tương phản văn bản và biểu tượng trên mọi bề mặt nền sáng/tối. Loại bỏ triệt để hiện tượng mất chữ hoặc chữ trắng chìm trên nền trắng.
                </span>
              </div>
              <input
                type="checkbox"
                checked={uiForm.autoContrast}
                onChange={e => setUiForm({ ...uiForm, autoContrast: e.target.checked })}
                className="w-4 h-4 rounded text-red-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
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
              <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <span>VÙNG NGUY HIỂM: XÓA VĨNH VIỄN TOÀN BỘ DỮ LIỆU</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Hành động này sẽ xóa sạch vĩnh viễn: toàn bộ bảng điểm, môn học đã tích lũy, các lịch học trên thời khóa biểu, danh mục deadline và mọi tùy chỉnh cá nhân khỏi trình duyệt này. Không thể khôi phục lại sau khi xóa!
              </p>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-rose-200 dark:border-rose-900/50 space-y-2">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                  Để xác nhận, vui lòng gõ chính xác lệnh sudo bên dưới:
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 font-mono">
                  <span className="text-rose-600 dark:text-rose-400 font-bold select-all bg-rose-100 dark:bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 flex items-center justify-center">
                    sudo rm -rf
                  </span>
                  <input
                    type="text"
                    value={sudoConfirmText}
                    onChange={e => setSudoConfirmText(e.target.value)}
                    placeholder="Gõ 'sudo rm -rf' vào đây..."
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={sudoConfirmText.trim().toLowerCase() !== 'sudo rm -rf'}
                onClick={() => {
                  if (onPurgeAllData) {
                    onPurgeAllData();
                    alert('🔥 Đã xóa toàn bộ dữ liệu thành công! Hệ thống đã được đưa về trạng thái trắng ban đầu.');
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-all shadow-lg shadow-rose-950/20 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>XÓA SẠCH VĨNH VIỄN TOÀN BỘ DỮ LIỆU (FACTORY PURGE)</span>
              </button>
            </div>

            {/* Khôi phục dữ liệu mẫu an toàn */}
            {onResetToSampleData && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Khôi phục về Dữ liệu Mẫu (Sample Data)</strong>
                  <span className="text-slate-500 dark:text-slate-400">Đặt lại dữ liệu mẫu ngành IT1 Bách Khoa</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Bạn có chắc muốn đặt lại toàn bộ dữ liệu mẫu không?')) {
                      onResetToSampleData();
                      alert('✅ Đã nạp lại dữ liệu mẫu ban đầu!');
                      onClose();
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
                >
                  Khôi Phục Mẫu
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-950/20 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Lưu Toàn Bộ Cài Đặt</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
