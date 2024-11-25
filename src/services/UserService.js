import handleRequest from './handleRequest';
import apiClient from './apiClient';

class UserService {
  // Login method
  static login(email, password) {
    return handleRequest(() => apiClient.post("/login", { email, password }));
  }

  // Register method
  static register(userData) {
    return handleRequest(() => apiClient.post("/register", userData));
  }

  // Get all users (for admins)
  static getAllUsers() {
    return handleRequest(() => apiClient.get("/admin/get-all-users"));
  }

  // Get user by ID
  static getUserById(userId) {
    return handleRequest(() => apiClient.get(`/admin/get-users/${userId}`));
  }

  // Delete user
  static deleteUser(userId) {
    return handleRequest(() => apiClient.delete(`/admin/delete/${userId}`));
  }

  // Update user
  static updateUser(userId, userData) {
    return handleRequest(() => apiClient.put(`/admin/update/${userId}`, userData));
  }
}

export default UserService;
