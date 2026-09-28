import { ExamTargetCalculation, FeasibilityLevel } from '../types/grade';
import { LetterGrade } from '../types/course';

interface TargetThreshold {
  letter: LetterGrade;
  scale4: number;
  min10: number;
}

const TARGETS: TargetThreshold[] = [
  { letter: 'A',  scale4: 4.0, min10: 8.5 },
  { letter: 'B+', scale4: 3.5, min10: 8.0 },
  { letter: 'B',  scale4: 3.0, min10: 7.0 },
  { letter: 'C+', scale4: 2.5, min10: 6.5 },
  { letter: 'C',  scale4: 2.0, min10: 5.5 },
  { letter: 'D+', scale4: 1.5, min10: 5.0 },
  { letter: 'D',  scale4: 1.0, min10: 4.0 },
];

export function getFeasibility(score: number): {
  level: FeasibilityLevel;
  label: string;
} {
  if (score > 10.0) {
    return { level: 'impossible', label: 'Bất khả thi (D_qt quá thấp)' };
  }
  if (score <= 5.0) {
    return { level: 'very_easy', label: 'Rất dễ dàng (Ôn nhẹ nhàng)' };
  }
  if (score <= 7.0) {
    return { level: 'moderate', label: 'Vừa sức (Ôn tập kỹ)' };
  }
  if (score <= 8.5) {
    return { level: 'hard', label: 'Cần cày cuốc (Luyện đề sâu)' };
  }
  return { level: 'very_hard', label: 'Thách thức cao (Gần tuyệt đối)' };
}

/**
 * Tính điểm thi cuối kỳ tối thiểu (D_ck_min) để đạt mốc điểm mục tiêu
 * Áp dụng công thức: D_ck_min = max(3.0, ceil((T_min - w_qt * D_qt) / w_ck * 10) / 10)
 */
export function solveMinExamScore(
  gradeQt: number,
  targetMin10: number,
  weightQt: number = 0.3,
  weightCk: number = 0.7
): {
  minScore: number;
  isPossible: boolean;
  isFailProne: boolean;
} {
  // Điểm cuối kỳ lý thuyết tối đa có thể đạt là 10.0
  const maxPossibleTotal = weightQt * gradeQt + weightCk * 10.0;
  if (maxPossibleTotal < targetMin10) {
    return {
      minScore: 99.9,
      isPossible: false,
      isFailProne: false
    };
  }

  // Tính D_ck_min lý thuyết
  const rawMin = (targetMin10 - weightQt * gradeQt) / weightCk;
  
  // Làm tròn lên 1 chữ số thập phân (ví dụ 6.52 -> 6.6)
  const roundedMin = Math.ceil(rawMin * 10) / 10;
  
  // Ràng buộc điểm liệt HUST: D_ck >= 3.0
  const finalMin = Math.max(3.0, roundedMin);

  return {
    minScore: Math.min(10.0, finalMin),
    isPossible: finalMin <= 10.0,
    isFailProne: finalMin <= 3.0 // Nếu chỉ cần 3.0 là do chạm điểm liệt
  };
}

/**
 * Tính bảng tổng hợp điểm thi cuối kỳ cần đạt cho tất cả các mốc điểm chữ HUST
 */
export function solveAllTargets(
  gradeQt: number,
  weightQt: number = 0.3,
  weightCk: number = 0.7
): ExamTargetCalculation[] {
  return TARGETS.map(t => {
    const solved = solveMinExamScore(gradeQt, t.min10, weightQt, weightCk);
    const feas = getFeasibility(solved.minScore);

    return {
      letter: t.letter,
      scale4: t.scale4,
      minFinalScore: solved.minScore,
      isPossible: solved.isPossible,
      isFailProne: solved.isFailProne,
      feasibility: feas.level,
      feasibilityLabel: feas.label
    };
  });
}
