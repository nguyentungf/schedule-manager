import {
  ScheduleItem,
  ScheduleClassOption,
  ScheduleStrategyType,
  GeneratedSchedulePlan
} from '../types/schedule';

/**
 * Ngân hàng dữ liệu các lớp học phần mở kỳ mới của ĐHBK Hà Nội (HUST Class Offerings Catalog)
 * Cung cấp sẵn các lớp mở ở nhiều khung giờ khác nhau để thuật toán Backtracking tìm tổ hợp tối ưu.
 */
export const SAMPLE_HUST_CLASS_OFFERINGS: ScheduleClassOption[] = [
  // --- MI1111: Giải tích I (4 TC) ---
  { classCode: '145101', courseCode: 'MI1111', courseName: 'Giải tích I', dayOfWeek: 2, startPeriod: 1, endPeriod: 3, room: 'D9-401', weeks: '1-18', teacher: 'TS. Nguyễn Văn A', credits: 4 },
  { classCode: '145102', courseCode: 'MI1111', courseName: 'Giải tích I', dayOfWeek: 3, startPeriod: 7, endPeriod: 9, room: 'B1-302', weeks: '1-18', teacher: 'ThS. Trần Thị B', credits: 4 },
  { classCode: '145103', courseCode: 'MI1111', courseName: 'Giải tích I', dayOfWeek: 4, startPeriod: 1, endPeriod: 3, room: 'D3-201', weeks: '1-18', teacher: 'PGS. TS. Lê C', credits: 4 },
  { classCode: '145104', courseCode: 'MI1111', courseName: 'Giải tích I', dayOfWeek: 5, startPeriod: 7, endPeriod: 9, room: 'TC-301', weeks: '1-18', teacher: 'TS. Hoàng D', credits: 4 },

  // --- MI1121: Đại số (3 TC) ---
  { classCode: '145110', courseCode: 'MI1121', courseName: 'Đại số', dayOfWeek: 2, startPeriod: 4, endPeriod: 6, room: 'D9-402', weeks: '1-18', teacher: 'TS. Phạm Văn E', credits: 3 },
  { classCode: '145111', courseCode: 'MI1121', courseName: 'Đại số', dayOfWeek: 4, startPeriod: 7, endPeriod: 9, room: 'B1-205', weeks: '1-18', teacher: 'ThS. Vũ Thị F', credits: 3 },
  { classCode: '145112', courseCode: 'MI1121', courseName: 'Đại số', dayOfWeek: 6, startPeriod: 1, endPeriod: 3, room: 'D5-102', weeks: '1-18', teacher: 'TS. Đặng G', credits: 3 },

  // --- PH1110: Vật lý I (3 TC) ---
  { classCode: '145120', courseCode: 'PH1110', courseName: 'Vật lý I', dayOfWeek: 3, startPeriod: 1, endPeriod: 3, room: 'D3-501', weeks: '1-18', teacher: 'PGS. TS. Bùi H', credits: 3 },
  { classCode: '145121', courseCode: 'PH1110', courseName: 'Vật lý I', dayOfWeek: 5, startPeriod: 1, endPeriod: 3, room: 'B1-401', weeks: '1-18', teacher: 'TS. Ngô I', credits: 3 },
  { classCode: '145122', courseCode: 'PH1110', courseName: 'Vật lý I', dayOfWeek: 6, startPeriod: 7, endPeriod: 9, room: 'D9-301', weeks: '1-18', teacher: 'ThS. Đỗ K', credits: 3 },

  // --- IT1110: Tin học đại cương (4 TC) ---
  { classCode: '145130', courseCode: 'IT1110', courseName: 'Tin học đại cương', dayOfWeek: 2, startPeriod: 7, endPeriod: 9, room: 'D9-505', weeks: '1-18', teacher: 'TS. Phan L', credits: 4 },
  { classCode: '145131', courseCode: 'IT1110', courseName: 'Tin học đại cương', dayOfWeek: 4, startPeriod: 4, endPeriod: 6, room: 'B1-101', weeks: '1-18', teacher: 'TS. Mai M', credits: 4 },
  { classCode: '145132', courseCode: 'IT1110', courseName: 'Tin học đại cương', dayOfWeek: 6, startPeriod: 1, endPeriod: 3, room: 'D5-301', weeks: '1-18', teacher: 'ThS. Chu N', credits: 4 },

  // --- SSH1111: Triết học Mác - Lênin (3 TC) ---
  { classCode: '145140', courseCode: 'SSH1111', courseName: 'Triết học Mác - Lênin', dayOfWeek: 3, startPeriod: 4, endPeriod: 6, room: 'D3-102', weeks: '1-18', teacher: 'TS. Dương O', credits: 3 },
  { classCode: '145141', courseCode: 'SSH1111', courseName: 'Triết học Mác - Lênin', dayOfWeek: 5, startPeriod: 4, endPeriod: 6, room: 'TC-202', weeks: '1-18', teacher: 'ThS. Hà P', credits: 3 },
  { classCode: '145142', courseCode: 'SSH1111', courseName: 'Triết học Mác - Lênin', dayOfWeek: 7, startPeriod: 1, endPeriod: 3, room: 'D9-201', weeks: '1-18', teacher: 'TS. Trịnh Q', credits: 3 },

  // --- FL1020: Tiếng Anh II (3 TC) ---
  { classCode: '145150', courseCode: 'FL1020', courseName: 'Tiếng Anh II', dayOfWeek: 3, startPeriod: 7, endPeriod: 9, room: 'D4-205', weeks: '1-18', teacher: 'ThS. Lê R', credits: 3 },
  { classCode: '145151', courseCode: 'FL1020', courseName: 'Tiếng Anh II', dayOfWeek: 5, startPeriod: 1, endPeriod: 3, room: 'D4-301', weeks: '1-18', teacher: 'ThS. Smith J', credits: 3 },

  // --- ET2000: Kỹ thuật Điện tử / Tín hiệu & Hệ thống (3 TC) ---
  { classCode: '145160', courseCode: 'ET2000', courseName: 'Tín hiệu và Hệ thống', dayOfWeek: 2, startPeriod: 1, endPeriod: 3, room: 'C9-101', weeks: '1-18', teacher: 'PGS. TS. Tạ S', credits: 3 },
  { classCode: '145161', courseCode: 'ET2000', courseName: 'Tín hiệu và Hệ thống', dayOfWeek: 4, startPeriod: 7, endPeriod: 9, room: 'C9-202', weeks: '1-18', teacher: 'TS. Nguyễn T', credits: 3 },

  // --- IT3011: Cấu trúc dữ liệu và giải thuật (3 TC) ---
  { classCode: '145170', courseCode: 'IT3011', courseName: 'Cấu trúc dữ liệu và giải thuật', dayOfWeek: 2, startPeriod: 7, endPeriod: 9, room: 'B1-301', weeks: '1-18', teacher: 'TS. Đinh U', credits: 3 },
  { classCode: '145171', courseCode: 'IT3011', courseName: 'Cấu trúc dữ liệu và giải thuật', dayOfWeek: 4, startPeriod: 1, endPeriod: 3, room: 'B1-305', weeks: '1-18', teacher: 'TS. Lương V', credits: 3 },
  { classCode: '145172', courseCode: 'IT3011', courseName: 'Cấu trúc dữ liệu và giải thuật', dayOfWeek: 6, startPeriod: 7, endPeriod: 9, room: 'D9-401', weeks: '1-18', teacher: 'ThS. Trương X', credits: 3 },

  // --- IT3080: Mạng máy tính (3 TC) ---
  { classCode: '145180', courseCode: 'IT3080', courseName: 'Mạng máy tính', dayOfWeek: 3, startPeriod: 1, endPeriod: 3, room: 'D5-201', weeks: '1-18', teacher: 'TS. Vũ Y', credits: 3 },
  { classCode: '145181', courseCode: 'IT3080', courseName: 'Mạng máy tính', dayOfWeek: 5, startPeriod: 7, endPeriod: 9, room: 'D5-205', weeks: '1-18', teacher: 'PGS. TS. Trần Z', credits: 3 },

  // --- ET3250: Xử lý tín hiệu số (3 TC) ---
  { classCode: '145190', courseCode: 'ET3250', courseName: 'Xử lý tín hiệu số', dayOfWeek: 3, startPeriod: 7, endPeriod: 9, room: 'C9-301', weeks: '1-18', teacher: 'PGS. TS. Nguyễn AA', credits: 3 },
  { classCode: '145191', courseCode: 'ET3250', courseName: 'Xử lý tín hiệu số', dayOfWeek: 6, startPeriod: 1, endPeriod: 3, room: 'C9-204', weeks: '1-18', teacher: 'TS. Lê BB', credits: 3 },

  // --- EE2000: Kỹ thuật Điện (3 TC) ---
  { classCode: '145200', courseCode: 'EE2000', courseName: 'Kỹ thuật Điện', dayOfWeek: 2, startPeriod: 4, endPeriod: 6, room: 'C1-201', weeks: '1-18', teacher: 'TS. Hoàng CC', credits: 3 },
  { classCode: '145201', courseCode: 'EE2000', courseName: 'Kỹ thuật Điện', dayOfWeek: 5, startPeriod: 1, endPeriod: 3, room: 'C1-301', weeks: '1-18', teacher: 'ThS. Phạm DD', credits: 3 },
];

/**
 * Kiểm tra xem 2 dải tuần học có giao nhau hay không (VD: "1-8, 10-18" và "2-16")
 */
export function isWeekOverlap(weeks1: string, weeks2: string): boolean {
  if (!weeks1 || !weeks2 || weeks1.includes('1-18') || weeks2.includes('1-18')) return true;

  const parseWeeks = (str: string): Set<number> => {
    const set = new Set<number>();
    const parts = str.split(',').map(p => p.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n));
        if (!isNaN(start) && !isNaN(end)) {
          for (let w = start; w <= end; w++) set.add(w);
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num)) set.add(num);
      }
    }
    return set;
  };

  const set1 = parseWeeks(weeks1);
  const set2 = parseWeeks(weeks2);

  for (const w of set1) {
    if (set2.has(w)) return true;
  }
  return false;
}

/**
 * Kiểm tra xem 2 lớp học có bị trùng lịch học hay không (Hard Constraint)
 */
export function isClassConflict(a: ScheduleClassOption, b: ScheduleClassOption): boolean {
  if (a.dayOfWeek !== b.dayOfWeek) return false;

  // Giao nhau về tiết học
  const periodOverlap = a.startPeriod <= b.endPeriod && b.startPeriod <= a.endPeriod;
  if (!periodOverlap) return false;

  // Giao nhau về tuần học
  return isWeekOverlap(a.weeks, b.weeks);
}

/**
 * Thuật toán Backtracking tìm các phương án Thời Khóa Biểu Không Trùng Tiết
 * Tham khảo dự án hungitb/tkb-hust
 */
export function solveScheduleCombinations(
  targetCourseCodes: string[],
  availableClasses: ScheduleClassOption[],
  maxSolutions = 120
): ScheduleClassOption[][] {
  if (targetCourseCodes.length === 0) return [];

  // Gom các lớp mở theo từng mã học phần
  const classesByCourse: ScheduleClassOption[][] = [];

  for (const code of targetCourseCodes) {
    const matching = availableClasses.filter(c => c.courseCode.toUpperCase() === code.toUpperCase());
    if (matching.length === 0) {
      // Nếu môn này chưa có trong catalog lớp mở, sinh giả định 2 lựa chọn khung giờ hợp lý
      classesByCourse.push([
        {
          classCode: `AUTO_${code}_1`,
          courseCode: code,
          courseName: `Học phần ${code}`,
          dayOfWeek: ((classesByCourse.length * 2) % 5) + 2,
          startPeriod: 1,
          endPeriod: 3,
          room: 'TC-101',
          weeks: '1-18',
          credits: 3
        },
        {
          classCode: `AUTO_${code}_2`,
          courseCode: code,
          courseName: `Học phần ${code}`,
          dayOfWeek: ((classesByCourse.length * 2 + 1) % 5) + 2,
          startPeriod: 7,
          endPeriod: 9,
          room: 'D9-301',
          weeks: '1-18',
          credits: 3
        }
      ]);
    } else {
      classesByCourse.push(matching);
    }
  }

  const validSolutions: ScheduleClassOption[][] = [];

  // Hàm đệ quy Backtracking
  function backtrack(courseIdx: number, currentSchedule: ScheduleClassOption[]) {
    if (validSolutions.length >= maxSolutions) return;

    if (courseIdx === classesByCourse.length) {
      validSolutions.push([...currentSchedule]);
      return;
    }

    const optionsForCourse = classesByCourse[courseIdx];

    for (const option of optionsForCourse) {
      // Kiểm tra xung đột với tất cả các lớp đã xếp trước đó
      let hasConflict = false;
      for (const existing of currentSchedule) {
        if (isClassConflict(option, existing)) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        currentSchedule.push(option);
        backtrack(courseIdx + 1, currentSchedule);
        currentSchedule.pop(); // Quay lui
      }
    }
  }

  backtrack(0, []);
  return validSolutions;
}

/**
 * Đánh giá & Chấm điểm TKB theo các Chiến thuật Xếp lớp (Workload & Rest Scoring)
 */
export function evaluateSchedulePlan(
  classes: ScheduleClassOption[],
  strategy: ScheduleStrategyType,
  index: number
): GeneratedSchedulePlan {
  const dayGroups: Record<number, ScheduleClassOption[]> = {};
  for (let d = 2; d <= 8; d++) dayGroups[d] = [];

  classes.forEach(c => {
    dayGroups[c.dayOfWeek]?.push(c);
  });

  let morningPeriods = 0;
  let afternoonPeriods = 0;
  let hasLunchBreak = true;
  let maxContinuous = 0;
  let activeDays = 0;

  for (let d = 2; d <= 8; d++) {
    const list = dayGroups[d];
    if (list.length === 0) continue;
    activeDays++;

    // Sắp xếp theo tiết bắt đầu
    list.sort((a, b) => a.startPeriod - b.startPeriod);

    // Kiểm tra giờ nghỉ trưa: có môn nào học kéo dài qua cả tiết 6 và tiết 7 không
    const hasP6 = list.some(c => c.startPeriod <= 6 && c.endPeriod >= 6);
    const hasP7 = list.some(c => c.startPeriod <= 7 && c.endPeriod >= 7);
    if (hasP6 && hasP7) {
      hasLunchBreak = false;
    }

    // Đếm tiết sáng / chiều
    list.forEach(c => {
      const span = c.endPeriod - c.startPeriod + 1;
      if (c.endPeriod <= 6) morningPeriods += span;
      else if (c.startPeriod >= 7) afternoonPeriods += span;
      else {
        // Vắt qua trưa
        morningPeriods += Math.max(0, 6 - c.startPeriod + 1);
        afternoonPeriods += Math.max(0, c.endPeriod - 7 + 1);
      }
    });

    // Tính số tiết học liên tiếp dài nhất trong ngày
    let currentContinuous = 0;
    for (let p = 1; p <= 12; p++) {
      const isOccupied = list.some(c => c.startPeriod <= p && p <= c.endPeriod);
      if (isOccupied) {
        currentContinuous++;
        if (currentContinuous > maxContinuous) maxContinuous = currentContinuous;
      } else {
        currentContinuous = 0;
      }
    }
  }

  // --- Tính điểm Rest Score (0 - 100) theo chiến thuật người dùng ---
  let restScore = 70;

  // Thưởng nếu có giờ nghỉ trưa trọn vẹn
  if (hasLunchBreak) restScore += 12;
  else restScore -= 20;

  // Phạt nếu học liên tục quá 4 tiết không nghỉ
  if (maxContinuous >= 6) restScore -= 25;
  else if (maxContinuous >= 5) restScore -= 12;
  else if (maxContinuous <= 3) restScore += 10;

  // Điều chỉnh điểm số theo từng chiến thuật cụ thể
  let strategyName = 'Cân bằng vừa sức & Khoa học';
  let desc = 'Phân bổ đều các ngày, đảm bảo có giờ nghỉ trưa và khoảng thở giữa các ca học.';

  if (strategy === 'morning') {
    strategyName = 'Tập trung buổi sáng';
    const morningRatio = (morningPeriods + afternoonPeriods) > 0 ? (morningPeriods / (morningPeriods + afternoonPeriods)) : 0.5;
    restScore += Math.round(morningRatio * 20);
    desc = `Ưu tiên ${morningPeriods} tiết buổi sáng, chiều để trống nghỉ ngơi hoặc đi làm thêm.`;
  } else if (strategy === 'afternoon') {
    strategyName = 'Tập trung buổi chiều';
    const afternoonRatio = (morningPeriods + afternoonPeriods) > 0 ? (afternoonPeriods / (morningPeriods + afternoonPeriods)) : 0.5;
    restScore += Math.round(afternoonRatio * 20);
    desc = `Ưu tiên ${afternoonPeriods} tiết ca chiều, buổi sáng thảnh thơi tự học hoặc ngủ đủ giấc.`;
  } else if (strategy === 'compact') {
    strategyName = 'Gom ngày / Tối đa ngày nghỉ';
    // Thưởng nếu số ngày đến trường ít (3 hoặc 4 ngày)
    if (activeDays <= 3) restScore += 25;
    else if (activeDays === 4) restScore += 15;
    else restScore -= 10;
    const freeDays = Math.max(0, 5 - activeDays);
    desc = `Gom lịch vào ${activeDays} ngày, có ${freeDays} ngày trong tuần hoàn toàn không phải đến trường.`;
  } else {
    // Balanced
    // Phân bổ đều các ngày: độ lệch chuẩn số tiết mỗi ngày thấp
    if (maxContinuous <= 4 && hasLunchBreak && activeDays >= 4) {
      restScore += 15;
    }
  }

  restScore = Math.max(20, Math.min(100, restScore));

  const totalCredits = classes.reduce((sum, c) => sum + (c.credits || 3), 0);

  // Chuyển đổi thành định dạng ScheduleItem chuẩn
  const items: ScheduleItem[] = classes.map(c => ({
    id: `opt_${strategy}_${c.classCode}_${c.dayOfWeek}_${c.startPeriod}`,
    classCode: c.classCode,
    courseCode: c.courseCode,
    courseName: c.courseName,
    dayOfWeek: c.dayOfWeek,
    startPeriod: c.startPeriod,
    endPeriod: c.endPeriod,
    room: c.room,
    weeks: c.weeks,
    teacher: c.teacher,
    type: c.type || 'lecture'
  }));

  return {
    id: `plan_${strategy}_${index + 1}`,
    name: `Phương án ${index + 1}: ${strategyName}`,
    strategy,
    items,
    totalCredits,
    courseCount: classes.length,
    studyDaysCount: activeDays,
    morningPeriodsCount: morningPeriods,
    afternoonPeriodsCount: afternoonPeriods,
    restScore,
    hasLunchBreak,
    maxContinuousPeriods: maxContinuous,
    description: desc
  };
}

/**
 * Xếp hạng và sinh danh mục các phương án TKB đa dạng theo cả 4 chiến thuật
 */
export function generateMultiStrategySchedulePlans(
  targetCourseCodes: string[],
  availableClasses: ScheduleClassOption[] = SAMPLE_HUST_CLASS_OFFERINGS
): {
  allPlans: GeneratedSchedulePlan[];
  plansByStrategy: Record<ScheduleStrategyType, GeneratedSchedulePlan[]>;
  topPick: GeneratedSchedulePlan | null;
} {
  const rawSolutions = solveScheduleCombinations(targetCourseCodes, availableClasses);

  if (rawSolutions.length === 0) {
    return {
      allPlans: [],
      plansByStrategy: { balanced: [], morning: [], afternoon: [], compact: [] },
      topPick: null
    };
  }

  const strategies: ScheduleStrategyType[] = ['balanced', 'morning', 'afternoon', 'compact'];
  const plansByStrategy: Record<ScheduleStrategyType, GeneratedSchedulePlan[]> = {
    balanced: [],
    morning: [],
    afternoon: [],
    compact: []
  };

  strategies.forEach(strat => {
    const plansForStrat = rawSolutions
      .map((sol, idx) => evaluateSchedulePlan(sol, strat, idx))
      .sort((a, b) => b.restScore - a.restScore)
      .slice(0, 4); // Lấy top 4 phương án xuất sắc nhất của mỗi chiến thuật

    plansByStrategy[strat] = plansForStrat;
  });

  const allPlans = [
    ...plansByStrategy.balanced,
    ...plansByStrategy.morning,
    ...plansByStrategy.afternoon,
    ...plansByStrategy.compact
  ];

  // Top pick là phương án cân bằng có điểm Rest Score cao nhất
  const topPick = plansByStrategy.balanced[0] || allPlans[0] || null;

  return {
    allPlans,
    plansByStrategy,
    topPick
  };
}
