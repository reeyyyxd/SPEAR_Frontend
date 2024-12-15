import handleRequest from "./handleRequest";
import apiClient from "./apiClient";

class ProjectProposalService {
  static attachHeaders(token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  static createProposal(proposalData, token) {
    return handleRequest(() =>
      apiClient.post(
        "/student/create-proposal",
        proposalData,
        this.attachHeaders(token)
      )
    );
  }

  static updateProposal(proposalId, proposalData, token) {
    return handleRequest(() =>
      apiClient.put(
        `/student/update-proposal/${proposalId}`,
        proposalData,
        this.attachHeaders(token)
      )
    );
  }

  static updateAdviser(proposalId, adviserId, token) {
    return handleRequest(() =>
      apiClient.put(
        `/student/update-adviser/${proposalId}`,
        { adviserId },
        this.attachHeaders(token)
      )
    );
  }

  static deleteProposal(proposalId, token) {
    return handleRequest(() =>
      apiClient.delete(
        `/student/delete-proposal/${proposalId}`,
        this.attachHeaders(token)
      )
    );
  }

  static getProposalsByClassWithFeatures(classId = "", token) {
    return handleRequest(() =>
      apiClient.get(
        `/proposals/class/with-features/${classId}`, // If cid is optional, handle it in your backend
        this.attachHeaders(token)
      )
    );
  }
  

  static updateProposalStatus(proposalId, statusData, token) {
    return handleRequest(() =>
      apiClient.put(
        `/teacher/status-proposal/${proposalId}`,
        statusData,
        this.attachHeaders(token)
      )
    );
  }

  static getProposalsByStatus(status, token) {
    return handleRequest(() =>
      apiClient.get(`/proposals/status/${status}`, this.attachHeaders(token))
    );
  }

  static getProposalsByClassAndStudent(classId, studentId, token) {
    return handleRequest(() =>
      apiClient.get(
        `/proposals/class/${classId}/student/${studentId}`,
        this.attachHeaders(token)
      )
    );
  }

  static getProposalsByAdviser(adviserId, token) {
    return handleRequest(() =>
      apiClient.get(
        `/proposals/adviser/${adviserId}`,
        this.attachHeaders(token)
      )
    );
  }

  static getApprovedProposalsByClass(classId, token) {
    return handleRequest(() =>
      apiClient.get(
        `/proposals/class/${classId}/approved`,
        this.attachHeaders(token)
      )
    );
  }

  static getDeniedProposalsByClass(classId, token) {
    return handleRequest(() =>
      apiClient.get(
        `/proposals/class/${classId}/denied`,
        this.attachHeaders(token)
      )
    );
  }

  static getPendingProposalsByClass(classId, token) {
    return handleRequest(() =>
      apiClient.get(
        `/proposals/class/${classId}/pending`,
        this.attachHeaders(token)
      )
    );
  }

  static getOpenProjectsByClass(classId, token) {
    return handleRequest(() =>
      apiClient.get(
        `/proposals/class/${classId}/open-projects`,
        this.attachHeaders(token)
      )
    );
  }

  static getAbandonedProposals(token) {
    return handleRequest(() =>
      apiClient.get("/proposals/abandoned", this.attachHeaders(token))
    );
  }

  static updateDeniedToPending(proposalId, token) {
    return handleRequest(() =>
      apiClient.put(
        `/student/update-denied/${proposalId}`,
        null,
        this.attachHeaders(token)
      )
    );
  }

  static updateApprovedToOpenProject(proposalId, token) {
    return handleRequest(() =>
      apiClient.put(
        `/student/set-to-open-project/${proposalId}`,
        null,
        this.attachHeaders(token)
      )
    );
  }

  static assignStudentToOpenProject(proposalId, studentId, token) {
    return handleRequest(() =>
      apiClient.post(
        `/student/get-project/${proposalId}?studentId=${studentId}`,
        null,
        this.attachHeaders(token)
      )
    );
  }

  static getProposalsByClassAndStatus(classId, status, token) {
    return handleRequest(() =>
      apiClient.get(
        `/proposals/class/${classId}/${status.toLowerCase()}`,
        this.attachHeaders(token)
      )
    );
  }

  static getProposalsByUser(studentId, token) {
    return handleRequest(() =>
      apiClient.get(
        `/proposals/user/${studentId}`,
        this.attachHeaders(token)
      )
  );
  }
}

export default ProjectProposalService;