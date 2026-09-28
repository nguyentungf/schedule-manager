import { Curriculum } from '../../types/course';

export const ET_E5_CURRICULUM: Curriculum = {
  id: 'et_e5',
  code: 'ET-E5',
  name: 'Truyền thông số & Kỹ thuật Đa phương tiện (Digital Media & Multimedia)',
  faculty: 'Trường Điện - Điện tử - ĐHBK Hà Nội',
  totalCredits: 135,
  courses: [
    // Kỳ 1
    { id: 'ete5_mi1111', code: 'MI1111', name: 'Giải tích 1', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: [], status: 'unlocked' },
    { id: 'ete5_mi1141', code: 'MI1141', name: 'Đại số', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: [], status: 'unlocked' },
    { id: 'ete5_it1110', code: 'IT1110', name: 'Tin học đại cương (Python/C++)', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.5, prerequisites: [], status: 'unlocked' },
    { id: 'ete5_fl1010', code: 'FL1010', name: 'Tiếng Anh I', credits: 3, term: 1, weightQt: 0.4, weightCk: 0.6, difficulty: 2.5, prerequisites: [], status: 'unlocked' },
    { id: 'ete5_ssh1110', code: 'SSH1110', name: 'Triết học Mác - Lênin', credits: 3, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.0, prerequisites: [], status: 'unlocked' },

    // Kỳ 2
    { id: 'ete5_mi1121', code: 'MI1121', name: 'Giải tích 2', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'ete5_ph1110', code: 'PH1110', name: 'Vật lý đại cương I (Quang học & Sóng)', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.0, prerequisites: [], status: 'unlocked' },
    { id: 'ete5_et2000', code: 'ET2000', name: 'Tín hiệu và Hệ thống', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'ete5_fl1020', code: 'FL1020', name: 'Tiếng Anh II', credits: 3, term: 2, weightQt: 0.4, weightCk: 0.6, difficulty: 2.8, prerequisites: ['FL1010'], status: 'locked' },
    { id: 'ete5_ssh1120', code: 'SSH1120', name: 'Kinh tế chính trị Mác - Lênin', credits: 2, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 2.7, prerequisites: ['SSH1110'], status: 'locked' },

    // Kỳ 3
    { id: 'ete5_et3300', code: 'ET3300', name: 'Đồ họa máy tính & Tạo hình 3D', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: ['MI1141', 'IT1110'], status: 'locked' },
    { id: 'ete5_et2010', code: 'ET2010', name: 'Kỹ thuật điện tử tương tự & số', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.1, prerequisites: ['PH1110'], status: 'locked' },
    { id: 'ete5_it3011', code: 'IT3011', name: 'Cấu trúc dữ liệu và giải thuật', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['IT1110'], status: 'locked' },
    { id: 'ete5_et3320', code: 'ET3320', name: 'Thiết kế giao diện & Trải nghiệm người dùng UI/UX', credits: 3, term: 3, weightQt: 0.4, weightCk: 0.6, difficulty: 3.4, prerequisites: [], status: 'unlocked' },
    { id: 'ete5_ssh1130', code: 'SSH1130', name: 'Chủ nghĩa xã hội khoa học', credits: 2, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 2.6, prerequisites: ['SSH1120'], status: 'locked' },

    // Kỳ 4
    { id: 'ete5_et3310', code: 'ET3310', name: 'Xử lý âm thanh & Video số chuyên nghiệp', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['ET2000'], status: 'locked' },
    { id: 'ete5_it4060', code: 'IT4060', name: 'Lập trình ứng dụng Web tương tác cao', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 3.6, prerequisites: ['IT3011'], status: 'locked' },
    { id: 'ete5_et3030', code: 'ET3030', name: 'Cơ sở kỹ thuật truyền thông số', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: ['ET2000'], status: 'locked' },
    { id: 'ete5_mi2020', code: 'MI2020', name: 'Xác suất thống kê', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.1, prerequisites: ['MI1121'], status: 'locked' },
    { id: 'ete5_ssh1140', code: 'SSH1140', name: 'Tư tưởng Hồ Chí Minh', credits: 2, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 2.5, prerequisites: ['SSH1130'], status: 'locked' },

    // Kỳ 5
    { id: 'ete5_et4300', code: 'ET4300', name: 'Công nghệ Thực tế ảo (VR) và Thực tế tăng cường (AR)', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.7, prerequisites: ['ET3300'], status: 'locked' },
    { id: 'ete5_et4310', code: 'ET4310', name: 'Mạng phân phối nội dung (CDN) & Streaming Media', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['ET3030'], status: 'locked' },
    { id: 'ete5_it4350', code: 'IT4350', name: 'Phát triển ứng dụng di động đa nền tảng', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 3.9, prerequisites: ['IT4060'], status: 'locked' },
    { id: 'ete5_et4330', code: 'ET4330', name: 'Trí tuệ nhân tạo trong xử lý Đa phương tiện (GenAI)', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['ET3310', 'MI2020'], status: 'locked' },
    { id: 'ete5_ssh1150', code: 'SSH1150', name: 'Lịch sử Đảng Cộng sản VN', credits: 2, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 2.8, prerequisites: ['SSH1140'], status: 'locked' },

    // Kỳ 6
    { id: 'ete5_et4320', code: 'ET4320', name: 'Kỹ xảo hình ảnh VFX & Sản xuất Game 3D với Unity/Unreal', credits: 3, term: 6, weightQt: 0.4, weightCk: 0.6, difficulty: 4.6, prerequisites: ['ET4300'], status: 'locked' },
    { id: 'ete5_et4340', code: 'ET4340', name: 'Bản quyền số (DRM) & An ninh truyền thông', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.0, prerequisites: ['ET4310'], status: 'locked' },
    { id: 'ete5_et4995', code: 'ET4995', name: 'Đồ án Thiết kế Đa phương tiện & Game', credits: 2, term: 6, weightQt: 0.5, weightCk: 0.5, difficulty: 4.4, prerequisites: ['ET4300', 'IT4060'], status: 'locked' },
    { id: 'ete5_em1010', code: 'EM1010', name: 'Quản trị dự án truyền thông số', credits: 2, term: 6, weightQt: 0.4, weightCk: 0.6, difficulty: 2.5, prerequisites: [], status: 'unlocked' },

    // Kỳ 7
    { id: 'ete5_et4900', code: 'ET4900', name: 'Thực tập tại Studio Game / Đài truyền hình / Tech Corp', credits: 3, term: 7, weightQt: 0.5, weightCk: 0.5, difficulty: 3.0, prerequisites: ['ET4995'], status: 'locked' },
    { id: 'ete5_et4350', code: 'ET4350', name: 'Tương tác Người - Máy nâng cao & Metaverse', credits: 3, term: 7, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['ET4300'], status: 'locked' },

    // Kỳ 8
    { id: 'ete5_et5000', code: 'ET5000', name: 'Đồ án tốt nghiệp Kỹ sư Truyền thông Đa phương tiện', credits: 6, term: 8, weightQt: 0.5, weightCk: 0.5, difficulty: 4.9, prerequisites: ['ET4995', 'ET4900'], status: 'locked' }
  ]
};
