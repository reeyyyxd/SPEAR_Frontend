import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../services/AuthContext";

const FormTeamModal = ({ onClose, projectId }) => {
  const { authState } = useContext(AuthContext);
  const [groupName, setGroupName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [advisers, setAdvisers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAdviser, setSelectedAdviser] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);


  const address = getIpAddress();

  function getIpAddress() {
      const hostname = window.location.hostname;
      const indexOfColon = hostname.indexOf(':');
      return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }



  // Fetch all departments when the modal opens
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`http://${address}:8080/departments`);
        setDepartments(response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch advisers when a department is selected
  useEffect(() => {
    if (!selectedDepartment) return;
    const fetchAdvisers = async () => {
      try {
        const response = await axios.get(`http://${address}:8080/advisers/${selectedDepartment}`);
        setAdvisers(response.data || []);
      } catch (error) {
        console.error("Error fetching advisers:", error);
      }
    };
    fetchAdvisers();
  }, [selectedDepartment]);

  // Fetch schedules when an adviser is selected
  useEffect(() => {
    if (!selectedAdviser) return;
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`http://${address}:8080/schedules/${selectedAdviser}`);
        setSchedules(response.data || []);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };
    fetchSchedules();
  }, [selectedAdviser]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://${address}:8080/student/create-team`,
        { 
          groupName,
          adviserId: selectedAdviser,
          scheduleId: selectedSchedule
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      alert("Team successfully created!");
      onClose(); // Close the modal
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create team. Please try again.");
      console.error("Error creating team:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Form a Team</h2>
        <form onSubmit={handleSubmit}>
          
          {/* Group Name */}
          <label htmlFor="groupName" className="block text-sm font-medium">Group Name</label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mt-2 mb-4"
            placeholder="Enter group name"
            required
          />

          {/* Department Dropdown */}
          <label htmlFor="department" className="block text-sm font-medium">Department</label>
          <select
            id="department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mt-2 mb-4"
            required
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          {/* Adviser Dropdown */}
          <label htmlFor="adviser" className="block text-sm font-medium">Adviser</label>
          <select
            id="adviser"
            value={selectedAdviser}
            onChange={(e) => setSelectedAdviser(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mt-2 mb-4"
            disabled={!selectedDepartment}
            required
          >
            <option value="">Select an adviser</option>
            {advisers.map((adviser) => (
              <option key={adviser.id} value={adviser.id}>{adviser.name}</option>
            ))}
          </select>

          {/* Schedule Dropdown */}
          <label htmlFor="schedule" className="block text-sm font-medium">Schedule</label>
          <select
            id="schedule"
            value={selectedSchedule}
            onChange={(e) => setSelectedSchedule(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mt-2 mb-4"
            disabled={!selectedAdviser}
            required
          >
            <option value="">Select a schedule</option>
            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.timeSlot} ({schedule.day})
              </option>
            ))}
          </select>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          
          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-white px-4 py-2 rounded-md hover:bg-peach hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal text-white px-4 py-2 rounded-md hover:bg-peach transition"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormTeamModal;