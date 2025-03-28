import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import { toast } from "react-toastify";
import Header from "../../../components/Header/Header";
import axios from "axios";
import AuthContext from "../../../services/AuthContext";
import TeacherAddSchedule from "../../../components/Modals/TeacherAddSchedule";
import TeacherEditSchedule from "../../../components/Modals/TeacherEditSchedule";

const TeacherSchedules = () => {
  const { authState } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [qualifiedClasses, setQualifiedClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  useEffect(() => {
    if (authState?.isAuthenticated) {
      fetchSchedules();
      fetchQualifiedClasses();
    }
  }, [authState]);
  

  const fetchSchedules = async () => {
    if (!authState?.uid || !authState?.token) {
      setError("Authentication error. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://${address}:8080/teacher/get-my-schedule/${authState.uid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      setSchedules(response.data || []);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError(err.response?.data?.message || "Failed to load schedules.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQualifiedClasses = async () => {
    try {
      const response = await axios.get(
        `http://${address}:8080/class/advisory-needed`,
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );
  
      setQualifiedClasses(response.data || []);
    } catch (error) {
      console.error("Error fetching advisory-needed classes:", error);
    }
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const requestDelete = (schedid) => {
    setScheduleToDelete(schedid);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!scheduleToDelete) return;

    try {
      await axios.delete(`http://${address}:8080/teacher/delete-schedule/${scheduleToDelete}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      toast.success("Schedule deleted successfully!");
      fetchSchedules();
    } catch (err) {
      toast.error("Failed to delete schedule.");
    } finally {
      setIsConfirmDeleteOpen(false);
      setScheduleToDelete(null);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
  
    const [hour, minute] = timeString.split(":");
    let formattedHour = parseInt(hour, 10);
    const ampm = formattedHour >= 12 ? "PM" : "AM";
  
    if (formattedHour > 12) formattedHour -= 12;
    if (formattedHour === 0) formattedHour = 12;
  
    return `${formattedHour}:${minute} ${ampm}`;
  };

 

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={"TEACHER"} />
      <div className="main-content bg-white text-teal p-11">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Teacher Schedules</h1>
          <Header />
        </div>

        {/* Qualified Advisory Classes Table */}
        <div className="mb-6">
          <h2 className="text-md font-semibold mb-2">Advisory Classes</h2>
          <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-2 text-start text-md font-medium">Course Code</th>
                  <th className="px-6 py-2 text-start text-md font-medium">Course Description</th>
                  <th className="px-6 py-2 text-start text-md font-medium">Class Creator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {qualifiedClasses.length ? (
                  qualifiedClasses.map((classItem) => (
                    <tr key={classItem.cid}>
                      <td className="px-6 py-2">{classItem.courseCode}</td>
                      <td className="px-6 py-2">{classItem.courseDescription}</td>
                      <td className="px-6 py-2">{classItem.firstname} {classItem.lastname}</td>    
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No advisory classes assigned.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setIsAddModalOpen(true)}>
            + Add Schedule
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading schedules...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ScheduleTable schedules={schedules} onEdit={handleEdit} onDelete={requestDelete} formatTime={formatTime} />
        )}

        {isAddModalOpen && (
          <TeacherAddSchedule closeModal={() => setIsAddModalOpen(false)} fetchSchedules={fetchSchedules} />
        )}

        {isEditModalOpen && (
          <TeacherEditSchedule
            schedule={selectedSchedule}
            closeModal={() => setIsEditModalOpen(false)}
            fetchSchedules={fetchSchedules}
          />
        )}

        {isConfirmDeleteOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg">
              <p>Are you sure you want to delete this schedule?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => setIsConfirmDeleteOpen(false)}>Cancel</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ScheduleTable = ({ schedules, onEdit, onDelete, formatTime }) => (
  <div className="overflow-x-auto border border-gray-300 rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-teal font-medium text-white">
        <tr>
          <th className="px-6 py-2 text-start text-md font-medium">Day</th>
          <th className="px-6 py-2 text-start text-md font-medium">Time</th>
          <th className="px-6 py-2 text-start text-md font-medium">Class</th>
          <th className="px-6 py-2 text-start text-md font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((schedule) => (
          <tr key={schedule.schedid} className="hover:bg-gray-100 transition">
            <td className="px-6 py-2">{schedule.day}</td>
            <td className="px-6 py-2">
              {schedule.startTime && schedule.endTime
                ? `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`
                : "No Time Set"}
            </td>
            <td className="px-6 py-2">{schedule.className} - {schedule.courseDescription}</td>
            <td className="px-6 py-2 flex space-x-2">
              {/* Purple Edit Button */}
              <button
                onClick={() => onEdit(schedule)}
                className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition"
              >
               Edit
              </button>

              {/* Red Delete Button */}
              <button
                onClick={() => onDelete(schedule.schedid)}
                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
              >
               Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TeacherSchedules;