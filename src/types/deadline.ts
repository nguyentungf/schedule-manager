export type DeadlineType = 'project' | 'assignment' | 'lab' | 'exam';

export type UrgencyLevel = 'urgent' | 'warning' | 'safe' | 'overdue';

export interface Deadline {
  id: string;
  title: string;              // Tiêu đề bài tập/đồ án
  courseCode: string;         // Mã môn học (IT3011...)
  courseName: string;         // Tên môn học
  type: DeadlineType;         // Loại deadline
  assignedAt: string;         // Ngày giao bài (ISO string: 2026-09-20T08:00)
  dueAt: string;              // Hạn nộp bài (ISO string: 2026-09-28T23:59)
  notes?: string;             // Ghi chú chi tiết
  docUrl?: string;            // Link nộp bài/tài liệu (Teams, LMS, Drive...)
  completed: boolean;         // Đã hoàn thành hay chưa
  completedAt?: string | null;// Thời điểm hoàn thành
}

export interface CountdownInfo {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  percentElapsed: number;     // 0 - 100%
  urgency: UrgencyLevel;
  isOverdue: boolean;
}
