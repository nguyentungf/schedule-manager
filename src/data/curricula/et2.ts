import { Curriculum } from '../../types/course';

export const ET2_CURRICULUM: Curriculum = {
  id: 'et2',
  code: 'ET2',
  name: 'Kỹ thuật Y sinh (Biomedical Engineering)',
  faculty: 'Trường Điện - Điện tử - ĐHBK Hà Nội',
  totalCredits: 135,
  courses: [
    // Kỳ 1
    { id: 'et2_mi1111', code: 'MI1111', name: 'Giải tích 1', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: [], status: 'unlocked' },
    { id: 'et2_mi1141', code: 'MI1141', name: 'Đại số', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: [], status: 'unlocked' },
    { id: 'et2_it1110', code: 'IT1110', name: 'Tin học đại cương', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.5, prerequisites: [], status: 'unlocked' },
    { id: 'et2_fl1010', code: 'FL1010', name: 'Tiếng Anh I', credits: 3, term: 1, weightQt: 0.4, weightCk: 0.6, difficulty: 2.5, prerequisites: [], status: 'unlocked' },
    { id: 'et2_ssh1110', code: 'SSH1110', name: 'Triết học Mác - Lênin', credits: 3, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.0, prerequisites: [], status: 'unlocked' },

    // Kỳ 2
    { id: 'et2_mi1121', code: 'MI1121', name: 'Giải tích 2', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'et2_ph1110', code: 'PH1110', name: 'Vật lý đại cương I', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.0, prerequisites: [], status: 'unlocked' },
    { id: 'et2_ch1010', code: 'CH1010', name: 'Hóa học đại cương', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 3.5, prerequisites: [], status: 'unlocked' },
    { id: 'et2_fl1020', code: 'FL1020', name: 'Tiếng Anh II', credits: 3, term: 2, weightQt: 0.4, weightCk: 0.6, difficulty: 2.8, prerequisites: ['FL1010'], status: 'locked' },
    { id: 'et2_ssh1120', code: 'SSH1120', name: 'Kinh tế chính trị Mác - Lênin', credits: 2, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 2.7, prerequisites: ['SSH1110'], status: 'locked' },

    // Kỳ 3
    { id: 'et2_et2000', code: 'ET2000', name: 'Tín hiệu và Hệ thống', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'et2_et3100', code: 'ET3100', name: 'Giải phẫu & Sinh lý học cho kỹ sư', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 3.8, prerequisites: [], status: 'unlocked' },
    { id: 'et2_et2010', code: 'ET2010', name: 'Kỹ thuật điện tử tương tự & số', credits: 4, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: ['PH1110'], status: 'locked' },
    { id: 'et2_ph1120', code: 'PH1120', name: 'Vật lý đại cương II (Điện quang)', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 3.8, prerequisites: ['PH1110'], status: 'locked' },
    { id: 'et2_ssh1130', code: 'SSH1130', name: 'Chủ nghĩa xã hội khoa học', credits: 2, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 2.6, prerequisites: ['SSH1120'], status: 'locked' },

    // Kỳ 4
    { id: 'et2_et3110', code: 'ET3110', name: 'Cảm biến & Đo lường tín hiệu sinh học', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['ET2010', 'ET3100'], status: 'locked' },
    { id: 'et2_et3120', code: 'ET3120', name: 'Xử lý tín hiệu y sinh (ECG, EEG, EMG)', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['ET2000'], status: 'locked' },
    { id: 'et2_et3020', code: 'ET3020', name: 'Kỹ thuật vi xử lý trong thiết bị y tế', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: ['ET2010'], status: 'locked' },
    { id: 'et2_mi2020', code: 'MI2020', name: 'Xác suất thống kê & Thống kê sinh học', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.1, prerequisites: ['MI1121'], status: 'locked' },
    { id: 'et2_ssh1140', code: 'SSH1140', name: 'Tư tưởng Hồ Chí Minh', credits: 2, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 2.5, prerequisites: ['SSH1130'], status: 'locked' },

    // Kỳ 5
    { id: 'et2_et4100', code: 'ET4100', name: 'Thiết bị chẩn đoán hình ảnh y tế (X-ray, CT, MRI)', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.7, prerequisites: ['ET3110', 'PH1120'], status: 'locked' },
    { id: 'et2_et4110', code: 'ET4110', name: 'Hệ thống thiết bị điều trị & Phẫu thuật', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['ET3110'], status: 'locked' },
    { id: 'et2_et4120', code: 'ET4120', name: 'Xử lý ảnh y tế & AI trong Chẩn đoán', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['ET3120', 'MI2020'], status: 'locked' },
    { id: 'et2_it3040', code: 'IT3040', name: 'Lập trình ứng dụng y tế (Python/C++)', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 3.8, prerequisites: ['IT1110'], status: 'locked' },
    { id: 'et2_ssh1150', code: 'SSH1150', name: 'Lịch sử Đảng Cộng sản VN', credits: 2, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 2.8, prerequisites: ['SSH1140'], status: 'locked' },

    // Kỳ 6
    { id: 'et2_et4130', code: 'ET4130', name: 'Thiết bị y tế đeo & Hệ thống IoMT', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['ET3020', 'ET3110'], status: 'locked' },
    { id: 'et2_et4140', code: 'ET4140', name: 'An toàn bức xạ và Quản lý trang thiết bị bệnh viện', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 3.7, prerequisites: ['ET4100'], status: 'locked' },
    { id: 'et2_et4992', code: 'ET4992', name: 'Đồ án thiết kế Thiết bị Y sinh', credits: 2, term: 6, weightQt: 0.5, weightCk: 0.5, difficulty: 4.3, prerequisites: ['ET3110', 'ET3120'], status: 'locked' },
    { id: 'et2_em1010', code: 'EM1010', name: 'Quản trị học đại cương', credits: 2, term: 6, weightQt: 0.4, weightCk: 0.6, difficulty: 2.4, prerequisites: [], status: 'unlocked' },

    // Kỳ 7
    { id: 'et2_et4900', code: 'ET4900', name: 'Thực tập tại Bệnh viện / Doanh nghiệp Y sinh', credits: 3, term: 7, weightQt: 0.5, weightCk: 0.5, difficulty: 3.0, prerequisites: ['ET4992'], status: 'locked' },
    { id: 'et2_et4150', code: 'ET4150', name: 'Y tế từ xa (Telemedicine) & Hệ thống PACS', credits: 3, term: 7, weightQt: 0.3, weightCk: 0.7, difficulty: 3.9, prerequisites: ['ET4120'], status: 'locked' },

    // Kỳ 8
    { id: 'et2_et5000', code: 'ET5000', name: 'Khóa luận tốt nghiệp Kỹ sư Y sinh', credits: 6, term: 8, weightQt: 0.5, weightCk: 0.5, difficulty: 4.9, prerequisites: ['ET4992', 'ET4900'], status: 'locked' }
  ]
};
