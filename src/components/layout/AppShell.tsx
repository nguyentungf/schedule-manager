import React, { useState } from 'react';
import { DashboardTab } from '../../types/state';
import { StudentInfo } from '../../types/state';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Calendar, 
  GitFork, 
  Calculator, 
  Compass, 
  Database, 
  Settings, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  RotateCcw,
  Sparkles,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Upload,
  BookOpen,
  MoreHorizontal
} from 'lucide-react';

interface AppShellProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  studentInfo: StudentInfo;
  theme: 'dark' | 'light' | 'oled' | 'crimson';
  onToggleTheme: () => void;
  autoContrast?: boolean;
  onToggleAutoContrast?: () => void;
  urgentDeadlineCount: number;
  onOpenSettings: () => void;
  onResetSampleData: () => void;
  onOpenSisModal?: () => void;
  onOpenCourseCatalogModal?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  studentInfo,
  theme,
  onToggleTheme,
  autoContrast = true,
  onToggleAutoContrast,
  urgentDeadlineCount,
  onOpenSettings,
  onResetSampleData,
  onOpenSisModal,
  onOpenCourseCatalogModal,
  children
}) => {
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const navItems: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'schedule', label: 'Thời Khóa Biểu', icon: <Calendar className="w-4 h-4" /> },
    { id: 'curriculum', label: 'Khung CTĐT & Tiên Quyết', icon: <GitFork className="w-4 h-4" /> },
    { id: 'grade-calculator', label: 'Tính Điểm & CPA', icon: <Calculator className="w-4 h-4" /> },
    { id: 'planner', label: 'Dự Đoán GPA (OLS)', icon: <Compass className="w-4 h-4" /> },
    { id: 'sis', label: 'Cổng SIS / QLĐT', icon: <Database className="w-4 h-4" /> },
    { id: 'settings', label: 'Cài Đặt Hệ Thống', icon: <Settings className="w-4 h-4" /> },
  ];

  const currentTabLabel = navItems.find(i => i.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070913] p-0 sm:p-4 lg:p-6 flex items-center justify-center transition-colors">
      {/* Main Rounded App Card Container - Edge-to-edge on mobile, rounded card on tablet/desktop */}
      <div className="w-full max-w-[1600px] min-h-screen sm:min-h-[92vh] bg-white dark:bg-[#0e1322] rounded-none sm:rounded-[32px] lg:rounded-[36px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-none border-0 sm:border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row transition-all relative">
        
        {/* =========================================================
            DESKTOP LEFT SIDEBAR (HUST Bách Khoa Crimson Red)
           ========================================================= */}
        <aside className="hidden lg:flex w-64 flex-shrink-0 bg-gradient-to-b from-[#dc2626] via-[#b91c1c] to-[#991b1b] text-white p-5 flex-col justify-between relative shadow-xl z-20">
          
          {/* Top Logo & Brand */}
          <div>
            <div className="flex items-center justify-center mb-6">
              {/* Graduate Cap Squircle Logo */}
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg shadow-red-950/20 transform hover:scale-105 transition-transform">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Navigation Menu Links */}
            <nav className="space-y-1.5 !bg-transparent !border-0 !shadow-none">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'settings') {
                        onOpenSettings();
                      } else {
                        onSelectTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-[#b91c1c] shadow-lg shadow-red-950/25 font-bold'
                        : 'text-white/90 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <span className={isActive ? 'text-[#b91c1c]' : 'text-white'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar: Cohort Badge & Reset Action */}
          <div className="pt-6 mt-6 border-t border-white/15 space-y-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[10px] text-red-200 block font-mono font-medium">CHƯƠNG TRÌNH</span>
              <span className="text-xs font-bold text-white block truncate">
                {studentInfo.major || 'ET-E4'} • {studentInfo.classCode || studentInfo.cohort || 'K66'}
              </span>
            </div>

            <button
              type="button"
              onClick={onResetSampleData}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              title="Khôi phục dữ liệu mẫu Bách Khoa"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Dữ Liệu Mẫu</span>
            </button>
          </div>
        </aside>

        {/* =========================================================
            RIGHT MAIN CONTENT AREA
           ========================================================= */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-[#0b0f1d] overflow-y-auto">
          
          {/* Top Bar Header / Mobile Native App Bar */}
          <header className="bg-white/95 dark:bg-[#0e1322]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-20">
            {/* Top row for Mobile (App Title + Logo) / Desktop search container */}
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2.5 lg:hidden">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-900/30">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                    HUST PORTAL
                  </h1>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-white block leading-tight">
                    {currentTabLabel}
                  </span>
                </div>
              </div>

              {/* Search Bar - Full on desktop, hidden on tiny screen or expandable */}
              <div className="relative w-full max-w-md hidden sm:block">
                <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search học phần, giảng viên, phòng học, mã lớp..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-sm font-medium"
                />
              </div>

              {/* Mobile Profile & Notification pill */}
              <div className="flex items-center gap-1.5 sm:hidden">
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  title="Chuyển theme"
                >
                  {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                </button>
                {onToggleAutoContrast && (
                  <button
                    type="button"
                    onClick={onToggleAutoContrast}
                    className={`p-1.5 rounded-full border transition-all ${
                      autoContrast
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400'
                        : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400'
                    }`}
                    title="Tương phản tự động"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs"
                >
                  {studentInfo.name ? studentInfo.name.charAt(0).toUpperCase() : 'BK'}
                </button>
              </div>
            </div>

            {/* Desktop Actions & Student Profile Card */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
              {/* Quick SIS & Prereq scrapers */}
              {onOpenSisModal && (
                <button
                  type="button"
                  onClick={onOpenSisModal}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-bold text-xs border border-red-200 dark:border-red-800 transition-colors"
                  title="Dán dữ liệu bảng điểm & CTĐT từ SIS / QLĐT HUST"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Nhập SIS</span>
                </button>
              )}

              {onOpenCourseCatalogModal && (
                <button
                  type="button"
                  onClick={onOpenCourseCatalogModal}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800 transition-colors"
                  title="Cào & ghép học phần tiên quyết từ CourseLists.aspx"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>HP Tiên Quyết</span>
                </button>
              )}

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-600 transition-colors"
                title={theme === 'light' ? 'Chuyển sang Giao diện Tối' : 'Chuyển sang Giao diện Sáng'}
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>

              {/* Auto-Contrast (WCAG AAA) Quick Toggle */}
              {onToggleAutoContrast && (
                <button
                  type="button"
                  onClick={onToggleAutoContrast}
                  className={`p-2 rounded-full border transition-all ${
                    autoContrast
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                  title={
                    autoContrast
                      ? 'Chế độ Tự Động Tương Phản WCAG AAA đang BẬT: Đảm bảo độ tương phản cao toàn bộ content'
                      : 'Bật chế độ Tự Động Tương Phản WCAG AAA'
                  }
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              )}

              {/* Notification Bell with Urgent Deadlines Badge */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => onSelectTab('dashboard')}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-600 transition-colors relative"
                  title="Thông báo hạn chót"
                >
                  <Bell className="w-4 h-4" />
                  {urgentDeadlineCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>
              </div>

              {/* Student Profile Pill - Clickable to open settings */}
              <button
                type="button"
                onClick={onOpenSettings}
                className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-85 transition-opacity text-left cursor-pointer"
                title="Cài đặt thông tin cá nhân & thang điểm"
              >
                <div className="w-9 h-9 rounded-full bg-red-600 p-0.5 shadow-sm flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-red-700 flex items-center justify-center font-bold text-xs text-white">
                    {studentInfo.name ? studentInfo.name.charAt(0).toUpperCase() : 'BK'}
                  </div>
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                    {studentInfo.name || 'Sinh Viên HUST'}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Năm 3 • {studentInfo.major || 'ET-E4'}
                  </span>
                </div>
              </button>
            </div>
          </header>

          {/* Body Content Container - Extra bottom padding on mobile so Bottom Nav doesn't overlap */}
          <div className="p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 flex-1 pb-24 lg:pb-8">
            {children}
          </div>
        </main>

        {/* =========================================================
            MOBILE ANDROID BOTTOM NAVIGATION BAR (Fixed at Bottom)
           ========================================================= */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0e1322]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/90 px-1 py-1 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] flex items-center justify-around">
          {/* Tab 1: Dashboard */}
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
              activeTab === 'dashboard'
                ? 'text-red-600 dark:text-red-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {activeTab === 'dashboard' && (
              <span className="absolute top-0 w-8 h-1 bg-red-600 dark:bg-red-500 rounded-full" />
            )}
            <div className={`p-1 rounded-xl transition-transform ${activeTab === 'dashboard' ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 scale-105' : ''}`}>
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium">Tổng Quan</span>
          </button>

          {/* Tab 2: Schedule */}
          <button
            type="button"
            onClick={() => onSelectTab('schedule')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
              activeTab === 'schedule'
                ? 'text-red-600 dark:text-red-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {activeTab === 'schedule' && (
              <span className="absolute top-0 w-8 h-1 bg-red-600 dark:bg-red-500 rounded-full" />
            )}
            <div className={`p-1 rounded-xl transition-transform ${activeTab === 'schedule' ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 scale-105' : ''}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium">Lịch TKB</span>
          </button>

          {/* Tab 3: Curriculum */}
          <button
            type="button"
            onClick={() => onSelectTab('curriculum')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
              activeTab === 'curriculum'
                ? 'text-red-600 dark:text-red-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {activeTab === 'curriculum' && (
              <span className="absolute top-0 w-8 h-1 bg-red-600 dark:bg-red-500 rounded-full" />
            )}
            <div className={`p-1 rounded-xl transition-transform ${activeTab === 'curriculum' ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 scale-105' : ''}`}>
              <GitFork className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium">CTĐT</span>
          </button>

          {/* Tab 4: Grade Calculator */}
          <button
            type="button"
            onClick={() => onSelectTab('grade-calculator')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
              activeTab === 'grade-calculator'
                ? 'text-red-600 dark:text-red-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {activeTab === 'grade-calculator' && (
              <span className="absolute top-0 w-8 h-1 bg-red-600 dark:bg-red-500 rounded-full" />
            )}
            <div className={`p-1 rounded-xl transition-transform ${activeTab === 'grade-calculator' ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 scale-105' : ''}`}>
              <Calculator className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium">Tính Điểm</span>
          </button>

          {/* Tab 5: More Menu Drawer */}
          <button
            type="button"
            onClick={() => setMobileMoreOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
              ['planner', 'sis', 'settings'].includes(activeTab) || mobileMoreOpen
                ? 'text-red-600 dark:text-red-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {(['planner', 'sis', 'settings'].includes(activeTab) || mobileMoreOpen) && (
              <span className="absolute top-0 w-8 h-1 bg-red-600 dark:bg-red-500 rounded-full" />
            )}
            <div className={`p-1 rounded-xl transition-transform ${['planner', 'sis', 'settings'].includes(activeTab) || mobileMoreOpen ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 scale-105' : ''}`}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium">Tiện Ích</span>
          </button>
        </nav>

        {/* =========================================================
            MOBILE MORE UTILITIES BOTTOM SHEET (Modal Drawer)
           ========================================================= */}
        {mobileMoreOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200"
            onClick={() => setMobileMoreOpen(false)}
          >
            <div 
              className="bg-white dark:bg-[#131b2e] rounded-t-[28px] p-5 border-t border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Sheet Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tiện Ích & Mở Rộng</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">HUST Smart Student Portal</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMoreOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of Utilities */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('planner');
                    setMobileMoreOpen(false);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                    activeTab === 'planner'
                      ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-slate-900 dark:text-white">Dự Đoán GPA</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Mô hình OLS ML</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('sis');
                    setMobileMoreOpen(false);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                    activeTab === 'sis'
                      ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-slate-900 dark:text-white">Cổng SIS / QLĐT</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Bảng điểm & CTĐT</span>
                  </div>
                </button>

                {onOpenSisModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSisModal();
                      setMobileMoreOpen(false);
                    }}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-left flex items-start gap-2.5 text-slate-700 dark:text-slate-300"
                  >
                    <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">Nhập SIS Nhanh</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Dán bảng điểm</span>
                    </div>
                  </button>
                )}

                {onOpenCourseCatalogModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenCourseCatalogModal();
                      setMobileMoreOpen(false);
                    }}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-left flex items-start gap-2.5 text-slate-700 dark:text-slate-300"
                  >
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">HP Tiên Quyết</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Cào CourseLists</span>
                    </div>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onOpenSettings();
                    setMobileMoreOpen(false);
                  }}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-left flex items-start gap-2.5 text-slate-700 dark:text-slate-300 col-span-2 sm:col-span-1"
                >
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-slate-900 dark:text-white">Cài Đặt Hệ Thống</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Thang điểm 4-10, tài khoản</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onResetSampleData();
                    setMobileMoreOpen(false);
                  }}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-left flex items-start gap-2.5 text-slate-700 dark:text-slate-300 col-span-2 sm:col-span-1"
                >
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-slate-900 dark:text-white">Dữ Liệu Mẫu</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Khôi phục mẫu BK</span>
                  </div>
                </button>
              </div>

              {/* Student Cohort Footer in Sheet */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">SINH VIÊN:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {studentInfo.name || 'Bách Khoa'} • {studentInfo.major || 'ET-E4'} ({studentInfo.cohort || 'K66'})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

