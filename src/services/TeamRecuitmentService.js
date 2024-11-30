import handleRequest from "./handleRequest";
import apiClient from "./apiClient";

class TeamRecruitmentService {
  // Apply to a Team
  static applyToTeam(applicationData, token) {
    return handleRequest(
      () => apiClient.post("/student/apply", applicationData),
      token
    );
  }

  // Get Pending Applications for a Team
  static getPendingApplications(teamId, token) {
    return handleRequest(
      () => apiClient.get(`/team/${teamId}/pending`),
      token
    );
  }

  // Review a Recruitment Application
  static reviewApplication(recruitmentId, reviewData, token) {
    return handleRequest(
      () => apiClient.post(`/student/review/${recruitmentId}`, reviewData),
      token
    );
  }
}

export default TeamRecruitmentService;
