import handleRequest from "./handleRequest";
import apiClient from "./apiClient";

class ClassService {
  static createClass(classData) {
    return handleRequest(() => apiClient.post("/teacher/create-class", classData));
  }

  static updateClass(classId, classData) {
    return handleRequest(() => apiClient.put(`/teacher/updateClass/${classId}`, classData));
  }

  static deleteClass(classId) {
    return handleRequest(() => apiClient.delete(`/teacher/deleteClass/${classId}`));
  }

  static getClassKeyByCourseCodeAndSection(courseCode, section) {
    return handleRequest(() => apiClient.get(`/teacher/getclassKey/${courseCode}/${section}`));
  }

  static getClassesCreatedByUser(userId) {
    return handleRequest(() => apiClient.get(`/teacher/classes-created/${userId}`));
  }

  static enrollStudentByClassKey(classKey) {
    return handleRequest(() => apiClient.post("/student/enroll", { classKey }));
  }

  static getClassesForStudent(studentId) {
    return handleRequest(() => apiClient.get(`/student/${studentId}/enrolled-classes`));
  }

  static getTotalUsersInClass(classId) {
    return handleRequest(() => apiClient.get(`/class/${classId}/total-users`));
  }

  static getStudentsInClass(classKey) {
    return handleRequest(() => apiClient.get(`/class/${classKey}/students`));
  }

  static getClassByCourseCode(courseCode, section) {
    return handleRequest(() =>
      apiClient.get(`/teacher/class/${courseCode}/${section}`)
    );
  }

  static getClassByCourseCodeStudent(courseCode, section) {
    return handleRequest(() =>
      apiClient.get(`/class/${courseCode}/${section}`)
    );
  }
  
  static removeStudentFromClass(classKey, email) {
    return handleRequest(() => apiClient.post("/teacher/remove-student", { classKey, email }));
  }
}

export default ClassService;
