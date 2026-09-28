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
 * TIÊU CHÍ VÀNG: Ưu tiên độ khó trung bình của tổ hợp học phần nằm trong dải chuẩn [3.7 - 4.3] (tâm ~4.0)
 * 
 * Kết hợp:
 * 1. Đồ thị có hướng DAG (Topological Dependency & Critical Path Unlocking)
 * 2. Đánh giá độ khó đa chiều (3.7 - 4.3 Star Target Difficulty Regularization)
 * 3. Tối ưu hóa tổ hợp Beam Search Knapsack (Constrained Combinatorial Optimization)
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
    maxDifficultCourses: customPrefs?.maxDifficultCourses ?? 3
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
    (c.prerequisites || []).forEach(prereq => {
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
    const difficulty = course.difficulty || 3.5;

    let difficultyTag: 'easy' | 'medium' | 'hard' | 'extreme' = 'medium';
    if (difficulty >= 4.5) difficultyTag = 'extreme';
    else if (difficulty >= 4.0) difficultyTag = 'hard';
    else if (difficulty <= 2.8) difficultyTag = 'easy';

    // Bắt đầu tính điểm gợi ý Score (0 - 100)
    let score = 50.0;

    // Tiêu chí 1: Điều kiện tiên quyết (Bắt buộc phải mở khóa)
    if (!isUnlocked) {
      score -= 85.0; // Chưa đủ điều kiện -> loại khỏi tập ưu tiên
    } else {
      score += 20.0; // Đã đủ điều kiện tiên quyết
    }

    // Tiêu chí 2: Môn ưu tiên bắt buộc do sinh viên tick chọn
    if (prefs.priorityCourseCodes.includes(course.code)) {
      score += 60.0;
    }

    // Tiêu chí 3: Độ mở khóa dây chuyền (Critical Path Unlocking)
    // Môn mở khóa càng nhiều môn phía sau thì càng phải học sớm để tránh nghẽn ra trường
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

    // Tiêu chí 6: ĐỘ KHÓ VÀNG [3.7 - 4.3]
    // Ưu tiên các môn có độ khó trong khoảng lý tưởng để tạo nên tổ hợp chuẩn 3.7 - 4.3
    if (difficulty >= 3.7 && difficulty <= 4.3) {
      score += 22.0; // Thưởng điểm cao cho môn trong khoảng vàng
    } else if (difficulty > 4.3) {
      score -= (difficulty - 4.3) * 12.0; // Giảm bớt để tránh quá tải
    } else if (difficulty < 3.5) {
      score -= (3.5 - difficulty) * 8.0; // Giảm nhẹ nếu quá nhẹ
    }

    // Tiêu chí 7: Điều chỉnh theo Chiến lược người dùng chọn
    if (prefs.strategy === 'fast_track') {
      score += unlocksCount * 4.0 + (course.credits >= 4 ? 8.0 : 0);
    } else if (prefs.strategy === 'high_gpa') {
      if (difficulty <= 3.5) score += 15.0;
      if (difficulty >= 4.2) score -= 20.0;
    } else if (prefs.strategy === 'core_first') {
      if (/cơ sở|cốt lõi|chuyên ngành/i.test(course.categoryName || '')) score += 18.0;
    } else {
      // Balanced: Cân bằng vừa sức
      if (difficulty >= 4.4) score -= 10.0;
    }

    // Tạo thông điệp lý do trực quan
    let priorityReason = 'Khớp lộ trình kỳ học';
    if (!isUnlocked) {
      priorityReason = `Thiếu tiên quyết: ${missing.join(', ')}`;
    } else if (prefs.priorityCourseCodes.includes(course.code)) {
      priorityReason = 'Môn ưu tiên bạn đã chọn';
    } else if (termDiff < 0) {
      priorityReason = `Môn nợ kỳ trước (Kỳ ${courseTerm})`;
    } else if (unlocksCount >= 3) {
      priorityReason = `Khóa then chốt: Mở khóa ${unlocksCount} môn`;
    } else if (difficulty >= 3.7 && difficulty <= 4.3) {
      priorityReason = `Độ khó lý tưởng (${difficulty.toFixed(1)}★), cân bằng tải`;
    } else if (difficultyTag === 'easy') {
      priorityReason = 'Môn nhẹ giúp điều hòa tải học tập';
    } else if (course.isRequired) {
      priorityReason = 'Học phần bắt buộc theo CTĐT';
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

  // 5. THUẬT TOÁN TỐI ƯU TỔ HỢP BEAM SEARCH (TARGET AVERAGE DIFFICULTY 3.7 - 4.3)
  // Tìm gói môn S sao cho:
  // - Chứa toàn bộ priorityCourseCodes
  // - Tổng tín chỉ C(S) xấp xỉ targetCredits
  // - Độ khó trung bình D_avg(S) nằm trong khoảng [3.7, 4.3] (càng gần 4.0 càng điểm cao)
  const priorityItems = eligibleCandidates.filter(item => prefs.priorityCourseCodes.includes(item.course.code));
  const poolItems = eligibleCandidates.filter(item => !prefs.priorityCourseCodes.includes(item.course.code));

  // Giới hạn pool tìm kiếm để thuật toán chạy trong < 3ms
  const searchCandidates = poolItems.slice(0, 24);

  interface SearchState {
    items: RecommendedCourseItem[];
    totalCredits: number;
    diffSum: number;
    scoreSum: number;
  }

  const initialCredits = priorityItems.reduce((acc, it) => acc + it.course.credits, 0);
  const initialDiffSum = priorityItems.reduce((acc, it) => acc + (it.course.difficulty || 3.5), 0);
  const initialScoreSum = priorityItems.reduce((acc, it) => acc + it.score, 0);

  let currentBeam: SearchState[] = [{
    items: [...priorityItems],
    totalCredits: initialCredits,
    diffSum: initialDiffSum,
    scoreSum: initialScoreSum
  }];

  const BEAM_WIDTH = 40;
  const targetCredits = prefs.targetCredits;
  const validCompletedBundles: SearchState[] = [];

  // Mở rộng từng ứng viên vào chùm Beam Search
  for (const candidate of searchCandidates) {
    const nextBeam: SearchState[] = [];

    for (const state of currentBeam) {
      // Nhánh 1: Không thêm candidate này
      nextBeam.push(state);

      // Nhánh 2: Thêm candidate này nếu chưa vượt quá tín chỉ tối đa (target + 2)
      const newCredits = state.totalCredits + candidate.course.credits;
      if (newCredits <= targetCredits + 2) {
        const nextState: SearchState = {
          items: [...state.items, candidate],
          totalCredits: newCredits,
          diffSum: state.diffSum + (candidate.course.difficulty || 3.5),
          scoreSum: state.scoreSum + candidate.score
        };

        nextBeam.push(nextState);

        // Nếu đạt ngưỡng tín chỉ [target - 1, target + 2], đây là một tổ hợp hợp lệ hoàn chỉnh
        if (newCredits >= targetCredits - 1) {
          validCompletedBundles.push(nextState);
        }
      }
    }

    // Đánh giá sơ bộ và tỉa bớt beam
    nextBeam.sort((a, b) => {
      const aDiffAvg = a.items.length > 0 ? a.diffSum / a.items.length : 3.5;
      const bDiffAvg = b.items.length > 0 ? b.diffSum / b.items.length : 3.5;
      // Thưởng trạng thái gần khoảng [3.7, 4.3]
      const aPenalty = (aDiffAvg < 3.7 ? (3.7 - aDiffAvg) : (aDiffAvg > 4.3 ? (aDiffAvg - 4.3) : 0)) * 40;
      const bPenalty = (bDiffAvg < 3.7 ? (3.7 - bDiffAvg) : (bDiffAvg > 4.3 ? (bDiffAvg - 4.3) : 0)) * 40;
      return (b.scoreSum - bPenalty) - (a.scoreSum - aPenalty);
    });

    currentBeam = nextBeam.slice(0, BEAM_WIDTH);
  }

  // Thuật toán chấm điểm Fitness toàn diện cho gói môn hoàn chỉnh:
  const evaluateBundleFitness = (bundle: SearchState): number => {
    if (bundle.items.length === 0) return -9999;
    const count = bundle.items.length;
    const avgDiff = bundle.diffSum / count;
    let fitness = bundle.scoreSum;

    // 1. Tiêu chí Vàng: Độ khó trung bình nằm trong [3.7, 4.3]
    if (avgDiff >= 3.7 && avgDiff <= 4.3) {
      fitness += 80.0; // THƯỞNG LỚN KHI RƠI VÀO KHOẢNG VÀNG
      // Bonus thêm nếu tiệm cận tâm lý tưởng 4.0
      const distFrom4 = Math.abs(avgDiff - 4.0);
      fitness += Math.max(0, 20.0 - distFrom4 * 50.0);
    } else if (avgDiff < 3.7) {
      // Phạt nếu độ khó trung bình thấp hơn 3.7
      fitness -= (3.7 - avgDiff) * 150.0;
    } else {
      // Phạt nếu độ khó trung bình cao hơn 4.3 (nguy cơ quá tải/kiệt sức)
      fitness -= (avgDiff - 4.3) * 180.0;
    }

    // 2. Tiêu chí Tín chỉ: Càng sát targetCredits càng tốt
    const creditGap = Math.abs(bundle.totalCredits - targetCredits);
    fitness -= creditGap * 18.0;

    return fitness;
  };

  // Chọn ra gói tối ưu nhất
  let bestBundle: SearchState;

  if (validCompletedBundles.length > 0) {
    validCompletedBundles.sort((a, b) => evaluateBundleFitness(b) - evaluateBundleFitness(a));
    bestBundle = validCompletedBundles[0];
  } else {
    // Dự phòng trường hợp số lượng môn không đủ để lấp đầy tín chỉ
    currentBeam.sort((a, b) => evaluateBundleFitness(b) - evaluateBundleFitness(a));
    bestBundle = currentBeam[0];
  }

  const recommended = bestBundle.items;
  const recommendedCodes = new Set(recommended.map(r => r.course.code));

  // Danh sách môn thay thế (Alternatives) để sinh viên hoán đổi
  const alternatives = eligibleCandidates
    .filter(item => !recommendedCodes.has(item.course.code))
    .slice(0, 10);

  // 6. Tính toán chỉ số tải học tập & Độ khó trung bình cuối cùng
  const totalCredits = recommended.reduce((sum, r) => sum + r.course.credits, 0);
  const avgDiff = recommended.length > 0
    ? recommended.reduce((sum, r) => sum + (r.course.difficulty || 3.5), 0) / recommended.length
    : 0;

  const estimatedWorkloadHours = Math.round(totalCredits * 3.0 * (avgDiff / 3.0));

  let burnoutRisk: 'low' | 'moderate' | 'high' = 'low';
  if (totalCredits > 21 || (avgDiff >= 4.2 && totalCredits >= 18)) {
    burnoutRisk = 'high';
  } else if (totalCredits >= 17 || avgDiff >= 3.7) {
    burnoutRisk = 'moderate';
  }

  // Tạo thông điệp tóm tắt chính xác theo tiêu chí độ khó 3.7 - 4.3
  let summaryMessage = '';
  if (avgDiff >= 3.7 && avgDiff <= 4.3) {
    summaryMessage = `🎯 Đề xuất ${recommended.length} môn (${totalCredits} TC) đạt độ khó chuẩn mực ${avgDiff.toFixed(1)}/5.0★ (nằm trong dải vàng 3.7 - 4.3★). Lịch học vừa sức, tối ưu giữa tiến độ ra trường và bảo toàn CPA.`;
  } else if (avgDiff > 4.3) {
    summaryMessage = `⚠️ Gói đề xuất gồm ${recommended.length} môn (${totalCredits} TC) có độ khó ${avgDiff.toFixed(1)}/5.0★ (> 4.3★). Bạn nên cân nhắc hoán đổi bớt 1 môn khó để tránh áp lực thi cử.`;
  } else {
    summaryMessage = `💡 Gói đề xuất gồm ${recommended.length} môn (${totalCredits} TC) có độ khó ${avgDiff.toFixed(1)}/5.0★ (< 3.7★). Lịch học rất nhẹ nhàng, có thể đăng ký thêm môn cốt lõi nếu muốn bứt phá.`;
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
