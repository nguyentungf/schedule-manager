/**
 * Trình phân tích chuyên dụng cho trang Danh sách học phần & HP Điều kiện HUST:
 * https://ctt-sis.hust.edu.vn/pub/CourseLists.aspx
 *
 * Cấu trúc 9 cột chuẩn:
 * Mã học phần | Tên học phần | Thời lượng | Số tín chỉ | TC học phí | Viện quản lý | HP điều kiện | Tên tiếng anh | Trọng số
 * Kèm khối Mục tiêu & Nội dung học phần
 */

export interface CourseCatalogItem {
  code: string;
  name: string;
  duration?: string;              // VD: 3(3-0-1-6)
  credits: number;                // Số TC (VD: 3)
  tuitionCredits?: number | null; // TC học phí (VD: 4.5)
  department?: string;            // Viện quản lý (VD: TDDT)
  conditionString: string;        // Biểu thức HP điều kiện gốc
  prerequisiteOptions: string[][]; // Các phương án thỏa mãn (phân cách bởi dấu /)
  distinctPrerequisites: string[]; // Danh sách duy nhất các mã môn cần
  englishName?: string;           // Tên tiếng Anh (VD: Circuit Theory)
  weightCk: number;               // Trọng số cuối kỳ (VD: 0.7)
  weightQt: number;               // Trọng số quá trình = 1 - weightCk (VD: 0.3)
  objectives?: string;            // Mục tiêu học phần
  content?: string;               // Nội dung học phần
}

export interface CourseCatalogReport {
  successCount: number;
  items: CourseCatalogItem[];
  errors: string[];
}

/**
 * Ngân hàng dữ liệu các học phần tiêu biểu của ĐHBK Hà Nội
 * Dùng làm mỏ neo dự phòng khi người dùng tra cứu nhanh 1 mã môn (VD: ET2050)
 */
export const KNOWN_HUST_COURSE_CATALOG: Record<string, Partial<CourseCatalogItem>> = {
  ET2050: {
    code: 'ET2050',
    name: 'Lý thuyết mạch',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(MI1111,MI1121,MI1131,PH1122)/(MI1111,MI1121,MI1131,PH1121)/(MI1111,MI1121,MI1131,PH1120)',
    distinctPrerequisites: ['MI1111', 'MI1121', 'MI1131', 'PH1122', 'PH1121', 'PH1120'],
    englishName: 'Circuit Theory',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET2050E: {
    code: 'ET2050E',
    name: 'Lý thuyết mạch',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(MI1111,MI1121,MI1131,PH1122)/(MI1111,MI1121,MI1131,PH1121)',
    distinctPrerequisites: ['MI1111', 'MI1121', 'MI1131', 'PH1122', 'PH1121'],
    englishName: 'Circuit Theory',
    weightCk: 0.6,
    weightQt: 0.4
  },
  ET2050Q: {
    code: 'ET2050Q',
    name: 'Lý thuyết mạch',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(MI1111,MI1121,MI1131,PH1120)',
    distinctPrerequisites: ['MI1111', 'MI1121', 'MI1131', 'PH1120'],
    englishName: 'Electrical Circuit Theory',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET2000: {
    code: 'ET2000',
    name: 'Tín hiệu và Hệ thống',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(MI1111)',
    distinctPrerequisites: ['MI1111'],
    englishName: 'Signals and Systems',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET2010: {
    code: 'ET2010',
    name: 'Kỹ thuật điện tử tương tự',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(ET2000)/(ET2050)',
    distinctPrerequisites: ['ET2000', 'ET2050'],
    englishName: 'Analog Electronics',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET2020: {
    code: 'ET2020',
    name: 'Kỹ thuật điện tử số',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(ET2000)',
    distinctPrerequisites: ['ET2000'],
    englishName: 'Digital Electronics',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET3241: {
    code: 'ET3241',
    name: 'Điện tử tương tự II',
    duration: '2(2-0-1-4)',
    credits: 2,
    tuitionCredits: 3.0,
    department: 'TDDT',
    conditionString: '(ET2010)',
    distinctPrerequisites: ['ET2010'],
    englishName: 'Analog Electronics II',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET3250: {
    code: 'ET3250',
    name: 'Thông tin số',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(ET2000,MI2020)',
    distinctPrerequisites: ['ET2000', 'MI2020'],
    englishName: 'Digital Communications',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET3300: {
    code: 'ET3300',
    name: 'Kỹ thuật vi xử lý',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(ET2020)',
    distinctPrerequisites: ['ET2020'],
    englishName: 'Microprocessor Engineering',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET3010: {
    code: 'ET3010',
    name: 'Xử lý tín hiệu số (DSP)',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(ET2000)',
    distinctPrerequisites: ['ET2000'],
    englishName: 'Digital Signal Processing',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET3210: {
    code: 'ET3210',
    name: 'Trường điện từ và anten',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(MI1121,PH1110)',
    distinctPrerequisites: ['MI1121', 'PH1110'],
    englishName: 'Electromagnetic Fields and Antennas',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET3220: {
    code: 'ET3220',
    name: 'Mạch cao tần',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(ET2010,ET3210)',
    distinctPrerequisites: ['ET2010', 'ET3210'],
    englishName: 'High Frequency Circuits',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET3230: {
    code: 'ET3230',
    name: 'Kỹ thuật thông tin quang',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(ET3210)',
    distinctPrerequisites: ['ET3210'],
    englishName: 'Optical Communication Engineering',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET3290: {
    code: 'ET3290',
    name: 'Mạng truyền thông số liệu',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(ET3250)',
    distinctPrerequisites: ['ET3250'],
    englishName: 'Data Communication Networks',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET4010: {
    code: 'ET4010',
    name: 'Hệ thống thông tin di động',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(ET3250)',
    distinctPrerequisites: ['ET3250'],
    englishName: 'Mobile Communication Systems',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET4220: {
    code: 'ET4220',
    name: 'Thiết kế hệ thống nhúng',
    duration: '3(3-0-1-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(ET3300)',
    distinctPrerequisites: ['ET3300'],
    englishName: 'Embedded System Design',
    weightCk: 0.7,
    weightQt: 0.3
  },
  ET4900: {
    code: 'ET4900',
    name: 'Thực tập kỹ thuật',
    duration: '3(0-0-6-6)',
    credits: 3,
    tuitionCredits: 4.5,
    department: 'TDDT',
    conditionString: '(ET3990)',
    distinctPrerequisites: ['ET3990'],
    englishName: 'Engineering Internship',
    weightCk: 0.5,
    weightQt: 0.5
  },
  ET4990: {
    code: 'ET4990',
    name: 'Đồ án tốt nghiệp Cử nhân',
    duration: '6(0-0-12-12)',
    credits: 6,
    tuitionCredits: 9.0,
    department: 'TDDT',
    conditionString: '(ET4900)',
    distinctPrerequisites: ['ET4900'],
    englishName: 'Bachelor Graduation Project',
    weightCk: 0.5,
    weightQt: 0.5
  },
  MI1111: {
    code: 'MI1111',
    name: 'Giải tích 1',
    duration: '4(3-2-0-8)',
    credits: 4,
    tuitionCredits: 4.0,
    department: 'SAMI',
    conditionString: 'Không',
    distinctPrerequisites: [],
    englishName: 'Calculus I',
    weightCk: 0.7,
    weightQt: 0.3
  },
  MI1121: {
    code: 'MI1121',
    name: 'Giải tích 2',
    duration: '3(2-2-0-6)',
    credits: 3,
    tuitionCredits: 3.0,
    department: 'SAMI',
    conditionString: '(MI1111)',
    distinctPrerequisites: ['MI1111'],
    englishName: 'Calculus II',
    weightCk: 0.7,
    weightQt: 0.3
  },
  MI1141: {
    code: 'MI1141',
    name: 'Đại số',
    duration: '4(3-2-0-8)',
    credits: 4,
    tuitionCredits: 4.0,
    department: 'SAMI',
    conditionString: 'Không',
    distinctPrerequisites: [],
    englishName: 'Algebra',
    weightCk: 0.7,
    weightQt: 0.3
  },
  PH1110: {
    code: 'PH1110',
    name: 'Vật lý đại cương I',
    duration: '3(2-1-1-6)',
    credits: 3,
    tuitionCredits: 3.0,
    department: 'SEP',
    conditionString: 'Không',
    distinctPrerequisites: [],
    englishName: 'General Physics I',
    weightCk: 0.7,
    weightQt: 0.3
  },
  PH1120: {
    code: 'PH1120',
    name: 'Vật lý đại cương II',
    duration: '3(2-1-1-6)',
    credits: 3,
    tuitionCredits: 3.0,
    department: 'SEP',
    conditionString: '(PH1110)',
    distinctPrerequisites: ['PH1110'],
    englishName: 'General Physics II',
    weightCk: 0.7,
    weightQt: 0.3
  }
};

/**
 * Bóc tách chuỗi HP điều kiện phức tạp của HUST
 * VD: (MI1111,MI1121,MI1131,PH1122)/(MI1111,MI1121,MI1131,PH1121)/(MI1111,MI1121,MI1131,PH1120)
 * Dấu / là HOẶC (OR)
 * Dấu , là VÀ (AND)
 */
export function parseHustConditionString(conditionStr: string): {
  prerequisiteOptions: string[][];
  distinctPrerequisites: string[];
} {
  const trimmed = conditionStr.trim();
  if (!trimmed || trimmed === '-' || trimmed === 'Không' || trimmed === 'none' || trimmed === 'None') {
    return { prerequisiteOptions: [], distinctPrerequisites: [] };
  }

  // Tách theo dấu / (tổ hợp OR)
  const branches = trimmed.split('/');
  const options: string[][] = [];
  const distinctSet = new Set<string>();

  for (const branch of branches) {
    const codesInBranch = branch.match(/[A-Z]{2,4}[0-9]{4}[A-Z0-9]*/gi) || [];
    const normalized = Array.from(new Set(codesInBranch.map(c => c.toUpperCase())));
    if (normalized.length > 0) {
      options.push(normalized);
      normalized.forEach(c => distinctSet.add(c));
    }
  }

  return {
    prerequisiteOptions: options,
    distinctPrerequisites: Array.from(distinctSet)
  };
}

/**
 * Phân tích dữ liệu văn bản từ trang ctt-sis.hust.edu.vn/pub/CourseLists.aspx
 * Hỗ trợ linh hoạt:
 * 1. Dạng JSON
 * 2. Dạng copy Tab-separated (1 hàng 1 môn)
 * 3. Dạng copy Newline-separated (mỗi ô 1 dòng - phổ biến khi copy từ trình duyệt)
 * 4. Tra cứu nhanh một hoặc nhiều mã môn (VD chỉ dán "ET2050")
 */
export function parseCourseCatalogText(rawText: string): CourseCatalogReport {
  const trimmed = rawText.trim();
  const errors: string[] = [];
  const items: CourseCatalogItem[] = [];
  const seenCodes = new Set<string>();

  if (!trimmed) {
    return { successCount: 0, items: [], errors: [] };
  }

  // 1. Kiểm tra nếu là JSON từ Bookmarklet / Console Script
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      const parsed = JSON.parse(trimmed);
      const list = Array.isArray(parsed) ? parsed : (parsed.courses || parsed.items || []);
      for (const raw of list) {
        const rawCode = (raw.code || '').toUpperCase().trim();
        if (!rawCode || seenCodes.has(rawCode)) continue;

        const cond = parseHustConditionString(raw.conditionString || raw.condition || raw.prerequisitesString || '');
        const ck = parseFloat(raw.weightCk) || 0.7;
        const qt = Math.round((1 - ck) * 10) / 10;

        items.push({
          code: rawCode,
          name: raw.name || ('Học phần ' + rawCode),
          duration: raw.duration || '',
          credits: parseInt(raw.credits) || 3,
          tuitionCredits: parseFloat(raw.tuitionCredits) || null,
          department: raw.department || '',
          conditionString: raw.conditionString || '',
          prerequisiteOptions: cond.prerequisiteOptions,
          distinctPrerequisites: cond.distinctPrerequisites.length > 0 ? cond.distinctPrerequisites : (raw.prerequisites || []),
          englishName: raw.englishName || '',
          weightCk: ck,
          weightQt: qt,
          objectives: raw.objectives || '',
          content: raw.content || ''
        });
        seenCodes.add(rawCode);
      }
      return { successCount: items.length, items, errors: [] };
    } catch (e) {
      // Tiếp tục phân tích text thuần
    }
  }

  // 2. Phân tích theo từng dòng
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 2.A: Kiểm tra nếu là copy bảng Tab-delimited (1 dòng chứa nhiều cột cách bởi Tab)
  const hasTabs = lines.some(l => l.split('\t').length >= 4);

  if (hasTabs) {
    for (const line of lines) {
      if (/mã học phần/i.test(line) && /tên học phần/i.test(line)) continue;
      if (/danh sách học phần/i.test(line) || /tìm theo viện/i.test(line)) continue;

      const cols = line.split('\t').map(c => c.trim());
      // Tìm cột mã môn
      const codeIdx = cols.findIndex(c => /^[A-Z]{2,4}[0-9]{4}[A-Z0-9]*$/i.test(c));
      if (codeIdx !== -1) {
        const rawCode = cols[codeIdx].toUpperCase();
        if (seenCodes.has(rawCode)) continue;

        const name = cols[codeIdx + 1] || ('Học phần ' + rawCode);
        const duration = cols[codeIdx + 2] || '';
        const credits = parseInt(cols[codeIdx + 3]) || 3;
        const tuitionCredits = parseFloat(cols[codeIdx + 4]?.replace(',', '.')) || null;
        const department = cols[codeIdx + 5] || '';
        const conditionRaw = cols[codeIdx + 6] || '';
        const englishName = cols[codeIdx + 7] || '';
        const weightCkRaw = parseFloat(cols[codeIdx + 8]?.replace(',', '.')) || 0.7;
        const weightQt = Math.round((1 - weightCkRaw) * 10) / 10;

        const condParsed = parseHustConditionString(conditionRaw);

        items.push({
          code: rawCode,
          name,
          duration,
          credits,
          tuitionCredits,
          department,
          conditionString: conditionRaw,
          prerequisiteOptions: condParsed.prerequisiteOptions,
          distinctPrerequisites: condParsed.distinctPrerequisites,
          englishName,
          weightCk: weightCkRaw,
          weightQt,
          objectives: '',
          content: ''
        });

        seenCodes.add(rawCode);
      }
    }
  }

  // 2.B: Phân tích Cell-Stream (Newline-separated)
  // Khi copy từ bảng HTML trong Chrome, mỗi ô của bảng thường nằm trên 1 dòng riêng biệt:
  // Dòng 1: ET2050
  // Dòng 2: Lý thuyết mạch
  // Dòng 3: 3(3-0-1-6)
  // Dòng 4: 3
  // Dòng 5: 4.5
  // Dòng 6: TDDT
  // Dòng 7: (MI1111,MI1121...)/(...)
  // Dòng 8: Circuit Theory
  // Dòng 9: 0.7
  if (items.length === 0) {
    // Tìm các vị trí dòng là mã học phần
    const courseCodeRegex = /^[A-Z]{2,4}[0-9]{4}[A-Z0-9]*$/i;
    const codeIndices: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      if (courseCodeRegex.test(lines[i])) {
        // Loại bỏ các từ khóa giả
        if (!/^(STT|MSV|CPA|GPA|ECTS)$/i.test(lines[i])) {
          codeIndices.push(i);
        }
      }
    }

    if (codeIndices.length > 0) {
      for (let k = 0; k < codeIndices.length; k++) {
        const startIdx = codeIndices[k];
        const endIdx = k + 1 < codeIndices.length ? codeIndices[k + 1] : lines.length;
        const block = lines.slice(startIdx, endIdx);

        const rawCode = block[0].toUpperCase();
        if (seenCodes.has(rawCode)) continue;

        let name = 'Học phần ' + rawCode;
        let duration = '';
        let credits = 3;
        let tuitionCredits: number | null = null;
        let department = '';
        let conditionString = '';
        let englishName = '';
        let weightCk = 0.7;

        // Bóc tách từng phần tử trong block
        // Nếu block có từ 6 đến 12 dòng (chuẩn CourseLists 9 cột)
        if (block.length >= 6) {
          name = block[1] || name;
          duration = block[2] || '';
          credits = parseInt(block[3]) || 3;
          tuitionCredits = parseFloat(block[4]?.replace(',', '.')) || null;
          department = block[5] || '';
          conditionString = block[6] || '';
          englishName = block[7] || '';
          weightCk = parseFloat(block[8]?.replace(',', '.')) || 0.7;
        } else {
          // Block ngắn (chỉ có vài dòng hoặc thông tin vắn tắt)
          for (let b = 1; b < block.length; b++) {
            const val = block[b];
            if (/\d\(\d-\d-\d-\d\)/.test(val)) {
              duration = val;
            } else if (/\([A-Z0-9,()/]+\)/.test(val)) {
              conditionString = val;
            } else if (/^0\.[5-8]$/.test(val)) {
              weightCk = parseFloat(val);
            } else if (/^[A-Z]{2,6}$/.test(val) && !department) {
              department = val;
            } else if (!name || name === 'Học phần ' + rawCode) {
              name = val;
            } else if (!englishName && /[a-zA-Z\s]{4,}/.test(val)) {
              englishName = val;
            }
          }
        }

        // Nếu thiếu điều kiện hoặc tên, tra cứu mỏ neo từ điển KNOWN_HUST_COURSE_CATALOG
        const known = KNOWN_HUST_COURSE_CATALOG[rawCode];
        if (known) {
          if (!conditionString || conditionString === 'Không' || conditionString === '-') {
            conditionString = known.conditionString || conditionString;
          }
          if (name === 'Học phần ' + rawCode && known.name) {
            name = known.name;
          }
          if (!duration && known.duration) duration = known.duration;
          if (credits === 3 && known.credits) credits = known.credits;
          if (tuitionCredits === null && known.tuitionCredits) tuitionCredits = known.tuitionCredits;
          if (!department && known.department) department = known.department;
          if (!englishName && known.englishName) englishName = known.englishName;
          if (known.weightCk) weightCk = known.weightCk;
        }

        const condParsed = parseHustConditionString(conditionString);
        const weightQt = Math.round((1 - weightCk) * 10) / 10;

        items.push({
          code: rawCode,
          name,
          duration,
          credits,
          tuitionCredits,
          department,
          conditionString,
          prerequisiteOptions: condParsed.prerequisiteOptions,
          distinctPrerequisites: condParsed.distinctPrerequisites.length > 0
            ? condParsed.distinctPrerequisites
            : (known?.distinctPrerequisites || []),
          englishName,
          weightCk,
          weightQt,
          objectives: '',
          content: ''
        });

        seenCodes.add(rawCode);
      }
    }
  }

  // 2.C: Dự phòng nếu người dùng chỉ dán chuỗi tự do có chứa các mã môn (VD "ET2050", "ET3250")
  if (items.length === 0) {
    const allCodes = Array.from(new Set(rawText.match(/\b([A-Z]{2,4}[0-9]{4}[A-Z0-9]*)\b/gi) || []));
    for (const raw of allCodes) {
      const norm = raw.toUpperCase();
      if (seenCodes.has(norm)) continue;
      if (/^(STT|MSV|CPA|GPA|ECTS)$/i.test(norm)) continue;

      const known = KNOWN_HUST_COURSE_CATALOG[norm];
      const condStr = known?.conditionString || '';
      const condParsed = parseHustConditionString(condStr);
      const ck = known?.weightCk || 0.7;

      items.push({
        code: norm,
        name: known?.name || ('Học phần ' + norm),
        duration: known?.duration || '',
        credits: known?.credits || 3,
        tuitionCredits: known?.tuitionCredits || null,
        department: known?.department || '',
        conditionString: condStr,
        prerequisiteOptions: condParsed.prerequisiteOptions,
        distinctPrerequisites: condParsed.distinctPrerequisites.length > 0
          ? condParsed.distinctPrerequisites
          : (known?.distinctPrerequisites || []),
        englishName: known?.englishName || '',
        weightCk: ck,
        weightQt: Math.round((1 - ck) * 10) / 10,
        objectives: '',
        content: ''
      });

      seenCodes.add(norm);
    }
  }

  return {
    successCount: items.length,
    items,
    errors
  };
}

/**
 * Sinh mã Bookmarklet 1-click cho trang ctt-sis.hust.edu.vn/pub/CourseLists.aspx
 */
export function generateCourseListsBookmarklet(): string {
  const script = `(function(){
    try {
      var rows = Array.from(document.querySelectorAll('table tr')).filter(function(r){
        return r.cells && r.cells.length >= 7;
      });
      if (!rows.length) {
        alert('Vui lòng mở đúng trang Danh sách học phần: https://ctt-sis.hust.edu.vn/pub/CourseLists.aspx');
        return;
      }
      var results = [];
      rows.forEach(function(row){
        var cells = Array.from(row.cells).map(function(c){ return c.innerText.trim(); });
        var codeMatch = cells[0] && cells[0].match(/^[A-Z]{2,4}[0-9]{4}[A-Z0-9]*/);
        if (codeMatch) {
          results.push({
            code: codeMatch[0],
            name: cells[1] || '',
            duration: cells[2] || '',
            credits: parseInt(cells[3]) || 3,
            tuitionCredits: parseFloat((cells[4]||'').replace(',', '.')) || null,
            department: cells[5] || '',
            conditionString: cells[6] || '',
            englishName: cells[7] || '',
            weightCk: parseFloat((cells[8]||'').replace(',', '.')) || 0.7
          });
        }
      });
      var jsonStr = JSON.stringify(results, null, 2);
      navigator.clipboard.writeText(jsonStr).then(function(){
        alert('Đã trích xuất và sao chép thành công ' + results.length + ' học phần kèm điều kiện tiên quyết vào bộ nhớ tạm!');
      }).catch(function(){
        prompt('Sao chép dữ liệu JSON dưới đây:', jsonStr);
      });
    } catch(err) {
      alert('Lỗi: ' + err.message);
    }
  })();`;

  return `javascript:${encodeURIComponent(script)}`;
}

/**
 * Mã script F12 Console cho trang ctt-sis.hust.edu.vn/pub/CourseLists.aspx
 */
export function getCourseListsConsoleScript(): string {
  return `(function(){
  var rows = Array.from(document.querySelectorAll('table tr')).filter(r => r.cells && r.cells.length >= 7);
  var results = [];
  rows.forEach(row => {
    var cells = Array.from(row.cells).map(c => c.innerText.trim());
    var codeMatch = cells[0] && cells[0].match(/^[A-Z]{2,4}[0-9]{4}[A-Z0-9]*/);
    if (codeMatch) {
      results.push({
        code: codeMatch[0],
        name: cells[1] || '',
        duration: cells[2] || '',
        credits: parseInt(cells[3]) || 3,
        tuitionCredits: parseFloat((cells[4]||'').replace(',', '.')) || null,
        department: cells[5] || '',
        conditionString: cells[6] || '',
        englishName: cells[7] || '',
        weightCk: parseFloat((cells[8]||'').replace(',', '.')) || 0.7
      });
    }
  });
  console.log('✅ Đã trích xuất ' + results.length + ' học phần:');
  console.log(JSON.stringify(results, null, 2));
  copy(JSON.stringify(results, null, 2));
  alert('Đã sao chép ' + results.length + ' học phần vào Clipboard! Hãy quay lại Dashboard và dán vào ô nhập liệu.');
})();`;
}
