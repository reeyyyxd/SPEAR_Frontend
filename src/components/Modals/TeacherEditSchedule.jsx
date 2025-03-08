import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AuthContext from "../../services/AuthContext";

const TeacherEditSchedule = ({ schedule, closeModal, fetchSchedules }) => {
  const { authState } = useContext(AuthContext);
  const [updatedSchedule, setUpdatedSchedule] = useState({
    day: schedule.day, // DayOfWeek enum
    startTime: schedule.startTime, // New field
    endTime: schedule.endTime, // New field
    classId: schedule.classId,
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  const dayOptions = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

  // Fetch qualified classes for the dropdown
  useEffect(() => {
    const fetchQualifiedAdviserClasses = async () => {
      if (!authState?.uid) return;

      setLoading(true);
      setFetchError(null);

      try {
        const response = await axios.get(
          `http://${address}:8080/teacher/${authState.uid}/qualified-adviser-classes`,
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
    setUpdatedSchedule({ ...updatedSchedule, [e.target.name]: e.target.value });
  };

  const handleUpdateSchedule = async () => {
    if (!updatedSchedule.day || !updatedSchedule.startTime || !updatedSchedule.endTime || !updatedSchedule.classId) {
      toast.error("All fields are required.");
      return;
    }

    try {
      await axios.put(
        `http://${address}:8080/teacher/update-schedule/${schedule.schedid}`,
        { ...updatedSchedule, teacherId: authState.uid }, // Ensure correct API structure
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      toast.success("Schedule updated successfully!");
      closeModal();
      fetchSchedules();
    } catch (err) {
      toast.error("Failed to update schedule. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Schedule</h2>

        {/* Day Dropdown */}
        <label className="block mb-2">Day:</label>
        <select
          name="day"
          value={updatedSchedule.day}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-3"
        >
          <option value="">Select a Day</option>
          {dayOptions.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        {/* Start Time Input */}
        <label className="block mb-2">Start Time:</label>
        <input
          type="time"
          name="startTime"
          value={updatedSchedule.startTime}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-3"
        />

        {/* End Time Input */}
        <label className="block mb-2">End Time:</label>
        <input
          type="time"
          name="endTime"
          value={updatedSchedule.endTime}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-3"
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
            value={updatedSchedule.classId}
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
          <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={handleUpdateSchedule}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherEditSchedule;