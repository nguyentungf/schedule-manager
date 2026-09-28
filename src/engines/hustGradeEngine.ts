import { Course, LetterGrade } from '../types/course';
import { CpaTargetAnalysis } from '../types/grade';
import { CustomGradeScaleSettings } from '../types/state';

export interface GradeScaleDetail {
  min10: number;
  max10: number;
  letter: LetterGrade;
  scale4: number;
  description: string;
}

export const DEFAULT_GRADE_SCALES: GradeScaleDetail[] = [
  { min10: 9.5, max10: 10.0, letter: 'A+', scale4: 4.0, description: 'Xuất sắc tuyệt đối' },
  { min10: 8.5, max10: 9.4,  letter: 'A',  scale4: 4.0, description: 'Xuất sắc / Giỏi' },
  { min10: 8.0, max10: 8.4,  letter: 'B+', scale4: 3.5, description: 'Khá giỏi' },
  { min10: 7.0, max10: 7.9,  letter: 'B',  scale4: 3.0, description: 'Khá' },
  { min10: 6.5, max10: 6.9,  letter: 'C+', scale4: 2.5, description: 'Trung bình khá' },
  { min10: 5.5, max10: 6.4,  letter: 'C',  scale4: 2.0, description: 'Trung bình' },
  { min10: 5.0, max10: 5.4,  letter: 'D+', scale4: 1.5, description: 'Trung bình yếu' },
  { min10: 4.0, max10: 4.9,  letter: 'D',  scale4: 1.0, description: 'Yếu (Đạt tối thiểu)' },
  { min10: 0.0, max10: 3.9,  letter: 'F',  scale4: 0.0, description: 'Kém (Không đạt / Trượt)' }
];

export const HUST_GRADE_SCALES = DEFAULT_GRADE_SCALES;

export function buildScalesFromSettings(settings?: CustomGradeScaleSettings): GradeScaleDetail[] {
  if (!settings) return DEFAULT_GRADE_SCALES;
  const minA = settings.minA ?? 8.5;
  return [
    { min10: 9.5, max10: 10.0, letter: 'A+', scale4: 4.0, description: 'Xuất sắc tuyệt đối' },
    { min10: minA, max10: 9.4, letter: 'A', scale4: 4.0, description: 'Xuất sắc / Giỏi' },
    { min10: settings.minBPlus, max10: minA - 0.1, letter: 'B+', scale4: 3.5, description: 'Khá giỏi' },
    { min10: settings.minB, max10: settings.minBPlus - 0.1, letter: 'B', scale4: 3.0, description: 'Khá' },
    { min10: settings.minCPlus, max10: settings.minB - 0.1, letter: 'C+', scale4: 2.5, description: 'Trung bình khá' },
    { min10: settings.minC, max10: settings.minCPlus - 0.1, letter: 'C', scale4: 2.0, description: 'Trung bình' },
    { min10: settings.minDPlus, max10: settings.minC - 0.1, letter: 'D+', scale4: 1.5, description: 'Trung bình yếu' },
    { min10: settings.minD, max10: settings.minDPlus - 0.1, letter: 'D', scale4: 1.0, description: 'Yếu (Đạt tối thiểu)' },
    { min10: 0.0, max10: settings.minD - 0.1, letter: 'F', scale4: 0.0, description: 'Kém (Không đạt / Trượt)' },
  ];
}

/**
 * Quy đổi điểm học phần thang 10 sang thang chữ và thang 4 chuẩn Bách Khoa
 * Bổ sung điểm chữ A+ khi tổng kết >= 9.5
 */
export function convertScoreToGrade(
  totalScore10: number,
  finalExamScore: number,
  settings?: CustomGradeScaleSettings
): {
  letter: LetterGrade;
  scale4: number;
  isFailProne: boolean;
} {
  const minFail = settings?.failFinalExamMin ?? 3.0;

  // Điểm liệt cuối kỳ HUST: D_ck < minFail auto F
  if (finalExamScore < minFail) {
    return { letter: 'F', scale4: 0.0, isFailProne: true };
  }

  const rounded = Math.round(totalScore10 * 10) / 10;

  // ĐIỂM CHỮ A+ KHI TỔNG KẾT >= 9.5
  if (rounded >= 9.5) {
    return { letter: 'A+', scale4: 4.0, isFailProne: false };
  }

  const scales = buildScalesFromSettings(settings);

  for (const scale of scales) {
    if (rounded >= scale.min10 && rounded <= scale.max10) {
      return {
        letter: scale.letter,
        scale4: scale.scale4,
        isFailProne: false
      };
    }
  }

  return { letter: 'F', scale4: 0.0, isFailProne: false };
}

/**
 * Tính điểm tổng kết học phần: D_hp = w_qt * D_qt + w_ck * D_ck
 */
export function calculateCourseFinalGrade(
  gradeQt: number,
  gradeCk: number,
  weightQt: number = 0.3,
  weightCk: number = 0.7,
  settings?: CustomGradeScaleSettings
): {
  total10: number;
  letter: LetterGrade;
  scale4: number;
  passed: boolean;
} {
  const minFail = settings?.failFinalExamMin ?? 3.0;
  const minD = settings?.minD ?? 4.0;
  const total10 = Math.round((weightQt * gradeQt + weightCk * gradeCk) * 10) / 10;
  const converted = convertScoreToGrade(total10, gradeCk, settings);
  const passed = gradeCk >= minFail && total10 >= minD && converted.letter !== 'F';

  return {
    total10,
    letter: converted.letter,
    scale4: converted.scale4,
    passed
  };
}

/**
 * Tính CPA toàn khóa theo chuẩn Bách Khoa:
 * - Đối với các môn học cải thiện: Lấy điểm cao nhất trong các lần học.
 * - Số tín chỉ của môn học chỉ được tính tích lũy một lần.
 */
export function calculateCpa(courses: Course[]): {
  cpa: number;
  totalAccumulatedCredits: number;
  passedCoursesCount: number;
  failedCoursesCount: number;
} {
  const bestCourseMap = new Map<string, { scale4: number; credits: number; passed: boolean }>();

  courses.forEach(c => {
    if (c.gradeScale4 !== null && c.gradeScale4 !== undefined && (c.status === 'passed' || c.status === 'failed')) {
      const existing = bestCourseMap.get(c.code);
      const isPassed = c.status === 'passed' && c.gradeScale4 > 0;

      if (!existing) {
        bestCourseMap.set(c.code, {
          scale4: c.gradeScale4,
          credits: c.credits,
          passed: isPassed
        });
      } else {
        if (c.gradeScale4 > existing.scale4) {
          bestCourseMap.set(c.code, {
            scale4: c.gradeScale4,
            credits: c.credits,
            passed: isPassed
          });
        }
      }
    }
  });

  let totalWeightedPoints = 0;
  let totalCredits = 0;
  let passedCount = 0;
  let failedCount = 0;

  bestCourseMap.forEach((val) => {
    totalWeightedPoints += val.scale4 * val.credits;
    totalCredits += val.credits;
    if (val.passed) {
      passedCount++;
    } else {
      failedCount++;
    }
  });

  const cpa = totalCredits > 0 ? Math.round((totalWeightedPoints / totalCredits) * 100) / 100 : 0;

  return {
    cpa,
    totalAccumulatedCredits: totalCredits,
    passedCoursesCount: passedCount,
    failedCoursesCount: failedCount
  };
}

/**
 * Tính toán mức độ khả thi và GPA cần đạt ở các kỳ còn lại để đạt CPA mục tiêu
 */
export function analyzeCpaTarget(
  currentCpa: number,
  completedCredits: number,
  totalCurriculumCredits: number,
  targetCpa: number
): CpaTargetAnalysis {
  const remainingCredits = Math.max(0, totalCurriculumCredits - completedCredits);

  if (remainingCredits === 0) {
    const achieved = currentCpa >= targetCpa;
    return {
      targetCpa,
      currentCpa,
      totalCompletedCredits: completedCredits,
      totalCurriculumCredits,
      remainingCredits: 0,
      requiredRemainingGpa: 0,
      isAchievable: achieved,
      message: achieved
        ? 'Chúc mừng! Bạn đã hoàn thành toàn bộ chương trình và đạt mục tiêu CPA!'
        : 'Bạn đã hoàn tất số tín chỉ nhưng chưa đạt CPA mục tiêu. Bạn có thể đăng ký học cải thiện các môn điểm C/D.'
    };
  }

  const requiredGpaRaw = (targetCpa * totalCurriculumCredits - currentCpa * completedCredits) / remainingCredits;
  const requiredGpa = Math.round(requiredGpaRaw * 100) / 100;

  if (requiredGpa > 4.0) {
    return {
      targetCpa,
      currentCpa,
      totalCompletedCredits: completedCredits,
      totalCurriculumCredits,
      remainingCredits,
      requiredRemainingGpa: requiredGpa,
      isAchievable: false,
      message: `Về mặt toán học, bạn không thể đạt CPA ${targetCpa} vì cần GPA các kỳ còn lại là ${requiredGpa} (> 4.0). Hãy xem xét đăng ký học cải thiện các môn cũ.`
    };
  }

  if (requiredGpa <= 0) {
    return {
      targetCpa,
      currentCpa,
      totalCompletedCredits: completedCredits,
      totalCurriculumCredits,
      remainingCredits,
      requiredRemainingGpa: 0,
      isAchievable: true,
      message: `Tuyệt vời! Bạn chắc chắn sẽ đạt CPA mục tiêu ${targetCpa} ngay cả khi chỉ cần qua môn ở các kỳ còn lại!`
    };
  }

  return {
    targetCpa,
    currentCpa,
    totalCompletedCredits: completedCredits,
    totalCurriculumCredits,
    remainingCredits,
    requiredRemainingGpa: requiredGpa,
    isAchievable: true,
    message: `Để tốt nghiệp với CPA ${targetCpa}, bạn cần duy trì GPA trung bình tối thiểu ${requiredGpa} cho ${remainingCredits} tín chỉ còn lại.`
  };
}

/**
 * Xếp loại học lực theo CPA chuẩn Bách Khoa
 */
export function getAcademicClassification(cpa: number): { rank: string; color: string } {
  if (cpa >= 3.6) return { rank: 'Xuất sắc', color: 'emerald' };
  if (cpa >= 3.2) return { rank: 'Giỏi', color: 'blue' };
  if (cpa >= 2.5) return { rank: 'Khá', color: 'indigo' };
  if (cpa >= 2.0) return { rank: 'Trung bình', color: 'amber' };
  return { rank: 'Kém (Cảnh báo)', color: 'rose' };
}

