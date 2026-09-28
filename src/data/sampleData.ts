import { DashboardState } from '../types/state';
import { IT1_CURRICULUM } from './curricula/it1';
import { Course } from '../types/course';
import { Deadline } from '../types/deadline';
import { ScheduleItem } from '../types/schedule';

// Helper tạo deadline tương đối với thời điểm hiện tại
export function createSampleDeadlines(): Deadline[] {
  const now = new Date();
  
  // Urgent: Còn 14 tiếng (dưới 24h)
  const urgentDue = new Date(now.getTime() + 14 * 60 * 60 * 1000);
  const urgentAssigned = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

  // Warning: Còn 46 tiếng (dưới 72h)
  const warningDue = new Date(now.getTime() + 46 * 60 * 60 * 1000);
  const warningAssigned = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Safe: Còn 5 ngày
  const safeDue = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const safeAssigned = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  // Safe: Còn 9 ngày
  const laterDue = new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000);
  const laterAssigned = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'dl_urgent_1',
      title: 'Báo cáo Milestone 2: Thiết kế Database & API REST',
      courseCode: 'IT4060',
      courseName: 'Lập trình Web & Ứng dụng',
      type: 'project',
      assignedAt: urgentAssigned.toISOString(),
      dueAt: urgentDue.toISOString(),
      notes: 'Nộp file PDF báo cáo kèm link GitHub repository cho thầy hướng dẫn trên MS Teams.',
      docUrl: 'https://teams.microsoft.com',
      completed: false,
      completedAt: null
    },
    {
      id: 'dl_warning_2',
      title: 'Bài tập lớn 1: Cài đặt thuật toán A* và Heuristic Search',
      courseCode: 'IT4409',
      courseName: 'Trí tuệ nhân tạo',
      type: 'assignment',
      assignedAt: warningAssigned.toISOString(),
      dueAt: warningDue.toISOString(),
      notes: 'Thực nghiệm trên bài toán 8-puzzle và TSP, nộp Jupyter Notebook kèm slide phân tích.',
      docUrl: 'https://qldt.hust.edu.vn',
      completed: false,
      completedAt: null
    },
    {
      id: 'dl_safe_3',
      title: 'Thực hành Lab 3: Khai thác lỗ hổng Buffer Overflow & ROP',
      courseCode: 'IT4015',
      courseName: 'Nhập môn An toàn thông tin',
      type: 'lab',
      assignedAt: safeAssigned.toISOString(),
      dueAt: safeDue.toISOString(),
      notes: 'Làm trên máy ảo Ubuntu 20.04, chụp ảnh cờ (flag) và ghi lại shellcode.',
      docUrl: 'https://drive.google.com',
      completed: false,
      completedAt: null
    },
    {
      id: 'dl_safe_4',
      title: 'Đặc tả yêu cầu phần mềm SRS (Use-case Diagram & User Stories)',
      courseCode: 'IT3120',
      courseName: 'Phân tích thiết kế hệ thống',
      type: 'assignment',
      assignedAt: laterAssigned.toISOString(),
      dueAt: laterDue.toISOString(),
      notes: 'Vẽ bằng Visual Paradigm hoặc PlantUML, tuân thủ chuẩn IEEE 830.',
      docUrl: '',
      completed: false,
      completedAt: null
    }
  ];
}

// Khởi tạo thời khóa biểu mẫu kỳ hiện tại
export function createSampleSchedule(): ScheduleItem[] {
  return [
    {
      id: 'sch_1',
      classCode: '145620',
      courseCode: 'IT4060',
      courseName: 'Lập trình Web & Ứng dụng',
      dayOfWeek: 2, // Thứ 2
      startPeriod: 1,
      endPeriod: 3,
      room: 'D9-401',
      weeks: '1-18',
      teacher: 'TS. Trịnh Tuấn Đạt',
      type: 'lecture',
      color: '#ef4444'
    },
    {
      id: 'sch_2',
      classCode: '145621',
      courseCode: 'IT4409',
      courseName: 'Trí tuệ nhân tạo',
      dayOfWeek: 3, // Thứ 3
      startPeriod: 7,
      endPeriod: 9,
      room: 'B1-302',
      weeks: '1-18',
      teacher: 'PGS. TS. Nguyễn Nhật Quang',
      type: 'lecture',
      color: '#3b82f6'
    },
    {
      id: 'sch_3',
      classCode: '145622',
      courseCode: 'IT3120',
      courseName: 'Phân tích thiết kế hệ thống',
      dayOfWeek: 4, // Thứ 4
      startPeriod: 3,
      endPeriod: 5,
      room: 'D3-501',
      weeks: '1-18',
      teacher: 'TS. Vũ Thị Hương Giang',
      type: 'lecture',
      color: '#10b981'
    },
    {
      id: 'sch_4',
      classCode: '145623',
      courseCode: 'IT4015',
      courseName: 'Nhập môn An toàn thông tin',
      dayOfWeek: 5, // Thứ 5
      startPeriod: 7,
      endPeriod: 9,
      room: 'D5-301',
      weeks: '1-18',
      teacher: 'TS. Phạm Văn Hậu',
      type: 'lecture',
      color: '#f59e0b'
    },
    {
      id: 'sch_5',
      classCode: '145624',
      courseCode: 'IT4060',
      courseName: 'Thực hành Lập trình Web',
      dayOfWeek: 6, // Thứ 6
      startPeriod: 1,
      endPeriod: 4,
      room: 'Lab B1-602',
      weeks: '2-16(chẵn)',
      teacher: 'ThS. Lê Đình Thanh',
      type: 'lab',
      color: '#8b5cf6'
    }
  ];
}

// Khởi tạo danh sách môn học mẫu kèm điểm thực tế các kỳ trước
export function createSampleCourses(): Course[] {
  const baseCourses = JSON.parse(JSON.stringify(IT1_CURRICULUM.courses)) as Course[];

  const gradeMap: Record<string, { status: Course['status']; qt: number | null; ck: number | null; letter: any; scale4: number | null; isRetake?: boolean }> = {
    // Kỳ 1: Hoàn thành
    'MI1111': { status: 'passed', qt: 8.5, ck: 9.0, letter: 'A', scale4: 4.0, isRetake: true },
    'MI1141': { status: 'passed', qt: 8.0, ck: 7.5, letter: 'B', scale4: 3.0 },
    'IT1110': { status: 'passed', qt: 9.0, ck: 9.5, letter: 'A', scale4: 4.0 },
    'FL1010': { status: 'passed', qt: 8.0, ck: 8.5, letter: 'B+', scale4: 3.5 },
    'SSH1110': { status: 'passed', qt: 7.0, ck: 7.0, letter: 'B', scale4: 3.0 },

    // Kỳ 2: Hoàn thành
    'MI1121': { status: 'passed', qt: 7.5, ck: 8.0, letter: 'B', scale4: 3.0 },
    'PH1110': { status: 'passed', qt: 6.5, ck: 7.0, letter: 'C+', scale4: 2.5 },
    'IT3011': { status: 'passed', qt: 9.0, ck: 9.0, letter: 'A', scale4: 4.0 },
    'IT3020': { status: 'passed', qt: 8.5, ck: 8.0, letter: 'B+', scale4: 3.5 },
    'FL1020': { status: 'passed', qt: 8.0, ck: 8.5, letter: 'B+', scale4: 3.5 },

    // Kỳ 3: Hoàn thành
    'MI1131': { status: 'passed', qt: 8.0, ck: 7.5, letter: 'B', scale4: 3.0 },
    'IT3040': { status: 'passed', qt: 9.5, ck: 9.0, letter: 'A', scale4: 4.0 },
    'IT3070': { status: 'passed', qt: 8.0, ck: 8.5, letter: 'B+', scale4: 3.5 },
    'PH1120': { status: 'passed', qt: 7.0, ck: 6.5, letter: 'C+', scale4: 2.5 },
    'SSH1120': { status: 'passed', qt: 7.5, ck: 8.0, letter: 'B', scale4: 3.0 },

    // Kỳ 4: Hoàn thành
    'IT3080': { status: 'passed', qt: 8.5, ck: 8.5, letter: 'A', scale4: 4.0 },
    'IT3100': { status: 'passed', qt: 9.0, ck: 8.5, letter: 'A', scale4: 4.0 },
    'IT3170': { status: 'passed', qt: 8.0, ck: 7.5, letter: 'B', scale4: 3.0 },
    'MI2020': { status: 'passed', qt: 7.5, ck: 7.0, letter: 'B', scale4: 3.0 },
    'SSH1130': { status: 'passed', qt: 8.0, ck: 8.0, letter: 'B', scale4: 3.0 },

    // Kỳ 5: Đang học
    'IT4409': { status: 'in_progress', qt: 8.5, ck: null, letter: null, scale4: null },
    'IT4060': { status: 'in_progress', qt: 9.0, ck: null, letter: null, scale4: null },
    'IT3120': { status: 'in_progress', qt: 8.0, ck: null, letter: null, scale4: null },
    'IT4015': { status: 'in_progress', qt: 8.0, ck: null, letter: null, scale4: null },
    'SSH1140': { status: 'in_progress', qt: 7.5, ck: null, letter: null, scale4: null }
  };

  return baseCourses.map(course => {
    const override = gradeMap[course.code];
    if (override) {
      return {
        ...course,
        status: override.status,
        gradeQt: override.qt,
        gradeCk: override.ck,
        gradeLetter: override.letter,
        gradeScale4: override.scale4,
        isRetake: override.isRetake || false
      };
    }
    return course;
  });
}

export function getInitialSampleState(): DashboardState {
  return {
    version: 'HUST_DASHBOARD_DATA_V1',
    studentInfo: {
      name: 'Nguyễn Văn Bách',
      studentId: '20210001',
      major: 'IT1',
      majorName: 'Khoa học Máy tính (Computer Science)',
      classCode: 'Khoa học Máy tính 01',
      cohort: 'K66',
      currentTerm: 5,
      targetCpa: 3.6
    },
    deadlines: createSampleDeadlines(),
    courses: createSampleCourses(),
    schedule: createSampleSchedule(),
    semesterHistory: [
      {
        termId: '2021.1',
        termName: 'Học kỳ 1 (2021-2022)',
        credits: 18,
        gpa: 3.33,
        drl: 85,
        avgDifficulty: 3.8
      },
      {
        termId: '2021.2',
        termName: 'Học kỳ 2 (2021-2022)',
        credits: 16,
        gpa: 3.25,
        drl: 88,
        avgDifficulty: 4.1
      },
      {
        termId: '2022.1',
        termName: 'Học kỳ 1 (2022-2023)',
        credits: 14,
        gpa: 3.36,
        drl: 90,
        avgDifficulty: 3.9
      },
      {
        termId: '2022.2',
        termName: 'Học kỳ 2 (2022-2023)',
        credits: 14,
        gpa: 3.43,
        drl: 88,
        avgDifficulty: 3.7
      }
    ],
    settings: {
      theme: 'dark',
      soundEnabled: true,
      urgentThresholdHours: 24,
      warningThresholdHours: 72,
      gradeScales: {
        minA: 8.5,
        minBPlus: 8.0,
        minB: 7.0,
        minCPlus: 6.5,
        minC: 5.5,
        minDPlus: 5.0,
        minD: 4.0,
        failFinalExamMin: 3.0
      },
      autoContrast: true
    },
    lastUpdated: new Date().toISOString()
  };
}
