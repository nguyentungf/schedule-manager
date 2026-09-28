import { Course } from './course';
import { Deadline } from './deadline';
import { SemesterHistory } from './grade';
import { ScheduleItem } from './schedule';

export type DashboardTab = 'dashboard' | 'schedule' | 'curriculum' | 'grade-calculator' | 'planner' | 'sis' | 'settings';

export type ThemePalette = 'crimson' | 'ocean' | 'emerald' | 'amethyst' | 'amber' | 'oled';

export interface StudentInfo {
  name: string;
  studentId: string;       // MSSV
  major: string;           // Mã ngành: 'IT1', 'IT2', 'EE1', 'EE2', 'ET1', 'ET2', 'ET-E4', 'ET-E5', 'ET-E9', 'ET-E16'
  majorName: string;       // Tên đầy đủ của ngành
  classCode: string;       // Lớp quản lý: IT1-01, EE2-02...
  cohort: string;          // Khóa: K65, K66, K67, K68, K69...
  currentTerm: number;     // Kỳ học hiện tại (1 - 8)
  targetCpa: number;       // Mục tiêu CPA (VD: 3.2, 3.6)
  exemptEnglish?: boolean; // Miễn các học phần Tiếng Anh (FL*) do có chứng chỉ IELTS/TOEIC
  exemptEnglishCourses?: string[]; // Danh sách cụ thể các mã môn tiếng Anh được miễn: ['FL1010', 'FL1020', ...]
}

export interface CustomGradeScaleSettings {
  minA: number;   // default 8.5
  minBPlus: number; // default 8.0
  minB: number;   // default 7.0
  minCPlus: number; // default 6.5
  minC: number;   // default 5.5
  minDPlus: number; // default 5.0
  minD: number;   // default 4.0
  failFinalExamMin: number; // default 3.0 (điểm liệt cuối kỳ)
}

export interface DashboardSettings {
  theme: 'light' | 'dark' | 'oled' | 'crimson';
  themePalette?: ThemePalette;    // 6 bảng màu giao diện chuẩn Impeccable
  soundEnabled: boolean;
  urgentThresholdHours: number;
  warningThresholdHours: number;
  gradeScales: CustomGradeScaleSettings;
  exemptEnglish?: boolean;        // Miễn học phần tiếng Anh
  manualScheduleMode?: boolean;   // Toggle tự thiết lập TKB thủ công
  autoContrast?: boolean;         // Tự động tương phản màu nền WCAG AAA trên toàn bộ content (bắt buộc)
  dashboardCardOrder?: string[];  // Thứ tự hiển thị các thẻ kéo thả trên Dashboard
  dashboardHiddenCards?: string[]; // Danh sách ID các thẻ đang bị ẩn trên Dashboard
}

export interface DashboardState {
  version: string;
  studentInfo: StudentInfo;
  deadlines: Deadline[];
  courses: Course[];
  schedule: ScheduleItem[];
  semesterHistory: SemesterHistory[];
  settings: DashboardSettings;
  lastUpdated: string;
}

