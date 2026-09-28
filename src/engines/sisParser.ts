import { LetterGrade, CourseStatus } from '../types/course';
import { DashboardState } from '../types/state';
import { findCourseMasterInfo } from '../data/curricula';
import { KNOWN_HUST_COURSE_CATALOG } from './courseCatalogParser';

export interface ParsedCourseResult {
  code: string;
  name: string;
  credits: number;
  ects?: number | null;
  gradeQt: number | null;
  gradeCk: number | null;
  gradeLetter: LetterGrade | null;
  gradeScale4: number | null;
  term?: number;
  isRequired?: boolean;
  creditsTaken?: number | null;
  codeTaken?: string;
  category?: string;
  department?: string;
  isLearned?: boolean;
  status: CourseStatus;
  prerequisites: string[];

  // Cờ phân loại thông minh phục vụ lọc sạch CTĐT
  isPhysicalEducation?: boolean;     // Thể chất (PE) không tính CPA
  isGraduateOrEngineer?: boolean;    // Kỹ sư / Thạc sĩ / Sau ĐH (Kỳ 9-10)
  isElectiveSupport?: boolean;       // Khối Bổ trợ tự chọn (tối thiểu 9 tín)
  isModuleCourse?: boolean;          // Học phần thuộc Module/Mô-đun chuyên ngành (mã đầu 4)
  isEnglishCourse?: boolean;         // Học phần Ngoại ngữ / Tiếng Anh (FL*)

  // Siêu dữ liệu từ CourseLists
  conditionString?: string;
  tuitionCredits?: number | null;
  duration?: string;
  englishName?: string;
}

export interface ParsedStudentInfo {
  studentId?: string;
  name?: string;
  programCode?: string;
  programName?: string;
  cohort?: string;
  major?: string;
}

export interface ParseReport {
  successCount: number;
  sourceType: 'QLDT' | 'SIS' | 'JSON' | 'UNKNOWN';
  studentInfo?: ParsedStudentInfo;
  courses: ParsedCourseResult[];
  errors: string[];
}

const LETTER_TO_SCALE4: Record<string, number> = {
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D+': 1.5,
  'D': 1.0,
  'F': 0.0
};

/**
 * Suy luận Năm học và Kỳ học tự động dựa theo quy ước mã số học phần của ĐHBK Hà Nội (HUST):
 * Chữ số đầu tiên trong cụm 4 số đại diện cho Năm đào tạo (Level):
 * - Đầu 1 (VD: MI1111, IT1110, FL1010): Năm 1 -> Kỳ 1 hoặc Kỳ 2
 * - Đầu 2 (VD: ET2000, ET2050, MI2020): Năm 2 -> Kỳ 3 hoặc Kỳ 4
 * - Đầu 3 (VD: ET3230, ET3250, ET3300): Năm 3 -> Kỳ 5 hoặc Kỳ 6
 * - Đầu 4 (VD: ET4010, ET4220, ET4900): Năm 4 -> Kỳ 7 hoặc Kỳ 8
 * - Đầu 5 (VD: ET5000): Năm 5 / Kỹ sư / Thạc sĩ -> Kỳ 9 hoặc Kỳ 10
 */
export function inferYearAndTermFromCourseCode(
  code: string,
  prerequisites: string[] = [],
  explicitTerm?: number | null
): { year: number; term: number } {
  // Nếu đã có kỳ học rõ ràng hợp lệ từ bảng nguồn (VD bảng SIS có cột Kỳ học > 1)
  if (explicitTerm && explicitTerm > 1 && explicitTerm <= 10) {
    const year = Math.min(5, Math.max(1, Math.ceil(explicitTerm / 2)));
    return { year, term: explicitTerm };
  }

  const normCode = code.replace(/\s+/g, '').toUpperCase();
  const digitMatch = normCode.match(/^[A-Z]{2,4}([1-5])([0-9]{3})/);

  if (!digitMatch) {
    return { year: 1, term: (explicitTerm && explicitTerm >= 1) ? explicitTerm : 1 };
  }

  const yearDigit = parseInt(digitMatch[1]); // 1, 2, 3, 4, 5
  const secondDigit = parseInt(digitMatch[2][0]); // Chữ số thứ 2
  const year = yearDigit;
  const baseTerm = (year - 1) * 2 + 1; // 1, 3, 5, 7, 9
  let term = baseTerm;

  // 1. Phân định Kỳ 1 vs Kỳ 2 (Năm 1)
  if (year === 1) {
    const term2Codes = ['MI1121', 'MI1131', 'PH1110', 'FL1020', 'SSH1120', 'PE1020', 'CH1010'];
    if (term2Codes.includes(normCode) || prerequisites.some(p => ['MI1111', 'FL1010', 'SSH1110'].includes(p))) {
      term = 2;
    } else {
      term = 1;
    }
  }
  // 2. Phân định Kỳ 3 vs Kỳ 4 (Năm 2)
  else if (year === 2) {
    const term4Codes = ['ET2020', 'ET3241', 'MI2020', 'SSH1140', 'PE1030', 'IT3020', 'EE2020'];
    if (term4Codes.includes(normCode) || prerequisites.some(p => ['ET2000', 'ET2010', 'ET2050', 'SSH1130'].includes(p)) || secondDigit >= 2) {
      term = 4;
    } else {
      term = 3;
    }
  }
  // 3. Phân định Kỳ 5 vs Kỳ 6 (Năm 3)
  else if (year === 3) {
    const term6Codes = ['ET3220', 'ET3230', 'ET3250', 'ET3290', 'ET3990', 'ET3262', 'EM1010', 'IT3080', 'IT3120', 'EE3050'];
    if (term6Codes.includes(normCode) || prerequisites.some(p => ['ET3300', 'ET3000', 'ET3010', 'ET3210'].includes(p)) || secondDigit >= 2) {
      term = 6;
    } else {
      term = 5;
    }
  }
  // 4. Phân định Kỳ 7 vs Kỳ 8 (Năm 4)
  else if (year === 4) {
    const term8Codes = ['ET4990', 'ET4991', 'ET4992', 'ET4994', 'ET4995', 'ET4999', 'ET5000', 'IT4995', 'EE4900'];
    if (term8Codes.includes(normCode) || prerequisites.some(p => ['ET4900', 'ET4010', 'ET4220', 'ET3990'].includes(p)) || secondDigit >= 9) {
      term = 8;
    } else {
      term = 7;
    }
  }
  // 5. Năm 5 (Kỹ sư chuyên sâu / Thạc sĩ)
  else if (year === 5) {
    term = secondDigit >= 5 ? 10 : 9;
  }

  return { year, term };
}

/**
 * Trình phân tích thông minh cho dữ liệu copy từ QLĐT (qldt.hust.edu.vn) & SIS (sis.hust.edu.vn)
 * Hỗ trợ bóc tách đầy đủ:
 * 1. Bố cục QLĐT mới: STT | Mã HP | Tên HP | Phân loại Module/HP | Số TC | ECTS | Bắt buộc | Đã học | Điểm HP(Bậc) | Kết quả
 * 2. Bố cục SIS cũ: Mã HP | Tên HP | Kỳ học | Bắt buộc | TC ĐT | TC học | Mã HP học | Ghi chú | Điểm chữ | Điểm số
 * 3. Tự động nhận diện và gắn các môn tiên quyết (Prerequisites) từ Ngân hàng tri thức HUST
 * 4. Gắn các cờ phân loại (isPhysicalEducation, isGraduateOrEngineer, isElectiveSupport)
 */
export function parseSisText(rawText: string): ParseReport {
  const errors: string[] = [];
  const parsedCourses: ParsedCourseResult[] = [];
  let parsedStudentInfo: ParsedStudentInfo | undefined = undefined;
  let detectedSource: 'QLDT' | 'SIS' | 'JSON' | 'UNKNOWN' = 'UNKNOWN';

  // 1. Kiểm tra nếu người dùng dán chuỗi JSON từ Bookmarklet hoặc Console Script
  const trimmed = rawText.trim();
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      const json = JSON.parse(trimmed);
      if (Array.isArray(json)) {
        return {
          successCount: json.length,
          sourceType: 'JSON',
          courses: json.map(c => enrichWithPrerequisites(c)),
          errors: []
        };
      } else if (json.courses && Array.isArray(json.courses)) {
        return {
          successCount: json.courses.length,
          sourceType: 'JSON',
          studentInfo: json.studentInfo,
          courses: json.courses.map((c: any) => enrichWithPrerequisites(c, json.studentInfo?.major)),
          errors: []
        };
      }
    } catch (e) {
      // Không phải JSON hợp lệ, tiếp tục phân tích văn bản
    }
  }

  // 2. Nhận diện Header thông tin sinh viên & chương trình đào tạo
  // Mẫu QLĐT: "Chương trình đào tạo: ET1 - Kỹ thuật Điện tử - Viễn thông (2023)"
  const qldtHeaderMatch = rawText.match(
    /(?:Chương trình đào tạo|CTĐT):\s*([A-Z0-9-]+)\s*[-–]\s*(.+?)(?:\s*\(([0-9]{4})\)|\s*[\r\n]|$)/i
  );

  // Mẫu SIS cũ: "Chương trình 1845 - Kỹ thuật Điện tử - Viễn thông 2024 cho sinh viên 202414443 Nguyễn Quang Tùng"
  const sisHeaderMatch = rawText.match(
    /Chương trình\s+(\d+)\s*[-–]\s*([^\n\r]+?)\s+cho sinh viên\s+(\d{8,10})\s+([^\n\r]+)/i
  );

  if (qldtHeaderMatch) {
    detectedSource = 'QLDT';
    const majorRaw = qldtHeaderMatch[1].trim();
    const programName = qldtHeaderMatch[2].trim();
    const yearStr = qldtHeaderMatch[3] ? qldtHeaderMatch[3].trim() : '';
    const yearVal = parseInt(yearStr);
    const cohort = !isNaN(yearVal) && yearVal >= 1956 ? `K${yearVal - 1955}` : 'K68';

    parsedStudentInfo = {
      major: majorRaw,
      programName,
      cohort,
      programCode: majorRaw
    };
  } else if (sisHeaderMatch) {
    detectedSource = 'SIS';
    const programCode = sisHeaderMatch[1].trim();
    const programName = sisHeaderMatch[2].trim();
    const studentId = sisHeaderMatch[3].trim();
    const studentName = sisHeaderMatch[4].trim();

    const yearPrefix = parseInt(studentId.substring(0, 4));
    const cohort = !isNaN(yearPrefix) && yearPrefix >= 1956 ? `K${yearPrefix - 1955}` : 'K69';

    let detectedMajor = 'ET1';
    const normProg = (programName + ' ' + programCode).toLowerCase();
    if (normProg.includes('điện tử') || normProg.includes('viễn thông')) detectedMajor = 'ET1';
    else if (normProg.includes('khoa học máy tính') || normProg.includes('it1')) detectedMajor = 'IT1';
    else if (normProg.includes('kỹ thuật phần mềm') || normProg.includes('it2')) detectedMajor = 'IT2';
    else if (normProg.includes('điều khiển') || normProg.includes('tự động hóa') || normProg.includes('ee2')) detectedMajor = 'EE2';
    else if (normProg.includes('kỹ thuật điện') || normProg.includes('ee1')) detectedMajor = 'EE1';
    else if (normProg.includes('y sinh') || normProg.includes('et2')) detectedMajor = 'ET2';
    else if (normProg.includes('hệ thống nhúng') || normProg.includes('et-e4')) detectedMajor = 'ET-E4';
    else if (normProg.includes('viễn thông số') || normProg.includes('et-e5')) detectedMajor = 'ET-E5';
    else if (normProg.includes('vi mạch') || normProg.includes('bán dẫn') || normProg.includes('et-e16')) detectedMajor = 'ET-E16';

    parsedStudentInfo = {
      studentId,
      name: studentName,
      programCode,
      programName,
      cohort,
      major: detectedMajor
    };
  }

  // 3. Quét từng dòng dữ liệu bảng
  const lines = rawText.split(/\r?\n/);
  const seenCodes = new Set<string>();

  // Regex nhận dạng Mã môn HUST (bắt buộc viết hoa): ET3250, MI1111, EE2000, PE1010, SSH1110...
  const courseCodeRegex = /\b([A-Z]{2,4}(?:-[A-Z0-9]+)?\s?[0-9]{4})\b/;
  const letterGradeRegex = /\b(A\+|A|B\+|B|C\+|C|D\+|D|F)\b/i;

  let currentCategory = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Bỏ qua dòng tiêu đề trang hoặc nhóm filter
    if (/^chương trình/i.test(line)) continue;
    if (/^tìm kiếm mã hp/i.test(line)) continue;
    if (/^mã loại hp/i.test(line)) continue;
    if (line.includes('MÃ HỌC PHẦN') && line.includes('TÊN HỌC PHẦN')) {
      detectedSource = 'QLDT';
      continue;
    }
    if (line.includes('Mã HP') && line.includes('Tên HP')) {
      detectedSource = 'SIS';
      continue;
    }

    // Nhận diện dòng Loại HP trên SIS
    if (/Loại HP:\s*([^(]+)/i.test(line)) {
      const catMatch = line.match(/Loại HP:\s*([^(]+)/i);
      if (catMatch) currentCategory = catMatch[1].trim();
      continue;
    }

    // Tìm mã môn học
    const codeMatch = line.match(courseCodeRegex);
    if (!codeMatch) continue;

    const rawCode = codeMatch[1].replace(/\s+/g, '').toUpperCase();
    if (seenCodes.has(rawCode)) continue;

    // --- PHƯƠNG ÁN A: Phân tích TAB-SEPARATED hoặc MULTI-SPACE (Copy trực tiếp từ bảng HTML QLĐT hoặc SIS) ---
    // Hỗ trợ cả copy theo dòng và copy từng ô (cell-by-cell multi-line)
    let tabCols = line.split(/\t+|\s{2,}/).map(c => c.trim()).filter(Boolean);

    // Xử lý trường hợp copy bảng từ trình duyệt tạo ra mỗi dòng 1 ô (multi-line layout)
    let lookaheadIdx = i;
    if (tabCols.length <= 2 && i + 1 < lines.length) {
      const gathered = [...tabCols];
      while (lookaheadIdx + 1 < lines.length) {
        const nextLine = lines[lookaheadIdx + 1].trim();
        if (!nextLine) { lookaheadIdx++; continue; }
        // Nếu dòng tiếp theo là 1 mã môn học mới khác mã hiện tại -> ngắt
        const nextCodeM = nextLine.match(courseCodeRegex);
        if (nextCodeM && nextCodeM[1].replace(/\s+/g, '').toUpperCase() !== rawCode) {
          break;
        }
        const nextParts = nextLine.split(/\t+|\s{2,}/).map(c => c.trim()).filter(Boolean);
        gathered.push(...nextParts);
        lookaheadIdx++;
        if (gathered.length >= 8) break;
      }
      if (gathered.length >= 3) {
        tabCols = gathered;
        i = lookaheadIdx; // tiến con trỏ dòng
      }
    }

    if (tabCols.length >= 3) {
      const codeColIdx = tabCols.findIndex(c => c.toUpperCase() === rawCode || c.replace(/\s+/g, '').toUpperCase() === rawCode);
      if (codeColIdx !== -1) {
        // Nhận diện xem là định dạng QLĐT hay SIS
        const isQldtRow = tabCols.some(c => /Cơ sở|Cốt lõi|Bổ trợ|Module|ECTS|Xem chi tiết/i.test(c)) || detectedSource === 'QLDT';

        let name = '';
        let category = currentCategory;
        let credits = 3;
        let ects: number | null = null;
        let isRequired = false;
        let isLearned = false;
        let letter: LetterGrade | null = null;
        let scale4: number | null = null;
        let department = '';
        let term: number | undefined = undefined;

        if (isQldtRow && tabCols.length >= 4) {
          // Cột QLĐT: STT(0) | Mã HP(1) | Tên HP(2) | Phân loại(3) | Số TC(4) | ECTS(5) | Bắt buộc(6) | Đã học(7) | Điểm(8) | Kết quả(9)
          name = tabCols[codeColIdx + 1] || '';
          // Loại bỏ từ khóa phân loại nếu dính vào tên
          name = name.replace(/\s+(Cơ sở ngành|Cốt lõi ngành|Bổ trợ|Kiến thức bổ trợ|Module|Bắt buộc|Tự chọn)$/i, '').trim();

          category = tabCols[codeColIdx + 2] || currentCategory;
          credits = parseFloat(tabCols[codeColIdx + 3]?.replace(',', '.')) || 3;
          ects = parseFloat(tabCols[codeColIdx + 4]?.replace(',', '.')) || null;

          const reqVal = tabCols[codeColIdx + 5] || '';
          isRequired = /X|x|1|true|bắt buộc/i.test(reqVal);

          const learnedVal = tabCols[codeColIdx + 6] || '';
          isLearned = /X|x|1|true|đã học/i.test(learnedVal);

          // Cột điểm HP
          const gradeVal = tabCols[codeColIdx + 7] || '';
          if (letterGradeRegex.test(gradeVal)) {
            const m = gradeVal.match(letterGradeRegex);
            if (m) letter = m[1].toUpperCase() === 'A+' ? 'A' : (m[1].toUpperCase() as LetterGrade);
          } else if (!isNaN(parseFloat(gradeVal.replace(',', '.')))) {
            scale4 = parseFloat(gradeVal.replace(',', '.'));
          }

          if (isLearned && !letter && scale4 === null) {
            // Môn đã học trên QLĐT nhưng không hiển thị điểm chi tiết -> mặc định tính là Đạt
            scale4 = 3.0;
          }
        } else {
          // Cột SIS cũ: Mã HP | Tên HP | Kỳ | Bắt buộc | TC ĐT | TC học | Mã HP học | Ghi chú | Điểm chữ | Điểm số | Viện/Khoa
          name = tabCols[codeColIdx + 1] || '';
          name = name.replace(/\s+(Cơ sở ngành|Cốt lõi ngành|Bổ trợ|Kiến thức bổ trợ|Module|Bắt buộc|Tự chọn)$/i, '').trim();

          term = parseInt(tabCols[codeColIdx + 2]) || undefined;
          const reqVal = tabCols[codeColIdx + 3] || '';
          isRequired = !/false|0|không|uncheck/i.test(reqVal);
          credits = parseFloat(tabCols[codeColIdx + 4]?.replace(',', '.')) || 3;
          const tcHoc = parseFloat(tabCols[codeColIdx + 5]?.replace(',', '.')) || null;
          category = tabCols[codeColIdx + 7] || currentCategory;

          for (let k = codeColIdx + 8; k < tabCols.length; k++) {
            const val = tabCols[k];
            if (letterGradeRegex.test(val) && !letter) {
              const m = val.match(letterGradeRegex);
              if (m) letter = m[1].toUpperCase() === 'A+' ? 'A' : (m[1].toUpperCase() as LetterGrade);
            } else if (!isNaN(parseFloat(val.replace(',', '.'))) && scale4 === null) {
              const num = parseFloat(val.replace(',', '.'));
              if (num <= 4.0 && num >= 0) scale4 = num;
            } else if (/^[A-Z]{2,8}$/.test(val) && val !== 'TC') {
              department = val;
            }
          }

          isLearned = Boolean(letter) || (tcHoc !== null && tcHoc > 0) || (scale4 !== null && scale4 > 0);
        }

        if (letter && scale4 === null) {
          scale4 = LETTER_TO_SCALE4[letter] ?? null;
        }

        // BẢO TỒN 100% TÊN TỪ BẢNG NGUỒN - TUYỆT ĐỐI KHÔNG TỰ BỊA
        if (!name) {
          name = (KNOWN_HUST_COURSE_CATALOG as any)[rawCode]?.name || ('Học phần ' + rawCode);
        }

        const enriched = buildParsedCourse({
          code: rawCode,
          name: name.replace(/^[-:.]\s*/, ''),
          credits: Math.round(credits),
          ects,
          gradeQt: null,
          gradeCk: null,
          gradeLetter: letter,
          gradeScale4: scale4,
          term,
          isRequired,
          isLearned,
          category,
          department,
          major: parsedStudentInfo?.major
        });

        parsedCourses.push(enriched);
        seenCodes.add(rawCode);
        continue;
      }
    }

    // --- PHƯƠNG ÁN B: Phân tích dự phòng theo khoảng trắng / Regex thông minh ---
    const letterMatch = line.match(letterGradeRegex);
    let letter = letterMatch ? (letterMatch[1].toUpperCase() as LetterGrade) : null;
    if (letter === ('A+' as any)) letter = 'A';
    const scale4 = letter ? LETTER_TO_SCALE4[letter] ?? null : null;

    const numbersInLine = line.match(/\b\d+(?:[.,]\d+)?\b/g);
    let credits = 3;
    let ects: number | null = null;
    let term: number | undefined = undefined;

    if (numbersInLine) {
      const floats = numbersInLine.map(n => parseFloat(n.replace(',', '.'))).filter(n => !isNaN(n));
      if (floats.length >= 2) {
        credits = floats[0] <= 12 ? Math.round(floats[0]) : 3;
        ects = floats[1];
      } else if (floats.length === 1) {
        credits = floats[0] <= 12 ? Math.round(floats[0]) : 3;
      }
    }

    let courseName = '';
    const parts = line.split(codeMatch[0]);
    if (parts.length > 1) {
      const rest = parts[1].trim();
      const textMatch = rest.match(/^[^\d\t]+/);
      if (textMatch && textMatch[0].trim().length > 2) {
        courseName = textMatch[0].trim()
          .replace(/^[-:.]\s*/, '')
          .replace(/\s+(Cơ sở ngành|Cốt lõi ngành|Bổ trợ|Kiến thức bổ trợ|Module|Bắt buộc|Tự chọn)$/i, '')
          .trim();
      }
    }

    // Nếu không tìm thấy tên cùng dòng, thử kiểm tra dòng kế tiếp
    if (!courseName && i + 1 < lines.length) {
      const nextLine = lines[i + 1].trim();
      if (nextLine && !courseCodeRegex.test(nextLine) && !/^\d+([.,]\d+)?$/.test(nextLine)) {
        courseName = nextLine.replace(/^[-:.]\s*/, '').trim();
      }
    }

    // Bảo tồn tên học phần, tra cứu catalog chuẩn nếu chưa có
    if (!courseName) {
      courseName = (KNOWN_HUST_COURSE_CATALOG as any)[rawCode]?.name || ('Học phần ' + rawCode);
    }

    const isLearned = Boolean(letter) || (scale4 !== null && scale4 > 0);
    const isRequired = line.includes(' X ') || line.includes('\tX\t') || /bắt buộc/i.test(line);

    const enriched = buildParsedCourse({
      code: rawCode,
      name: courseName,
      credits,
      ects,
      gradeQt: null,
      gradeCk: null,
      gradeLetter: letter,
      gradeScale4: scale4,
      term,
      isRequired,
      isLearned,
      category: currentCategory,
      major: parsedStudentInfo?.major
    });

    parsedCourses.push(enriched);
    seenCodes.add(rawCode);
  }

  return {
    successCount: parsedCourses.length,
    sourceType: detectedSource,
    studentInfo: parsedStudentInfo,
    courses: parsedCourses,
    errors
  };
}

/**
 * Hàm phụ trợ phân loại học phần thông minh & tự động gán môn tiên quyết từ ngân hàng tri thức HUST
 */
function buildParsedCourse(params: {
  code: string;
  name: string;
  credits: number;
  ects?: number | null;
  gradeQt: number | null;
  gradeCk: number | null;
  gradeLetter: LetterGrade | null;
  gradeScale4: number | null;
  term?: number;
  isRequired?: boolean;
  isLearned?: boolean;
  category?: string;
  department?: string;
  major?: string;
}): ParsedCourseResult {
  const { code, name, credits, ects, gradeQt, gradeCk, gradeLetter, gradeScale4, isRequired, isLearned, category, department, major } = params;

  // 1. Nhận diện học phần Thể chất (PE) không tính CPA
  const isPhysicalEducation =
    code.startsWith('PE') ||
    /thể chất|gdtc|bơi lội|bóng đá|bóng rổ|cầu lông|bóng chuyền|bóng bàn|điền kinh|aerobic|võ thuật|gym/i.test((category || '') + ' ' + name);

  // 2. Nhận diện học phần Ngoại ngữ / Tiếng Anh (FL*)
  const isEnglishCourse =
    code.startsWith('FL') ||
    /tiếng anh|ngoại ngữ|english/i.test(name) ||
    /tiếng anh/i.test(category || '');

  // 3. Nhận diện học phần Module định hướng / Chuyên sâu (mã đầu 4 như ET4xxx, IT4xxx, EE4xxx)
  // Lưu ý: Đồ án cử nhân ET4900 / thực tập 4900 là bắt buộc cử nhân, KHÔNG PHẢI module tự chọn
  const isBachelorCapstone = /4900|4991|4992|4994|4995|4996/.test(code) || /đồ án tốt nghiệp cử nhân|thực tập kỹ thuật|thực tập tốt nghiệp/i.test(name);
  const isModuleCourse = !isBachelorCapstone && (
    /mô-?đun|module/i.test(category || '') ||
    /^[A-Z]{2,4}4\d{3}/.test(code)
  );

  // 4. Nhận diện học phần Kỹ sư chuyên sâu & Thạc sĩ (Sau ĐH / Kỳ 9-10)
  // Chỉ nhận diện khi mã >= 5000 hoặc ghi rõ thạc sĩ, sau đại học, khóa luận kỹ sư (không nhận nhầm môn module đầu 4 cử nhân)
  const isGraduateOrEngineer =
    /^[A-Z]{2,4}5\d{3}/.test(code) ||
    /thạc sĩ|sau đại học|sau đh|master/i.test((category || '') + ' ' + name) ||
    (/kỹ sư chuyên sâu|đồ án tốt nghiệp kỹ sư|khóa luận tốt nghiệp kỹ sư/i.test((category || '') + ' ' + name) && !isBachelorCapstone);

  // 5. Nhận diện khối Kiến thức bổ trợ tự chọn (tối thiểu 9 tín)
  const isElectiveSupport =
    /bổ trợ|kiến thức bổ trợ/i.test(category || '');

  // 6. Tra cứu thông tin tiên quyết & kỳ học chuẩn từ Ngân hàng tri thức Bách Khoa
  const masterInfo = findCourseMasterInfo(code, major);
  const prereqs = (masterInfo.prerequisites && masterInfo.prerequisites.length > 0)
    ? masterInfo.prerequisites
    : [];

  // Suy luận thông minh Năm học và Kỳ học từ mã số học phần chuẩn HUST
  const inferred = inferYearAndTermFromCourseCode(code, prereqs, masterInfo.term || params.term);
  const term = inferred.term;

  // 7. Học phần module là tự chọn theo nhóm, không phải bắt buộc toàn khóa
  const calculatedIsRequired = isModuleCourse ? false : (isRequired ?? true);

  // 8. Xác định trạng thái học phần
  let status: CourseStatus = 'unlocked';
  if (isLearned) {
    status = gradeLetter === 'F' ? 'failed' : 'passed';
  } else if (calculatedIsRequired) {
    status = 'planned';
  } else {
    status = 'unlocked';
  }

  // Bảo tồn 100% tên do người dùng nhập hoặc cào được - Tuyệt đối không tự bịa tên
  let finalName = (name || '').trim();
  if (!finalName || finalName === 'Học phần ' + code || finalName === code) {
    const official = (KNOWN_HUST_COURSE_CATALOG as any)[code];
    if (official?.name) {
      finalName = official.name;
    } else {
      finalName = 'Học phần ' + code;
    }
  }

  return {
    code,
    name: finalName,
    credits,
    ects: ects ?? null,
    gradeQt,
    gradeCk,
    gradeLetter,
    gradeScale4,
    term,
    isRequired: calculatedIsRequired,
    isLearned: isLearned ?? false,
    category,
    department,
    status,
    prerequisites: prereqs,
    isPhysicalEducation,
    isGraduateOrEngineer,
    isElectiveSupport,
    isModuleCourse,
    isEnglishCourse
  };
}

/**
 * Tự động làm giàu danh sách học phần nhập từ JSON bằng tri thức môn tiên quyết
 */
function enrichWithPrerequisites(c: any, major?: string): ParsedCourseResult {
  const master = findCourseMasterInfo(c.code, major);
  const prereqs = (c.prerequisites && c.prerequisites.length > 0) ? c.prerequisites : (master.prerequisites || []);

  const isBachelorCapstone = /4900|4991|4992|4994|4995|4996/.test(c.code) || /đồ án tốt nghiệp cử nhân/i.test(c.name || '');

  const isPhysicalEducation =
    c.isPhysicalEducation ?? (
      c.code.startsWith('PE') ||
      /thể chất|gdtc|bơi lội|bóng đá|bóng rổ|cầu lông|bóng chuyền|bóng bàn|điền kinh/i.test((c.category || '') + ' ' + (c.name || ''))
    );

  const isEnglishCourse =
    c.isEnglishCourse ?? (
      c.code.startsWith('FL') ||
      /tiếng anh|ngoại ngữ|english/i.test((c.category || '') + ' ' + (c.name || ''))
    );

  const isModuleCourse =
    c.isModuleCourse ?? (
      !isBachelorCapstone && (
        /mô-?đun|module/i.test(c.category || '') ||
        /^[A-Z]{2,4}4\d{3}/.test(c.code)
      )
    );

  const isGraduateOrEngineer =
    c.isGraduateOrEngineer ?? (
      /^[A-Z]{2,4}5\d{3}/.test(c.code) ||
      /thạc sĩ|sau đại học|sau đh|master/i.test((c.category || '') + ' ' + (c.name || '')) ||
      (/kỹ sư chuyên sâu|đồ án tốt nghiệp kỹ sư|khóa luận tốt nghiệp kỹ sư/i.test((c.category || '') + ' ' + (c.name || '')) && !isBachelorCapstone)
    );

  const isElectiveSupport =
    c.isElectiveSupport ?? /bổ trợ|kiến thức bổ trợ/i.test(c.category || '');

  const official = (KNOWN_HUST_COURSE_CATALOG as any)[c.code];
  const finalCourseName = (c.name && !c.name.startsWith('Học phần '))
    ? c.name
    : (official?.name || c.name || ('Học phần ' + c.code));

  return {
    code: c.code,
    name: finalCourseName,
    credits: c.credits || master.credits || 3,
    ects: c.ects ?? null,
    gradeQt: c.gradeQt ?? null,
    gradeCk: c.gradeCk ?? null,
    gradeLetter: c.gradeLetter ?? null,
    gradeScale4: c.gradeScale4 ?? null,
    term: c.term || master.term || 1,
    isRequired: c.isRequired ?? true,
    isLearned: c.isLearned ?? Boolean(c.gradeLetter || (c.gradeScale4 !== null && c.gradeScale4 > 0)),
    category: c.category || '',
    department: c.department || '',
    status: c.status || (c.gradeLetter === 'F' ? 'failed' : ((c.gradeScale4 !== null && c.gradeScale4 > 0) ? 'passed' : 'planned')),
    prerequisites: prereqs,
    isPhysicalEducation,
    isGraduateOrEngineer,
    isElectiveSupport,
    isModuleCourse,
    isEnglishCourse
  };
}

/**
 * Sinh mã Bookmarklet thông minh chạy trực tiếp trên cả QLĐT (qldt.hust.edu.vn) và SIS (sis.hust.edu.vn)
 * Tự động bóc tách các cột QLĐT: STT, Mã HP, Tên HP, Phân loại, Số TC, ECTS, Bắt buộc, Đã học, Điểm
 * Tự động nhận diện và phân loại: PE, Kỹ sư/Thạc sĩ, Bổ trợ
 */
export function generateUltraBookmarkletCode(): string {
  const script = `(function(){
    try {
      var isQldt = window.location.hostname.includes('qldt');
      var bodyText = document.body.innerText || '';
      var studentInfo = null;
      var courses = [];
      var courseMap = {};

      if (isQldt) {
        // --- BÓC TÁCH TRÊN TRANG QLĐT (qldt.hust.edu.vn) ---
        var qldtMatch = bodyText.match(/(?:Chương trình đào tạo|CTĐT):\\s*([A-Z0-9-]+)\\s*[-–]\\s*(.+?)(?:\\s*\\(([0-9]{4})\\)|\\s*[\\r\\n]|$)/i);
        if (qldtMatch) {
          var mj = qldtMatch[1].trim();
          var pn = qldtMatch[2].trim();
          var yr = parseInt(qldtMatch[3] || '2023');
          var ch = (!isNaN(yr) && yr >= 1956) ? ('K' + (yr - 1955)) : 'K68';
          studentInfo = { major: mj, programName: pn, cohort: ch, programCode: mj };
        }

        var rows = Array.from(document.querySelectorAll('table tbody tr, table tr'));
        rows.forEach(function(row){
          var cells = Array.from(row.querySelectorAll('td'));
          if (cells.length < 5) return;
          var texts = cells.map(function(c){ return (c.innerText || '').trim(); });
          
          var codeM = texts.join(' ').match(/\\b([A-Z]{2,4}(?:-[A-Z0-9]+)?\\s?[0-9]{4})\\b/);
          if (!codeM) return;
          var code = codeM[1].replace(/\\s+/g, '').toUpperCase();
          if (courseMap[code]) return;

          var codeIdx = texts.findIndex(function(t){ return t.replace(/\\s+/g, '').toUpperCase() === code; });
          if (codeIdx === -1) return;

          var name = texts[codeIdx + 1] || ('Học phần ' + code);
          var category = texts[codeIdx + 2] || '';
          var tc = parseFloat(texts[codeIdx + 3].replace(',', '.')) || 3;
          var ects = parseFloat(texts[codeIdx + 4].replace(',', '.')) || null;
          var isReq = /X|x|1|true/i.test(texts[codeIdx + 5] || '');
          var isLrn = /X|x|1|true/i.test(texts[codeIdx + 6] || '');
          var gradeVal = texts[codeIdx + 7] || '';

          var isPE = code.startsWith('PE') || /thể chất|gdtc|bơi lội|bóng đá|bóng rổ|cầu lông/i.test(category + ' ' + name);
          var isGrad = /kỹ sư|thạc sĩ|sau đại học|master/i.test(category) || /kỹ sư|thạc sĩ/i.test(name);
          var isSupp = /bổ trợ|kiến thức bổ trợ/i.test(category);

          courseMap[code] = {
            code: code,
            name: name,
            category: category,
            credits: Math.round(tc),
            ects: ects,
            isRequired: isReq,
            isLearned: isLrn,
            gradeLetter: /^[A-DF][+]?$/i.test(gradeVal) ? gradeVal.toUpperCase() : null,
            gradeScale4: !isNaN(parseFloat(gradeVal)) ? parseFloat(gradeVal) : (isLrn ? 3.0 : null),
            isPhysicalEducation: isPE,
            isGraduateOrEngineer: isGrad,
            isElectiveSupport: isSupp,
            status: isLrn ? 'passed' : (isReq ? 'planned' : 'unlocked')
          };
        });
      } else {
        // --- BÓC TÁCH TRÊN TRANG SIS (sis.hust.edu.vn) ---
        var bannerM = bodyText.match(/Chương trình\\s+(\\d+)\\s*[-–]\\s*([^\\n\\r]+?)\\s+cho sinh viên\\s+(\\d{8,10})\\s+([^\\n\\r]+)/i);
        if (bannerM) {
          var sId = bannerM[3].trim(), sName = bannerM[4].trim(), pCode = bannerM[1].trim(), pName = bannerM[2].trim();
          var yPref = parseInt(sId.substring(0, 4));
          var cohort = (!isNaN(yPref) && yPref >= 1956) ? ('K' + (yPref - 1955)) : 'K69';
          studentInfo = { studentId: sId, name: sName, programCode: pCode, programName: pName, cohort: cohort, major: 'ET1' };
        }

        var sRows = Array.from(document.querySelectorAll('tr, .dxgvDataRow_Office2010Blue, .dxgvDataRow'));
        var curCat = '';
        sRows.forEach(function(row){
          var t = (row.innerText || '').trim();
          if (/Loại HP:\\s*([^(]+)/i.test(t)) {
            var cm = t.match(/Loại HP:\\s*([^(]+)/i);
            if (cm) curCat = cm[1].trim();
          }
          var cells = Array.from(row.querySelectorAll('td'));
          if (cells.length < 4) return;
          var texts = cells.map(function(c){ return (c.innerText || '').trim(); });
          var codeM = texts.join(' ').match(/\\b([A-Z]{2,4}(?:-[A-Z0-9]+)?\\s?[0-9]{4})\\b/);
          if (!codeM) return;
          var code = codeM[1].replace(/\\s+/g, '').toUpperCase();
          if (courseMap[code]) return;
          var codeIdx = texts.findIndex(function(x){ return x.replace(/\\s+/g, '').toUpperCase() === code; });
          if (codeIdx === -1) return;

          var name = texts[codeIdx + 1] || ('Học phần ' + code);
          var tc = parseFloat(texts[codeIdx + 4]) || 3;
          var tcHoc = parseFloat(texts[codeIdx + 5]) || null;
          var isReq = true;
          var reqCell = cells[codeIdx + 3];
          if (reqCell && (reqCell.querySelector('.dxWeb_edtCheckBoxUnchecked') || reqCell.innerHTML.includes('Unchecked'))) isReq = false;

          courseMap[code] = {
            code: code,
            name: name,
            category: texts[codeIdx + 7] || curCat,
            credits: Math.round(tc),
            isRequired: isReq,
            isLearned: tcHoc !== null && tcHoc > 0,
            status: (tcHoc !== null && tcHoc > 0) ? 'passed' : 'planned'
          };
        });
      }

      courses = Object.values(courseMap);
      if (courses.length === 0) {
        alert('⚠️ Không nhận diện được học phần nào! Hãy mở trang Chương trình đào tạo (qldt.hust.edu.vn hoặc sis.hust.edu.vn).');
        return;
      }

      var payload = {
        source: isQldt ? 'HUST_QLDT' : 'HUST_SIS',
        timestamp: new Date().toISOString(),
        studentInfo: studentInfo,
        courses: courses
      };

      var jsonStr = JSON.stringify(payload, null, 2);

      // Tạo Popup Dialog nổi trên giao diện trang web
      var old = document.getElementById('hust-dash-scraper-modal');
      if (old) old.remove();

      var modal = document.createElement('div');
      modal.id = 'hust-dash-scraper-modal';
      modal.style.position = 'fixed';
      modal.style.top = '20px';
      modal.style.right = '20px';
      modal.style.zIndex = '999999';
      modal.style.backgroundColor = '#0f172a';
      modal.style.color = '#fff';
      modal.style.padding = '20px';
      modal.style.borderRadius = '16px';
      modal.style.boxShadow = '0 25px 60px rgba(0,0,0,0.85), 0 0 0 2px #dc2626';
      modal.style.maxWidth = '450px';
      modal.style.fontFamily = 'system-ui, -apple-system, sans-serif';

      var infoHtml = studentInfo 
        ? '<div style="background:#1e293b;padding:8px 12px;border-radius:10px;margin-bottom:12px;font-size:12px;border-left:3px solid #ef4444;">' +
            '<strong style="color:#f87171;">' + (studentInfo.major || studentInfo.name) + '</strong> • ' + studentInfo.cohort + '<br>' +
            '<span style="color:#94a3b8;">' + (studentInfo.programName || '') + '</span>' +
          '</div>'
        : '';

      modal.innerHTML = 
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
          '<h3 style="margin:0;font-size:16px;font-weight:bold;color:#f87171;">🎉 Cào CTĐT ' + (isQldt ? 'QLĐT' : 'SIS') + ' Thành Công!</h3>' +
          '<button id="hust-close-btn" style="background:#334155;color:#fff;border:none;border-radius:6px;padding:4px 8px;cursor:pointer;">✕</button>' +
        '</div>' +
        infoHtml +
        '<p style="font-size:12px;color:#94a3b8;margin:0 0 10px 0;">Đã trích xuất <strong style="color:#4ade80;">' + courses.length + ' học phần</strong> (đã phân loại PE, Bổ trợ, Kỹ sư). Chọn thao tác bên dưới:</p>' +
        '<div style="display:flex;gap:8px;margin-bottom:10px;">' +
          '<button id="hust-copy-btn" style="flex:1;background:#dc2626;color:#fff;border:none;border-radius:8px;padding:10px;font-weight:bold;font-size:12px;cursor:pointer;">📋 Sao Chép JSON</button>' +
          '<button id="hust-dl-btn" style="flex:1;background:#2563eb;color:#fff;border:none;border-radius:8px;padding:10px;font-weight:bold;font-size:12px;cursor:pointer;">💾 Tải File JSON</button>' +
        '</div>' +
        '<textarea id="hust-json-area" style="width:100%;height:110px;background:#020617;color:#38bdf8;border:1px solid #334155;border-radius:8px;padding:8px;font-size:10px;font-family:monospace;box-sizing:border-box;" readonly>' + jsonStr + '</textarea>';

      document.body.appendChild(modal);

      document.getElementById('hust-close-btn').onclick = function(){ modal.remove(); };

      document.getElementById('hust-copy-btn').onclick = function(){
        var area = document.getElementById('hust-json-area');
        area.select();
        navigator.clipboard.writeText(jsonStr).then(function(){
          alert('✅ Đã sao chép vào Clipboard! Hãy mở HUST Dashboard và dán vào tab Nhập SIS/QLĐT.');
        }).catch(function(){
          document.execCommand('copy');
          alert('✅ Đã sao chép! Hãy mở HUST Dashboard và dán vào ô Import.');
        });
      };

      document.getElementById('hust-dl-btn').onclick = function(){
        var blob = new Blob([jsonStr], {type:'application/json'});
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (isQldt ? 'hust_qldt_' : 'hust_sis_') + Date.now() + '.json';
        a.click();
      };

    } catch(err) {
      alert('Lỗi: ' + err.message);
    }
  })();`;

  return 'javascript:' + encodeURIComponent(script.replace(/\s+/g, ' ').trim());
}

/**
 * Đoạn mã chạy trên DevTools Console (F12) cho QLĐT & SIS HUST
 */
export function getConsoleScriptCode(): string {
  return `(function(){
  var isQldt = window.location.hostname.includes('qldt');
  var bodyText = document.body.innerText || '';
  var studentInfo = null;
  var courseMap = {};

  if (isQldt) {
    var qldtMatch = bodyText.match(/(?:Chương trình đào tạo|CTĐT):\\s*([A-Z0-9-]+)\\s*[-–]\\s*(.+?)(?:\\s*\\(([0-9]{4})\\)|\\s*[\\r\\n]|$)/i);
    if (qldtMatch) {
      var mj = qldtMatch[1].trim(), pn = qldtMatch[2].trim(), yr = parseInt(qldtMatch[3] || '2023');
      var ch = (!isNaN(yr) && yr >= 1956) ? ('K' + (yr - 1955)) : 'K68';
      studentInfo = { major: mj, programName: pn, cohort: ch, programCode: mj };
    }

    var rows = Array.from(document.querySelectorAll('table tbody tr, table tr'));
    rows.forEach(function(row){
      var cells = Array.from(row.querySelectorAll('td'));
      if (cells.length < 5) return;
      var texts = cells.map(function(c){ return (c.innerText || '').trim(); });
      var codeM = texts.join(' ').match(/\\b([A-Z]{2,4}(?:-[A-Z0-9]+)?\\s?[0-9]{4})\\b/);
      if (!codeM) return;
      var code = codeM[1].replace(/\\s+/g, '').toUpperCase();
      if (courseMap[code]) return;
      var codeIdx = texts.findIndex(function(t){ return t.replace(/\\s+/g, '').toUpperCase() === code; });
      if (codeIdx === -1) return;

      var name = texts[codeIdx + 1] || ('Học phần ' + code);
      var category = texts[codeIdx + 2] || '';
      var tc = parseFloat(texts[codeIdx + 3].replace(',', '.')) || 3;
      var ects = parseFloat(texts[codeIdx + 4].replace(',', '.')) || null;
      var isReq = /X|x|1|true/i.test(texts[codeIdx + 5] || '');
      var isLrn = /X|x|1|true/i.test(texts[codeIdx + 6] || '');
      var gradeVal = texts[codeIdx + 7] || '';

      var isPE = code.startsWith('PE') || /thể chất|gdtc|bơi lội|bóng đá|bóng rổ|cầu lông/i.test(category + ' ' + name);
      var isGrad = /kỹ sư|thạc sĩ|sau đại học|master/i.test(category) || /kỹ sư|thạc sĩ/i.test(name);
      var isSupp = /bổ trợ|kiến thức bổ trợ/i.test(category);

      courseMap[code] = {
        code: code,
        name: name,
        category: category,
        credits: Math.round(tc),
        ects: ects,
        isRequired: isReq,
        isLearned: isLrn,
        gradeLetter: /^[A-DF][+]?$/i.test(gradeVal) ? gradeVal.toUpperCase() : null,
        gradeScale4: !isNaN(parseFloat(gradeVal)) ? parseFloat(gradeVal) : (isLrn ? 3.0 : null),
        isPhysicalEducation: isPE,
        isGraduateOrEngineer: isGrad,
        isElectiveSupport: isSupp,
        status: isLrn ? 'passed' : (isReq ? 'planned' : 'unlocked')
      };
    });
  } else {
    var bannerM = bodyText.match(/Chương trình\\s+(\\d+)\\s*[-–]\\s*([^\\n\\r]+?)\\s+cho sinh viên\\s+(\\d{8,10})\\s+([^\\n\\r]+)/i);
    if (bannerM) {
      studentInfo = { studentId: bannerM[3].trim(), name: bannerM[4].trim(), programCode: bannerM[1].trim(), programName: bannerM[2].trim(), cohort: 'K69', major: 'ET1' };
    }
  }

  var courses = Object.values(courseMap);
  var payload = { source: isQldt ? 'HUST_QLDT' : 'HUST_SIS', timestamp: new Date().toISOString(), studentInfo: studentInfo, courses: courses };
  var jsonStr = JSON.stringify(payload, null, 2);
  copy(jsonStr);
  console.log('✅ HUST Scraper:', payload);
  alert('🎉 Đã cào thành công ' + courses.length + ' môn học từ ' + (isQldt ? 'QLĐT' : 'SIS') + ' và copy vào Clipboard! Mở Dashboard để dán.');
})();`;
}

/**
 * Xuất dữ liệu State sang file JSON tải về
 */
export function exportStateToJson(state: DashboardState): void {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hust_dashboard_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Kiểm tra tính hợp lệ của file JSON nhập vào
 */
export function validateStateJson(jsonStr: string): DashboardState | null {
  try {
    const data = JSON.parse(jsonStr) as DashboardState;
    if (!data.version || !data.studentInfo || !Array.isArray(data.deadlines) || !Array.isArray(data.courses)) {
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
}
