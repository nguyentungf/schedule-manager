import { Course } from '../types/course';

export interface PrerequisiteNodeInfo {
  code: string;
  directPrerequisites: string[];
  allPrerequisites: string[];
  directDependents: string[];
  allDependents: string[];
  criticalityIndex: number; // Số lượng môn phụ thuộc trực tiếp + gián tiếp
}

/**
 * Xây dựng bản đồ quan hệ hai chiều: Tiên quyết (Upstream) và Phụ thuộc (Downstream)
 */
export function buildDependencyGraph(courses: Course[]): Map<string, PrerequisiteNodeInfo> {
  const nodeMap = new Map<string, PrerequisiteNodeInfo>();

  // Khởi tạo các node
  courses.forEach(c => {
    const prereqs = c.prerequisites || [];
    nodeMap.set(c.code, {
      code: c.code,
      directPrerequisites: [...prereqs],
      allPrerequisites: [],
      directDependents: [],
      allDependents: [],
      criticalityIndex: 0
    });
  });

  // Xây dựng danh sách phụ thuộc trực tiếp (Direct Dependents)
  courses.forEach(c => {
    const prereqs = c.prerequisites || [];
    prereqs.forEach(preCode => {
      const preNode = nodeMap.get(preCode);
      if (preNode) {
        if (!preNode.directDependents.includes(c.code)) {
          preNode.directDependents.push(c.code);
        }
      }
    });
  });

  // Tìm kiếm theo chiều sâu (DFS) để tìm toàn bộ quan hệ gián tiếp
  function getTransitivePrereqs(code: string, visited = new Set<string>()): string[] {
    const node = nodeMap.get(code);
    if (!node) return [];

    node.directPrerequisites.forEach(pre => {
      if (!visited.has(pre)) {
        visited.add(pre);
        getTransitivePrereqs(pre, visited);
      }
    });

    return Array.from(visited);
  }

  function getTransitiveDependents(code: string, visited = new Set<string>()): string[] {
    const node = nodeMap.get(code);
    if (!node) return [];

    node.directDependents.forEach(dep => {
      if (!visited.has(dep)) {
        visited.add(dep);
        getTransitiveDependents(dep, visited);
      }
    });

    return Array.from(visited);
  }

  // Điền allPrerequisites, allDependents và tính Criticality Index
  nodeMap.forEach((info, code) => {
    info.allPrerequisites = getTransitivePrereqs(code);
    info.allDependents = getTransitiveDependents(code);
    info.criticalityIndex = info.allDependents.length;
  });

  return nodeMap;
}

/**
 * Kiểm tra xem một môn học đã đủ điều kiện tiên quyết để đăng ký hay chưa
 */
export function isCourseEligible(course: Course, passedCourseCodes: Set<string>): boolean {
  if (course.prerequisites.length === 0) return true;
  return course.prerequisites.every(pre => passedCourseCodes.has(pre));
}

/**
 * Lấy danh sách các môn sẽ bị "chặn" (Blocked) nếu trượt một môn cụ thể
 */
export function getBlockedCoursesByFailure(
  targetCourseCode: string,
  courses: Course[],
  passedCourseCodes: Set<string>
): Course[] {
  const graph = buildDependencyGraph(courses);
  const targetInfo = graph.get(targetCourseCode);
  if (!targetInfo) return [];

  // Các môn phụ thuộc vào môn này
  const dependentCodes = new Set(targetInfo.allDependents);

  return courses.filter(c => {
    if (!dependentCodes.has(c.code)) return false;
    // Kiểm tra xem môn này có bị block trực tiếp bởi môn target không
    return c.prerequisites.includes(targetCourseCode) ||
      !isCourseEligible(c, passedCourseCodes);
  });
}
