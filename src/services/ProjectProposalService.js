import handleRequest from "./handleRequest";
import apiClient from "./apiClient";

class ProjectProposalService {
  // Attach the Authorization header automatically for all requests
  static attachHeaders(token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // Create Proposal with Features
  static createProposal(proposalData, token) {
    return handleRequest(() =>
      apiClient.post("/student/create-proposal", proposalData, this.attachHeaders(token))
    );
  }

  // Update Proposal and Features
  static updateProposal(proposalId, proposalData, token) {
    return handleRequest(() =>
      apiClient.put(`/student/update-proposal/${proposalId}`, proposalData, this.attachHeaders(token))
    );
  }

  // Update Adviser for Capstone
  static updateAdviser(proposalId, adviserId, token) {
    return handleRequest(() =>
      apiClient.put(`/student/update-adviser/${proposalId}`, { adviserId }, this.attachHeaders(token))
    );
  }

  // Delete Proposal
  static deleteProposal(proposalId, token) {
    return handleRequest(() =>
      apiClient.delete(`/student/delete-proposal/${proposalId}`, this.attachHeaders(token))
    );
  }

  // Retrieve Proposals by Class with Features
  static getProposalsByClassWithFeatures(classId, token) {
    return handleRequest(() =>
      apiClient.get(`/proposals/class/with-features/${classId}`, this.attachHeaders(token))
    );
  }

  // Update Proposal Status (Teacher Action)
  static updateProposalStatus(proposalId, statusData, token) {
    return handleRequest(() =>
      apiClient.put(`/teacher/status-proposal/${proposalId}`, statusData, this.attachHeaders(token))
    );
  }

  // Retrieve Proposals by Status
  static getProposalsByStatus(status, token) {
    return handleRequest(() =>
      apiClient.get(`/proposals/status/${status}`, this.attachHeaders(token))
    );
  }

  // Retrieve Proposals by Class and Student
  static getProposalsByClassAndStudent(classId, studentId, token) {
    return handleRequest(() =>
      apiClient.get(`/proposals/class/${classId}/student/${studentId}`, this.attachHeaders(token))
    );
  }

  // Retrieve Proposals by Adviser
  static getProposalsByAdviser(adviserId, token) {
    return handleRequest(() =>
      apiClient.get(`/proposals/adviser/${adviserId}`, this.attachHeaders(token))
    );
  }

  // Retrieve Approved Proposals by Class
  static getApprovedProposalsByClass(classId, token) {
    return handleRequest(() =>
      apiClient.get(`/proposals/class/${classId}/approved`, this.attachHeaders(token))
    );
  }

  // Retrieve Denied Proposals by Class
  static getDeniedProposalsByClass(classId, token) {
    return handleRequest(() =>
      apiClient.get(`/proposals/class/${classId}/denied`, this.attachHeaders(token))
    );
  }

  // Retrieve Pending Proposals by Class
  static getPendingProposalsByClass(classId, token) {
    return handleRequest(() =>
      apiClient.get(`/proposals/class/${classId}/pending`, this.attachHeaders(token))
    );
  }

  // Retrieve Open Projects by Class
  static getOpenProjectsByClass(classId, token) {
    return handleRequest(() =>
      apiClient.get(`/proposals/class/${classId}/open-projects`, this.attachHeaders(token))
    );
  }

  // Retrieve Abandoned Proposals
  static getAbandonedProposals(token) {
    return handleRequest(() =>
      apiClient.get("/proposals/abandoned", this.attachHeaders(token))
    );
  }

  // Update Denied Proposal to Pending
  static updateDeniedToPending(proposalId, token) {
    return handleRequest(() =>
      apiClient.put(`/student/update-denied/${proposalId}`, null, this.attachHeaders(token))
    );
  }

  // Update Approved Proposal to Open Project
  static updateApprovedToOpenProject(proposalId, token) {
    return handleRequest(() =>
      apiClient.put(`/student/set-to-open-project/${proposalId}`, null, this.attachHeaders(token))
    );
  }

  // Assign Student to Open Project
  static assignStudentToOpenProject(proposalId, studentId, token) {
    return handleRequest(() =>
      apiClient.post(`/student/get-project/${proposalId}`, { studentId }, this.attachHeaders(token))
    );
  }

  // Retrieve Proposals by Class and Status
  static getProposalsByClassAndStatus(classId, status, token) {
    return handleRequest(() =>
      apiClient.get(`/proposals/class/${classId}/${status.toLowerCase()}`, this.attachHeaders(token))
    );
  }
}

export default ProjectProposalService;
