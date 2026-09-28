export interface PeriodTime {
  period: number;
  startTime: string;
  endTime: string;
  session: 'morning' | 'afternoon';
}

// Khung giờ tiết học chuẩn của Đại học Bách Khoa Hà Nội (Chuẩn 12 tiết)
export const HUST_PERIOD_TIMES: PeriodTime[] = [
  // Ca sáng
  { period: 1, startTime: '06:45', endTime: '07:30', session: 'morning' },
  { period: 2, startTime: '07:30', endTime: '08:15', session: 'morning' },
  { period: 3, startTime: '08:25', endTime: '09:10', session: 'morning' },
  { period: 4, startTime: '09:20', endTime: '10:05', session: 'morning' },
  { period: 5, startTime: '10:15', endTime: '11:00', session: 'morning' },
  { period: 6, startTime: '11:00', endTime: '11:45', session: 'morning' },
  // Ca chiều
  { period: 7, startTime: '12:30', endTime: '13:15', session: 'afternoon' },
  { period: 8, startTime: '13:15', endTime: '14:00', session: 'afternoon' },
  { period: 9, startTime: '14:10', endTime: '14:55', session: 'afternoon' },
  { period: 10, startTime: '15:05', endTime: '15:50', session: 'afternoon' },
  { period: 11, startTime: '16:00', endTime: '16:45', session: 'afternoon' },
  { period: 12, startTime: '16:45', endTime: '17:30', session: 'afternoon' },
];

export type ScheduleItemType = 'lecture' | 'exercise' | 'lab' | 'project';

export interface ScheduleItem {
  id: string;
  classCode: string;       // Mã lớp kèm/lớp học (VD: 145620)
  courseCode: string;      // Mã học phần (VD: IT3080)
  courseName: string;      // Tên học phần
  dayOfWeek: number;       // 2 = Thứ 2, 3 = Thứ 3, ..., 7 = Thứ 7, 8 = Chủ Nhật
  startPeriod: number;     // Tiết bắt đầu (1 - 12)
  endPeriod: number;       // Tiết kết thúc (1 - 12)
  room: string;            // Phòng học (VD: D9-401, B1-302)
  weeks: string;           // Tuần học (VD: "1-8, 10-18" hoặc "2-16(chẵn)")
  teacher?: string;        // Giảng viên giảng dạy
  type?: ScheduleItemType; // Lý thuyết, bài tập, thí nghiệm...
  color?: string;          // Màu card hiển thị trên thời khóa biểu
}

export interface ScheduleConflict {
  item1: ScheduleItem;
  item2: ScheduleItem;
  dayOfWeek: number;
  overlapPeriods: number[];
  message: string;
}
