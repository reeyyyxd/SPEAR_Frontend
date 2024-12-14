import handleRequest from './handleRequest';
import apiClient from './apiClient';

class UserService {
  // Login
  static login(email, password) {
    return handleRequest(() => apiClient.post("/login", { email, password }));
  }

  // Register
  static register(userData) {
    return apiClient.post("/register", userData).catch((error) => {
      // Throw the error for the caller to handle
      throw error;
    });
  }

  // Refresh Token
  static refreshToken() {
    return handleRequest(() => apiClient.post("/auth/refresh"));
  }


  // Get User by ID
  static getUserById(userId) {
    return handleRequest(() => apiClient.get(`/admin/getUsers/${userId}`));
  }

  // Update Admin User
  static updateAdminUser(userId, userData) {
    return handleRequest(() => apiClient.put(`/admin/update/${userId}`, userData));
  }

  // Update Teacher User
  static updateTeacherUser(userId, userData) {
    return handleRequest(() => apiClient.put(`/teacher/update/${userId}`, userData));
  }

  // Update Student User
  static updateStudentUser(userId, userData) {
    return handleRequest(() => apiClient.put(`/student/update/${userId}`, userData));
  }

  // Delete User by Email
static deleteUser(email) {
  if (!email) throw new Error("User email is required");
  return handleRequest(() => apiClient.delete(`/admin/delete/${email}`));
}


  // Get User Profile (Currently Authenticated User)
  static getUserProfileById(userId) {
    return handleRequest(() => apiClient.get(`/user/profile/${userId}`));
  }

  // Get All Active Users
  static getAllActiveUsers() {
    return handleRequest(() => apiClient.get("/admin/users/active"));
  }

  // Get All Active Students
  static getAllActiveStudents() {
    return handleRequest(() => apiClient.get("/admin/users/active-students"));
  }

  // Get All Active Teachers
  static getAllActiveTeachers() {
    return handleRequest(() => apiClient.get("/admin/users/active-teachers"));
  }

  // Get All Soft Deleted Teachers
  static getAllDeletedTeachers() {
    return handleRequest(() => apiClient.get("/admin/users/deleted-teachers"));
  }

  // Get All Soft Deleted Students
  static getAllDeletedStudents() {
    return handleRequest(() => apiClient.get("/admin/users/deleted-students"));
  }

  // Get Teacher Interests by ID
  static getTeacherInterests(teacherId) {
    return handleRequest(() => apiClient.get(`/${teacherId}/interests`));
  }
}

export default UserService;
