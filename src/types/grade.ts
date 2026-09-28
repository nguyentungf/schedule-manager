import { LetterGrade } from './course';

export type FeasibilityLevel = 'very_easy' | 'moderate' | 'hard' | 'very_hard' | 'impossible';

export interface ExamTargetCalculation {
  letter: LetterGrade;
  scale4: number;
  minFinalScore: number;     // D_ck_min cần đạt
  isPossible: boolean;       // Có khả thi về mặt toán học không (<= 10.0)
  isFailProne: boolean;      // Bị điểm liệt nếu < 3.0
  feasibility: FeasibilityLevel;
  feasibilityLabel: string;
}

export interface SemesterHistory {
  termId: string;            // Ví dụ: '2023.1', '2023.2'
  termName: string;          // Học kỳ 1 năm học 2023-2024
  credits: number;           // Số tín chỉ học kỳ đó
  gpa: number;               // GPA thang 4 của kỳ
  drl: number;               // Điểm rèn luyện (0 - 100)
  avgDifficulty: number;     // Độ khó trung bình (1.0 - 5.0)
}

export interface CpaTargetAnalysis {
  targetCpa: number;
  currentCpa: number;
  totalCompletedCredits: number;
  totalCurriculumCredits: number;
  remainingCredits: number;
  requiredRemainingGpa: number;
  isAchievable: boolean;
  message: string;
}
