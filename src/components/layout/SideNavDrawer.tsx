import React from 'react';
import { StudentInfo } from '../../types/state';
import {
  X,
  User,
  Palette,
  Move,
  Settings,
  ChevronRight,
  GraduationCap,
  Layers,
  Eye,
  EyeOff,
  Sliders,
  ShieldAlert
} from 'lucide-react';

interface SideNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentInfo: StudentInfo;
  onOpenSettings: (tab?: 'profile' | 'scales' | 'ui' | 'danger') => void;
  isArrangeMode?: boolean;
  onToggleArrangeMode?: () => void;
  onResetCardOrder?: () => void;
  hiddenCards?: string[];
  onToggleHideCard?: (cardId: 'hero' | 'kpi' | 'courses' | 'deadlines') => void;
  onRestoreHiddenCards?: () => void;
}

export const SideNavDrawer: React.FC<SideNavDrawerProps> = ({
  isOpen,
  onClose,
  studentInfo,
  onOpenSettings,
  isArrangeMode = false,
  onToggleArrangeMode,
  onResetCardOrder,
  hiddenCards = [],
  onToggleHideCard,
  onRestoreHiddenCards
}) => {
  if (!isOpen) return null;

  const handleOpenSettingsTab = (tab?: 'profile' | 'scales' | 'ui' | 'danger') => {
    onClose();
    onOpenSettings(tab);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with smooth fade animation */}
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity animate-drawer-backdrop"
        onClick={onClose}
      />

      {/* Drawer Panel Sliding from Right with smooth cubic-bezier transition */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-white dark:bg-[#0e1322] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-drawer-slide">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
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
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white font-bold text-base flex items-center justify-center shadow-md shadow-zinc-900/20 dark:shadow-none">
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
                  onClick={() => handleOpenSettingsTab('profile')}
                  className="w-full py-2 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-white text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-between"
                >
                  <span>Chỉnh sửa thông tin hồ sơ</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 2. CÀI ĐẶT HỆ THỐNG TẬP TRUNG (SINGLE SOURCE OF TRUTH) */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Cài Đặt Hệ Thống Tập Trung</span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleOpenSettingsTab()}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Trung Tâm Cài Đặt Chung
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Quản lý toàn bộ cấu hình ứng dụng
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenSettingsTab('ui')}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Giao Diện & 6 Bảng Màu
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Chế độ sáng/tối, màu Crimson, Ocean, Emerald...
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenSettingsTab('scales')}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Quy Chế Điểm & Thang Đo
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Thang điểm chữ A-B-C-D-F & Thang 4.0
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenSettingsTab('danger')}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Quản Lý & Làm Sạch Dữ Liệu
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Xóa dữ liệu, khôi phục database mẫu
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 3. TÍNH NĂNG SẮP XẾP & ẨN/HIỆN THẺ DASHBOARD */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span>Sắp Xếp & Quản Lý Thẻ</span>
                </div>
                {hiddenCards.length > 0 && onRestoreHiddenCards && (
                  <button
                    type="button"
                    onClick={onRestoreHiddenCards}
                    className="text-[10px] text-red-600 dark:text-red-400 font-semibold hover:underline"
                  >
                    Hiện lại tất cả ({hiddenCards.length})
                  </button>
                )}
              </div>

              {/* Ẩn / Hiện Thẻ Lời Chào (Hero Banner) theo yêu cầu người dùng */}
              {onToggleHideCard && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                      {hiddenCards.includes('hero') ? (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Thẻ Lời Chào Dashboard
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {hiddenCards.includes('hero') ? 'Đang ẩn thẻ lời chào' : 'Đang hiển thị trên Dashboard'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleHideCard('hero')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      hiddenCards.includes('hero')
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-red-600'
                    }`}
                  >
                    {hiddenCards.includes('hero') ? 'Hiện thẻ' : 'Ẩn thẻ'}
                  </button>
                </div>
              )}

              {/* Bật / Tắt Chế Độ Kéo Thả Sắp Xếp */}
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
                        ? 'bg-red-600 text-white shadow-md shadow-zinc-900/20 dark:shadow-none'
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
