import handleRequest from "./handleRequest";
import apiClient from "./apiClient";

class ProjectProposalService {
  // Create Proposal with Features
  static createProposal(proposalData, token) {
    return handleRequest(
      () => apiClient.post("/student/create-proposal", proposalData),
      token
    );
  }

  // Update Proposal and Features
  static updateProposal(proposalId, proposalData, token) {
    return handleRequest(
      () => apiClient.put(`/student/update-proposal/${proposalId}`, proposalData),
      token
    );
  }

  // Update Adviser for Capstone
  static updateAdviser(proposalId, adviserId, token) {
    return handleRequest(
      () => apiClient.put(`/student/update-adviser/${proposalId}`, { adviserId }),
      token
    );
  }

  // Delete Proposal
  static deleteProposal(proposalId, token) {
    return handleRequest(
      () => apiClient.delete(`/student/delete-proposal/${proposalId}`),
      token
    );
  }

  // Update Denied Proposal to Pending
  static updateDeniedToPending(proposalId, token) {
    return handleRequest(
      () => apiClient.put(`/student/update-denied/${proposalId}`),
      token
    );
  }

  // Update Approved Proposal to Open Project
  static updateToOpenProject(proposalId, token) {
    return handleRequest(
      () => apiClient.put(`/student/set-to-open-project/${proposalId}`),
      token
    );
  }

  // Assign Student to Open Project
  static assignStudentToProject(proposalId, studentId, token) {
    return handleRequest(
      () =>
        apiClient.post(`/student/get-project/${proposalId}`, { studentId }),
      token
    );
  }

  // Update Proposal Status (Teacher Action)
  static updateProposalStatus(proposalId, statusData, token) {
    return handleRequest(
      () => apiClient.put(`/teacher/status-proposal/${proposalId}`, statusData),
      token
    );
  }

  // Retrieve Proposals by Class with Features
  static getProposalsByClassWithFeatures(classId, token) {
    return handleRequest(
      () => apiClient.get(`/proposals/class/with-features/${classId}`),
      token
    );
  }

  // Retrieve Proposals by Class and Student
  static getProposalsByClassAndStudent(classId, studentId, token) {
    return handleRequest(
      () =>
        apiClient.get(`/proposals/class/${classId}/student/${studentId}`),
      token
    );
  }

  // Retrieve Proposals by Adviser
  static getProposalsByAdviser(adviserId, token) {
    return handleRequest(
      () => apiClient.get(`/proposals/adviser/${adviserId}`),
      token
    );
  }

  // Retrieve Proposals by Status
  static getProposalsByStatus(status, token) {
    return handleRequest(
      () => apiClient.get(`/proposals/status/${status}`),
      token
    );
  }

  // Retrieve Approved Proposals by Class
  static getApprovedProposalsByClass(classId, token) {
    return handleRequest(
      () => apiClient.get(`/proposals/class/${classId}/approved`),
      token
    );
  }

  // Retrieve Denied Proposals by Class
  static getDeniedProposalsByClass(classId, token) {
    return handleRequest(
      () => apiClient.get(`/proposals/class/${classId}/denied`),
      token
    );
  }

  // Retrieve Pending Proposals by Class
  static getPendingProposalsByClass(classId, token) {
    return handleRequest(
      () => apiClient.get(`/proposals/class/${classId}/pending`),
      token
    );
  }

  // Retrieve Open Projects by Class
  static getOpenProjectsByClass(classId, token) {
    return handleRequest(
      () => apiClient.get(`/proposals/class/${classId}/open-projects`),
      token
    );
  }

  // Retrieve Abandoned Proposals
  static getAbandonedProposals(token) {
    return handleRequest(() => apiClient.get("/proposals/abandoned"), token);
  }
}

export default ProjectProposalService;
