import { Curriculum } from '../../types/course';

export const ET_E4_CURRICULUM: Curriculum = {
  id: 'et_e4',
  code: 'ET-E4',
  name: 'Chương trình Tiên tiến Hệ thống Nhúng Thông minh & IoT (Elitech)',
  faculty: 'Trường Điện - Điện tử - ĐHBK Hà Nội',
  totalCredits: 140,
  courses: [
    // Kỳ 1
    { id: 'ete4_mi1111', code: 'MI1111', name: 'Calculus I (Giải tích 1)', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: [], status: 'unlocked' },
    { id: 'ete4_mi1141', code: 'MI1141', name: 'Linear Algebra (Đại số tuyến tính)', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: [], status: 'unlocked' },
    { id: 'ete4_it1110', code: 'IT1110', name: 'Introduction to Computer Science (C/C++)', credits: 4, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.5, prerequisites: [], status: 'unlocked' },
    { id: 'ete4_fl1010', code: 'FL1010', name: 'Academic English I', credits: 3, term: 1, weightQt: 0.4, weightCk: 0.6, difficulty: 2.8, prerequisites: [], status: 'unlocked' },
    { id: 'ete4_ssh1110', code: 'SSH1110', name: 'Triết học Mác - Lênin', credits: 3, term: 1, weightQt: 0.3, weightCk: 0.7, difficulty: 3.0, prerequisites: [], status: 'unlocked' },

    // Kỳ 2
    { id: 'ete4_mi1121', code: 'MI1121', name: 'Calculus II (Giải tích 2)', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'ete4_ph1110', code: 'PH1110', name: 'General Physics I', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.0, prerequisites: [], status: 'unlocked' },
    { id: 'ete4_et2000', code: 'ET2000', name: 'Signals and Systems', credits: 3, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['MI1111'], status: 'locked' },
    { id: 'ete4_fl1020', code: 'FL1020', name: 'Academic English II', credits: 3, term: 2, weightQt: 0.4, weightCk: 0.6, difficulty: 3.0, prerequisites: ['FL1010'], status: 'locked' },
    { id: 'ete4_ssh1120', code: 'SSH1120', name: 'Kinh tế chính trị Mác - Lênin', credits: 2, term: 2, weightQt: 0.3, weightCk: 0.7, difficulty: 2.7, prerequisites: ['SSH1110'], status: 'locked' },

    // Kỳ 3
    { id: 'ete4_et2010', code: 'ET2010', name: 'Analog Circuit Design', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['ET2000'], status: 'locked' },
    { id: 'ete4_et2020', code: 'ET2020', name: 'Digital Logic and Circuit Design', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.1, prerequisites: ['ET2000'], status: 'locked' },
    { id: 'ete4_it3011', code: 'IT3011', name: 'Data Structures and Algorithms', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 4.4, prerequisites: ['IT1110'], status: 'locked' },
    { id: 'ete4_ph1120', code: 'PH1120', name: 'General Physics II (Electromagnetics)', credits: 3, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 3.8, prerequisites: ['PH1110'], status: 'locked' },
    { id: 'ete4_ssh1130', code: 'SSH1130', name: 'Chủ nghĩa xã hội khoa học', credits: 2, term: 3, weightQt: 0.3, weightCk: 0.7, difficulty: 2.6, prerequisites: ['SSH1120'], status: 'locked' },

    // Kỳ 4
    { id: 'ete4_et3200', code: 'ET3200', name: 'Microcontrollers & ARM Embedded System Design', credits: 4, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['ET2020'], status: 'locked' },
    { id: 'ete4_et3230e', code: 'ET3230E', name: 'HDL Design with Verilog & FPGA', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['ET2020'], status: 'locked' },
    { id: 'ete4_et3010', code: 'ET3010', name: 'Digital Signal Processing (DSP)', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['ET2000'], status: 'locked' },
    { id: 'ete4_mi2020', code: 'MI2020', name: 'Probability and Statistics', credits: 3, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 4.1, prerequisites: ['MI1121'], status: 'locked' },
    { id: 'ete4_ssh1140', code: 'SSH1140', name: 'Tư tưởng Hồ Chí Minh', credits: 2, term: 4, weightQt: 0.3, weightCk: 0.7, difficulty: 2.5, prerequisites: ['SSH1130'], status: 'locked' },

    // Kỳ 5
    { id: 'ete4_et3210', code: 'ET3210', name: 'Wireless Sensor Networks and IoT Protocols (BLE/ZigBee/LoRa)', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.5, prerequisites: ['ET3200'], status: 'locked' },
    { id: 'ete4_et3220', code: 'ET3220', name: 'Real-Time Operating Systems (FreeRTOS & Embedded Linux)', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.7, prerequisites: ['ET3200'], status: 'locked' },
    { id: 'ete4_it4060', code: 'IT4060', name: 'Web and Cloud API Development for IoT', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 3.7, prerequisites: ['IT3011'], status: 'locked' },
    { id: 'ete4_et4015', code: 'ET4015', name: 'Hardware Security and Cryptography', credits: 3, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 4.2, prerequisites: ['ET3200'], status: 'locked' },
    { id: 'ete4_ssh1150', code: 'SSH1150', name: 'Lịch sử Đảng Cộng sản VN', credits: 2, term: 5, weightQt: 0.3, weightCk: 0.7, difficulty: 2.8, prerequisites: ['SSH1140'], status: 'locked' },

    // Kỳ 6
    { id: 'ete4_et4200', code: 'ET4200', name: 'Edge AI: Deep Learning on Microcontrollers (TinyML)', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.8, prerequisites: ['ET3220', 'MI2020'], status: 'locked' },
    { id: 'ete4_et4210', code: 'ET4210', name: 'Automotive Electronics & AUTOSAR Standard', credits: 3, term: 6, weightQt: 0.3, weightCk: 0.7, difficulty: 4.6, prerequisites: ['ET3220'], status: 'locked' },
    { id: 'ete4_et4994', code: 'ET4994', name: 'Elitech Capstone Design Project', credits: 2, term: 6, weightQt: 0.5, weightCk: 0.5, difficulty: 4.5, prerequisites: ['ET3210', 'ET3220'], status: 'locked' },
    { id: 'ete4_em1010', code: 'EM1010', name: 'Tech Entrepreneurship & Innovation', credits: 2, term: 6, weightQt: 0.4, weightCk: 0.6, difficulty: 2.5, prerequisites: [], status: 'unlocked' },

    // Kỳ 7
    { id: 'ete4_et4900', code: 'ET4900', name: 'Industrial Internship (Viettel/VinAI/FPT/Qualcomm)', credits: 3, term: 7, weightQt: 0.5, weightCk: 0.5, difficulty: 3.0, prerequisites: ['ET4994'], status: 'locked' },
    { id: 'ete4_et4220', code: 'ET4220', name: 'Industrial IoT & Smart Robotics Architecture', credits: 3, term: 7, weightQt: 0.3, weightCk: 0.7, difficulty: 4.3, prerequisites: ['ET3210'], status: 'locked' },

    // Kỳ 8
    { id: 'ete4_et5004', code: 'ET5004', name: 'Elitech Engineering Graduation Thesis', credits: 6, term: 8, weightQt: 0.5, weightCk: 0.5, difficulty: 4.9, prerequisites: ['ET4994', 'ET4900'], status: 'locked' }
  ]
};
