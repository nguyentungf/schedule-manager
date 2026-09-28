import { useState, useEffect, useCallback } from 'react';
import { DashboardState, StudentInfo, DashboardSettings, CustomGradeScaleSettings } from '../types/state';
import { Deadline } from '../types/deadline';
import { Course } from '../types/course';
import { ScheduleItem } from '../types/schedule';
import { getInitialSampleState } from '../data/sampleData';
import { ParsedCourseResult, ParsedStudentInfo } from '../engines/sisParser';
import { getCurriculum, AVAILABLE_MAJORS } from '../data/curricula';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'HUST_DASHBOARD_DATA_V1';

export function useDashboardState() {
  const [state, setState] = useState<DashboardState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Đảm bảo có mảng schedule và settings hợp lệ
        if (!parsed.schedule) {
          parsed.schedule = [];
        }
        if (!parsed.settings?.gradeScales) {
          parsed.settings = {
            theme: 'dark',
            soundEnabled: true,
            urgentThresholdHours: 24,
            warningThresholdHours: 72,
            gradeScales: {
              minA: 8.5,
              minBPlus: 8.0,
              minB: 7.0,
              minCPlus: 6.5,
              minC: 5.5,
              minDPlus: 5.0,
              minD: 4.0,
              failFinalExamMin: 3.0
            },
            autoContrast: true
          };
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Không thể đọc dữ liệu từ localStorage, sử dụng dữ liệu mẫu.', e);
    }
    return getInitialSampleState();
  });

  // Tự động lưu vào localStorage mỗi khi state thay đổi (Debounce 250ms để tối ưu hóa hiệu năng phản hồi UI)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Lỗi khi ghi vào localStorage:', e);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [state]);

  // Quản lý Deadlines
  const addDeadline = useCallback((deadline: Omit<Deadline, 'id'>) => {
    const newDeadline: Deadline = {
      ...deadline,
      id: 'dl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
    };
    setState(prev => ({
      ...prev,
      deadlines: [newDeadline, ...prev.deadlines],
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const updateDeadline = useCallback((id: string, updates: Partial<Deadline>) => {
    setState(prev => ({
      ...prev,
      deadlines: prev.deadlines.map(d => d.id === id ? { ...d, ...updates } : d),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const deleteDeadline = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      deadlines: prev.deadlines.filter(d => d.id !== id),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const toggleDeadlineComplete = useCallback((id: string) => {
    setState(prev => {
      let isNowCompleted = false;
      const updated = prev.deadlines.map(d => {
        if (d.id === id) {
          isNowCompleted = !d.completed;
          return {
            ...d,
            completed: isNowCompleted,
            completedAt: isNowCompleted ? new Date().toISOString() : null
          };
        }
        return d;
      });

      if (isNowCompleted && prev.settings.soundEnabled) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch (e) {
          // ignore
        }
      }

      return {
        ...prev,
        deadlines: updated,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  // Quản lý Thời Khóa Biểu (Schedule)
  const addScheduleItem = useCallback((item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: 'sch_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
    };
    setState(prev => ({
      ...prev,
      schedule: [...prev.schedule, newItem],
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const updateScheduleItem = useCallback((id: string, updates: Partial<ScheduleItem>) => {
    setState(prev => ({
      ...prev,
      schedule: prev.schedule.map(s => s.id === id ? { ...s, ...updates } : s),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const deleteScheduleItem = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      schedule: prev.schedule.filter(s => s.id !== id),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const importScheduleItems = useCallback((items: ScheduleItem[]) => {
    setState(prev => ({
      ...prev,
      schedule: items,
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Quản lý Học phần (Courses)
  const updateCourse = useCallback((courseId: string, updates: Partial<Course>) => {
    setState(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === courseId ? { ...c, ...updates } : c),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const addCourse = useCallback((newCourse: Course) => {
    setState(prev => {
      const existingIdx = prev.courses.findIndex(c => c.code === newCourse.code);
      let updatedCourses = [...prev.courses];
      if (existingIdx !== -1) {
        updatedCourses[existingIdx] = { ...updatedCourses[existingIdx], ...newCourse };
      } else {
        updatedCourses.push(newCourse);
      }
      return {
        ...prev,
        courses: updatedCourses,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  const deleteCourse = useCallback((courseId: string) => {
    setState(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c.id !== courseId),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const batchUpdateCourses = useCallback((updatedCourses: Course[]) => {
    setState(prev => {
      const map = new Map(updatedCourses.map(c => [c.id, c]));
      return {
        ...prev,
        courses: prev.courses.map(c => map.has(c.id) ? map.get(c.id)! : c),
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  const batchDeleteCourses = useCallback((courseIds: string[]) => {
    const idSet = new Set(courseIds);
    setState(prev => ({
      ...prev,
      courses: prev.courses.filter(c => !idSet.has(c.id)),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  /**
   * Chuyển đổi mã ngành đào tạo
   * Logic: Khi chọn mã ngành khác thì KHÔNG lưu lại thông tin của mã ngành cũ,
   * khởi tạo mới 100% danh sách học phần theo đúng khung CTĐT của ngành mới.
   */
  const changeMajor = useCallback((newMajorCode: string) => {
    const curr = getCurriculum(newMajorCode);
    const foundMajor = AVAILABLE_MAJORS.find(m => m.code === newMajorCode);
    setState(prev => ({
      ...prev,
      studentInfo: {
        ...prev.studentInfo,
        major: newMajorCode,
        majorName: foundMajor ? foundMajor.name : curr.name
      },
      // Đặt lại toàn bộ danh sách môn học theo CTĐT ngành mới
      courses: curr.courses.map(c => ({ ...c })),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Cập nhật thông tin sinh viên (nếu đổi mã ngành thì tự động reset danh sách môn học của ngành cũ)
  const updateStudentInfo = useCallback((updates: Partial<StudentInfo>) => {
    setState(prev => {
      let newCourses = prev.courses;
      if (updates.major && updates.major !== prev.studentInfo.major) {
        const curr = getCurriculum(updates.major);
        const found = AVAILABLE_MAJORS.find(m => m.code === updates.major);
        updates.majorName = updates.majorName || (found ? found.name : curr.name);
        // Reset sạch sẽ sang các môn của ngành mới
        newCourses = curr.courses.map(c => ({ ...c }));
      }

      return {
        ...prev,
        studentInfo: { ...prev.studentInfo, ...updates },
        courses: newCourses,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  // Cập nhật Cài đặt hệ thống
  const updateSettings = useCallback((updates: Partial<DashboardSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Cập nhật Thang điểm quy đổi
  const updateGradeScales = useCallback((updates: Partial<CustomGradeScaleSettings>) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        gradeScales: { ...prev.settings.gradeScales, ...updates }
      },
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Nạp dữ liệu mẫu
  const resetToSampleData = useCallback(() => {
    const sample = getInitialSampleState();
    setState(sample);
  }, []);

  // Nhập dữ liệu từ file JSON
  const importFullState = useCallback((imported: DashboardState) => {
    setState(imported);
  }, []);

  // Tích hợp dữ liệu từ SIS Parser vào danh sách môn học
  const mergeSisCourses = useCallback((parsedList: ParsedCourseResult[], newStudentInfo?: ParsedStudentInfo) => {
    setState(prev => {
      let baseCourses = prev.courses;
      let nextStudentInfo = { ...prev.studentInfo };

      // Nếu có thông tin sinh viên và mã ngành mới khác mã ngành cũ -> nạp lại CTĐT ngành mới
      if (newStudentInfo?.major && newStudentInfo.major !== prev.studentInfo.major) {
        const newCurr = getCurriculum(newStudentInfo.major);
        const found = AVAILABLE_MAJORS.find(m => m.code === newStudentInfo.major);
        baseCourses = newCurr.courses.map(c => ({ ...c }));
        nextStudentInfo = {
          ...nextStudentInfo,
          major: newStudentInfo.major,
          majorName: found ? found.name : newCurr.name,
          name: newStudentInfo.name || nextStudentInfo.name,
          studentId: newStudentInfo.studentId || nextStudentInfo.studentId,
          cohort: newStudentInfo.cohort || nextStudentInfo.cohort
        };
      } else if (newStudentInfo) {
        if (newStudentInfo.name) nextStudentInfo.name = newStudentInfo.name;
        if (newStudentInfo.studentId) nextStudentInfo.studentId = newStudentInfo.studentId;
        if (newStudentInfo.cohort) nextStudentInfo.cohort = newStudentInfo.cohort;
      }

      const courseMap = new Map<string, Course>(baseCourses.map(c => [c.code, c]));

      parsedList.forEach(item => {
        const existing = courseMap.get(item.code);
        const isPassed = item.gradeScale4 !== null && item.gradeScale4 > 0;
        const status = isPassed
          ? 'passed'
          : (item.gradeLetter === 'F'
            ? 'failed'
            : (existing?.status ?? (item.creditsTaken ? 'in_progress' : 'planned')));

        if (existing) {
          const validName = (item.name && !item.name.startsWith('Học phần ')) ? item.name : existing.name;
          courseMap.set(item.code, {
            ...existing,
            name: validName,
            credits: item.credits || existing.credits,
            term: item.term ?? existing.term,
            isRequired: item.isRequired ?? existing.isRequired,
            department: item.department || existing.department,
            categoryName: item.category || existing.categoryName,
            creditsTaken: item.creditsTaken ?? existing.creditsTaken,
            codeTaken: item.codeTaken || existing.codeTaken,
            ects: item.ects ?? existing.ects,
            isLearned: item.isLearned ?? existing.isLearned,
            prerequisites: (item.prerequisites && item.prerequisites.length > 0) ? item.prerequisites : existing.prerequisites,
            isModuleCourse: item.isModuleCourse ?? existing.isModuleCourse,
            isEnglishCourse: item.isEnglishCourse ?? existing.isEnglishCourse,
            conditionString: item.conditionString || existing.conditionString,
            tuitionCredits: item.tuitionCredits ?? existing.tuitionCredits,
            duration: item.duration || existing.duration,
            englishName: item.englishName || existing.englishName,
            gradeQt: item.gradeQt ?? existing.gradeQt,
            gradeCk: item.gradeCk ?? existing.gradeCk,
            gradeLetter: item.gradeLetter ?? existing.gradeLetter,
            gradeScale4: item.gradeScale4 ?? existing.gradeScale4,
            status
          });
        } else {
          courseMap.set(item.code, {
            id: 'custom_' + item.code,
            code: item.code,
            name: item.name,
            credits: item.credits,
            term: item.term || 1,
            weightQt: 0.3,
            weightCk: 0.7,
            difficulty: 3.5,
            prerequisites: item.prerequisites || [],
            isRequired: item.isRequired,
            department: item.department,
            categoryName: item.category,
            creditsTaken: item.creditsTaken,
            codeTaken: item.codeTaken,
            ects: item.ects,
            isLearned: item.isLearned,
            isPhysicalEducation: item.isPhysicalEducation,
            isGraduateOrEngineer: item.isGraduateOrEngineer,
            isElectiveSupport: item.isElectiveSupport,
            isModuleCourse: item.isModuleCourse,
            isEnglishCourse: item.isEnglishCourse,
            conditionString: item.conditionString,
            tuitionCredits: item.tuitionCredits,
            duration: item.duration,
            englishName: item.englishName,
            status,
            gradeQt: item.gradeQt,
            gradeCk: item.gradeCk,
            gradeLetter: item.gradeLetter,
            gradeScale4: item.gradeScale4
          });
        }
      });

      return {
        ...prev,
        studentInfo: nextStudentInfo,
        courses: Array.from(courseMap.values()),
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  const toggleEnglishExemption = useCallback((exempt: boolean) => {
    setState(prev => {
      const updatedCourses = prev.courses.map(c => {
        const isEng = c.isEnglishCourse || c.code.startsWith('FL') || /tiếng anh|ngoại ngữ|english/i.test(c.name);
        if (isEng) {
          return {
            ...c,
            isEnglishCourse: true,
            status: exempt && !c.isLearned ? ('passed' as const) : c.status,
            isRequired: !exempt
          };
        }
        return c;
      });

      return {
        ...prev,
        studentInfo: {
          ...prev.studentInfo,
          exemptEnglish: exempt
        },
        settings: {
          ...prev.settings,
          exemptEnglish: exempt
        },
        courses: updatedCourses,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  const mergeCourseCatalog = useCallback((catalogList: Array<{
    code: string;
    name?: string;
    credits?: number;
    conditionString?: string;
    prerequisites?: string[];
    tuitionCredits?: number | null;
    duration?: string;
    englishName?: string;
    weightCk?: number;
    weightQt?: number;
    objectives?: string;
    content?: string;
    department?: string;
  }>) => {
    setState(prev => {
      const catalogMap = new Map(catalogList.map(item => [item.code.toUpperCase().replace(/\s+/g, ''), item]));
      const existingCodes = new Set(prev.courses.map(c => c.code.toUpperCase().replace(/\s+/g, '')));

      // 1. Cập nhật các môn đã có trong danh sách
      const updatedCourses = prev.courses.map(c => {
        const cat = catalogMap.get(c.code.toUpperCase().replace(/\s+/g, ''));
        if (!cat) return c;

        return {
          ...c,
          conditionString: cat.conditionString || c.conditionString,
          prerequisites: (cat.prerequisites && cat.prerequisites.length > 0) ? cat.prerequisites : c.prerequisites,
          tuitionCredits: cat.tuitionCredits ?? c.tuitionCredits,
          duration: cat.duration || c.duration,
          englishName: cat.englishName || c.englishName,
          weightCk: cat.weightCk ?? c.weightCk,
          weightQt: cat.weightQt ?? c.weightQt,
          courseObjectives: cat.objectives || c.courseObjectives,
          courseContent: cat.content || c.courseContent,
          department: cat.department || c.department
        };
      });

      // 2. Thêm mới các môn chưa có trong danh sách (VD tra cứu thêm ET2050)
      const newCoursesToAdd: Course[] = [];
      catalogList.forEach(item => {
        const normCode = item.code.toUpperCase().replace(/\s+/g, '');
        if (!existingCodes.has(normCode)) {
          // Tính năm học và kỳ học tự động dựa trên chữ số đầu tiên của mã môn (VD: ET2050 -> Năm 2 -> Kỳ 3)
          const digitMatch = normCode.match(/[A-Z]{2,4}([1-5])[0-9]{3}/);
          const year = digitMatch ? parseInt(digitMatch[1]) : 1;
          const term = (year - 1) * 2 + 1; // Mặc định kỳ lẻ của năm học đó

          newCoursesToAdd.push({
            id: 'catalog_' + normCode,
            code: normCode,
            name: item.name || ('Học phần ' + normCode),
            credits: item.credits || 3,
            term,
            weightQt: item.weightQt ?? 0.3,
            weightCk: item.weightCk ?? 0.7,
            difficulty: 3.5,
            prerequisites: item.prerequisites || [],
            conditionString: item.conditionString || '',
            tuitionCredits: item.tuitionCredits,
            duration: item.duration,
            englishName: item.englishName,
            courseObjectives: item.objectives,
            courseContent: item.content,
            department: item.department,
            status: 'planned',
            gradeQt: null,
            gradeCk: null,
            gradeLetter: null,
            gradeScale4: null
          });
          existingCodes.add(normCode);
        }
      });

      return {
        ...prev,
        courses: [...updatedCourses, ...newCoursesToAdd],
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  const importCoursesFromExcel = useCallback((newCourses: Course[], overwrite: boolean) => {
    setState(prev => {
      let finalCourses: Course[];
      if (overwrite) {
        finalCourses = newCourses;
      } else {
        const courseMap = new Map<string, Course>(prev.courses.map(c => [c.code, c]));
        newCourses.forEach(nc => {
          courseMap.set(nc.code, nc);
        });
        finalCourses = Array.from(courseMap.values());
      }
      return {
        ...prev,
        courses: finalCourses,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  const importScheduleFromExcel = useCallback((newSchedule: ScheduleItem[], overwrite: boolean) => {
    setState(prev => {
      return {
        ...prev,
        schedule: overwrite ? newSchedule : [...prev.schedule, ...newSchedule],
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  const purgeAllData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    const cleanState: DashboardState = {
      version: '1.0.0',
      studentInfo: {
        name: 'Sinh Viên Bách Khoa',
        studentId: '',
        major: 'ET1',
        majorName: 'Kỹ thuật Điện tử - Viễn thông',
        classCode: '',
        cohort: 'K68',
        currentTerm: 1,
        targetCpa: 3.2
      },
      deadlines: [],
      courses: [],
      schedule: [],
      semesterHistory: [],
      settings: {
        theme: 'dark',
        soundEnabled: true,
        urgentThresholdHours: 24,
        warningThresholdHours: 72,
        gradeScales: {
          minA: 8.5,
          minBPlus: 8.0,
          minB: 7.0,
          minCPlus: 6.5,
          minC: 5.5,
          minDPlus: 5.0,
          minD: 4.0,
          failFinalExamMin: 3.0
        },
        autoContrast: true
      },
      lastUpdated: new Date().toISOString()
    };
    setState(cleanState);
  }, []);

  const updateDashboardCardOrder = useCallback((newOrder: string[]) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        dashboardCardOrder: newOrder
      },
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const toggleHideDashboardCard = useCallback((cardId: string) => {
    setState(prev => {
      const currentHidden = prev.settings.dashboardHiddenCards || [];
      const isHidden = currentHidden.includes(cardId);
      const nextHidden = isHidden
        ? currentHidden.filter(id => id !== cardId)
        : [...currentHidden, cardId];

      return {
        ...prev,
        settings: {
          ...prev.settings,
          dashboardHiddenCards: nextHidden
        },
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  const restoreAllDashboardCards = useCallback(() => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        dashboardHiddenCards: []
      },
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const updateEnglishExemptions = useCallback((courses: string[]) => {
    setState(prev => ({
      ...prev,
      studentInfo: {
        ...prev.studentInfo,
        exemptEnglishCourses: courses,
        exemptEnglish: courses.length > 0
      },
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const applyGeneratedSchedule = useCallback((items: ScheduleItem[], overwrite = true) => {
    setState(prev => ({
      ...prev,
      schedule: overwrite ? items : [...prev.schedule, ...items],
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  return {
    state,
    addDeadline,
    updateDeadline,
    deleteDeadline,
    toggleDeadlineComplete,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    importScheduleItems,
    updateCourse,
    addCourse,
    deleteCourse,
    batchUpdateCourses,
    batchDeleteCourses,
    changeMajor,
    updateStudentInfo,
    updateSettings,
    updateGradeScales,
    resetToSampleData,
    importFullState,
    mergeSisCourses,
    toggleEnglishExemption,
    updateEnglishExemptions,
    mergeCourseCatalog,
    importCoursesFromExcel,
    importScheduleFromExcel,
    purgeAllData,
    updateDashboardCardOrder,
    toggleHideDashboardCard,
    restoreAllDashboardCards,
    applyGeneratedSchedule
  };
}
