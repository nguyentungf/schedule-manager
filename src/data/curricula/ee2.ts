import { Curriculum } from '../../types/course';

export const EE2_CURRICULUM: Curriculum = {
  id: 'ee2',
  code: 'EE2',
  name: 'Kỹ thuật Điều khiển & Tự động hóa (Control & Automation)',
  faculty: 'Trường Điện - Điện tử - ĐHBK Hà Nội',
  totalCredits: 135,
  courses: [
    // Kỳ 1
    { id: 'ee2_mi1111', code: 'MI1111', name: 'Giải tích 1', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: [], status: 'unlocked' },
    { id: 'ee2_mi1141', code: 'MI1141', name: 'Đại số', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: [], status: 'unlocked' },
    { id: 'ee2_it1110', code: 'IT1110', name: 'Tin học đại cương', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.5, prerequisites: [], status: 'unlocked' },
    { id: 'ee2_fl1010', code: 'FL1010', name: 'Tiếng Anh I', credits: 3, term: 1, weightQt: 0.4, weightCk: 0.6, difficulty: 2.5, prerequisites: [], status: 'unlocked' },
    { id: 'ee2_ssh1110', code: 'SSH1110', name: 'Triết học Mác - Lênin', credits: 3, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.0, prerequisites: [], status: 'unlocked' },

    // Kỳ 2
    { id: 'ee2_mi1121', code: 'MI1121', name: 'Giải tích 2', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'ee2_ph1110', code: 'PH1110', name: 'Vật lý đại cương I', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.0, prerequisites: [], status: 'unlocked' },
    { id: 'ee2_ee2000', code: 'EE2000', name: 'Mạch điện I', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'ee2_fl1020', code: 'FL1020', name: 'Tiếng Anh II', credits: 3, term: 2, weightQt: 0.4, weightCk: 0.6, difficulty: 2.8, prerequisites: ['FL1010'], status: 'locked' },
    { id: 'ee2_ssh1120', code: 'SSH1120', name: 'Kinh tế chính trị Mác - Lênin', credits: 2, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 2.7, prerequisites: ['SSH1110'], status: 'locked' },

    // Kỳ 3
    { id: 'ee2_ee3010', code: 'EE3010', name: 'Lý thuyết điều khiển tự động I', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.7, prerequisites: ['MI1121', 'EE2000'], status: 'locked' },
    { id: 'ee2_ee3030', code: 'EE3030', name: 'Kỹ thuật điện tử tương tự & số', credits: 4, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: ['EE2000'], status: 'locked' },
    { id: 'ee2_ee3110', code: 'EE3110', name: 'Cảm biến và cơ cấu chấp hành', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 3.9, prerequisites: ['EE2000'], status: 'locked' },
    { id: 'ee2_ph1120', code: 'PH1120', name: 'Vật lý đại cương II', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 3.8, prerequisites: ['PH1110'], status: 'locked' },
    { id: 'ee2_ssh1130', code: 'SSH1130', name: 'Chủ nghĩa xã hội khoa học', credits: 2, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 2.6, prerequisites: ['SSH1120'], status: 'locked' },

    // Kỳ 4
    { id: 'ee2_ee3020', code: 'EE3020', name: 'Lý thuyết điều khiển tự động II (Hiện đại)', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.8, prerequisites: ['EE3010'], status: 'locked' },
    { id: 'ee2_ee3600', code: 'EE3600', name: 'Kỹ thuật vi xử lý & Hệ vi điều khiển', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['EE3030'], status: 'locked' },
    { id: 'ee2_ee3300', code: 'EE3300', name: 'Điện tử công suất & Truyền động điện', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['EE2000'], status: 'locked' },
    { id: 'ee2_mi2020', code: 'MI2020', name: 'Xác suất thống kê', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.1, prerequisites: ['MI1121'], status: 'locked' },
    { id: 'ee2_ssh1140', code: 'SSH1140', name: 'Tư tưởng Hồ Chí Minh', credits: 2, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 2.5, prerequisites: ['SSH1130'], status: 'locked' },

    // Kỳ 5
    { id: 'ee2_ee3510', code: 'EE3510', name: 'Lập trình PLC & Mạng truyền thông công nghiệp', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.0, prerequisites: ['EE3030'], status: 'locked' },
    { id: 'ee2_ee4010', code: 'EE4010', name: 'Thiết kế hệ thống điều khiển nhúng', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['EE3600'], status: 'locked' },
    { id: 'ee2_ee4020', code: 'EE4020', name: 'Hệ thống SCADA và Tự động hóa quá trình', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: ['EE3510'], status: 'locked' },
    { id: 'ee2_it3011', code: 'IT3011', name: 'Cấu trúc dữ liệu và giải thuật', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['IT1110'], status: 'locked' },
    { id: 'ee2_ssh1150', code: 'SSH1150', name: 'Lịch sử Đảng Cộng sản VN', credits: 2, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 2.8, prerequisites: ['SSH1140'], status: 'locked' },

    // Kỳ 6
    { id: 'ee2_ee4030', code: 'EE4030', name: 'Robot công nghiệp & Thị giác máy tính', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.7, prerequisites: ['EE3020'], status: 'locked' },
    { id: 'ee2_ee4040', code: 'EE4040', name: 'Điều khiển thông minh (Fuzzy & Neural Net)', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['EE3020'], status: 'locked' },
    { id: 'ee2_ee4992', code: 'EE4992', name: 'Đồ án thiết kế Hệ thống Điều khiển', credits: 2, term: 6, weightQt: 0.5, weightCk: 0.5, difficulty: 4.4, prerequisites: ['EE3510', 'EE4010'], status: 'locked' },
    { id: 'ee2_em1010', code: 'EM1010', name: 'Quản trị học đại cương', credits: 2, term: 6, weightQt: 0.4, weightCk: 0.6, difficulty: 2.4, prerequisites: [], status: 'unlocked' },

    // Kỳ 7
    { id: 'ee2_ee4900', code: 'EE4900', name: 'Thực tập doanh nghiệp Tự động hóa', credits: 3, term: 7, weightQt: 0.5, weightCk: 0.5, difficulty: 3.0, prerequisites: ['EE4992'], status: 'locked' },
    { id: 'ee2_ee4050', code: 'EE4050', name: 'Tự động hóa tòa nhà (BMS) & IoT công nghiệp', credits: 3, term: 7, weightQt: 0.3, weightCk: 0.7, difficulty: 3.8, prerequisites: ['EE3510'], status: 'locked' },

    // Kỳ 8
    { id: 'ee2_ee5000', code: 'EE5000', name: 'Khóa luận tốt nghiệp Kỹ sư Tự động hóa', credits: 6, term: 8, weightQt: 0.5, weightCk: 0.5, difficulty: 4.9, prerequisites: ['EE4992', 'EE4900'], status: 'locked' }
  ]
};
