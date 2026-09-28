import { Curriculum, Course } from '../../types/course';
import { IT1_CURRICULUM } from './it1';
import { IT2_CURRICULUM } from './it2';
import { EE1_CURRICULUM } from './ee1';
import { EE2_CURRICULUM } from './ee2';
import { ET1_CURRICULUM } from './et1';
import { ET2_CURRICULUM } from './et2';
import { ET_E4_CURRICULUM } from './et_e4';
import { ET_E5_CURRICULUM } from './et_e5';
import { ET_E16_CURRICULUM } from './et_e16';

export const BUILT_IN_CURRICULA: Record<string, Curriculum> = {
  IT1: IT1_CURRICULUM,
  IT2: IT2_CURRICULUM,
  EE1: EE1_CURRICULUM,
  EE2: EE2_CURRICULUM,
  ET1: ET1_CURRICULUM,
  ET2: ET2_CURRICULUM,
  'ET-E4': ET_E4_CURRICULUM,
  'ET-E5': ET_E5_CURRICULUM,
  'ET-E16': ET_E16_CURRICULUM,
};

export const AVAILABLE_MAJORS = [
  { code: 'IT1', name: 'IT1 - Khoa học Máy tính', faculty: 'Trường CNTT&TT' },
  { code: 'IT2', name: 'IT2 - Kỹ thuật Máy tính', faculty: 'Trường CNTT&TT' },
  { code: 'EE1', name: 'EE1 - Kỹ thuật Điện', faculty: 'Trường Điện - Điện tử' },
  { code: 'EE2', name: 'EE2 - Kỹ thuật Điều khiển & Tự động hóa', faculty: 'Trường Điện - Điện tử' },
  { code: 'ET1', name: 'ET1 - Kỹ thuật Điện tử - Viễn thông', faculty: 'Trường Điện - Điện tử' },
  { code: 'ET2', name: 'ET2 - Kỹ thuật Y sinh', faculty: 'Trường Điện - Điện tử' },
  { code: 'ET-E4', name: 'ET-E4 - CTTT Kỹ thuật Điện tử - Viễn thông (Elitech)', faculty: 'Trường Điện - Điện tử' },
  { code: 'ET-E5', name: 'ET-E5 - CTTT Kỹ thuật Y sinh (Elitech)', faculty: 'Trường Điện - Điện tử' },
  { code: 'ET-E9', name: 'ET-E9 - CTTT Hệ thống Nhúng & IoT (Elitech)', faculty: 'Trường Điện - Điện tử' },
  { code: 'ET-E16', name: 'ET-E16 - CTTT Truyền thông số & Đa phương tiện (Elitech)', faculty: 'Trường Điện - Điện tử' },
];

export function getCurriculum(code: string): Curriculum {
  return BUILT_IN_CURRICULA[code] || IT1_CURRICULUM;
}

/**
 * Từ điển tra cứu điều kiện tiên quyết chuẩn ĐHBK Hà Nội (HUST Prerequisite Knowledge Base)
 * Dùng để tự động điền học phần tiên quyết khi cào dữ liệu từ bảng tổng quan QLĐT hoặc SIS
 */
export const HUST_PREREQUISITE_MAP: Record<string, string[]> = {
  // --- TOÁN VÀ KHOA HỌC CƠ BẢN ---
  MI1111: [],
  MI1141: [],
  MI1121: ['MI1111'],
  MI1131: ['MI1121'],
  MI2020: ['MI1121'],
  PH1110: [],
  PH1120: ['PH1110'],
  IT1110: [],

  // --- ĐIỆN TỬ - VIỄN THÔNG (ET1, ET2, ET-E4, ET-E5, ET-E16) ---
  ET2050: ['MI1111'], // Lý thuyết mạch
  ET2000: ['MI1111'], // Tín hiệu và hệ thống
  ET2010: ['ET2050'], // Điện tử tương tự
  ET2020: ['ET2000'], // Điện tử số
  ET2022: [], // Technical Writing & Presentation (Bổ trợ)
  ET3241: ['ET2010'], // Điện tử tương tự II
  ET3010: ['ET2000'], // Xử lý tín hiệu số (DSP)
  ET3210: ['MI1121', 'PH1110'], // Trường điện từ và Anten
  ET3300: ['ET2020'], // Kỹ thuật vi xử lý
  ET3250: ['ET2000', 'MI2020'], // Thông tin số
  ET3220: ['ET2010', 'ET3210'], // Mạch cao tần
  ET3230: ['ET3210'], // Kỹ thuật thông tin quang
  ET3290: ['ET3250'], // Mạng truyền thông số liệu
  ET3262: [], // Tư duy công nghệ và thiết kế kỹ thuật (Bổ trợ)
  ET3990: ['ET3300'], // Đồ án thiết kế kỹ thuật
  ET4010: ['ET3250'], // Hệ thống thông tin di động
  ET4220: ['ET3300'], // Thiết kế hệ thống nhúng
  ET4110: ['ET3010'], // Thị giác máy tính & Xử lý ảnh
  ET4900: ['ET3990'], // Thực tập kỹ thuật
  ET4990: ['ET4900'], // Đồ án tốt nghiệp Cử nhân
  ET4999: ['ET4900'], // Khóa luận tốt nghiệp Kỹ sư
  ET5000: ['ET4900'], // Đồ án chuyên sâu Kỹ sư / Thạc sĩ

  // --- CÔNG NGHỆ THÔNG TIN (IT1, IT2) ---
  IT3011: ['IT1110'],
  IT3012: ['IT1110'],
  IT3020: ['MI1141'],
  IT3040: ['IT1110'],
  IT3070: ['IT3011'],
  IT3080: ['IT3011'],
  IT3100: ['IT3011'],
  IT3120: ['IT3100'],
  IT3170: ['IT3011'],
  IT3180: ['IT3011', 'MI2020'],
  IT4015: ['IT3011', 'MI2020'],
  IT4060: ['IT3040', 'IT3100'],
  IT4409: ['IT3040'],
  IT4441: ['IT1110'],
  IT4995: ['IT3120', 'IT4409'],

  // --- ĐIỆN & ĐIỀU KHIỂN - TỰ ĐỘNG HÓA (EE1, EE2) ---
  EE2000: ['MI1111', 'PH1110'],
  EE3010: ['EE2000'],
  EE3020: ['EE2000'],
  EE3030: ['EE2000'],
  EE3040: ['EE2000'],
  EE3050: ['EE2000'],
  EE4000: ['EE3040'],
  EE4010: ['EE3010', 'EE3050'],
  EE4900: ['EE3040', 'EE3050'],

  // --- LÝ LUẬN CHÍNH TRỊ & PHÁP LUẬT ---
  SSH1110: [],
  SSH1111: [],
  SSH1120: ['SSH1110'],
  SSH1121: ['SSH1111'],
  SSH1130: ['SSH1120'],
  SSH1131: ['SSH1121'],
  SSH1140: ['SSH1130'],
  SSH1141: ['SSH1131'],
  SSH1150: ['SSH1140'],
  SSH1151: ['SSH1141'],
  EM1170: [],

  // --- KIẾN THỨC BỔ TRỢ ---
  EM1010: [], // Quản trị học đại cương
  ED3280: [], // Tâm lý học ứng dụng
  ED3220: [], // Kỹ năng mềm

  // --- NGOẠI NGỮ ---
  FL1010: [],
  FL1020: ['FL1010'],
  FL1030: ['FL1020']
};

/**
 * Tra cứu học phần trong ngân hàng kiến thức CTĐT HUST
 * Trả về danh sách tiên quyết, kỳ học chuẩn, độ khó và trọng số điểm
 */
export function findCourseMasterInfo(code: string, majorCode?: string): Partial<Course> {
  const normCode = code.replace(/\s+/g, '').toUpperCase();

  // 1. Tìm trong chuyên ngành cụ thể nếu có
  if (majorCode && BUILT_IN_CURRICULA[majorCode]) {
    const found = BUILT_IN_CURRICULA[majorCode].courses.find(c => c.code === normCode);
    if (found) return found;
  }

  // 2. Tìm trong các CTĐT tích hợp theo thứ tự ưu tiên chuẩn (ET1, EE1, IT1 trước các chương trình Elitech)
  const priorityMajors = ['ET1', 'EE1', 'IT1', 'ET2', 'EE2', 'IT2', 'ET-E4', 'ET-E5', 'ET-E16'];
  for (const m of priorityMajors) {
    const curr = BUILT_IN_CURRICULA[m];
    if (curr) {
      const found = curr.courses.find(c => c.code === normCode);
      if (found) return found;
    }
  }

  // 3. Tra trong từ điển HUST_PREREQUISITE_MAP
  const prereqs = HUST_PREREQUISITE_MAP[normCode] || [];
  return {
    prerequisites: prereqs
  };
}
