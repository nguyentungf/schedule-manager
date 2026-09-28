import React, { useState, useEffect } from 'react';
import { useDashboardState } from './hooks/useDashboardState';
import { DashboardTab } from './types/state';
import { Deadline } from './types/deadline';
import { Course } from './types/course';
import { getCurriculum, AVAILABLE_MAJORS } from './data/curricula';

// Layout & Dashboard Reference UI Components
import { AppShell } from './components/layout/AppShell';
import { HeroBanner } from './components/dashboard/HeroBanner';
import { AcademicKpiSection } from './components/dashboard/AcademicKpiSection';
import { EnrolledCoursesSection } from './components/dashboard/EnrolledCoursesSection';
import { InstructorsAndNotices } from './components/dashboard/InstructorsAndNotices';

// Feature Components
import { ScheduleManager } from './components/schedule/ScheduleManager';
import { CurriculumView } from './components/curriculum/CurriculumView';
import { ExamPredictor } from './components/grade-calculator/ExamPredictor';
import { CpaTargetTracker } from './components/grade-calculator/CpaTargetTracker';
import { GradeScaleTable } from './components/grade-calculator/GradeScaleTable';
import { StudyPlannerView } from './components/planner/StudyPlannerView';
import { SisPasteModal } from './components/sis/SisPasteModal';
import { CourseCatalogModal } from './components/curriculum/CourseCatalogModal';
import { BookmarkletGuide } from './components/sis/BookmarkletGuide';
import { BackupRestore } from './components/sis/BackupRestore';
import { SettingsModal } from './components/settings/SettingsModal';
import { DeadlineModal } from './components/dashboard/DeadlineModal';
import { CourseDetailModal } from './components/curriculum/CourseDetailModal';
import { Settings } from 'lucide-react';

import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

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
    mergeCourseCatalog,
    importCoursesFromExcel,
    importScheduleFromExcel,
    purgeAllData
  } = useDashboardState();

  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [isSisModalOpen, setIsSisModalOpen] = useState(false);
  const [isCourseCatalogModalOpen, setIsCourseCatalogModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [detailModalCourse, setDetailModalCourse] = useState<Course | null>(null);

  // Tích hợp Native Android: Màu Status Bar & Phím Back vật lý
  useEffect(() => {
    try {
      StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#b91c1c' }).catch(() => {});
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    } catch {
      // Ignored on web browser
    }

    let backListener: any = null;
    try {
      CapApp.addListener('backButton', () => {
        if (detailModalCourse) {
          setDetailModalCourse(null);
        } else if (isDeadlineModalOpen) {
          setIsDeadlineModalOpen(false);
        } else if (isSisModalOpen) {
          setIsSisModalOpen(false);
        } else if (isCourseCatalogModalOpen) {
          setIsCourseCatalogModalOpen(false);
        } else if (isSettingsModalOpen) {
          setIsSettingsModalOpen(false);
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
    isDeadlineModalOpen,
    isSisModalOpen,
    isCourseCatalogModalOpen,
    isSettingsModalOpen,
    activeTab
  ]);

  // Đồng bộ class .theme-light và .auto-contrast trên thẻ <html> để toàn bộ giao diện đổi màu chuẩn xác
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('dark');
    } else {
      root.classList.remove('theme-light');
      root.classList.add('dark');
    }

    // Tự động tương phản màu nền WCAG AAA trên toàn bộ content
    if (state.settings.autoContrast !== false) {
      root.classList.add('auto-contrast');
    } else {
      root.classList.remove('auto-contrast');
    }
  }, [state.settings.theme, state.settings.autoContrast]);

  // Nút chuyển đổi nhanh Sáng / Tối
  const handleToggleTheme = () => {
    const nextTheme = state.settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: nextTheme });
  };

  // Nút chuyển đổi nhanh Tự động tương phản
  const handleToggleAutoContrast = () => {
    const nextAutoContrast = state.settings.autoContrast === false;
    updateSettings({ autoContrast: nextAutoContrast });
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

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      studentInfo={state.studentInfo}
      theme={state.settings.theme}
      onToggleTheme={handleToggleTheme}
      autoContrast={state.settings.autoContrast !== false}
      onToggleAutoContrast={handleToggleAutoContrast}
      urgentDeadlineCount={urgentDeadlineCount}
      onOpenSettings={() => setIsSettingsModalOpen(true)}
      onResetSampleData={resetToSampleData}
      onOpenSisModal={() => setIsSisModalOpen(true)}
      onOpenCourseCatalogModal={() => setIsCourseCatalogModalOpen(true)}
    >
      {/* TAB 1: Tổng Quan & Dashboard Theo Giao Diện Chuẩn Ảnh Mẫu */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* Main Left/Center Column (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* HUST Crimson Red Gradient Hero Banner */}
            <HeroBanner
              studentName={state.studentInfo.name}
              studentId={state.studentInfo.studentId}
              majorName={state.studentInfo.majorName}
            />

            {/* 3 KPI Cards: CPA, Completed Credits (with active red outline & progress bar), In-progress & DRL */}
            <AcademicKpiSection
              courses={state.courses}
              totalCurriculumCredits={getCurriculum(state.studentInfo.major).totalCredits || 135}
            />

            {/* Enrolled Courses Grid with Crisp Cards & "Chi tiết" buttons */}
            <EnrolledCoursesSection
              courses={state.courses}
              onOpenDetail={course => setDetailModalCourse(course)}
              onNavigateToCurriculum={() => setActiveTab('curriculum')}
            />
          </div>

          {/* Right Column (lg:col-span-4): Instructors + Daily Notice / Deadlines */}
          <div className="lg:col-span-4 space-y-6">
            <InstructorsAndNotices
              deadlines={state.deadlines}
              schedule={state.schedule}
              onToggleComplete={toggleDeadlineComplete}
              onOpenAddDeadline={handleOpenAddDeadline}
              onEditDeadline={handleEditDeadline}
            />
          </div>
        </div>
      )}

      {/* TAB 2: Thời Khóa Biểu (TKB) */}
      {activeTab === 'schedule' && (
        <ScheduleManager
          schedule={state.schedule}
          onAddScheduleItem={addScheduleItem}
          onUpdateScheduleItem={updateScheduleItem}
          onDeleteScheduleItem={deleteScheduleItem}
          onImportScheduleItems={importScheduleItems}
          onImportScheduleFromExcel={importScheduleFromExcel}
        />
      )}

      {/* TAB 3: Bản đồ CTĐT & Cây Tiên Quyết */}
      {activeTab === 'curriculum' && (
        <div className="animate-in fade-in duration-200">
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
        <div className="space-y-6 animate-in fade-in duration-200">
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
        <div className="animate-in fade-in duration-200">
          <StudyPlannerView
            courses={state.courses}
            semesterHistory={state.semesterHistory}
          />
        </div>
      )}

      {/* TAB 6: Cổng Dữ Liệu SIS HUST */}
      {activeTab === 'sis' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-700/70 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  1. Nhập Bảng Điểm & CTĐT Từ QLĐT / SIS HUST
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Dán nội dung bảng CTĐT từ qldt.hust.edu.vn hoặc sis.hust.edu.vn (hỗ trợ lọc môn Thể chất, Kỹ sư, Bổ trợ 9TC).
                </p>
              </div>
              <button
                onClick={() => setIsSisModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-900/20 transition-colors w-full sm:w-auto self-start"
              >
                Mở Nhập CTĐT & Bảng Điểm
              </button>
            </div>

            <div className="bg-white dark:bg-[#131b2e] border border-amber-500/30 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>2. Cào & Ghép HP Điều Kiện (CourseLists)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">MỚI</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Cào dữ liệu từ https://ctt-sis.hust.edu.vn/pub/CourseLists.aspx để cập nhật chính xác môn tiên quyết, học trước, học phí và trọng số.
                </p>
              </div>
              <button
                onClick={() => setIsCourseCatalogModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-950/40 transition-colors w-full sm:w-auto self-start"
              >
                Mở Trình Cào HP Tiên Quyết
              </button>
            </div>
          </div>

          <BookmarkletGuide />
          <BackupRestore
            state={state}
            onImportState={importFullState}
            onResetSampleData={resetToSampleData}
          />
        </div>
      )}

      {/* TAB 7: Cài Đặt Hệ Thống */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <Settings className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Cài Đặt Hệ Thống & Tài Khoản</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Tùy biến tài khoản sinh viên, chuyên ngành đào tạo, thang điểm 4 - 10 và chế độ giao diện.
          </p>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all"
          >
            Mở Bảng Cài Đặt Chi Tiết
          </button>
        </div>
      )}

      {/* Modals */}
      <DeadlineModal
        isOpen={isDeadlineModalOpen}
        onClose={() => setIsDeadlineModalOpen(false)}
        onSave={handleSaveDeadline}
        editingDeadline={editingDeadline}
        courses={state.courses}
      />

      <SisPasteModal
        isOpen={isSisModalOpen}
        onClose={() => setIsSisModalOpen(false)}
        onMergeCourses={mergeSisCourses}
      />

      <CourseCatalogModal
        isOpen={isCourseCatalogModalOpen}
        onClose={() => setIsCourseCatalogModalOpen(false)}
        onMergeCatalog={mergeCourseCatalog}
        initialMajorCode={state.studentInfo.major}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        studentInfo={state.studentInfo}
        settings={state.settings}
        onUpdateStudentInfo={updateStudentInfo}
        onUpdateSettings={updateSettings}
        onUpdateGradeScales={updateGradeScales}
        onToggleEnglishExemption={toggleEnglishExemption}
        onPurgeAllData={purgeAllData}
        onResetToSampleData={resetToSampleData}
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
