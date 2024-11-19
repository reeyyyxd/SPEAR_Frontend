import axios from "axios";

// Create an Axios instance with a base URL and headers
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Utility function for handling API requests
const handleRequest = async (request) => {
  try {
    const response = await request();
    return response.data;
  } catch (err) {
    // You can extend this to return a more specific error message
    console.error(err); // Optional: Log the error for debugging
    throw err;
  }
};

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

  // Get your profile (admin user)
  static getYourProfile() {
    return handleRequest(() => apiClient.get("/adminuser/get-profile"));
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
    return handleRequest(() =>
      apiClient.put(`/admin/update/${userId}`, userData)
    );
  }

  // Logout: Remove token and role from localStorage
  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
}

export default UserService;
