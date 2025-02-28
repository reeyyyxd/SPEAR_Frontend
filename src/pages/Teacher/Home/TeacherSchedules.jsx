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
      const indexOfColon = hostname.indexOf(':');
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
      // toast.error("Failed to load schedules.");
      setError(err.response?.data?.message || "Failed to load schedules.");
    } finally {
      setIsLoading(false);
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



  const fetchQualifiedClasses = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/teacher/qualified-classes/${authState.uid}`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      setQualifiedClasses(response.data || []);
    } catch (error) {
      console.error("Error fetching qualified classes:", error);
    }
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={"TEACHER"} />
      <div className="main-content bg-white text-teal p-11">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Teacher Schedules</h1>
          <Header />
        </div>

        <div className="mb-6">
          <h2 className="text-md font-semibold mb-2">Qualified Advisory Classes</h2>
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
                    <tr key={classItem.classId}>  
                      {/* subject to be changed */}
                      <td className="px-6 py-2">{classItem.courseCode}</td>
                      <td className="px-6 py-2">{classItem.courseDescription}</td>
                      <td className="px-6 py-2">{classItem.classCreator}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-gray-500">No advisory classes assigned.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add Schedule
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading schedules...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ScheduleTable schedules={schedules} />
        )}

        {isAddModalOpen && (
          <TeacherAddSchedule 
            closeModal={() => setIsAddModalOpen(false)} 
            fetchSchedules={fetchSchedules} 
          />
        )}
      </div>
    </div>
  );
};

const ScheduleTable = ({ schedules, onEdit, onDelete }) => (
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
      <tbody className="divide-y divide-gray-200">
        {schedules.length ? (
          schedules.map((schedule) => (
            <tr key={schedule.schedid} className="hover:bg-gray-100">
              <td className="px-6 py-2">{schedule.day}</td>
              <td className="px-6 py-2">{schedule.time}</td>
              <td className="px-6 py-2">{schedule.className} - {schedule.courseDescription}</td>
              <td className="px-6 py-2 flex space-x-2">
                <button className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => onEdit(schedule)}>
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => onDelete(schedule.schedid)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4 text-gray-500">No schedules available.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default TeacherSchedules;