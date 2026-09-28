import { Course } from '../types/course';
import { StudentInfo } from '../types/state';

export type RecommendationStrategy = 'balanced' | 'fast_track' | 'high_gpa' | 'core_first';

export interface RecommendationPreferences {
  targetCredits: number;           // Số tín chỉ mong muốn (mặc định 18, dải 12 - 24)
  strategy: RecommendationStrategy; // Chiến lược: Vừa sức, Tăng tốc, An toàn CPA, Cốt lõi
  excludedCourseCodes: string[];   // Mã các môn sinh viên không muốn học kỳ này
  priorityCourseCodes: string[];   // Mã các môn sinh viên bắt buộc muốn đăng ký
  targetTerm?: number;             // Kỳ dự kiến đăng ký (mặc định kỳ tiếp theo)
  maxDifficultCourses?: number;    // Giới hạn số môn khó (>= 4.0 sao)
}

export interface RecommendedCourseItem {
  course: Course;
  score: number;                   // Điểm xếp hạng gợi ý (0 - 100)
  priorityReason: string;          // Lý do gợi ý trực quan
  isUnlocked: boolean;             // Đã mở khóa đầy đủ điều kiện tiên quyết
  missingPrereqs: string[];        // Các môn tiên quyết còn thiếu nếu chưa mở khóa
  unlocksCount: number;            // Số lượng môn tương lai được giải phóng sau khi qua môn này
  difficultyTag: 'easy' | 'medium' | 'hard' | 'extreme';
}

export interface RecommendationResult {
  recommended: RecommendedCourseItem[];
  alternatives: RecommendedCourseItem[];
  totalCredits: number;
  averageDifficulty: number;
  estimatedWorkloadHours: number;
  burnoutRisk: 'low' | 'moderate' | 'high';
  summaryMessage: string;
}

/**
 * Thuật toán Học Máy & Tối Ưu Hóa Gợi Ý Học Phần Kỳ Tới (HUST Course Recommender Engine)
 * Kết hợp:
 * 1. Đồ thị có hướng DAG (Topological Dependency & Critical Path Unlocking)
 * 2. Cân bằng độ khó & Chống kiệt sức (Workload & Mental Fatigue Regularization)
 * 3. Tối ưu hóa tổ hợp tín chỉ (Constrained Knapsack Optimization)
 */
export function recommendCoursesForNextTerm(
  allCourses: Course[],
  studentInfo: StudentInfo,
  customPrefs?: Partial<RecommendationPreferences>
): RecommendationResult {
  const prefs: RecommendationPreferences = {
    targetCredits: customPrefs?.targetCredits ?? 18,
    strategy: customPrefs?.strategy ?? 'balanced',
    excludedCourseCodes: customPrefs?.excludedCourseCodes ?? [],
    priorityCourseCodes: customPrefs?.priorityCourseCodes ?? [],
    targetTerm: customPrefs?.targetTerm ?? Math.min(8, (studentInfo.currentTerm || 3) + 1),
    maxDifficultCourses: customPrefs?.maxDifficultCourses ?? 2
  };

  // Tập hợp các môn đã qua (passed)
  const passedSet = new Set<string>();
  allCourses.forEach(c => {
    if (c.status === 'passed' || (typeof c.gradeScale4 === 'number' && c.gradeScale4 > 0)) {
      passedSet.add(c.code);
    }
  });

  // Miễn tiếng Anh nếu có chứng chỉ
  if (studentInfo.exemptEnglishCourses) {
    studentInfo.exemptEnglishCourses.forEach(code => passedSet.add(code));
  }

  // 1. Xây dựng đồ thị phụ thuộc DAG (Graph Dependency Map)
  // unlocksMap[A] = [B, C, D] (học xong A sẽ mở khóa B, C, D)
  const unlocksMap = new Map<string, string[]>();
  allCourses.forEach(c => {
    c.prerequisites?.forEach(prereq => {
      const existing = unlocksMap.get(prereq) || [];
      existing.push(c.code);
      unlocksMap.set(prereq, existing);
    });
  });

  // Tính transitive out-degree (tổng số môn gián tiếp mở khóa)
  const calculateTotalUnlocks = (courseCode: string, visited = new Set<string>()): number => {
    const direct = unlocksMap.get(courseCode) || [];
    let count = 0;
    direct.forEach(nextCode => {
      if (!visited.has(nextCode)) {
        visited.add(nextCode);
        count += 1 + calculateTotalUnlocks(nextCode, visited);
      }
    });
    return count;
  };

  // 2. Lọc danh sách ứng viên (Candidate Pool)
  // Chỉ lấy các môn CHƯA HỌC và không nằm trong danh sách loại trừ
  const unpassedCourses = allCourses.filter(c => {
    if (passedSet.has(c.code)) return false;
    if (c.status === 'passed') return false;
    if (prefs.excludedCourseCodes.includes(c.code)) return false;
    return true;
  });

  // 3. Chấm điểm đa tiêu chí (Multi-factor Machine Learning Scoring)
  const candidateScores: RecommendedCourseItem[] = unpassedCourses.map(course => {
    const prereqs = course.prerequisites || [];
    const missing = prereqs.filter(p => !passedSet.has(p));
    const isUnlocked = missing.length === 0;

    const unlocksCount = calculateTotalUnlocks(course.code);
    const difficulty = course.difficulty || 3.0;

    let difficultyTag: 'easy' | 'medium' | 'hard' | 'extreme' = 'medium';
    if (difficulty >= 4.5) difficultyTag = 'extreme';
    else if (difficulty >= 4.0) difficultyTag = 'hard';
    else if (difficulty <= 2.8) difficultyTag = 'easy';

    // Bắt đầu tính điểm gợi ý Score (0 - 100)
    let score = 50.0;

    // Tiêu chí 1: Điều kiện tiên quyết (Cực kỳ quan trọng)
    if (!isUnlocked) {
      score -= 80.0; // Chưa đủ điều kiện -> điểm thấp
    } else {
      score += 15.0; // Đã đủ điều kiện
    }

    // Tiêu chí 2: Môn ưu tiên bắt buộc do sinh viên tick chọn
    if (prefs.priorityCourseCodes.includes(course.code)) {
      score += 50.0;
    }

    // Tiêu chí 3: Độ mở khóa dây chuyền (Critical Path Unlocking)
    // Môn mở khóa càng nhiều môn phía sau thì càng bắt buộc phải học sớm để tránh nghẽn ra trường
    score += Math.min(30.0, unlocksCount * 6.5);

    // Tiêu chí 4: Khớp với kỳ học lộ trình đào tạo
    const courseTerm = course.term || 1;
    const termDiff = courseTerm - (prefs.targetTerm || 1);
    if (termDiff === 0) {
      score += 20.0; // Đúng kỳ chuẩn
    } else if (termDiff < 0) {
      // Môn nợ đọng từ các kỳ trước -> ƯU TIÊN CAO ĐỂ TRẢ NỢ MÔN
      score += 25.0 + Math.abs(termDiff) * 5.0;
    } else if (termDiff === 1) {
      score += 5.0; // Học vượt 1 kỳ
    } else {
      score -= 15.0; // Học vượt quá xa
    }

    // Tiêu chí 5: Tính chất bắt buộc hay tự chọn
    if (course.isRequired !== false) {
      score += 10.0;
    }

    // Tiêu chí 6: Điều chỉnh theo Chiến lược người dùng chọn
    if (prefs.strategy === 'fast_track') {
      // Tăng tốc: Thưởng lớn cho môn mở khóa và môn tín chỉ cao
      score += unlocksCount * 4.0 + (course.credits >= 4 ? 10.0 : 0);
    } else if (prefs.strategy === 'high_gpa') {
      // An toàn CPA: Ưu tiên môn nhẹ/vừa, phạt môn quá khắc nghiệt
      if (difficulty <= 3.2) score += 18.0;
      if (difficulty >= 4.2) score -= 15.0;
    } else if (prefs.strategy === 'core_first') {
      // Cốt lõi ngành: Thưởng cho môn cơ sở và cốt lõi
      if (/cơ sở|cốt lõi|chuyên ngành/i.test(course.categoryName || '')) score += 16.0;
    } else {
      // Cân bằng (Balanced): Phạt nếu môn quá khó
      if (difficulty >= 4.5) score -= 8.0;
    }

    // Tạo thông điệp lý do trực quan
    let priorityReason = 'Khớp lộ trình kỳ học';
    if (!isUnlocked) {
      priorityReason = `Thiếu tiên quyết: ${missing.join(', ')}`;
    } else if (prefs.priorityCourseCodes.includes(course.code)) {
      priorityReason = 'Môn ưu tiên bạn đã chọn';
    } else if (termDiff < 0) {
      priorityReason = `Môn kỳ trước cần hoàn thành (Kỳ ${courseTerm})`;
    } else if (unlocksCount >= 3) {
      priorityReason = `Khóa then chốt: Mở khóa ${unlocksCount} môn tiếp theo`;
    } else if (course.isRetake) {
      priorityReason = 'Học phần đăng ký cải thiện';
    } else if (difficultyTag === 'easy') {
      priorityReason = 'Môn vừa sức giúp bảo toàn CPA';
    } else if (course.isRequired) {
      priorityReason = 'Học phần bắt buộc theo khung CTĐT';
    }

    return {
      course,
      score: Math.max(0, Math.min(100, Math.round(score))),
      priorityReason,
      isUnlocked,
      missingPrereqs: missing,
      unlocksCount,
      difficultyTag
    };
  });

  // 4. Phân nhóm ứng viên đủ điều kiện (Eligible Candidates)
  const eligibleCandidates = candidateScores
    .filter(item => item.isUnlocked)
    .sort((a, b) => b.score - a.score);

  // 5. Thuật toán chọn gói môn tối ưu vừa sức (Knapsack & Fatigue Regularization)
  const recommended: RecommendedCourseItem[] = [];
  let currentCredits = 0;
  let difficultCount = 0;

  // Bước 5.1: Đưa các môn bắt buộc ưu tiên vào trước
  eligibleCandidates.forEach(item => {
    if (prefs.priorityCourseCodes.includes(item.course.code)) {
      recommended.push(item);
      currentCredits += item.course.credits;
      if ((item.course.difficulty || 3) >= 4.0) difficultCount++;
    }
  });

  // Bước 5.2: Greedy Selection kết hợp ràng buộc Fatigue Risk
  for (const item of eligibleCandidates) {
    if (recommended.some(r => r.course.code === item.course.code)) continue;

    const courseCredits = item.course.credits;
    // Kiểm tra giới hạn tín chỉ (cho phép chênh lệch +-1 tín chỉ)
    if (currentCredits + courseCredits > prefs.targetCredits + 1) {
      continue;
    }

    const isHard = (item.course.difficulty || 3) >= 4.0;
    // Ràng buộc kiệt sức: Nếu đã có quá nhiều môn khó, tránh nhồi nhét thêm môn khó
    if (isHard && difficultCount >= (prefs.maxDifficultCourses || 2) && prefs.strategy !== 'fast_track') {
      continue;
    }

    recommended.push(item);
    currentCredits += courseCredits;
    if (isHard) difficultCount++;

    if (currentCredits >= prefs.targetCredits) break;
  }

  // Danh sách môn thay thế (Alternatives) để sinh viên hoán đổi
  const recommendedCodes = new Set(recommended.map(r => r.course.code));
  const alternatives = eligibleCandidates
    .filter(item => !recommendedCodes.has(item.course.code))
    .slice(0, 10);

  // 6. Tính toán chỉ số tải học tập (Workload Analytics)
  const totalCredits = recommended.reduce((sum, r) => sum + r.course.credits, 0);
  const avgDiff = recommended.length > 0
    ? recommended.reduce((sum, r) => sum + (r.course.difficulty || 3.0), 0) / recommended.length
    : 0;

  // Công thức ước tính giờ học/tuần: Mỗi tín chỉ cần ~1.5h trên lớp + ~1.5h tự học
  const estimatedWorkloadHours = Math.round(totalCredits * 3.0 * (avgDiff / 3.0));

  let burnoutRisk: 'low' | 'moderate' | 'high' = 'low';
  if (totalCredits > 21 || (avgDiff >= 4.2 && totalCredits >= 18)) {
    burnoutRisk = 'high';
  } else if (totalCredits >= 17 || avgDiff >= 3.7) {
    burnoutRisk = 'moderate';
  }

  let summaryMessage = `Gợi ý ${recommended.length} học phần (${totalCredits} TC), độ khó trung bình ${avgDiff.toFixed(1)}/5.0. Phân bổ khoa học, đảm bảo tiến độ ra trường.`;
  if (burnoutRisk === 'high') {
    summaryMessage = `⚠️ Khối lượng học tập kỳ này khá nặng (${totalCredits} TC, ${estimatedWorkloadHours}h/tuần). Cân nhắc giảm bớt 1 môn khó để bảo toàn CPA.`;
  } else if (burnoutRisk === 'low') {
    summaryMessage = `✨ Lịch học kỳ tới rất vừa sức (${totalCredits} TC, ${estimatedWorkloadHours}h/tuần), có nhiều thời gian nghỉ ngơi và tự học.`;
  }

  return {
    recommended,
    alternatives,
    totalCredits,
    averageDifficulty: Number(avgDiff.toFixed(1)),
    estimatedWorkloadHours,
    burnoutRisk,
    summaryMessage
  };
}
