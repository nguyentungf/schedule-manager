import React from 'react';
import { StudentInfo } from '../../types/state';
import { Sparkles, Download, Upload, Settings, Sun, Moon, BookOpen } from 'lucide-react';

interface HeaderProps {
  studentInfo: StudentInfo;
  theme: 'light' | 'dark' | 'oled' | 'crimson';
  onToggleTheme: () => void;
  onOpenSettingsModal: () => void;
  onResetSampleData: () => void;
  onOpenSisModal: () => void;
  onOpenBackupModal: () => void;
  onOpenCourseCatalogModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  studentInfo,
  theme,
  onToggleTheme,
  onOpenSettingsModal,
  onResetSampleData,
  onOpenSisModal,
  onOpenBackupModal,
  onOpenCourseCatalogModal
}) => {
  const isLight = theme === 'light';

  return (
    <header className="bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3 transition-colors shadow-sm dark:shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-700 flex items-center justify-center shadow-md shadow-zinc-900/20 dark:shadow-none border border-red-500/30 flex-shrink-0">
            <span className="text-white font-black text-xl tracking-tighter">BK</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                HUST Smart Student Dashboard
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                PRO 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Đại học Bách Khoa Hà Nội • Quản trị Deadline & Tối ưu lộ trình học tập
            </p>
          </div>
        </div>

        {/* Student Meta Info Badge & Actions */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Student Profile Quick Badge */}
          <button
            onClick={onOpenSettingsModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-600 group text-xs text-left"
            title="Click để mở Cài đặt tài khoản, thang điểm và giao diện"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
              <span className="font-bold">{studentInfo.name}</span>
              <span className="text-slate-500 dark:text-slate-400">({studentInfo.studentId})</span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span className="text-red-600 dark:text-red-400 font-bold">{studentInfo.major}</span>
              <span className="text-slate-500 dark:text-slate-400">Kỳ {studentInfo.currentTerm}</span>
            </div>
          </button>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onResetSampleData}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
              title="Nạp lại bộ dữ liệu sinh viên Bách Khoa mẫu để trải nghiệm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Dữ liệu mẫu</span>
            </button>

            {onOpenCourseCatalogModal && (
              <button
                onClick={onOpenCourseCatalogModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-600/20 hover:bg-amber-100 dark:hover:bg-amber-600/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 transition-colors"
                title="Cào & ghép học phần tiên quyết từ CourseLists.aspx"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">HP Tiên Quyết</span>
              </button>
            )}

            <button
              onClick={onOpenSisModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-600/20 hover:bg-red-100 dark:hover:bg-red-600/30 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/30 transition-colors"
              title="Dán dữ liệu bảng điểm từ SIS HUST"
            >
              <Upload className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>Nhập SIS</span>
            </button>

            <button
              onClick={onOpenBackupModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
              title="Sao lưu hoặc Khôi phục file JSON"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Sao lưu</span>
            </button>

            {/* Toggle Sáng / Tối Button */}
            <button
              onClick={onToggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                isLight
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
              }`}
              title={isLight ? 'Chuyển sang giao diện Tối' : 'Chuyển sang giao diện Sáng'}
            >
              {isLight ? (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline text-slate-800 font-semibold">Tối</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-slate-200 font-semibold">Sáng</span>
                </>
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettingsModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
              title="Cài đặt hệ thống: Giao diện, Tài khoản, Thang điểm 4-10"
            >
              <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">Cài đặt</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
