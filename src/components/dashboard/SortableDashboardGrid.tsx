import React, { useState } from 'react';
import { GripVertical, ArrowUp, ArrowDown, Check, LayoutGrid } from 'lucide-react';
import { HeroBanner } from './HeroBanner';
import { AcademicKpiSection } from './AcademicKpiSection';
import { EnrolledCoursesSection } from './EnrolledCoursesSection';
import { InstructorsAndNotices } from './InstructorsAndNotices';
import { StudentInfo } from '../../types/state';
import { Course } from '../../types/course';
import { Deadline } from '../../types/deadline';
import { ScheduleItem } from '../../types/schedule';

export type DashboardCardId = 'hero' | 'kpi' | 'courses' | 'deadlines';

const DEFAULT_CARD_ORDER: DashboardCardId[] = ['hero', 'kpi', 'courses', 'deadlines'];

interface SortableDashboardGridProps {
  cardOrder?: string[];
  onUpdateCardOrder: (newOrder: string[]) => void;
  isArrangeMode: boolean;
  onExitArrangeMode: () => void;
  // Card sub-component props
  studentInfo: StudentInfo;
  courses: Course[];
  totalCurriculumCredits: number;
  deadlines: Deadline[];
  schedule: ScheduleItem[];
  onOpenCourseDetail: (course: Course) => void;
  onNavigateToCurriculum: () => void;
  onToggleDeadlineComplete: (id: string) => void;
  onOpenAddDeadline: () => void;
  onEditDeadline: (deadline: Deadline) => void;
}

const CARD_LABELS: Record<DashboardCardId, string> = {
  hero: 'Lời chào & Thông tin Sinh viên',
  kpi: 'Chỉ số học tập CPA & Tín chỉ tích lũy',
  courses: 'Học phần đăng ký kỳ hiện tại',
  deadlines: 'Hạn chót công việc & Lịch học hôm nay',
};

export const SortableDashboardGrid: React.FC<SortableDashboardGridProps> = ({
  cardOrder = DEFAULT_CARD_ORDER,
  onUpdateCardOrder,
  isArrangeMode,
  onExitArrangeMode,
  studentInfo,
  courses,
  totalCurriculumCredits,
  deadlines,
  schedule,
  onOpenCourseDetail,
  onNavigateToCurriculum,
  onToggleDeadlineComplete,
  onOpenAddDeadline,
  onEditDeadline,
}) => {
  // Validate and deduplicate order
  const validOrder = (
    cardOrder && cardOrder.length > 0 ? cardOrder : DEFAULT_CARD_ORDER
  ).filter((id): id is DashboardCardId => ['hero', 'kpi', 'courses', 'deadlines'].includes(id));

  // Ensure all 4 cards exist
  DEFAULT_CARD_ORDER.forEach(id => {
    if (!validOrder.includes(id)) validOrder.push(id);
  });

  const [draggedCardId, setDraggedCardId] = useState<DashboardCardId | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, id: DashboardCardId) => {
    setDraggedCardId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetIndex !== index) {
      setDropTargetIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (draggedCardId && dropTargetIndex !== null) {
      const currentIndex = validOrder.indexOf(draggedCardId);
      if (currentIndex !== -1 && currentIndex !== dropTargetIndex) {
        const nextOrder = [...validOrder];
        nextOrder.splice(currentIndex, 1);
        nextOrder.splice(dropTargetIndex, 0, draggedCardId);
        onUpdateCardOrder(nextOrder);
      }
    }
    setDraggedCardId(null);
    setDropTargetIndex(null);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const nextOrder = [...validOrder];
    const temp = nextOrder[index - 1];
    nextOrder[index - 1] = nextOrder[index];
    nextOrder[index] = temp;
    onUpdateCardOrder(nextOrder);
  };

  const handleMoveDown = (index: number) => {
    if (index >= validOrder.length - 1) return;
    const nextOrder = [...validOrder];
    const temp = nextOrder[index + 1];
    nextOrder[index + 1] = nextOrder[index];
    nextOrder[index] = temp;
    onUpdateCardOrder(nextOrder);
  };

  // Render individual card content
  const renderCardContent = (id: DashboardCardId) => {
    switch (id) {
      case 'hero':
        return (
          <HeroBanner
            studentName={studentInfo.name}
            studentId={studentInfo.studentId}
            majorName={studentInfo.majorName}
          />
        );
      case 'kpi':
        return (
          <AcademicKpiSection
            courses={courses}
            totalCurriculumCredits={totalCurriculumCredits}
          />
        );
      case 'courses':
        return (
          <EnrolledCoursesSection
            courses={courses}
            onOpenDetail={onOpenCourseDetail}
            onNavigateToCurriculum={onNavigateToCurriculum}
          />
        );
      case 'deadlines':
        return (
          <InstructorsAndNotices
            deadlines={deadlines}
            schedule={schedule}
            onToggleComplete={onToggleDeadlineComplete}
            onOpenAddDeadline={onOpenAddDeadline}
            onEditDeadline={onEditDeadline}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Arrange Mode Floating Banner */}
      {isArrangeMode && (
        <div className="sticky top-20 z-40 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center justify-between border border-red-400/30 backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base">Chế độ sắp xếp trật tự thẻ</h4>
              <p className="text-xs text-white/80 hidden sm:block">
                Kéo thả thẻ hoặc bấm nút mũi tên để di chuyển thứ tự hiển thị. Thẻ đang kéo sẽ có hiệu ứng rung nhẹ.
              </p>
            </div>
          </div>
          <button
            onClick={onExitArrangeMode}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-red-600 hover:bg-slate-100 font-semibold text-sm rounded-xl shadow transition-all shrink-0"
          >
            <Check className="w-4 h-4" />
            <span>Xong</span>
          </button>
        </div>
      )}

      {/* Cards list */}
      <div className="space-y-6">
        {validOrder.map((cardId, index) => {
          const isDragging = draggedCardId === cardId;
          const isTarget = dropTargetIndex === index && draggedCardId !== cardId;

          return (
            <React.Fragment key={cardId}>
              {/* Insertion preview placeholder when dragging over this position */}
              {isTarget && (
                <div className="drop-indicator-placeholder p-4 text-center">
                  <span>✦ Thả thẻ vào vị trí này ✦</span>
                </div>
              )}

              <div
                draggable={isArrangeMode}
                onDragStart={e => handleDragStart(e, cardId)}
                onDragOver={e => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`transition-all duration-200 relative ${
                  isDragging ? 'dragging-vibrate ring-2 ring-red-500 rounded-3xl' : ''
                } ${
                  isArrangeMode
                    ? 'p-2 sm:p-3 border-2 border-dashed border-red-500/30 rounded-3xl bg-slate-900/30 hover:border-red-500/60'
                    : ''
                }`}
              >
                {/* Arrange Mode Card Bar */}
                {isArrangeMode && (
                  <div className="flex items-center justify-between mb-3 px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700 text-xs font-medium text-slate-300">
                    <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-4 h-4 text-red-400" />
                      <span className="font-semibold text-white">{CARD_LABELS[cardId]}</span>
                      <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full">
                        Vị trí: {index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Di chuyển lên"
                        className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === validOrder.length - 1}
                        title="Di chuyển xuống"
                        className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Actual Card Content */}
                {renderCardContent(cardId)}
              </div>
            </React.Fragment>
          );
        })}

        {/* Indicator if dragging to the very end */}
        {dropTargetIndex === validOrder.length && (
          <div className="drop-indicator-placeholder p-4 text-center">
            <span>✦ Thả thẻ vào vị trí cuối cùng ✦</span>
          </div>
        )}
      </div>
    </div>
  );
};
