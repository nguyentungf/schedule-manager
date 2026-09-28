import { Curriculum } from '../../types/course';

export const EE1_CURRICULUM: Curriculum = {
  id: 'ee1',
  code: 'EE1',
  name: 'Kỹ thuật Điện (Electrical Engineering)',
  faculty: 'Trường Điện - Điện tử - ĐHBK Hà Nội',
  totalCredits: 135,
  courses: [
    // Kỳ 1
    { id: 'ee1_mi1111', code: 'MI1111', name: 'Giải tích 1', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: [], status: 'unlocked' },
    { id: 'ee1_mi1141', code: 'MI1141', name: 'Đại số', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: [], status: 'unlocked' },
    { id: 'ee1_it1110', code: 'IT1110', name: 'Tin học đại cương', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.5, prerequisites: [], status: 'unlocked' },
    { id: 'ee1_fl1010', code: 'FL1010', name: 'Tiếng Anh I', credits: 3, term: 1, weightQt: 0.4, weightCk: 0.6, difficulty: 2.5, prerequisites: [], status: 'unlocked' },
    { id: 'ee1_ssh1110', code: 'SSH1110', name: 'Triết học Mác - Lênin', credits: 3, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.0, prerequisites: [], status: 'unlocked' },

    // Kỳ 2
    { id: 'ee1_mi1121', code: 'MI1121', name: 'Giải tích 2', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'ee1_ph1110', code: 'PH1110', name: 'Vật lý đại cương I', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.0, prerequisites: [], status: 'unlocked' },
    { id: 'ee1_ee2000', code: 'EE2000', name: 'Mạch điện I', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'ee1_fl1020', code: 'FL1020', name: 'Tiếng Anh II', credits: 3, term: 2, weightQt: 0.4, weightCk: 0.6, difficulty: 2.8, prerequisites: ['FL1010'], status: 'locked' },
    { id: 'ee1_ssh1120', code: 'SSH1120', name: 'Kinh tế chính trị Mác - Lênin', credits: 2, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 2.7, prerequisites: ['SSH1110'], status: 'locked' },

    // Kỳ 3
    { id: 'ee1_ee2005', code: 'EE2005', name: 'Mạch điện II', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['EE2000'], status: 'locked' },
    { id: 'ee1_ee3000', code: 'EE3000', name: 'Trường điện từ', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['MI1121', 'PH1110'], status: 'locked' },
    { id: 'ee1_ee3100', code: 'EE3100', name: 'Kỹ thuật đo lường & Cảm biến', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 3.8, prerequisites: ['EE2000'], status: 'locked' },
    { id: 'ee1_ph1120', code: 'PH1120', name: 'Vật lý đại cương II', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 3.8, prerequisites: ['PH1110'], status: 'locked' },
    { id: 'ee1_ssh1130', code: 'SSH1130', name: 'Chủ nghĩa xã hội khoa học', credits: 2, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 2.6, prerequisites: ['SSH1120'], status: 'locked' },

    // Kỳ 4
    { id: 'ee1_ee3200', code: 'EE3200', name: 'Máy điện I (Máy biến áp & KĐB)', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['EE2005', 'EE3000'], status: 'locked' },
    { id: 'ee1_ee3300', code: 'EE3300', name: 'Điện tử công suất', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['EE2000'], status: 'locked' },
    { id: 'ee1_ee3400', code: 'EE3400', name: 'Khí cụ điện & Thiết bị đóng cắt', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 3.9, prerequisites: ['EE2000'], status: 'locked' },
    { id: 'ee1_mi2020', code: 'MI2020', name: 'Xác suất thống kê', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.1, prerequisites: ['MI1121'], status: 'locked' },
    { id: 'ee1_ssh1140', code: 'SSH1140', name: 'Tư tưởng Hồ Chí Minh', credits: 2, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 2.5, prerequisites: ['SSH1130'], status: 'locked' },

    // Kỳ 5
    { id: 'ee1_ee3210', code: 'EE3210', name: 'Máy điện II (Máy điện đồng bộ & 1 chiều)', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['EE3200'], status: 'locked' },
    { id: 'ee1_ee4000', code: 'EE4000', name: 'Hệ thống cung cấp điện', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['EE2005'], status: 'locked' },
    { id: 'ee1_ee4100', code: 'EE4100', name: 'Hệ thống điện I (Lưới điện)', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['EE2005'], status: 'locked' },
    { id: 'ee1_ee3500', code: 'EE3500', name: 'Điều khiển logic & PLC', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 3.7, prerequisites: ['IT1110'], status: 'locked' },
    { id: 'ee1_ssh1150', code: 'SSH1150', name: 'Lịch sử Đảng Cộng sản VN', credits: 2, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 2.8, prerequisites: ['SSH1140'], status: 'locked' },

    // Kỳ 6
    { id: 'ee1_ee4200', code: 'EE4200', name: 'Bảo vệ Rơle & Tự động hóa HTĐ', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.8, prerequisites: ['EE4100'], status: 'locked' },
    { id: 'ee1_ee4300', code: 'EE4300', name: 'Kỹ thuật điện cao áp', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['EE3000'], status: 'locked' },
    { id: 'ee1_ee4991', code: 'EE4991', name: 'Đồ án thiết kế Hệ thống Điện', credits: 2, term: 6, weightQt: 0.5, weightCk: 0.5, difficulty: 4.3, prerequisites: ['EE4000'], status: 'locked' },
    { id: 'ee1_ee4500', code: 'EE4500', name: 'Năng lượng tái tạo & Lưới điện thông minh', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.0, prerequisites: ['EE4000'], status: 'locked' },

    // Kỳ 7
    { id: 'ee1_ee4900', code: 'EE4900', name: 'Thực tập kỹ thuật điện', credits: 3, term: 7, weightQt: 0.5, weightCk: 0.5, difficulty: 3.0, prerequisites: ['EE4200'], status: 'locked' },
    { id: 'ee1_ee4600', code: 'EE4600', name: 'Thị trường điện & Kinh tế năng lượng', credits: 3, term: 7, weightQt: 0.4, weightCk: 0.6, difficulty: 3.5, prerequisites: ['EE4100'], status: 'locked' },
    { id: 'ee1_em1010', code: 'EM1010', name: 'Quản trị học đại cương', credits: 2, term: 7, weightQt: 0.4, weightCk: 0.6, difficulty: 2.4, prerequisites: [], status: 'unlocked' },

    // Kỳ 8
    { id: 'ee1_ee5000', code: 'EE5000', name: 'Đồ án tốt nghiệp Kỹ sư Điện', credits: 6, term: 8, weightQt: 0.5, weightCk: 0.5, difficulty: 4.9, prerequisites: ['EE4991', 'EE4900'], status: 'locked' }
  ]
};
