// handleRequest.js (Generic API request handler)
import apiClient from "./apiClient";

const handleRequest = async (request) => {
  try {
    const response = await request();
    return response.data;
  } catch (err) {
    console.error("API Request failed:", err);
    throw err;
  }
};

export default handleRequest;
