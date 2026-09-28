import React, { useState } from 'react';
import { generateUltraBookmarkletCode, getConsoleScriptCode } from '../../engines/sisParser';
import { Bookmark, Copy, Check, Terminal, Sparkles, ShieldCheck } from 'lucide-react';

export const BookmarkletGuide: React.FC = () => {
  const [copiedBookmarklet, setCopiedBookmarklet] = useState(false);
  const [copiedConsole, setCopiedConsole] = useState(false);

  const bookmarkletCode = generateUltraBookmarkletCode();
  const consoleCode = getConsoleScriptCode();

  const handleCopyBookmarklet = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopiedBookmarklet(true);
    setTimeout(() => setCopiedBookmarklet(false), 2500);
  };

  const handleCopyConsole = () => {
    navigator.clipboard.writeText(consoleCode);
    setCopiedConsole(true);
    setTimeout(() => setCopiedConsole(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400">
          <Bookmark className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Công Cụ Cào Dữ Liệu Tự Động Từ QLĐT & SIS HUST
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Hỗ trợ QLĐT & SIS 100%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hỗ trợ cả 2 cổng: Cổng mới qldt.hust.edu.vn (CTĐT & Bổ trợ) và Cổng cũ sis.hust.edu.vn
          </p>
        </div>
      </div>

      {/* METHOD 1: Bookmarklet Button */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 font-bold">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Cách 1: Kéo thả nút Bookmark lên thanh trình duyệt</span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300">
          👉 <strong>Kéo và thả</strong> nút màu đỏ bên dưới lên thanh Dấu trang (Bookmark Bar) của Chrome/Edge:
        </p>

        <a
          href={bookmarkletCode}
          onClick={e => e.preventDefault()}
          draggable
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs shadow-md border border-red-500 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
        >
          <Bookmark className="w-4 h-4 fill-white" />
          <span>⚡ Cào Điểm SIS HUST (Ultra)</span>
        </a>

        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={handleCopyBookmarklet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {copiedBookmarklet ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedBookmarklet ? 'Đã sao chép link bookmarklet!' : 'Sao chép link bookmarklet'}</span>
          </button>
        </div>
      </div>

      {/* METHOD 2: F12 Console Script (Fail-safe 100% works) */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
            <Terminal className="w-4 h-4" />
            <span>Cách 2: Chạy trực tiếp qua DevTools Console (F12) - Đảm bảo hoạt động 100%</span>
          </div>

          <button
            onClick={handleCopyConsole}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-bold text-white transition-colors shadow-sm active:scale-[0.98]"
          >
            {copiedConsole ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedConsole ? 'Đã sao chép code!' : 'Copy Code F12'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Khi đang ở trang Bảng điểm hoặc Chương trình đào tạo trên SIS HUST → Nhấn <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px] text-slate-800 dark:text-white">F12</kbd> → Chọn tab <strong>Console</strong> → Dán đoạn code này vào → Nhấn <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px] text-slate-800 dark:text-white">Enter</kbd>. Toàn bộ bảng điểm & CTĐT sẽ được bóc tách và copy vào clipboard ngay lập tức!
        </p>

        <div className="p-2.5 bg-slate-100 dark:bg-[#020617] rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-blue-300 max-h-24 overflow-y-auto">
          <code>{consoleCode}</code>
        </div>
      </div>
    </div>
  );
};
