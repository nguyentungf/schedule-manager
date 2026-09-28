import { Course, CourseStatus, LetterGrade } from '../types/course';
import { ScheduleItem } from '../types/schedule';
import { parseHustConditionString } from './courseCatalogParser';
import { inferYearAndTermFromCourseCode } from './sisParser';

// Lazy dynamic import để không làm nặng bundle ban đầu
const getXlsx = async () => await import('xlsx');

const SCHEDULE_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'
];

export interface ExcelImportReport {
  totalRows: number;
  successCount: number;
  errors: string[];
}

/**
 * Đọc file Excel / CSV danh mục học phần
 */
export async function parseCoursesFromExcel(file: File): Promise<{
  courses: Course[];
  report: ExcelImportReport;
}> {
  const XLSX = await getXlsx();
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  const courses: Course[] = [];
  const errors: string[] = [];
  const seenCodes = new Set<string>();

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];

    // Tìm trường Mã học phần
    const rawCode = String(
      row['Mã học phần'] || row['Mã HP'] || row['Mã môn'] || row['Course Code'] || row['Code'] || row['Mã'] || ''
    ).trim().toUpperCase().replace(/\s+/g, '');

    if (!rawCode || !/^[A-Z]{2,4}[0-9]{4}[A-Z0-9]*$/i.test(rawCode)) {
      continue;
    }

    if (seenCodes.has(rawCode)) {
      continue;
    }

    // Tên học phần (Bảo toàn 100% tên do người dùng nhập, tuyệt đối không tự bịa)
    const rawName = String(
      row['Tên học phần'] || row['Tên HP'] || row['Tên môn'] || row['Course Name'] || row['Name'] || row['Tên'] || ''
    ).trim();
    const name = rawName || ('Học phần ' + rawCode);

    // Số tín chỉ
    const rawCredits = row['Số tín chỉ'] || row['Số TC'] || row['Tín chỉ'] || row['TC'] || row['Credits'] || 3;
    const credits = Math.max(1, parseInt(String(rawCredits)) || 3);

    // Kỳ học
    const rawTerm = row['Kỳ học'] || row['Kỳ'] || row['Học kỳ'] || row['Term'] || row['Semester'];
    const parsedTerm = rawTerm ? parseInt(String(rawTerm)) : undefined;

    // HP điều kiện / Tiên quyết
    const rawCondition = String(
      row['Học phần điều kiện'] || row['HP điều kiện'] || row['Tiên quyết'] || row['Điều kiện'] || row['Prerequisites'] || ''
    ).trim();
    const condResult = parseHustConditionString(rawCondition);

    // Suy luận năm và kỳ học nếu chưa có
    const inferred = inferYearAndTermFromCourseCode(rawCode, condResult.distinctPrerequisites, parsedTerm);
    const term = inferred.term;

    // Trọng số
    const rawCk = row['Trọng số CK'] || row['CK'] || row['Cuối kỳ'] || row['Weight CK'];
    const weightCk = rawCk ? parseFloat(String(rawCk).replace(',', '.')) : 0.7;
    const rawQt = row['Trọng số QT'] || row['QT'] || row['Quá trình'] || row['Weight QT'];
    const weightQt = rawQt ? parseFloat(String(rawQt).replace(',', '.')) : Math.round((1 - weightCk) * 10) / 10;

    // Điểm số & Điểm chữ (nếu người dùng nhập điểm đã học)
    const rawGradeLetter = String(row['Điểm chữ'] || row['Điểm'] || row['Grade'] || '').trim().toUpperCase();
    let gradeLetter: LetterGrade | null = null;
    if (['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'].includes(rawGradeLetter)) {
      gradeLetter = rawGradeLetter as LetterGrade;
    } else if (rawGradeLetter === 'A+') {
      gradeLetter = 'A';
    }

    const rawScale4 = row['Điểm thang 4'] || row['Điểm hệ 4'] || row['Thang 4'] || row['Scale 4'];
    let gradeScale4: number | null = rawScale4 ? parseFloat(String(rawScale4).replace(',', '.')) : null;
    if (gradeLetter && gradeScale4 === null) {
      const map: Record<string, number> = { A: 4.0, 'B+': 3.5, B: 3.0, 'C+': 2.5, C: 2.0, 'D+': 1.5, D: 1.0, F: 0.0 };
      gradeScale4 = map[gradeLetter] ?? null;
    }

    const rawGradeQt = row['Điểm QT'] || row['Điểm quá trình'];
    const gradeQt = rawGradeQt ? parseFloat(String(rawGradeQt).replace(',', '.')) : null;

    const rawGradeCk = row['Điểm CK'] || row['Điểm cuối kỳ'] || row['Điểm thi'];
    const gradeCk = rawGradeCk ? parseFloat(String(rawGradeCk).replace(',', '.')) : null;

    // Trạng thái học phần
    let status: CourseStatus = 'planned';
    if (gradeScale4 !== null && gradeScale4 > 0) {
      status = 'passed';
    } else if (gradeLetter === 'F') {
      status = 'failed';
    } else if (row['Trạng thái']) {
      const st = String(row['Trạng thái']).toLowerCase();
      if (st.includes('đang học') || st.includes('in_progress')) status = 'in_progress';
      else if (st.includes('đã qua') || st.includes('passed')) status = 'passed';
      else if (st.includes('nợ') || st.includes('trượt') || st.includes('failed')) status = 'failed';
    }

    courses.push({
      id: 'excel_' + rawCode + '_' + idx,
      code: rawCode,
      name,
      credits,
      term,
      weightQt,
      weightCk,
      difficulty: 3.5,
      prerequisites: condResult.distinctPrerequisites,
      conditionString: rawCondition,
      status,
      gradeQt,
      gradeCk,
      gradeLetter,
      gradeScale4
    });

    seenCodes.add(rawCode);
  }

  return {
    courses,
    report: {
      totalRows: rows.length,
      successCount: courses.length,
      errors
    }
  };
}

/**
 * Đọc file Excel / CSV Thời khóa biểu
 */
export async function parseScheduleFromExcel(file: File): Promise<{
  schedule: ScheduleItem[];
  report: ExcelImportReport;
}> {
  const XLSX = await getXlsx();
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  const schedule: ScheduleItem[] = [];
  const errors: string[] = [];

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];

    // Mã lớp
    const classCode = String(
      row['Mã lớp'] || row['Mã lớp học'] || row['Mã lớp kèm'] || row['Class Code'] || (145000 + idx)
    ).trim();

    // Mã học phần
    const courseCode = String(
      row['Mã học phần'] || row['Mã HP'] || row['Mã môn'] || row['Course Code'] || ''
    ).trim().toUpperCase();

    if (!courseCode) continue;

    // Tên học phần (Bảo toàn 100% tên do người dùng nhập)
    const courseName = String(
      row['Tên học phần'] || row['Tên HP'] || row['Tên môn'] || row['Course Name'] || ('Học phần ' + courseCode)
    ).trim();

    // Thứ trong tuần
    let dayOfWeek = 2;
    const rawDay = String(row['Thứ'] || row['Thứ trong tuần'] || row['Day'] || '2').trim().toUpperCase();
    if (rawDay.includes('CN') || rawDay.includes('CHỦ') || rawDay === '8') {
      dayOfWeek = 8;
    } else {
      const match = rawDay.match(/\d/);
      if (match) {
        dayOfWeek = Math.min(8, Math.max(2, parseInt(match[0])));
      }
    }

    // Tiết học
    let startPeriod = 1;
    let endPeriod = 3;

    if (row['Tiết'] || row['Tiết học']) {
      const pMatch = String(row['Tiết'] || row['Tiết học']).match(/(\d{1,2})\s*-\s*(\d{1,2})/);
      if (pMatch) {
        startPeriod = Math.min(12, Math.max(1, parseInt(pMatch[1])));
        endPeriod = Math.min(12, Math.max(startPeriod, parseInt(pMatch[2])));
      }
    } else {
      const rawStart = row['Tiết bắt đầu'] || row['Tiết BĐ'] || row['Bắt đầu'] || row['Start Period'];
      if (rawStart) startPeriod = Math.min(12, Math.max(1, parseInt(String(rawStart))));

      const rawEnd = row['Tiết kết thúc'] || row['Tiết KT'] || row['Kết thúc'] || row['End Period'];
      if (rawEnd) endPeriod = Math.min(12, Math.max(startPeriod, parseInt(String(rawEnd))));
      else endPeriod = Math.min(12, startPeriod + 2);
    }

    // Phòng học
    const room = String(
      row['Phòng học'] || row['Phòng'] || row['Room'] || 'Chưa xếp phòng'
    ).trim().toUpperCase();

    // Tuần học
    const weeks = String(
      row['Tuần học'] || row['Tuần'] || row['Weeks'] || '2-9, 11-18'
    ).trim();

    // Giảng viên
    const teacher = String(
      row['Giảng viên'] || row['GV'] || row['Giáo viên'] || row['Teacher'] || ''
    ).trim();

    schedule.push({
      id: 'sch_excel_' + Date.now() + '_' + idx,
      classCode,
      courseCode,
      courseName,
      dayOfWeek,
      startPeriod,
      endPeriod,
      room,
      weeks: weeks || '2-9, 11-18',
      teacher,
      type: 'lecture',
      color: SCHEDULE_COLORS[idx % SCHEDULE_COLORS.length]
    });
  }

  return {
    schedule,
    report: {
      totalRows: rows.length,
      successCount: schedule.length,
      errors
    }
  };
}

/**
 * Tạo và tải về File Excel Mẫu danh mục học phần chuẩn HUST
 */
export async function downloadCoursesExcelTemplate(): Promise<void> {
  const XLSX = await getXlsx();
  const sampleData = [
    {
      'Mã học phần': 'MI1111',
      'Tên học phần': 'Giải tích 1',
      'Số tín chỉ': 4,
      'Kỳ học': 1,
      'Học phần điều kiện': 'Không',
      'Trọng số CK': 0.7,
      'Trọng số QT': 0.3,
      'Điểm chữ': 'A',
      'Điểm thang 4': 4.0,
      'Trạng thái': 'Đã qua'
    },
    {
      'Mã học phần': 'ET2050',
      'Tên học phần': 'Lý thuyết mạch',
      'Số tín chỉ': 3,
      'Kỳ học': 2,
      'Học phần điều kiện': '(MI1111,MI1121,MI1131,PH1120)',
      'Trọng số CK': 0.7,
      'Trọng số QT': 0.3,
      'Điểm chữ': '',
      'Điểm thang 4': '',
      'Trạng thái': 'Đang học'
    },
    {
      'Mã học phần': 'ET2000',
      'Tên học phần': 'Tín hiệu và Hệ thống',
      'Số tín chỉ': 3,
      'Kỳ học': 3,
      'Học phần điều kiện': '(MI1111)',
      'Trọng số CK': 0.7,
      'Trọng số QT': 0.3,
      'Điểm chữ': '',
      'Điểm thang 4': '',
      'Trạng thái': 'Chưa học'
    },
    {
      'Mã học phần': 'ET3230',
      'Tên học phần': 'Kỹ thuật thông tin quang',
      'Số tín chỉ': 3,
      'Kỳ học': 6,
      'Học phần điều kiện': '(ET3210)',
      'Trọng số CK': 0.7,
      'Trọng số QT': 0.3,
      'Điểm chữ': '',
      'Điểm thang 4': '',
      'Trạng thái': 'Chưa học'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  // Đặt độ rộng cột
  ws['!cols'] = [
    { wch: 14 }, // Mã HP
    { wch: 28 }, // Tên HP
    { wch: 10 }, // Số TC
    { wch: 10 }, // Kỳ học
    { wch: 32 }, // HP điều kiện
    { wch: 14 }, // Trọng số CK
    { wch: 14 }, // Trọng số QT
    { wch: 12 }, // Điểm chữ
    { wch: 14 }, // Điểm hệ 4
    { wch: 14 }  // Trạng thái
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Danh Mục Học Phần');
  XLSX.writeFile(wb, 'Mau_Danh_Muc_Hoc_Phan_HUST.xlsx');
}

/**
 * Tạo và tải về File Excel Mẫu Thời khóa biểu chuẩn HUST
 */
export async function downloadScheduleExcelTemplate(): Promise<void> {
  const XLSX = await getXlsx();
  const sampleSchedule = [
    {
      'Mã lớp': '145620',
      'Mã học phần': 'ET2050',
      'Tên học phần': 'Lý thuyết mạch',
      'Thứ': 2,
      'Tiết bắt đầu': 1,
      'Tiết kết thúc': 3,
      'Phòng học': 'D9-401',
      'Tuần học': '2-9, 11-18',
      'Giảng viên': 'PGS. TS. Nguyễn Văn A'
    },
    {
      'Mã lớp': '145621',
      'Mã học phần': 'ET2000',
      'Tên học phần': 'Tín hiệu và Hệ thống',
      'Thứ': 4,
      'Tiết bắt đầu': 7,
      'Tiết kết thúc': 9,
      'Phòng học': 'D5-302',
      'Tuần học': '2-9, 11-18',
      'Giảng viên': 'TS. Trần Thị B'
    },
    {
      'Mã lớp': '145622',
      'Mã học phần': 'ET3010',
      'Tên học phần': 'Thực hành Xử lý tín hiệu số',
      'Thứ': 6,
      'Tiết bắt đầu': 1,
      'Tiết kết thúc': 4,
      'Phòng học': 'Lab C9-204',
      'Tuần học': '4-8',
      'Giảng viên': 'ThS. Lê Văn C'
    },
    {
      'Mã lớp': '145623',
      'Mã học phần': 'ET3241',
      'Tên học phần': 'Điện tử tương tự II',
      'Thứ': 5,
      'Tiết bắt đầu': 4,
      'Tiết kết thúc': 6,
      'Phòng học': 'TC-205',
      'Tuần học': '2,4,6,8,12,14,16,18',
      'Giảng viên': 'PGS. TS. Hoàng D'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleSchedule);
  ws['!cols'] = [
    { wch: 12 }, // Mã lớp
    { wch: 14 }, // Mã HP
    { wch: 30 }, // Tên HP
    { wch: 8 },  // Thứ
    { wch: 14 }, // Tiết BĐ
    { wch: 14 }, // Tiết KT
    { wch: 14 }, // Phòng
    { wch: 22 }, // Tuần
    { wch: 24 }  // Giảng viên
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Thoi Khoa Bieu');
  XLSX.writeFile(wb, 'Mau_Thoi_Khoa_Bieu_HUST.xlsx');
}
