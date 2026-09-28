import React, { useState } from 'react';
import { ScheduleItem } from '../../types/schedule';
import { ScheduleCalendarView } from './ScheduleCalendarView';
import { ScheduleListView } from './ScheduleListView';
import { ScheduleItemModal } from './ScheduleItemModal';
import { ScheduleImportModal } from './ScheduleImportModal';
import { ExcelUploadModal } from '../common/ExcelUploadModal';
import { Calendar, List, Plus, Upload, FileSpreadsheet, Sparkles } from 'lucide-react';

interface ScheduleManagerProps {
  schedule: ScheduleItem[];
  onAddScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  onUpdateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => void;
  onDeleteScheduleItem: (id: string) => void;
  onImportScheduleItems: (items: ScheduleItem[]) => void;
  onImportScheduleFromExcel?: (schedule: ScheduleItem[], overwrite: boolean) => void;
  onOpenOptimizer?: () => void;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  schedule,
  onAddScheduleItem,
  onUpdateScheduleItem,
  onDeleteScheduleItem,
  onImportScheduleItems,
  onImportScheduleFromExcel,
  onOpenOptimizer
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsAddEditModalOpen(true);
  };

  const handleEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setIsAddEditModalOpen(true);
  };

  const handleSaveItem = (itemData: Omit<ScheduleItem, 'id'>) => {
    if (editingItem) {
      onUpdateScheduleItem(editingItem.id, itemData);
    } else {
      onAddScheduleItem(itemData);
    }
  };

  const handleAddNewAtSlot = (dayOfWeek: number, startPeriod: number) => {
    setEditingItem({
      id: '',
      classCode: '',
      courseCode: '',
      courseName: '',
      dayOfWeek,
      startPeriod,
      endPeriod: Math.min(12, startPeriod + 1),
      room: '',
      weeks: '1-18',
      type: 'lecture',
      color: '#dc2626'
    });
    setIsAddEditModalOpen(true);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#131b2e] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/70 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Xem Lịch Tuần</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Danh Sách Lớp ({schedule.length})</span>
            </button>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {onOpenOptimizer && (
            <button
              onClick={onOpenOptimizer}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-600/25 transition-all active:scale-[0.98]"
              title="Tự động xếp TKB không trùng tiết, gợi ý chiến thuật nghỉ ngơi & học máy môn học kỳ tới"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span>⚡ Soạn TKB Tự Động & Gợi Ý AI</span>
            </button>
          )}

          {onImportScheduleFromExcel && (
            <button
              onClick={() => setIsExcelModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs font-semibold transition-colors"
              title="Nhập thời khóa biểu từ file Excel (.xlsx, .xls, .csv) hoặc tải file mẫu"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Nhập Excel</span>
            </button>
          )}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-100 dark:hover:bg-blue-600/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Nhập SIS</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Lớp</span>
          </button>
        </div>
      </div>

      {/* Main View */}
      {viewMode === 'calendar' ? (
        <ScheduleCalendarView
          schedule={schedule}
          onEditItem={handleEdit}
          onDeleteItem={onDeleteScheduleItem}
          onAddNewAtSlot={handleAddNewAtSlot}
        />
      ) : (
        <ScheduleListView
          schedule={schedule}
          onOpenAddModal={handleOpenAdd}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onEditItem={handleEdit}
          onDeleteItem={onDeleteScheduleItem}
        />
      )}

      {/* Add / Edit Modal */}
      <ScheduleItemModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />

      {/* SIS Import Modal */}
      <ScheduleImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSchedule={onImportScheduleItems}
      />

      {/* Excel Upload Modal */}
      {onImportScheduleFromExcel && (
        <ExcelUploadModal
          isOpen={isExcelModalOpen}
          onClose={() => setIsExcelModalOpen(false)}
          mode="schedule"
          onImportSchedule={onImportScheduleFromExcel}
        />
      )}
    </div>
  );
};
