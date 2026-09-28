import React, { useRef } from 'react';
import { DashboardState } from '../../types/state';
import { exportStateToJson, validateStateJson } from '../../engines/sisParser';
import { Download, Upload, RefreshCw, Database } from 'lucide-react';

interface BackupRestoreProps {
  state: DashboardState;
  onImportState: (newState: DashboardState) => void;
  onResetSampleData: () => void;
}

export const BackupRestore: React.FC<BackupRestoreProps> = ({
  state,
  onImportState,
  onResetSampleData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportStateToJson(state);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const validated = validateStateJson(content);
        if (validated) {
          onImportState(validated);
          alert('✅ Khôi phục dữ liệu thành công!');
        } else {
          alert('❌ File JSON không hợp lệ hoặc sai cấu trúc schema HUST Dashboard!');
        }
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const handleConfirmReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn nạp lại bộ dữ liệu mẫu ban đầu? Toàn bộ dữ liệu chưa sao lưu sẽ được thay thế bằng dữ liệu demo Bách Khoa.')) {
      onResetSampleData();
    }
  };

  return (
    <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Quản Lý Sao Lưu & Khôi Phục Dữ Liệu (Backup & Restore)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dữ liệu được lưu trữ 100% trong trình duyệt (localStorage). Bạn có thể xuất file JSON để đồng bộ giữa các máy tính.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Export JSON */}
        <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-red-600 dark:text-red-400" />
              Xuất File Sao Lưu
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Đóng gói toàn bộ deadlines, điểm các kỳ, CTĐT thành file <span className="font-mono text-slate-700 dark:text-slate-300">.json</span>.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="w-full py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải File Backup (.json)</span>
          </button>
        </div>

        {/* Import JSON */}
        <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Khôi Phục Từ File
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Nạp lại file sao lưu JSON đã lưu từ máy khác hoặc bản sao lưu trước đó.
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Chọn File Để Khôi Phục</span>
          </button>
        </div>

        {/* Reset to Sample Data */}
        <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Nạp Lại Dữ Liệu Mẫu
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Đặt lại bảng điểm và deadlines của một sinh viên IT Bách Khoa mẫu để trải nghiệm hệ thống.
            </p>
          </div>
          <button
            onClick={handleConfirmReset}
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Nạp Dữ Liệu Mẫu BK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
