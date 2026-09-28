import { Course } from '../types/course';
import { buildDependencyGraph, isCourseEligible } from './dagEngine';

export interface PlannedSemesterSummary {
  selectedCourses: Course[];
  totalCredits: number;
  avgDifficulty: number;
  hardCoursesCount: number; // Môn có độ khó >= 4.5
  isOverloaded: boolean;
  isUnderloaded: boolean;
  warnings: string[];
}

/**
 * Thuật toán Heuristic Knapsack gợi ý danh sách môn học cho kỳ tới
 */
export function recommendNextSemesterCourses(
  allCourses: Course[],
  targetCreditsRange: [number, number] = [14, 20]
): Course[] {
  // Lấy danh sách các môn đã qua (passed)
  const passedCodes = new Set(
    allCourses
      .filter(c => c.status === 'passed' && (c.gradeScale4 ?? 0) > 0)
      .map(c => c.code)
  );

  // Xây dựng DAG đồ thị phụ thuộc
  const graph = buildDependencyGraph(allCourses);

  // Lọc ra các môn chưa học hoặc trượt (F) mà đã đủ điều kiện tiên quyết
  const candidateCourses = allCourses.filter(c => {
    if (c.status === 'passed') return false;
    return isCourseEligible(c, passedCodes);
  });

  // Đánh giá điểm ưu tiên (Priority Score):
  // 1. Môn kỳ trước chưa học (kỳ càng nhỏ điểm càng cao để trả nợ môn/học đúng tiến độ)
  // 2. Môn có Criticality Index cao (chặn nhiều môn phía sau)
  const scoredCandidates = candidateCourses.map(c => {
    const nodeInfo = graph.get(c.code);
    const critIndex = nodeInfo ? nodeInfo.criticalityIndex : 0;
    
    // Ưu tiên: kỳ học thấp + độ mở khóa môn tương lai
    const priority = (10 - c.term) * 3 + critIndex * 2;
    return { course: c, priority };
  });

  // Sắp xếp giảm dần theo độ ưu tiên
  scoredCandidates.sort((a, b) => b.priority - a.priority);

  const selected: Course[] = [];
  let currentCredits = 0;
  let hardCourseCount = 0;
  const maxCredits = targetCreditsRange[1];

  for (const item of scoredCandidates) {
    const c = item.course;
    
    // Kiểm tra nếu thêm môn này có vượt quá số tín chỉ tối đa không
    if (currentCredits + c.credits > maxCredits) {
      continue;
    }

    // Kiểm tra cân bằng nhận thức: Không dồn quá 2 môn siêu khó (>= 4.5)
    if (c.difficulty >= 4.5 && hardCourseCount >= 2) {
      continue;
    }

    selected.push(c);
    currentCredits += c.credits;
    if (c.difficulty >= 4.5) {
      hardCourseCount++;
    }

    // Nếu đã đạt ngưỡng tối thiểu khuyến nghị (16 tín), kiểm tra tiếp
    if (currentCredits >= targetCreditsRange[0] && currentCredits >= 17) {
      break;
    }
  }

  return selected;
}

/**
 * Tính toán thống kê và kiểm tra ràng buộc của danh sách môn học đang chọn
 */
export function evaluateStudyPlan(selectedCourses: Course[]): PlannedSemesterSummary {
  const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);
  
  let totalWeightedDiff = 0;
  let hardCount = 0;

  selectedCourses.forEach(c => {
    totalWeightedDiff += c.credits * c.difficulty;
    if (c.difficulty >= 4.5) {
      hardCount++;
    }
  });

  const avgDifficulty = totalCredits > 0
    ? Math.round((totalWeightedDiff / totalCredits) * 10) / 10
    : 0;

  const warnings: string[] = [];

  if (totalCredits < 12) {
    warnings.push('Số tín chỉ dưới mức tối thiểu của HUST (tối thiểu 12 tín/kỳ chính).');
  } else if (totalCredits > 22) {
    warnings.push('Số tín chỉ vượt quá trần quy định tối đa của HUST (tối đa 22 tín/kỳ chính).');
  }

  if (hardCount > 2) {
    warnings.push(`Cảnh báo quá tải nhận thức: Bạn đang chọn ${hardCount} môn độ khó cao (≥ 4.5★) trong cùng một kỳ!`);
  }

  return {
    selectedCourses,
    totalCredits,
    avgDifficulty,
    hardCoursesCount: hardCount,
    isOverloaded: totalCredits > 20 || hardCount > 2,
    isUnderloaded: totalCredits < 14,
    warnings
  };
}
