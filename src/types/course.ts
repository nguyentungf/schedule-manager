export type CourseStatus = 'passed' | 'in_progress' | 'unlocked' | 'locked' | 'failed' | 'planned';

export type LetterGrade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F';

export interface Course {
  id: string;
  code: string;            // Ví dụ: IT3011, MI1111
  name: string;            // Ví dụ: Cấu trúc dữ liệu và giải thuật
  credits: number;         // Số tín chỉ (1 - 6)
  term: number;            // Kỳ học đề xuất theo khung CTĐT (1 - 8)
  weightQt: number;        // Trọng số điểm quá trình (0.3 hoặc 0.4)
  weightCk: number;        // Trọng số điểm cuối kỳ (0.7 hoặc 0.6)
  difficulty: number;      // Độ khó (1.0 - 5.0)
  prerequisites: string[]; // Danh sách mã môn tiên quyết (môn cần qua để được học)
  category?: 'general' | 'core' | 'specialized' | 'project' | 'elective';
  categoryName?: string;   // Tên nhóm học phần (ví dụ: Lý luận chính trị, Đồ án tốt nghiệp...)
  isRequired?: boolean;    // Môn bắt buộc hay tự chọn theo CTĐT
  department?: string;     // Viện/Khoa phụ trách (TDDT, KML, KKTVQL...)
  creditsTaken?: number | null; // Số tín chỉ đã học/tích lũy
  codeTaken?: string;      // Mã học phần đã học thay thế tương đương
  ects?: number | null;    // Tín chỉ châu Âu ECTS (từ QLĐT)
  isLearned?: boolean;     // Đã học (từ cột Đã học trên QLĐT)
  
  // Các cờ phân loại thông minh phục vụ lọc sạch CTĐT
  isPhysicalEducation?: boolean;   // Học phần thể chất (PE) không tính CPA
  isGraduateOrEngineer?: boolean;  // Học phần Kỹ sư / Thạc sĩ / Sau đại học (Kỳ 9-10)
  isElectiveSupport?: boolean;     // Khối kiến thức bổ trợ tự chọn (tối thiểu 9 tín)
  isModuleCourse?: boolean;        // Học phần thuộc Module/Mô-đun chuyên ngành (mã đầu 4)
  isEnglishCourse?: boolean;       // Học phần Ngoại ngữ / Tiếng Anh (FL*)

  // Siêu dữ liệu chuẩn từ CourseLists.aspx (HP Điều kiện & Học phí)
  conditionString?: string;        // Biểu thức HP điều kiện gốc (VD: (MI1111,MI1121...)/(...))
  tuitionCredits?: number | null;  // Số tín chỉ học phí (VD: 4.5)
  duration?: string;               // Thời lượng (VD: 3(3-0-1-6))
  englishName?: string;            // Tên tiếng Anh
  courseObjectives?: string;       // Mục tiêu học phần
  courseContent?: string;          // Nội dung học phần
  
  // Trạng thái học tập của sinh viên
  status: CourseStatus;
  gradeQt?: number | null;     // Điểm quá trình thang 10
  gradeCk?: number | null;     // Điểm cuối kỳ thang 10
  gradeLetter?: LetterGrade | null; // Điểm chữ A, B+, B...
  gradeScale4?: number | null; // Điểm thang 4 (4.0, 3.5...)
  semesterTaken?: string;      // Kỳ đã học (VD: 2023.1, 2023.2)
  isRetake?: boolean;          // Đánh dấu môn học cải thiện
}

export interface Curriculum {
  id: string;
  code: string;            // IT1, IT2, EE1...
  name: string;            // Khoa học máy tính, Kỹ thuật phần mềm...
  faculty: string;         // Trường CNTT&TT...
  totalCredits: number;
  courses: Course[];
}
