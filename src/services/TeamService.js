import handleRequest from "./handleRequest";
import apiClient from "./apiClient";

class TeamService {
  // Create a Team
  static createTeam(projectId, groupName, token) {
    return handleRequest(
      () => apiClient.post(`/student/create-team/${projectId}`, { groupName }),
      token
    );
  }

  // Update Team Group Name
  static updateGroupName(teamId, groupName, token) {
    return handleRequest(
      () => apiClient.put(`/student/${teamId}/update-group-name`, { groupName }),
      token
    );
  }

  // Delete Team
  static deleteTeam(teamId, token) {
    return handleRequest(
      () => apiClient.delete(`/student/delete-team/${teamId}`),
      token
    );
  }

  // Transfer Leadership
  static transferLeadership(teamId, newLeaderId, token) {
    return handleRequest(
      () =>
        apiClient.put(`/team/${teamId}/transfer-leadership`, {
          newLeaderId,
        }),
      token
    );
  }

  // Add Member to Team
  static addMemberToTeam(teamId, memberId, token) {
    return handleRequest(
      () => apiClient.post(`/team/${teamId}/add-member`, { memberId }),
      token
    );
  }

  // Kick Member from Team
  static kickMemberFromTeam(teamId, memberId, token) {
    return handleRequest(
      () => apiClient.delete(`/student/${teamId}/kick-member/${memberId}`),
      token
    );
  }

  // Open Team Recruitment
  static openRecruitment(teamId, token) {
    return handleRequest(
      () => apiClient.put(`/student/${teamId}/open-recruitment`),
      token
    );
  }

  // Close Team Recruitment
  static closeRecruitment(teamId, token) {
    return handleRequest(
      () => apiClient.put(`/student/${teamId}/close-recruitment`),
      token
    );
  }

  // Get All Active Teams
  static getAllActiveTeams(token) {
    return handleRequest(() => apiClient.get("/teams/all-active"), token);
  }

  // Get Team by ID
  static getTeamById(teamId, token) {
    return handleRequest(() => apiClient.get(`/teams/${teamId}`), token);
  }

  // Get Teams by Class
  static getTeamsByClass(classId, token) {
    return handleRequest(
      () => apiClient.get(`/teams/class/${classId}`),
      token
    );
  }

  // Get My Team for a Class
  static getMyTeam(userId, classId, token) {
    return handleRequest(
      () => apiClient.get(`/team/my/${classId}`, { params: { userId } }),
      token
    );
  }
}

export default TeamService;
