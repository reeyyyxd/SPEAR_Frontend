import apiClient from "./apiClient";

// Utility function for handling API requests
const handleRequest = async (request, token) => {
  try {
    const response = await request({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("API Request failed:", err);
    throw err;
  }
};

class ClassService {
  // Create a new class
  static createClass(classData, token) {
    return handleRequest(
      () => apiClient.post("/teacher/create-class", classData),
      token
    );
  }
}

export default ClassService;
