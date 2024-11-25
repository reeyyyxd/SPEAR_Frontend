import handleRequest from "./handleRequest";
import apiClient from "./apiClient";

class ClassService {
  // Create a new class
  static createClass(classData) {
    return handleRequest(() =>
      apiClient.post("/teacher/create-class", classData)
    );
  }

  // Update a class
  static updateClass(classId, classData) {
    return handleRequest(() =>
      apiClient.put(`/teacher/updateClass/${classId}`, classData)
    );
  }

  // Get a class by its key
  static getClassKeyByCourseCodeAndSection(courseCode, section) {
    return handleRequest(() =>
      apiClient.get(`/teacher/getclassKey/${courseCode}/${section}`)
    );
  }

  // Enroll student by class key
  static enrollStudentByClassKey(classKey) {
    return handleRequest(() => apiClient.post("/student/enroll", { classKey }));
  }

  // Get total users in class
  static getTotalUsersInClass(classId) {
    return handleRequest(() => apiClient.get(`/class/${classId}/total-users`));
  }

  // Get classes created by the teacher
  static getClassesCreatedByUser(userId) {
    return handleRequest(() =>
      apiClient.get(`/teacher/classes-created/${userId}`)
    );
  }

  // Get students in a class
  static getStudentsInClass(classKey) {
    return handleRequest(() => apiClient.get(`/class/${classKey}/students`));
  }
}

export default ClassService;
