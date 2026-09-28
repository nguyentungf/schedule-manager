import React from 'react';
import { StudentInfo } from '../../types/state';
import {
  X,
  User,
  Moon,
  Sun,
  Palette,
  Move,
  Settings,
  RotateCcw,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Layers,
  Check
} from 'lucide-react';

interface SideNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentInfo: StudentInfo;
  theme: 'dark' | 'light' | 'oled' | 'crimson';
  themePalette?: string;
  onToggleTheme: () => void;
  onSelectPalette?: (palette: string) => void;
  onOpenSettings: (tab?: 'profile' | 'scales' | 'ui' | 'danger') => void;
  onResetSampleData: () => void;
  isArrangeMode?: boolean;
  onToggleArrangeMode?: () => void;
  onResetCardOrder?: () => void;
}

const THEME_PALETTES = [
  { id: 'crimson', name: 'Crimson HUST', desc: 'Đỏ Bách Khoa rực lửa', color: '#dc2626' },
  { id: 'ocean', name: 'Deep Ocean', desc: 'Xanh biển sâu công nghệ', color: '#0284c7' },
  { id: 'emerald', name: 'Lush Emerald', desc: 'Xanh ngọc bích thiên nhiên', color: '#059669' },
  { id: 'amethyst', name: 'Royal Amethyst', desc: 'Tím thạch anh hoàng gia', color: '#7c3aed' },
  { id: 'amber', name: 'Sunset Amber', desc: 'Vàng hổ phách ấm áp', color: '#d97706' },
  { id: 'oled', name: 'Monochrome OLED', desc: 'Đen tuyền siêu tiết kiệm pin', color: '#38bdf8' },
];

export const SideNavDrawer: React.FC<SideNavDrawerProps> = ({
  isOpen,
  onClose,
  studentInfo,
  theme,
  themePalette = 'crimson',
  onToggleTheme,
  onSelectPalette,
  onOpenSettings,
  onResetSampleData,
  isArrangeMode = false,
  onToggleArrangeMode,
  onResetCardOrder
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel Sliding from Right */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-white dark:bg-[#0e1322] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-md shadow-red-900/30">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Menu & Tùy Chọn
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  HUST Smart Portal
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-6 flex-1">
            
            {/* 1. MỤC TÀI KHOẢN SINH VIÊN */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Tài Khoản Sinh Viên</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/10 via-slate-50 to-slate-100 dark:from-red-950/30 dark:via-slate-900/60 dark:to-[#131b2e] border border-red-200/60 dark:border-red-900/40 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white font-bold text-base flex items-center justify-center shadow-md shadow-red-900/20">
                    {studentInfo.name ? studentInfo.name.charAt(0).toUpperCase() : 'BK'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {studentInfo.name || 'Sinh Viên Bách Khoa'}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">
                      MSSV: {studentInfo.studentId || 'Chưa thiết lập'}
                    </span>
                    <span className="text-[11px] text-red-600 dark:text-red-400 font-medium block truncate">
                      {studentInfo.majorName || studentInfo.major} • {studentInfo.cohort || 'K68'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenSettings('profile')}
                  className="w-full py-2 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-white text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-between"
                >
                  <span>Chỉnh sửa thông tin hồ sơ</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 2. CHẾ ĐỘ SÁNG / TỐI & 6 BẢNG MÀU IMPECCABLE */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Giao Diện & Bảng Màu</span>
              </div>

              {/* Dark / Light Mode Switch */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {theme === 'light' ? 'Chế độ Sáng (Light Clean)' : 'Chế độ Tối (Deep Night)'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Tương phản cao WCAG AAA
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-red-500 transition-all"
                >
                  Chuyển đổi
                </button>
              </div>

              {/* 6 Theme Palettes */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                  Chọn Bảng Màu Chủ Đạo:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_PALETTES.map(p => {
                    const isSelected = themePalette === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onSelectPalette && onSelectPalette(p.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-red-500 bg-red-50/50 dark:bg-slate-800/90 shadow-sm ring-1 ring-red-500'
                            : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: p.color }}
                          />
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {p.name}
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400 ml-auto shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                          {p.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. TÍNH NĂNG SẮP XẾP TRẬT TỰ THẺ DASHBOARD */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Sắp Xếp Dashboard</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Move className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Kéo thả trật tự thẻ
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {isArrangeMode ? '✦ Đang BẬT chế độ sắp xếp' : 'Bật để kéo thả thay đổi vị trí'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onToggleArrangeMode}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      isArrangeMode
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/20'
                        : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-red-500'
                    }`}
                  >
                    {isArrangeMode ? 'Tắt sắp xếp' : 'Bật sắp xếp'}
                  </button>
                </div>

                {isArrangeMode && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400/90 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-xl border border-amber-200 dark:border-amber-900/40">
                    💡 Khi kéo thẻ, thẻ sẽ có hiệu ứng rung nhẹ và hiển thị khung chèn trước vị trí bạn muốn đặt.
                  </p>
                )}

                {onResetCardOrder && (
                  <button
                    type="button"
                    onClick={onResetCardOrder}
                    className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    Khôi phục thứ tự thẻ mặc định
                  </button>
                )}
              </div>
            </div>

            {/* 4. KHÔI PHỤC DỮ LIỆU SẠCH */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn làm sạch toàn bộ dữ liệu để bắt đầu từ đầu không?')) {
                    onResetSampleData();
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Làm sạch & Khởi tạo database mới</span>
              </button>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-center">
            <span className="text-[10px] text-slate-400 font-mono">
              HUST Student Portal • Mobile v2.0 • Impeccable
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
