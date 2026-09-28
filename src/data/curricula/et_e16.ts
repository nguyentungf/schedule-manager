import { Curriculum } from '../../types/course';

export const ET_E16_CURRICULUM: Curriculum = {
  id: 'et_e16',
  code: 'ET-E16',
  name: 'Kỹ thuật Vi điện tử và Công nghệ Nano / Thiết kế Vi mạch (Semiconductors)',
  faculty: 'Trường Điện - Điện tử - ĐHBK Hà Nội',
  totalCredits: 140,
  courses: [
    // Kỳ 1
    { id: 'ete16_mi1111', code: 'MI1111', name: 'Giải tích 1', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: [], status: 'unlocked' },
    { id: 'ete16_mi1141', code: 'MI1141', name: 'Đại số tuyến tính', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: [], status: 'unlocked' },
    { id: 'ete16_it1110', code: 'IT1110', name: 'Tin học đại cương (C/C++)', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.5, prerequisites: [], status: 'unlocked' },
    { id: 'ete16_fl1010', code: 'FL1010', name: 'Tiếng Anh chuyên ngành I', credits: 3, term: 1, weightQt: 0.4, weightCk: 0.6, difficulty: 2.8, prerequisites: [], status: 'unlocked' },
    { id: 'ete16_ssh1110', code: 'SSH1110', name: 'Triết học Mác - Lênin', credits: 3, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.0, prerequisites: [], status: 'unlocked' },

    // Kỳ 2
    { id: 'ete16_mi1121', code: 'MI1121', name: 'Giải tích 2', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'ete16_ph1110', code: 'PH1110', name: 'Vật lý đại cương I', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.0, prerequisites: [], status: 'unlocked' },
    { id: 'ete16_et2000', code: 'ET2000', name: 'Mạch điện và Tín hiệu hệ thống', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'ete16_fl1020', code: 'FL1020', name: 'Tiếng Anh chuyên ngành II', credits: 3, term: 2, weightQt: 0.4, weightCk: 0.6, difficulty: 3.0, prerequisites: ['FL1010'], status: 'locked' },
    { id: 'ete16_ssh1120', code: 'SSH1120', name: 'Kinh tế chính trị Mác - Lênin', credits: 2, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 2.7, prerequisites: ['SSH1110'], status: 'locked' },

    // Kỳ 3
    { id: 'ete16_ph2100', code: 'PH2100', name: 'Vật lý chất rắn và Vật liệu bán dẫn', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['PH1110'], status: 'locked' },
    { id: 'ete16_et2010', code: 'ET2010', name: 'Kỹ thuật mạch điện tử tương tự', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['ET2000'], status: 'locked' },
    { id: 'ete16_et2020', code: 'ET2020', name: 'Kỹ thuật mạch điện tử số', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: ['ET2000'], status: 'locked' },
    { id: 'ete16_ph1120', code: 'PH1120', name: 'Vật lý đại cương II (Lượng tử & Quang học)', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 3.8, prerequisites: ['PH1110'], status: 'locked' },
    { id: 'ete16_ssh1130', code: 'SSH1130', name: 'Chủ nghĩa xã hội khoa học', credits: 2, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 2.6, prerequisites: ['SSH1120'], status: 'locked' },

    // Kỳ 4
    { id: 'ete16_et3400', code: 'ET3400', name: 'Vật lý linh kiện bán dẫn (MOSFET, FinFET & GAA)', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.8, prerequisites: ['PH2100'], status: 'locked' },
    { id: 'ete16_et3280', code: 'ET3280', name: 'Ngôn ngữ mô tả phần cứng Verilog/SystemVerilog', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['ET2020'], status: 'locked' },
    { id: 'ete16_et3410', code: 'ET3410', name: 'Công nghệ chế tạo vi mạch (Phòng sạch & Lithography)', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['PH2100'], status: 'locked' },
    { id: 'ete16_mi2020', code: 'MI2020', name: 'Xác suất thống kê & Thiết kế thực nghiệm', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.1, prerequisites: ['MI1121'], status: 'locked' },
    { id: 'ete16_ssh1140', code: 'SSH1140', name: 'Tư tưởng Hồ Chí Minh', credits: 2, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 2.5, prerequisites: ['SSH1130'], status: 'locked' },

    // Kỳ 5
    { id: 'ete16_et3420', code: 'ET3420', name: 'Thiết kế vi mạch tích hợp số (Digital ASIC Design)', credits: 4, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.9, prerequisites: ['ET3280'], status: 'locked' },
    { id: 'ete16_et4400', code: 'ET4400', name: 'Thiết kế vi mạch tương tự CMOS (Analog IC Design)', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.8, prerequisites: ['ET2010', 'ET3400'], status: 'locked' },
    { id: 'ete16_et3430', code: 'ET3430', name: 'Kiến trúc máy tính & Vi xử lý RISC-V', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['ET3280'], status: 'locked' },
    { id: 'ete16_it3040', code: 'IT3040', name: 'Scripting tự động hóa EDA (Python / Tcl)', credits: 2, term: 5, weightQt: 0.4, weightCk: 0.6, difficulty: 3.6, prerequisites: ['IT1110'], status: 'locked' },
    { id: 'ete16_ssh1150', code: 'SSH1150', name: 'Lịch sử Đảng Cộng sản VN', credits: 2, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 2.8, prerequisites: ['SSH1140'], status: 'locked' },

    // Kỳ 6
    { id: 'ete16_et4410', code: 'ET4410', name: 'Kiểm thử vi mạch & Thiết kế phục vụ kiểm thử (DFT/DFM)', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.7, prerequisites: ['ET3420'], status: 'locked' },
    { id: 'ete16_et4420', code: 'ET4420', name: 'Công nghệ đóng gói tiên tiến (Advanced Packaging & Chiplet)', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['ET3410'], status: 'locked' },
    { id: 'ete16_et4996', code: 'ET4996', name: 'Đồ án Thiết kế Vi mạch Bán dẫn (Synopsys/Cadence)', credits: 2, term: 6, weightQt: 0.5, weightCk: 0.5, difficulty: 4.6, prerequisites: ['ET3420', 'ET4400'], status: 'locked' },
    { id: 'ete16_em1010', code: 'EM1010', name: 'Chuỗi cung ứng ngành bán dẫn toàn cầu', credits: 2, term: 6, weightQt: 0.4, weightCk: 0.6, difficulty: 2.5, prerequisites: [], status: 'unlocked' },

    // Kỳ 7
    { id: 'ete16_et4900', code: 'ET4900', name: 'Thực tập tại Doanh nghiệp Bán dẫn (Synopsys, Marvell, Viettel, FPT Semi)', credits: 3, term: 7, weightQt: 0.5, weightCk: 0.5, difficulty: 3.0, prerequisites: ['ET4996'], status: 'locked' },
    { id: 'ete16_et4430', code: 'ET4430', name: 'Thiết kế vi mạch tần số cao (RF IC) & Tín hiệu hỗn hợp', credits: 3, term: 7, weightQt: 0.3, weightCk: 0.7, difficulty: 4.8, prerequisites: ['ET4400'], status: 'locked' },

    // Kỳ 8
    { id: 'ete16_et5006', code: 'ET5006', name: 'Khóa luận tốt nghiệp Kỹ sư Vi mạch Bán dẫn', credits: 6, term: 8, weightQt: 0.5, weightCk: 0.5, difficulty: 5.0, prerequisites: ['ET4996', 'ET4900'], status: 'locked' }
  ]
};
