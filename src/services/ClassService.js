import handleRequest from "./handleRequest";
import apiClient from "./apiClient";

class ClassService {
  // Create a new class
  static createClass(classData, token) {
    return handleRequest(
      () => apiClient.post("/teacher/create-class", classData),
      token // Add token for authentication
    );
  }

  // Update a class
  static updateClass(classId, classData, token) {
    return handleRequest(
      () => apiClient.put(`/teacher/updateClass/${classId}`, classData),
      token
    );
  }

  // Delete a class
  static deleteClass(classId, token) {
    return handleRequest(
      () => apiClient.delete(`/teacher/deleteClass/${classId}`),
      token
    );
  }

  // Get a class key by course code and section
  static getClassKeyByCourseCodeAndSection(courseCode, section, token) {
    return handleRequest(
      () => apiClient.get(`/teacher/getclassKey/${courseCode}/${section}`),
      token
    );
  }

  // Get classes created by the teacher
  static getClassesCreatedByUser(userId, token) {
    return handleRequest(
      () => apiClient.get(`/teacher/classes-created/${userId}`),
      token
    );
  }

  // Enroll student in a class by class key
  static enrollStudentByClassKey(classKey, token) {
    return handleRequest(
      () => apiClient.post("/student/enroll", { classKey }),
      token
    );
  }

  // Get classes for a specific student
  static getClassesForStudent(studentId, token) {
    return handleRequest(
      () => apiClient.get(`/student/${studentId}/enrolled-classes`),
      token
    );
  }

  // Get total users in a class
  static getTotalUsersInClass(classId, token) {
    return handleRequest(
      () => apiClient.get(`/class/${classId}/total-users`),
      token
    );
  }

  // Get students in a class
  static getStudentsInClass(classKey, token) {
    return handleRequest(
      () => apiClient.get(`/class/${classKey}/students`),
      token
    );
  }

  // Get class details by course code
  static getClassByCourseCode(courseCode, token) {
    return handleRequest(
      () => apiClient.get(`/teacher/class/${courseCode}`),
      token
    );
  }

  // Remove a student from a class
  static removeStudentFromClass(classKey, email, token) {
    return handleRequest(
      () => apiClient.post("/teacher/remove-student", { classKey, email }),
      token
    );
  }
}

export default ClassService;
