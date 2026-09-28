import { ScheduleItem, ScheduleConflict, HUST_PERIOD_TIMES } from '../types/schedule';

const SCHEDULE_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

/**
 * Lấy thông tin thời gian bắt đầu và kết thúc của một tiết học hoặc dải tiết học
 */
export function getPeriodsTimeString(startPeriod: number, endPeriod: number): string {
  const start = HUST_PERIOD_TIMES.find(p => p.period === startPeriod);
  const end = HUST_PERIOD_TIMES.find(p => p.period === endPeriod);
  if (!start || !end) return `Tiết ${startPeriod} - ${endPeriod}`;
  return `${start.startTime} - ${end.endTime} (Tiết ${startPeriod}-${endPeriod})`;
}

/**
 * Kiểm tra xem một chuỗi tuần học (VD: "2-9, 11-18" hoặc "2-16(chẵn)" hoặc "4-8") có bao gồm tuần cụ thể không
 * Quy chuẩn ĐHBK Hà Nội (HUST):
 * - Tuần 10: Tuần thi giữa kỳ (Midterm Exam) -> Các lớp học lý thuyết/chẵn/lẻ KHÔNG học.
 * - Tuần 19: Tuần dự trữ / Thi cuối kỳ -> Không học trên lớp.
 * - Cả kỳ chuẩn: "2-9, 11-18"
 * - Tuần chẵn: 2, 4, 6, 8, 12, 14, 16, 18 (Trừ tuần 10 & 19)
 * - Tuần lẻ: 3, 5, 7, 9, 11, 13, 15, 17 (Trừ tuần 10 & 19)
 * - Môn thí nghiệm / thực hành: cấu hình theo chuỗi tuần riêng (VD: "4-8", "12-16")
 */
export function isWeekMatching(weeksPattern: string, targetWeek: number): boolean {
  if (!weeksPattern || weeksPattern.trim() === '') return true;

  const clean = weeksPattern.toLowerCase().replace(/\s+/g, '');

  const isEvenCondition = clean.includes('chẵn') || clean.includes('chan');
  const isOddCondition = clean.includes('lẻ') || clean.includes('le');

  // Kiểm tra trừ tuần 10 (thi giữa kỳ) và tuần 19 (thi cuối kỳ) cho lớp chẵn/lẻ
  if (isEvenCondition) {
    if (targetWeek === 10 || targetWeek === 19 || targetWeek % 2 !== 0) return false;
  }
  if (isOddCondition) {
    if (targetWeek === 10 || targetWeek === 19 || targetWeek % 2 === 0) return false;
  }

  // Tách các đoạn cách nhau bởi dấu phẩy hoặc chấm phẩy
  const parts = clean.replace(/\([^)]*\)/g, '').split(/[,;]/);

  for (const part of parts) {
    if (!part) continue;
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr);
      const end = parseInt(endStr);
      if (!isNaN(start) && !isNaN(end)) {
        if (targetWeek >= start && targetWeek <= end) {
          // Nếu rơi vào dải số, và đã vượt qua điều kiện chẵn/lẻ ở trên
          return true;
        }
      }
    } else {
      const single = parseInt(part);
      if (!isNaN(single) && single === targetWeek) {
        return true;
      }
    }
  }

  // Nếu pattern chỉ ghi "chẵn" hoặc "lẻ" thuần túy
  if (isEvenCondition && targetWeek >= 2 && targetWeek <= 18 && targetWeek !== 10 && targetWeek % 2 === 0) {
    return true;
  }
  if (isOddCondition && targetWeek >= 3 && targetWeek <= 17 && targetWeek !== 10 && targetWeek % 2 !== 0) {
    return true;
  }

  return false;
}

/**
 * Phát hiện xung đột lịch học (Trùng thứ, trùng tiết và trùng tuần)
 */
export function detectScheduleConflicts(items: ScheduleItem[]): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];

      // Phải cùng thứ trong tuần
      if (a.dayOfWeek !== b.dayOfWeek) continue;

      // Tìm các tiết bị chồng lấn
      const overlapPeriods: number[] = [];
      const start = Math.max(a.startPeriod, b.startPeriod);
      const end = Math.min(a.endPeriod, b.endPeriod);

      if (start <= end) {
        for (let p = start; p <= end; p++) {
          overlapPeriods.push(p);
        }

        conflicts.push({
          item1: a,
          item2: b,
          dayOfWeek: a.dayOfWeek,
          overlapPeriods,
          message: `Trùng lịch Thứ ${a.dayOfWeek === 8 ? 'CN' : a.dayOfWeek} (Tiết ${overlapPeriods.join(', ')}) giữa môn "${a.courseName}" và "${b.courseName}"`
        });
      }
    }
  }

  return conflicts;
}

/**
 * Bóc tách văn bản Thời khóa biểu copy từ SIS HUST
 */
export function parseSisScheduleText(rawText: string): ScheduleItem[] {
  const lines = rawText.split(/\r?\n/);
  const results: ScheduleItem[] = [];
  let colorIdx = 0;

  // Regex nhận diện thứ: "Thứ 2", "Thứ Hai", "T2", "Monday", "2"
  const dayRegex = /(?:Thứ\s*|T)([2-7]|CN|Chủ\s*Nhật)/i;
  // Regex nhận diện tiết: "1-3", "Tiết 1-3", "1 - 4"
  const periodRegex = /(?:Tiết\s*)?(\d{1,2})\s*-\s*(\d{1,2})/i;
  // Regex mã HP: IT3080, EE2000, MI1111...
  const courseCodeRegex = /\b([A-Z]{2,4}\s?[0-9]{4})\b/i;
  // Regex mã lớp (5 - 7 chữ số): 145620
  const classCodeRegex = /\b(\d{5,7})\b/;
  // Regex phòng học: D9-401, TC-201, B1-302, D3-501...
  const roomRegex = /\b([A-Z][0-9]?\s*[-_.]\s*[0-9]{3}[A-Z]?)\b/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const courseMatch = line.match(courseCodeRegex);
    const dayMatch = line.match(dayRegex);
    const periodMatch = line.match(periodRegex);

    if (courseMatch && dayMatch && periodMatch) {
      const courseCode = courseMatch[1].replace(/\s+/g, '').toUpperCase();
      
      // Parse day
      let dayOfWeek = 2;
      const rawDay = dayMatch[1].toUpperCase();
      if (rawDay === 'CN' || rawDay.includes('CHỦ')) {
        dayOfWeek = 8;
      } else {
        const d = parseInt(rawDay);
        dayOfWeek = isNaN(d) ? 2 : Math.min(8, Math.max(2, d));
      }

      // Parse periods
      const startPeriod = Math.min(12, Math.max(1, parseInt(periodMatch[1])));
      const endPeriod = Math.min(12, Math.max(startPeriod, parseInt(periodMatch[2])));

      // Parse class code
      const classMatch = line.match(classCodeRegex);
      const classCode = classMatch ? classMatch[1] : String(140000 + i);

      // Parse room
      const roomMatch = line.match(roomRegex);
      const room = roomMatch ? roomMatch[1].toUpperCase() : 'Chưa xếp phòng';

      // Parse course name
      let courseName = 'Học phần ' + courseCode;
      const textParts = line.split(courseMatch[0]);
      if (textParts.length > 1) {
        const afterCode = textParts[1].trim();
        const nameMatch = afterCode.match(/^[^\d\t]+/);
        if (nameMatch && nameMatch[0].trim().length > 3) {
          courseName = nameMatch[0].trim();
        }
      }

      // Parse weeks (chuẩn HUST: thường là 2-9, 11-18 hoặc chẵn/lẻ)
      let weeks = '2-9, 11-18';
      const allPeriodMatches = Array.from(line.matchAll(/\b(\d{1,2}\s*-\s*\d{1,2}(?:\s*\(.*?\))?)\b/g));
      if (allPeriodMatches.length > 1) {
        weeks = allPeriodMatches[allPeriodMatches.length - 1][0];
      } else if (/chẵn/i.test(line)) {
        weeks = '2,4,6,8,12,14,16,18';
      } else if (/lẻ/i.test(line)) {
        weeks = '3,5,7,9,11,13,15,17';
      }

      results.push({
        id: 'sch_' + Date.now() + '_' + i,
        classCode,
        courseCode,
        courseName,
        dayOfWeek,
        startPeriod,
        endPeriod,
        room,
        weeks,
        type: 'lecture',
        color: SCHEDULE_COLORS[colorIdx % SCHEDULE_COLORS.length]
      });

      colorIdx++;
    }
  }

  return results;
}
