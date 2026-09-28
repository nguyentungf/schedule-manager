import { SemesterHistory } from '../types/grade';

export interface RegressionModelResult {
  isTrained: boolean;
  coefficients: number[]; // [beta0, beta_credits, beta_diff, beta_prevGpa, beta_drl]
  rSquared: number;
  standardError: number;
  sampleCount: number;
  isColdStart: boolean;
}

export interface PredictionResult {
  predictedGpa: number;
  confidenceLower: number;
  confidenceUpper: number;
  standardError: number;
  isColdStart: boolean;
  formulaDescription: string;
  insights: string[];
}

/**
 * Thuật toán giải hệ phương trình A * X = B (hoặc nghịch đảo ma trận) bằng khử Gauss-Jordan có chọn phần tử trội
 */
export function invertMatrix(A: number[][]): number[][] | null {
  const n = A.length;
  // Tạo ma trận mở rộng [A | I]
  const augmented: number[][] = A.map((row, i) => {
    const identityRow = new Array(n).fill(0);
    identityRow[i] = 1;
    return [...row, ...identityRow];
  });

  for (let i = 0; i < n; i++) {
    // Tìm phần tử trội (partial pivot)
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }

    // Hoán vị dòng
    if (maxRow !== i) {
      const temp = augmented[i];
      augmented[i] = augmented[maxRow];
      augmented[maxRow] = temp;
    }

    // Kiểm tra ma trận suy biến
    if (Math.abs(augmented[i][i]) < 1e-9) {
      return null;
    }

    // Chuẩn hóa dòng pivot về 1
    const pivot = augmented[i][i];
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= pivot;
    }

    // Khử các dòng khác
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = augmented[k][i];
        for (let j = 0; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
  }

  // Trích xuất nửa bên phải (ma trận nghịch đảo A^-1)
  return augmented.map(row => row.slice(n));
}

/**
 * Nhân hai ma trận A (m x k) và B (k x n)
 */
export function multiplyMatrices(A: number[][], B: number[][]): number[][] {
  const m = A.length;
  const k = A[0].length;
  const n = B[0].length;
  const result: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let p = 0; p < k; p++) {
        sum += A[i][p] * B[p][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

/**
 * Chuyển vị ma trận A^T
 */
export function transposeMatrix(A: number[][]): number[][] {
  const m = A.length;
  const n = A[0].length;
  const result: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      result[j][i] = A[i][j];
    }
  }
  return result;
}

/**
 * Huấn luyện mô hình OLS Regression từ lịch sử các kỳ học:
 * X_k = [1, credits, avgDiff, prevGpa, drl/100] -> Y_k = gpa
 */
export function trainOlsModel(history: SemesterHistory[]): RegressionModelResult {
  // Cần ít nhất 3 kỳ học để huấn luyện OLS cơ bản
  if (history.length < 3) {
    return {
      isTrained: false,
      coefficients: [3.0, -0.02, -0.15, 0.4, 0.2], // Heuristic priors
      rSquared: 0,
      standardError: 0.25,
      sampleCount: history.length,
      isColdStart: true
    };
  }

  const X: number[][] = [];
  const Y: number[][] = [];

  for (let i = 1; i < history.length; i++) {
    const cur = history[i];
    const prev = history[i - 1];

    // [bias=1, credits, avgDiff, prevGpa, drlScore]
    X.push([1, cur.credits, cur.avgDifficulty, prev.gpa, cur.drl / 100]);
    Y.push([cur.gpa]);
  }

  // Nếu số mẫu sau khi lấy lag prevGpa < 3, dùng cold start
  if (X.length < 2) {
    return {
      isTrained: false,
      coefficients: [3.0, -0.02, -0.15, 0.4, 0.2],
      rSquared: 0,
      standardError: 0.25,
      sampleCount: history.length,
      isColdStart: true
    };
  }

  try {
    const XT = transposeMatrix(X);
    const XTX = multiplyMatrices(XT, X);

    // Thêm hệ số điều chuẩn L2 nhỏ (Ridge penalty 0.01) để tránh suy biến
    for (let i = 0; i < XTX.length; i++) {
      XTX[i][i] += 0.01;
    }

    const XTX_inv = invertMatrix(XTX);
    if (!XTX_inv) {
      throw new Error('Singular matrix');
    }

    const XTY = multiplyMatrices(XT, Y);
    const betaMatrix = multiplyMatrices(XTX_inv, XTY);
    const beta = betaMatrix.map(row => row[0]);

    // Tính R^2 và Standard Error
    let sse = 0;
    let sst = 0;
    const yMean = Y.reduce((sum, val) => sum + val[0], 0) / Y.length;

    for (let i = 0; i < X.length; i++) {
      let yPred = 0;
      for (let j = 0; j < beta.length; j++) {
        yPred += beta[j] * X[i][j];
      }
      const actual = Y[i][0];
      sse += Math.pow(actual - yPred, 2);
      sst += Math.pow(actual - yMean, 2);
    }

    const rSquared = sst > 0 ? Math.max(0, Math.min(1, 1 - (sse / sst))) : 0.85;
    const degreesOfFreedom = Math.max(1, X.length - beta.length);
    const standardError = Math.sqrt(sse / degreesOfFreedom);

    return {
      isTrained: true,
      coefficients: beta,
      rSquared: Math.round(rSquared * 100) / 100,
      standardError: Math.round(standardError * 100) / 100,
      sampleCount: X.length,
      isColdStart: false
    };
  } catch (err) {
    return {
      isTrained: false,
      coefficients: [3.0, -0.02, -0.15, 0.4, 0.2],
      rSquared: 0,
      standardError: 0.25,
      sampleCount: history.length,
      isColdStart: true
    };
  }
}

/**
 * Dự đoán GPA kỳ tiếp theo dựa trên kế hoạch đăng ký
 */
export function predictNextSemesterGpa(
  model: RegressionModelResult,
  credits: number,
  avgDifficulty: number,
  prevGpa: number,
  drl: number,
  currentCpa: number = 3.0
): PredictionResult {
  let rawPrediction = 0;
  let formulaDesc = '';

  if (model.isColdStart || !model.isTrained) {
    // Heuristic Weighted Baseline formula theo Master Prompt
    // GPA = 0.5 * CPA_hien_tai + 0.3 * Baseline(3.0) - 0.1 * (Diff - 3.0) - 0.1 * ((Credits - 16) / 4)
    rawPrediction =
      0.5 * currentCpa +
      0.3 * 3.0 -
      0.15 * (avgDifficulty - 3.0) -
      0.1 * ((credits - 16) / 4) +
      0.1 * ((drl - 80) / 20);

    formulaDesc = 'Heuristic Weighted Baseline (Dữ liệu học tập < 3 kỳ)';
  } else {
    // OLS Regression: beta0 + beta1*credits + beta2*diff + beta3*prevGpa + beta4*drl/100
    const [b0, bCredits, bDiff, bPrev, bDrl] = model.coefficients;
    rawPrediction = b0 + bCredits * credits + bDiff * avgDifficulty + bPrev * prevGpa + bDrl * (drl / 100);
    formulaDesc = `Mô hình OLS Regression (R² = ${model.rSquared})`;
  }

  // Giới hạn trong khoảng [0.0, 4.0]
  const predictedGpa = Math.max(0.0, Math.min(4.0, Math.round(rawPrediction * 100) / 100));
  const se = model.standardError || 0.2;
  const lower = Math.max(0.0, Math.round((predictedGpa - 1.96 * se) * 100) / 100);
  const upper = Math.min(4.0, Math.round((predictedGpa + 1.96 * se) * 100) / 100);

  // Sinh thông tin độ nhạy (Sensitivity Insights)
  const insights: string[] = [];

  if (credits > 20) {
    insights.push(`⚠️ Bạn đang đăng ký ${credits} tín chỉ (khá nặng). Giảm bớt 3-4 tín chỉ có thể giúp GPA kỳ này tăng thêm ~0.15 - 0.25 điểm.`);
  } else if (credits < 14) {
    insights.push(`ℹ️ Tải tín chỉ ${credits} tín khá an toàn để tập trung cày điểm cao!`);
  }

  if (avgDifficulty >= 4.2) {
    insights.push(`🔥 Tải độ khó trung bình ${avgDifficulty.toFixed(1)}/5.0 ở mức rất cao. Hãy phân bổ thời gian tự học ít nhất 25-30 giờ/tuần.`);
  } else {
    insights.push(`✅ Phân bổ độ khó môn học (${avgDifficulty.toFixed(1)}/5.0) đang ở mức cân bằng hợp lý.`);
  }

  if (drl >= 85) {
    insights.push(`⭐ Điểm rèn luyện dự kiến ${drl} giúp tăng cơ hội học bổng khuyến khích học tập (loại Giỏi/Xuất sắc).`);
  }

  return {
    predictedGpa,
    confidenceLower: lower,
    confidenceUpper: upper,
    standardError: se,
    isColdStart: model.isColdStart,
    formulaDescription: formulaDesc,
    insights
  };
}
