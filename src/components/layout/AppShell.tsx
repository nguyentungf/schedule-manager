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
  RotateCcw,
  Menu,
  X,
  ClipboardPaste,
  MoreHorizontal,
  SlidersHorizontal
} from 'lucide-react';

interface AppShellProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  studentInfo: StudentInfo;
  theme?: 'dark' | 'light' | 'oled' | 'crimson';
  urgentDeadlineCount: number;
  onOpenSettings: () => void;
  onResetSampleData: () => void;
  onOpenRawTextModal?: () => void;
  onOpenSideNav: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  studentInfo,
  theme,
  urgentDeadlineCount,
  onOpenSettings,
  onResetSampleData,
  onOpenRawTextModal,
  onOpenSideNav,
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
      {/* Main Container */}
      <div className="w-full max-w-[1600px] min-h-screen sm:min-h-[92vh] bg-white dark:bg-[#0e1322] rounded-none sm:rounded-[32px] lg:rounded-[36px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-none border-0 sm:border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row transition-all relative">
        
        {/* =========================================================
            DESKTOP LEFT SIDEBAR (HUST Bách Khoa Crimson Red)
           ========================================================= */}
        <aside className="hidden lg:flex w-64 flex-shrink-0 bg-gradient-to-b from-[#dc2626] via-[#b91c1c] to-[#991b1b] text-white p-5 flex-col justify-between relative shadow-xl z-20">
          {/* Top Logo & Brand */}
          <div>
            <div className="flex items-center justify-center mb-6">
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

          {/* Bottom Sidebar */}
          <div className="pt-6 mt-6 border-t border-white/15 space-y-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[10px] text-red-200 block font-mono font-medium">CHƯƠNG TRÌNH</span>
              <span className="text-xs font-bold text-white block truncate">
                {studentInfo.major || 'IT1'} • {studentInfo.classCode || studentInfo.cohort || 'K68'}
              </span>
            </div>

            <button
              type="button"
              onClick={onResetSampleData}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              title="Khôi phục trạng thái database sạch"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Dữ Liệu Sạch</span>
            </button>
          </div>
        </aside>

        {/* =========================================================
            RIGHT MAIN CONTENT AREA
           ========================================================= */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-[#0b0f1d] overflow-y-auto pb-[calc(80px+max(env(safe-area-inset-bottom,0px),16px))] lg:pb-8">
          
          {/* Top Bar Header with Side Nav Drawer Button */}
          <header className="bg-white/95 dark:bg-[#0e1322]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 pt-3.5 sm:pt-4 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-20">
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

              {/* Search Bar on desktop */}
              <div className="relative w-full max-w-md hidden sm:block">
                <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search học phần, giảng viên, phòng học, mã lớp..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-sm font-medium"
                />
              </div>

              {/* Mobile Actions: Raw Text Import button & Side Nav Drawer button */}
              <div className="flex items-center gap-1.5 sm:hidden">
                {onOpenRawTextModal && (
                  <button
                    type="button"
                    onClick={onOpenRawTextModal}
                    className="p-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs border border-red-200 dark:border-red-800"
                    title="Dán văn bản SIS/QLĐT (Ctrl+A)"
                  >
                    <ClipboardPaste className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenSideNav}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-red-600 active:scale-95 transition-all"
                  title="Mở menu tính năng bên"
                >
                  <Menu className="w-5 h-5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
              {/* Quick Raw Text SIS/QLĐT Import */}
              {onOpenRawTextModal && (
                <button
                  type="button"
                  onClick={onOpenRawTextModal}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-bold text-xs border border-red-200 dark:border-red-800 transition-colors shadow-xs"
                  title="Dán nhanh văn bản SIS/QLĐT (Ctrl+A)"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Dán SIS / QLĐT (Ctrl+A)</span>
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

              {/* Side Navigation Drawer Trigger Button */}
              <button
                type="button"
                onClick={onOpenSideNav}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-all font-semibold text-xs active:scale-95"
                title="Mở menu cạnh bên: Tài khoản, Chế độ tối, Bảng màu & Sắp xếp thẻ"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Menu Điều Khiển</span>
              </button>
            </div>
          </header>

          {/* Body Content Container */}
          <div className="p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 flex-1 pb-24 lg:pb-8">
            {children}
          </div>
        </main>

        {/* =========================================================
            MOBILE ANDROID BOTTOM NAVIGATION BAR
           ========================================================= */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0e1322]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/90 px-2 pt-2 pb-[max(env(safe-area-inset-bottom,0px),14px)] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] flex items-center justify-around select-none">
          {/* Tab 1: Dashboard */}
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all relative ${
              activeTab === 'dashboard'
                ? 'text-red-600 dark:text-red-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {activeTab === 'dashboard' && (
              <span className="absolute top-0 w-8 h-1 bg-red-600 dark:bg-red-500 rounded-full" />
            )}
            <div className={`p-1.5 rounded-xl transition-transform ${activeTab === 'dashboard' ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 scale-105 shadow-xs' : ''}`}>
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium">Tổng Quan</span>
          </button>

          {/* Tab 2: Schedule */}
          <button
            type="button"
            onClick={() => onSelectTab('schedule')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all relative ${
              activeTab === 'schedule'
                ? 'text-red-600 dark:text-red-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {activeTab === 'schedule' && (
              <span className="absolute top-0 w-8 h-1 bg-red-600 dark:bg-red-500 rounded-full" />
            )}
            <div className={`p-1.5 rounded-xl transition-transform ${activeTab === 'schedule' ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 scale-105 shadow-xs' : ''}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium">Lịch TKB</span>
          </button>

          {/* Tab 3: Curriculum */}
          <button
            type="button"
            onClick={() => onSelectTab('curriculum')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all relative ${
              activeTab === 'curriculum'
                ? 'text-red-600 dark:text-red-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {activeTab === 'curriculum' && (
              <span className="absolute top-0 w-8 h-1 bg-red-600 dark:bg-red-500 rounded-full" />
            )}
            <div className={`p-1.5 rounded-xl transition-transform ${activeTab === 'curriculum' ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 scale-105 shadow-xs' : ''}`}>
              <GitFork className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium">CTĐT</span>
          </button>

          {/* Tab 4: Grade Calculator */}
          <button
            type="button"
            onClick={() => onSelectTab('grade-calculator')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all relative ${
              activeTab === 'grade-calculator'
                ? 'text-red-600 dark:text-red-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {activeTab === 'grade-calculator' && (
              <span className="absolute top-0 w-8 h-1 bg-red-600 dark:bg-red-500 rounded-full" />
            )}
            <div className={`p-1.5 rounded-xl transition-transform ${activeTab === 'grade-calculator' ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 scale-105 shadow-xs' : ''}`}>
              <Calculator className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium">Tính Điểm</span>
          </button>

          {/* Tab 5: More Menu Drawer */}
          <button
            type="button"
            onClick={() => setMobileMoreOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all relative ${
              ['planner', 'sis', 'settings'].includes(activeTab) || mobileMoreOpen
                ? 'text-red-600 dark:text-red-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {(['planner', 'sis', 'settings'].includes(activeTab) || mobileMoreOpen) && (
              <span className="absolute top-0 w-8 h-1 bg-red-600 dark:bg-red-500 rounded-full" />
            )}
            <div className={`p-1.5 rounded-xl transition-transform ${['planner', 'sis', 'settings'].includes(activeTab) || mobileMoreOpen ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 scale-105 shadow-xs' : ''}`}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-medium">Tiện Ích</span>
          </button>
        </nav>

        {/* Mobile More Sheet */}
        {mobileMoreOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200"
            onClick={() => setMobileMoreOpen(false)}
          >
            <div 
              className="bg-white dark:bg-[#111827] rounded-t-[32px] p-5 pt-3 border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-15px_40px_rgba(0,0,0,0.3)] space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[88vh] overflow-y-auto pb-[max(env(safe-area-inset-bottom,0px),24px)] select-none"
              onClick={e => e.stopPropagation()}
            >
              {/* Pull Handle */}
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-1 cursor-grab opacity-80" />

              {/* Student Profile Card in Sheet */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent border border-red-200/60 dark:border-red-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white font-black text-sm flex items-center justify-center shadow-md shadow-red-950/20">
                    {studentInfo.name ? studentInfo.name.charAt(0).toUpperCase() : 'BK'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[170px]">
                        {studentInfo.name || 'Sinh viên Bách Khoa'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 font-mono text-[9px] font-bold">
                        {studentInfo.cohort || 'K68'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">
                      {studentInfo.studentId ? `MSSV: ${studentInfo.studentId}` : 'HUST Student'} • {studentInfo.major || 'IT1'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMoreOpen(false)}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white shadow-xs border border-slate-200/60 dark:border-slate-700 transition-all active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* SECTION 1: LỘ TRÌNH & HỌC TẬP */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                    Học Tập & Dự Đoán
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('planner');
                      setMobileMoreOpen(false);
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all active:scale-[0.97] ${
                      activeTab === 'planner'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">Dự Đoán GPA</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Hồi quy OLS ML</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('sis');
                      setMobileMoreOpen(false);
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all active:scale-[0.97] ${
                      activeTab === 'sis'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">Cổng SIS / QLĐT</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Xem tiến độ & điểm</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* SECTION 2: ĐỒNG BỘ DỮ LIỆU SIÊU TỐC */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                    Đồng Bộ & Điều Khiển
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {onOpenRawTextModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenRawTextModal();
                        setMobileMoreOpen(false);
                      }}
                      className="p-3 rounded-2xl border border-red-200/80 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20 text-left flex items-start gap-2.5 text-slate-700 dark:text-slate-300 transition-all active:scale-[0.97] hover:border-red-400"
                    >
                      <div className="p-2 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 flex-shrink-0">
                        <ClipboardPaste className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-slate-900 dark:text-white">Dán SIS / QLĐT</span>
                        <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold">Tự động lọc rác (Ctrl+A)</span>
                      </div>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onOpenSideNav();
                      setMobileMoreOpen(false);
                    }}
                    className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-left flex items-start gap-2.5 text-slate-700 dark:text-slate-300 transition-all active:scale-[0.97]"
                  >
                    <div className="p-2 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex-shrink-0">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">Menu Điều Khiển</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Giao diện, sắp xếp</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* SECTION 3: CÀI ĐẶT & HỆ THỐNG */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                    Hệ Thống & Tùy Chọn
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSettings();
                      setMobileMoreOpen(false);
                    }}
                    className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-left flex items-start gap-2.5 text-slate-700 dark:text-slate-300 transition-all active:scale-[0.97]"
                  >
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex-shrink-0">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">Cài Đặt Hệ Thống</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Thang 4-10, tài khoản</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onResetSampleData();
                      setMobileMoreOpen(false);
                    }}
                    className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-left flex items-start gap-2.5 text-slate-700 dark:text-slate-300 transition-all active:scale-[0.97]"
                  >
                    <div className="p-2 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex-shrink-0">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">Dữ Liệu Sạch</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Khôi phục ban đầu</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
