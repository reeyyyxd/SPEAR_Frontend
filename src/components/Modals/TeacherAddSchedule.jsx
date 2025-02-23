import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AuthContext from "../../services/AuthContext";

const TeacherAddSchedule = ({ closeModal, fetchSchedules }) => {
  const { authState } = useContext(AuthContext);
  const [newSchedule, setNewSchedule] = useState({ day: "", time: "", classId: "" });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Fetch qualified adviser classes
  useEffect(() => {
    const fetchQualifiedAdviserClasses = async () => {
      if (!authState?.uid) return;

      setLoading(true);
      setFetchError(null);

      try {
        const response = await axios.get(
          `http://localhost:8080/teacher/${authState.uid}/qualified-adviser-classes`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );

        setClasses(response.data || []);
      } catch (err) {
        console.error("Error fetching adviser classes:", err);
        setFetchError("Failed to load qualified adviser classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQualifiedAdviserClasses();
  }, [authState]);

  const handleInputChange = (e) => {
    setNewSchedule({ ...newSchedule, [e.target.name]: e.target.value });
  };

  const handleCreateSchedule = async () => {
    if (!newSchedule.day || !newSchedule.time || !newSchedule.classId) {
      toast.error("All fields are required.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/teacher/create-schedule",
        { ...newSchedule, teacherId: authState.uid },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      toast.success("Schedule created successfully!");
      closeModal();
      fetchSchedules();
    } catch (err) {
      toast.error("Failed to create schedule. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Add New Schedule</h2>

        {/* Day Input */}
        <label className="block mb-2">Day:</label>
        <input
          type="text"
          name="day"
          value={newSchedule.day}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          placeholder="Enter day (e.g., Monday)"
        />

        {/* Time Input */}
        <label className="block mb-2">Time:</label>
        <input
          type="text"
          name="time"
          value={newSchedule.time}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          placeholder="Enter time (e.g., 10:00 AM - 12:00 PM)"
        />

        {/* Class Selection Dropdown */}
        <label className="block mb-2">Class:</label>
        {loading ? (
          <p className="text-sm text-gray-500 mb-3">Loading classes...</p>
        ) : fetchError ? (
          <p className="text-sm text-red-500 mb-3">{fetchError}</p>
        ) : (
          <select
            name="classId"
            value={newSchedule.classId}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          >
            <option value="">Select a Class</option>
            {classes.map((classItem) => (
              <option key={classItem.cid} value={classItem.cid}>
                {`${classItem.courseCode} - ${classItem.courseDescription} - ${classItem.section} (${classItem.firstname} ${classItem.lastname})`}
              </option>
            ))}
          </select>
        )}

        {/* Buttons */}
        <div className="flex justify-end">
          <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={closeModal}>
            Cancel
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCreateSchedule}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAddSchedule;