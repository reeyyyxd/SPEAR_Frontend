import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../services/AuthContext";

const AddTeamMembersModal = ({ isOpen, onClose, teamId, classId }) => {
  const { authState } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableStudents, setAvailableStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const address = getIpAddress();

  function getIpAddress() {
      const hostname = window.location.hostname;
      const indexOfColon = hostname.indexOf(':');
      return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Sorting State
  const [sortOption, setSortOption] = useState("firstname"); // Default sort by First Name

  useEffect(() => {
    if (isOpen && classId) {
      fetchAvailableStudents();
    }
  }, [isOpen, classId]);

  const fetchAvailableStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://${address}:8080/team/${classId}/available-students`,
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );
      setAvailableStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Error fetching available students:", error);
      setError("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = availableStudents.filter((student) =>
      `${student.firstname} ${student.lastname}`.toLowerCase().includes(term)
    );
    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    sortStudents(e.target.value);
  };

  const sortStudents = (sortBy) => {
    const sorted = [...filteredStudents].sort((a, b) =>
      a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1
    );
    setFilteredStudents(sorted);
  };

  const handleAddMember = async (memberId) => {
    if (!teamId) return;

    try {
      setAdding(true);
      await axios.post(
        `http://${address}:8080/team/${teamId}/add-member`,
        { memberId },
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );

      // Remove the added member from the list
      setAvailableStudents((prev) => prev.filter((s) => s.uid !== memberId));
      setFilteredStudents((prev) => prev.filter((s) => s.uid !== memberId));

      alert("Member added successfully!");
    } catch (error) {
      console.error("Error adding member:", error);
      setError("Failed to add member.");
    } finally {
      setAdding(false);
    }
  };

  // Pagination Logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredStudents.length / studentsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Add Team Members</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for students..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded-lg mb-3"
        />

        {/* Sort Dropdown */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Sort by:</label>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="firstname">First Name</option>
            <option value="lastname">Last Name</option>
            <option value="email">Email</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <p>Loading students...</p>
        ) : currentStudents.length > 0 ? (
          <>
            {/* Students List */}
            <ul className="max-h-60 overflow-y-auto">
              {currentStudents.map((student) => (
                <li key={student.uid} className="flex justify-between p-2 border-b">
                  {student.firstname} {student.lastname} ({student.email})
                  <button
                    onClick={() => handleAddMember(student.uid)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    disabled={adding}
                  >
                    {adding ? "Adding..." : "Add"}
                  </button>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-3">
              <button
                onClick={prevPage}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg disabled:bg-gray-400"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="text-sm">
                Page {currentPage} of {Math.ceil(filteredStudents.length / studentsPerPage)}
              </span>
              <button
                onClick={nextPage}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg disabled:bg-gray-400"
                disabled={currentPage === Math.ceil(filteredStudents.length / studentsPerPage)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No students found.</p>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* Close Button */}
        <button onClick={onClose} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
};

export default AddTeamMembersModal;