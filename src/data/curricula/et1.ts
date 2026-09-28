import { Curriculum } from '../../types/course';

export const ET1_CURRICULUM: Curriculum = {
  id: 'et1',
  code: 'ET1',
  name: 'Kỹ thuật Điện tử - Viễn thông (Electronics & Telecommunications)',
  faculty: 'Trường Điện - Điện tử - ĐHBK Hà Nội',
  totalCredits: 135,
  courses: [
    // --- NĂM 1 (Kỳ 1) ---
    { id: 'et1_mi1111', code: 'MI1111', name: 'Giải tích 1', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: [], status: 'unlocked' },
    { id: 'et1_mi1141', code: 'MI1141', name: 'Đại số', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: [], status: 'unlocked' },
    { id: 'et1_it1110', code: 'IT1110', name: 'Tin học đại cương', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.5, prerequisites: [], status: 'unlocked' },
    { id: 'et1_fl1010', code: 'FL1010', name: 'Tiếng Anh I', credits: 3, term: 1, weightQt: 0.4, weightCk: 0.6, difficulty: 2.5, prerequisites: [], status: 'unlocked' },
    { id: 'et1_ssh1110', code: 'SSH1110', name: 'Triết học Mác - Lênin', credits: 3, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.0, prerequisites: [], status: 'unlocked' },

    // --- NĂM 1 (Kỳ 2) ---
    { id: 'et1_mi1121', code: 'MI1121', name: 'Giải tích 2', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'et1_ph1110', code: 'PH1110', name: 'Vật lý đại cương I', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.0, prerequisites: [], status: 'unlocked' },
    { id: 'et1_et2050', code: 'ET2050', name: 'Lý thuyết mạch', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'et1_fl1020', code: 'FL1020', name: 'Tiếng Anh II', credits: 3, term: 2, weightQt: 0.4, weightCk: 0.6, difficulty: 2.8, prerequisites: ['FL1010'], status: 'locked' },
    { id: 'et1_ssh1120', code: 'SSH1120', name: 'Kinh tế chính trị Mác - Lênin', credits: 2, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 2.7, prerequisites: ['SSH1110'], status: 'locked' },

    // --- NĂM 2 (Kỳ 3) ---
    { id: 'et1_et2000', code: 'ET2000', name: 'Tín hiệu và Hệ thống', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'et1_et2010', code: 'ET2010', name: 'Kỹ thuật điện tử tương tự', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['ET2050'], status: 'locked' },
    { id: 'et1_ph1120', code: 'PH1120', name: 'Vật lý đại cương II', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 3.8, prerequisites: ['PH1110'], status: 'locked' },
    { id: 'et1_mi2020', code: 'MI2020', name: 'Xác suất thống kê', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.1, prerequisites: ['MI1121'], status: 'locked' },
    { id: 'et1_ssh1130', code: 'SSH1130', name: 'Chủ nghĩa xã hội khoa học', credits: 2, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 2.6, prerequisites: ['SSH1120'], status: 'locked' },
    { id: 'et1_et2022', code: 'ET2022', name: 'Technical Writing and Presentation', credits: 2, term: 3, weightQt: 0.4, weightCk: 0.6, difficulty: 2.5, prerequisites: [], status: 'unlocked' },

    // --- NĂM 2 (Kỳ 4) ---
    { id: 'et1_et2020', code: 'ET2020', name: 'Kỹ thuật điện tử số', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.1, prerequisites: ['ET2000'], status: 'locked' },
    { id: 'et1_et3241', code: 'ET3241', name: 'Điện tử tương tự II', credits: 2, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['ET2010'], status: 'locked' },
    { id: 'et1_et3010', code: 'ET3010', name: 'Xử lý tín hiệu số (DSP)', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.7, prerequisites: ['ET2000'], status: 'locked' },
    { id: 'et1_et3210', code: 'ET3210', name: 'Trường điện từ và Anten', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['MI1121', 'PH1110'], status: 'locked' },
    { id: 'et1_ssh1140', code: 'SSH1140', name: 'Tư tưởng Hồ Chí Minh', credits: 2, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 2.5, prerequisites: ['SSH1130'], status: 'locked' },

    // --- NĂM 3 (Kỳ 5) ---
    { id: 'et1_et3300', code: 'ET3300', name: 'Kỹ thuật vi xử lý', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['ET2020'], status: 'locked' },
    { id: 'et1_et3250', code: 'ET3250', name: 'Thông tin số', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: ['ET2000', 'MI2020'], status: 'locked' },
    { id: 'et1_et3220', code: 'ET3220', name: 'Mạch cao tần', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['ET2010', 'ET3210'], status: 'locked' },
    { id: 'et1_it3040', code: 'IT3040', name: 'Kỹ thuật lập trình C/C++', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.0, prerequisites: ['IT1110'], status: 'locked' },
    { id: 'et1_ssh1150', code: 'SSH1150', name: 'Lịch sử Đảng Cộng sản VN', credits: 2, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 2.8, prerequisites: ['SSH1140'], status: 'locked' },

    // --- NĂM 3 (Kỳ 6) ---
    { id: 'et1_et3230', code: 'ET3230', name: 'Kỹ thuật thông tin quang', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['ET3210'], status: 'locked' },
    { id: 'et1_et3290', code: 'ET3290', name: 'Mạng truyền thông số liệu', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.1, prerequisites: ['ET3250'], status: 'locked' },
    { id: 'et1_et3262', code: 'ET3262', name: 'Tư duy công nghệ và thiết kế kỹ thuật', credits: 2, term: 6, weightQt: 0.4, weightCk: 0.6, difficulty: 2.6, prerequisites: [], status: 'unlocked' },
    { id: 'et1_et3990', code: 'ET3990', name: 'Đồ án thiết kế kỹ thuật', credits: 2, term: 6, weightQt: 0.5, weightCk: 0.5, difficulty: 4.3, prerequisites: ['ET3300'], status: 'locked' },
    { id: 'et1_em1010', code: 'EM1010', name: 'Quản trị học đại cương', credits: 2, term: 6, weightQt: 0.4, weightCk: 0.6, difficulty: 2.4, prerequisites: [], status: 'unlocked' },

    // --- NĂM 4 (Kỳ 7) ---
    { id: 'et1_et4010', code: 'ET4010', name: 'Hệ thống thông tin di động', credits: 3, term: 7, weightQt: 0.3, weightCk: 0.7, difficulty: 4.7, prerequisites: ['ET3250'], status: 'locked' },
    { id: 'et1_et4220', code: 'ET4220', name: 'Thiết kế hệ thống nhúng', credits: 3, term: 7, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['ET3300'], status: 'locked' },
    { id: 'et1_et4900', code: 'ET4900', name: 'Thực tập kỹ thuật', credits: 3, term: 7, weightQt: 0.5, weightCk: 0.5, difficulty: 3.0, prerequisites: ['ET3990'], status: 'locked' },
    { id: 'et1_et4110', code: 'ET4110', name: 'Thị giác máy tính & Xử lý ảnh', credits: 3, term: 7, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['ET3010'], status: 'locked' },

    // --- NĂM 4 (Kỳ 8) ---
    { id: 'et1_et4990', code: 'ET4990', name: 'Đồ án tốt nghiệp Cử nhân Điện tử - Viễn thông', credits: 6, term: 8, weightQt: 0.5, weightCk: 0.5, difficulty: 4.9, prerequisites: ['ET4900'], status: 'locked' },
    { id: 'et1_et4999', code: 'ET4999', name: 'Khóa luận tốt nghiệp Kỹ sư Điện tử - Viễn thông', credits: 6, term: 8, weightQt: 0.5, weightCk: 0.5, difficulty: 5.0, prerequisites: ['ET4900'], status: 'locked' }
  ]
};
