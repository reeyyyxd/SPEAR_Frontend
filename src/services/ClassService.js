import apiClient from "./apiClient";

// Utility function for handling API requests

//some apis
// /teacher/createClass
// /teacher/getallclasses
// /teacher/updateClass/{id}
// /teacher/deleteClass/{id}
// /teacher/getclassKey/{courseCode}
// /student/enrollClass/{classKey}

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
      () => apiClient.post("/teacher/createClass", classData),
      token
    );
  }
}

export default ClassService;


