import React, { useState, useEffect } from 'react';
import { useDashboardState } from './hooks/useDashboardState';
import { DashboardTab } from './types/state';
import { Deadline } from './types/deadline';
import { Course } from './types/course';
import { ScheduleItem } from './types/schedule';
import { getCurriculum } from './data/curricula';

// Layout & Dashboard Components
import { AppShell } from './components/layout/AppShell';
import { SideNavDrawer } from './components/layout/SideNavDrawer';
import { SortableDashboardGrid } from './components/dashboard/SortableDashboardGrid';

// Feature Components
import { ScheduleManager } from './components/schedule/ScheduleManager';
import { CurriculumView } from './components/curriculum/CurriculumView';
import { ExamPredictor } from './components/grade-calculator/ExamPredictor';
import { CpaTargetTracker } from './components/grade-calculator/CpaTargetTracker';
import { GradeScaleTable } from './components/grade-calculator/GradeScaleTable';
import { StudyPlannerView } from './components/planner/StudyPlannerView';
import { RawTextImportModal } from './components/sis/RawTextImportModal';
import { BackupRestore } from './components/sis/BackupRestore';
import { SettingsModal } from './components/settings/SettingsModal';
import { DeadlineModal } from './components/dashboard/DeadlineModal';
import { CourseDetailModal } from './components/curriculum/CourseDetailModal';
import { SmartScheduleOptimizerModal } from './components/schedule/SmartScheduleOptimizerModal';
import { Settings, ClipboardPaste, Sparkles, ShieldCheck } from 'lucide-react';
import { ParsedCourseResult, ParsedStudentInfo } from './engines/sisParser';

import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

const PALETTE_STATUS_BAR_COLORS: Record<string, string> = {
  crimson: '#b91c1c',
  ocean: '#0369a1',
  emerald: '#047857',
  amethyst: '#6d28d9',
  amber: '#b45309',
  oled: '#000000',
};

export const App: React.FC = () => {
  const {
    state,
    addDeadline,
    updateDeadline,
    deleteDeadline,
    toggleDeadlineComplete,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    importScheduleItems,
    updateCourse,
    addCourse,
    deleteCourse,
    batchUpdateCourses,
    batchDeleteCourses,
    changeMajor,
    updateStudentInfo,
    updateSettings,
    updateGradeScales,
    resetToSampleData,
    importFullState,
    mergeSisCourses,
    toggleEnglishExemption,
    updateEnglishExemptions,
    updateDashboardCardOrder,
    toggleHideDashboardCard,
    restoreAllDashboardCards,
    applyGeneratedSchedule,
    importCoursesFromExcel,
    importScheduleFromExcel,
    purgeAllData
  } = useDashboardState();

  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [isRawTextModalOpen, setIsRawTextModalOpen] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isArrangeMode, setIsArrangeMode] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'profile' | 'scales' | 'ui' | 'danger'>('profile');
  const [isScheduleOptimizerOpen, setIsScheduleOptimizerOpen] = useState(false);
  const [detailModalCourse, setDetailModalCourse] = useState<Course | null>(null);

  // Tích hợp Native Android: Màu Status Bar theo Theme Palette & Phím Back vật lý
  useEffect(() => {
    try {
      const palette = state.settings.themePalette || 'crimson';
      const barColor = PALETTE_STATUS_BAR_COLORS[palette] || '#b91c1c';
      StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
      StatusBar.setBackgroundColor({ color: barColor }).catch(() => {});
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    } catch {
      // Ignored on web browser
    }

    let backListener: any = null;
    try {
      CapApp.addListener('backButton', () => {
        if (detailModalCourse) {
          setDetailModalCourse(null);
        } else if (isScheduleOptimizerOpen) {
          setIsScheduleOptimizerOpen(false);
        } else if (isSideNavOpen) {
          setIsSideNavOpen(false);
        } else if (isRawTextModalOpen) {
          setIsRawTextModalOpen(false);
        } else if (isDeadlineModalOpen) {
          setIsDeadlineModalOpen(false);
        } else if (isSettingsModalOpen) {
          setIsSettingsModalOpen(false);
        } else if (isArrangeMode) {
          setIsArrangeMode(false);
        } else if (activeTab !== 'dashboard') {
          setActiveTab('dashboard');
        } else {
          CapApp.exitApp();
        }
      }).then(handle => {
        backListener = handle;
      }).catch(() => {});
    } catch {
      // Ignored on web browser
    }

    return () => {
      if (backListener && typeof backListener.remove === 'function') {
        backListener.remove();
      }
    };
  }, [
    detailModalCourse,
    isScheduleOptimizerOpen,
    isSideNavOpen,
    isRawTextModalOpen,
    isDeadlineModalOpen,
    isSettingsModalOpen,
    isArrangeMode,
    activeTab,
    state.settings.themePalette
  ]);

  // Đồng bộ class .theme-light, .auto-contrast và [data-theme] trên thẻ <html>
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('dark');
    } else {
      root.classList.remove('theme-light');
      root.classList.add('dark');
    }

    // Thiết lập palette màu chủ đề (Crimson HUST, Ocean, Emerald, Amethyst, Amber, OLED)
    const palette = state.settings.themePalette || 'crimson';
    root.setAttribute('data-theme', palette);

    // Tính năng tự động tương phản màu nền WCAG AAA là bắt buộc trên toàn hệ thống
    root.classList.add('auto-contrast');
  }, [state.settings.theme, state.settings.themePalette]);

  // Nút chuyển đổi nhanh Sáng / Tối
  const handleToggleTheme = () => {
    const nextTheme = state.settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: nextTheme });
  };

  // Số deadline khẩn cấp (< 24h)
  const now = Date.now();
  const urgentDeadlineCount = state.deadlines.filter(d => {
    if (d.completed) return false;
    const diff = new Date(d.dueAt).getTime() - now;
    return diff > 0 && diff <= (state.settings.urgentThresholdHours || 24) * 60 * 60 * 1000;
  }).length;

  const handleOpenAddDeadline = () => {
    setEditingDeadline(null);
    setIsDeadlineModalOpen(true);
  };

  const handleEditDeadline = (deadline: Deadline) => {
    setEditingDeadline(deadline);
    setIsDeadlineModalOpen(true);
  };

  const handleSaveDeadline = (data: Omit<Deadline, 'id'>) => {
    if (editingDeadline) {
      updateDeadline(editingDeadline.id, data);
    } else {
      addDeadline(data);
    }
  };

  // Đổi chuyên ngành đào tạo: KHÔNG lưu lại thông tin của mã ngành cũ
  const handleSelectMajor = (majorCode: string) => {
    changeMajor(majorCode);
  };

  // Callback nhập văn bản thô (Ctrl+A từ trang web)
  const handleImportCoursesFromRaw = (courses: ParsedCourseResult[], studentInfo?: ParsedStudentInfo) => {
    if (studentInfo) {
      updateStudentInfo({
        name: studentInfo.name || state.studentInfo.name,
        studentId: studentInfo.studentId || state.studentInfo.studentId,
        major: studentInfo.major || state.studentInfo.major,
        majorName: studentInfo.majorName || state.studentInfo.majorName,
        classCode: studentInfo.classCode || state.studentInfo.classCode,
        cohort: studentInfo.cohort || state.studentInfo.cohort,
      });
    }
    mergeSisCourses(courses);
  };

  const handleImportScheduleFromRaw = (items: ScheduleItem[]) => {
    importScheduleItems(items);
  };

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      studentInfo={state.studentInfo}
      theme={state.settings.theme}
      urgentDeadlineCount={urgentDeadlineCount}
      onOpenSettings={() => setIsSettingsModalOpen(true)}
      onResetSampleData={purgeAllData}
      onOpenRawTextModal={() => setIsRawTextModalOpen(true)}
      onOpenSideNav={() => setIsSideNavOpen(true)}
    >
      {/* TAB 1: Tổng Quan & Dashboard Với Tính Năng Kéo Thả Thẻ & Ẩn Thẻ */}
      {activeTab === 'dashboard' && (
        <div className="animate-page-slide">
          <SortableDashboardGrid
            cardOrder={state.settings.dashboardCardOrder}
            hiddenCards={state.settings.dashboardHiddenCards || []}
            onUpdateCardOrder={updateDashboardCardOrder}
            onToggleHideCard={toggleHideDashboardCard}
            onRestoreHiddenCards={restoreAllDashboardCards}
            isArrangeMode={isArrangeMode}
            onExitArrangeMode={() => setIsArrangeMode(false)}
            studentInfo={state.studentInfo}
            courses={state.courses}
            totalCurriculumCredits={getCurriculum(state.studentInfo.major).totalCredits || 135}
            deadlines={state.deadlines}
            schedule={state.schedule}
            onOpenCourseDetail={(course: Course) => setDetailModalCourse(course)}
            onNavigateToCurriculum={() => setActiveTab('curriculum')}
            onToggleDeadlineComplete={toggleDeadlineComplete}
            onOpenAddDeadline={handleOpenAddDeadline}
            onEditDeadline={handleEditDeadline}
          />
        </div>
      )}

      {/* TAB 2: Thời Khóa Biểu (TKB) */}
      {activeTab === 'schedule' && (
        <div className="animate-page-slide">
          <ScheduleManager
            schedule={state.schedule}
            onAddScheduleItem={addScheduleItem}
            onUpdateScheduleItem={updateScheduleItem}
            onDeleteScheduleItem={deleteScheduleItem}
            onImportScheduleItems={importScheduleItems}
            onImportScheduleFromExcel={importScheduleFromExcel}
            onOpenOptimizer={() => setIsScheduleOptimizerOpen(true)}
          />
        </div>
      )}

      {/* TAB 3: Bản đồ CTĐT & Cây Tiên Quyết */}
      {activeTab === 'curriculum' && (
        <div className="animate-page-slide">
          <CurriculumView
            courses={state.courses}
            onUpdateCourse={updateCourse}
            onAddCourse={addCourse}
            onDeleteCourse={deleteCourse}
            onBatchUpdateCourses={batchUpdateCourses}
            onBatchDeleteCourses={batchDeleteCourses}
            majorCode={state.studentInfo.major}
            onSelectMajor={handleSelectMajor}
            onImportCoursesFromExcel={importCoursesFromExcel}
          />
        </div>
      )}

      {/* TAB 4: Máy Tính Điểm Thi CK & Mục Tiêu CPA */}
      {activeTab === 'grade-calculator' && (
        <div className="space-y-6 animate-page-slide">
          <ExamPredictor />
          <CpaTargetTracker
            courses={state.courses}
            initialTargetCpa={state.studentInfo.targetCpa}
            totalCurriculumCredits={getCurriculum(state.studentInfo.major).totalCredits || 135}
            onUpdateTargetCpa={target => updateStudentInfo({ targetCpa: target })}
          />
          <GradeScaleTable />
        </div>
      )}

      {/* TAB 5: Dự Đoán GPA & Gợi Ý Môn Học */}
      {activeTab === 'planner' && (
        <div className="animate-page-slide">
          <StudyPlannerView
            courses={state.courses}
            semesterHistory={state.semesterHistory}
          />
        </div>
      )}

      {/* TAB 6: Cổng Dữ Liệu SIS HUST - Tự Động Nhận Diện Dữ Liệu Từ Văn Bản Thô */}
      {activeTab === 'sis' && (
        <div className="space-y-6 animate-page-slide">
          {/* Main Hero Card for Raw Text Auto-Detector */}
          <div className="bg-gradient-to-br from-red-600/10 via-slate-900/60 to-slate-900/90 border border-red-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center shadow-md shadow-red-900/30 shrink-0">
                  <ClipboardPaste className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Nhận Diện Dữ Liệu SIS / QLĐT</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/20 text-red-600 dark:text-red-400 font-bold border border-red-500/30">
                      Ctrl + A
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Hỗ trợ 100% điện thoại di động & máy tính không cần DevTools.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsRawTextModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/25 transition-all flex items-center gap-2 shrink-0 active:scale-95"
              >
                <ClipboardPaste className="w-4 h-4" />
                <span>Mở Trình Dán Dữ Liệu</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-white">1. Chọn tất cả</span>
                  <span className="text-[11px] text-slate-400">Ctrl + A toàn bộ trang SIS / CTT và Copy.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-white">2. Dán vào ứng dụng</span>
                  <span className="text-[11px] text-slate-400">Tự động trích xuất thông tin & loại bỏ rác.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5">
                <ClipboardPaste className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-white">3. Đồng bộ hoàn tất</span>
                  <span className="text-[11px] text-slate-400">Điền điểm số, tín chỉ và TKB ngay tức thì.</span>
                </div>
              </div>
            </div>
          </div>

          <BackupRestore
            state={state}
            onImportState={importFullState}
            onResetSampleData={purgeAllData}
          />
        </div>
      )}

      {/* TAB 7: Cài Đặt Hệ Thống */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 animate-page-slide">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <Settings className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Cài Đặt Hệ Thống</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Quản lý tài khoản sinh viên, chuyên ngành, thang điểm và bảng màu giao diện.
          </p>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/25 transition-all"
          >
            Mở Bảng Cài Đặt
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <SideNavDrawer
        isOpen={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
        studentInfo={state.studentInfo}
        onOpenSettings={(tab) => {
          setSettingsInitialTab(tab || 'profile');
          setIsSideNavOpen(false);
          setIsSettingsModalOpen(true);
        }}
        isArrangeMode={isArrangeMode}
        onToggleArrangeMode={() => {
          setIsSideNavOpen(false);
          setIsArrangeMode(!isArrangeMode);
          if (activeTab !== 'dashboard') setActiveTab('dashboard');
        }}
        onResetCardOrder={() => updateDashboardCardOrder(['hero', 'kpi', 'courses', 'deadlines'])}
        hiddenCards={state.settings.dashboardHiddenCards || []}
        onToggleHideCard={toggleHideDashboardCard}
        onRestoreHiddenCards={restoreAllDashboardCards}
      />

      <SmartScheduleOptimizerModal
        isOpen={isScheduleOptimizerOpen}
        onClose={() => setIsScheduleOptimizerOpen(false)}
        allCourses={state.courses}
        studentInfo={state.studentInfo}
        onApplySchedule={applyGeneratedSchedule}
      />

      <RawTextImportModal
        isOpen={isRawTextModalOpen}
        onClose={() => setIsRawTextModalOpen(false)}
        onImportCourses={handleImportCoursesFromRaw}
        onImportSchedule={handleImportScheduleFromRaw}
      />

      <DeadlineModal
        isOpen={isDeadlineModalOpen}
        onClose={() => setIsDeadlineModalOpen(false)}
        onSave={handleSaveDeadline}
        editingDeadline={editingDeadline}
        courses={state.courses}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        initialTab={settingsInitialTab}
        studentInfo={state.studentInfo}
        settings={state.settings}
        allCourses={state.courses}
        onUpdateStudentInfo={updateStudentInfo}
        onUpdateSettings={updateSettings}
        onUpdateGradeScales={updateGradeScales}
        onToggleEnglishExemption={toggleEnglishExemption}
        onUpdateEnglishExemptions={updateEnglishExemptions}
        onPurgeAllData={purgeAllData}
        onResetToSampleData={purgeAllData}
      />

      {detailModalCourse && (
        <CourseDetailModal
          isOpen={!!detailModalCourse}
          onClose={() => setDetailModalCourse(null)}
          course={detailModalCourse}
          allCourses={state.courses}
          onUpdateCourse={updateCourse}
          onDeleteCourse={deleteCourse}
        />
      )}
    </AppShell>
  );
};

export default App;
