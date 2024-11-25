import handleRequest from "./handleRequest";
import apiClient from "./apiClient";

class ClassService {
  // Create a new class
  static createClass(classData, token) {
    return handleRequest(() =>
      apiClient.post("/teacher/create-class", classData),
      token // Add token for authentication
    );
  }

  // Update a class
  static updateClass(classId, classData, token) {
    return handleRequest(() =>
      apiClient.put(`/teacher/updateClass/${classId}`, classData),
      token
    );
  }

  // Get a class by its key
  static getClassKeyByCourseCodeAndSection(courseCode, section, token) {
    return handleRequest(() =>
      apiClient.get(`/teacher/getclassKey/${courseCode}/${section}`),
      token
    );
  }

  // Enroll student by class key
  static enrollStudentByClassKey(classKey, token) {
    return handleRequest(() =>
      apiClient.post("/student/enroll", { classKey }),
      token
    );
  }

  // Get total users in class
  static getTotalUsersInClass(classId, token) {
    return handleRequest(() =>
      apiClient.get(`/class/${classId}/total-users`),
      token
    );
  }

  // Get classes created by the teacher
  static getClassesCreatedByUser(userId, token) {
    return handleRequest(() =>
      apiClient.get(`/teacher/classes-created/${userId}`),
      token
    );
  }

  // Get students in a class
  static getStudentsInClass(classKey, token) {
    return handleRequest(() =>
      apiClient.get(`/class/${classKey}/students`),
      token
    );
  }
}

export default ClassService;
