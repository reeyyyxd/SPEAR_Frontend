import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import { toast } from "react-toastify";
import Header from "../../../components/Header/Header";
import axios from "axios";
import AuthContext from "../../../services/AuthContext";

const TeacherSchedules = () => {
  const { authState } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ day: "", time: "" });

  const fetchSchedules = async () => {
    if (!authState || !authState.uid || !authState.token) {
      setError("Authentication error. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const teacherId = authState.uid;

      console.log(`Fetching schedules for teacherId: ${teacherId}`); // Debug log

      const response = await axios.get(
        `http://localhost:8080/teacher/get-my-schedule/${teacherId}`,
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
      toast.error("Failed to load schedules. Please try again.");
      setError(err.response?.data?.message || "Failed to load schedules.");
    } finally {
      setIsLoading(false);
    }
  };

  //change something (modal and getting the tables)

  useEffect(() => {
    if (authState?.isAuthenticated) {
      fetchSchedules();
    }
  }, [authState]);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={"TEACHER"} />
      <div className="main-content bg-white text-teal p-11">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Teacher Schedules</h1>
          <Header />
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading schedules...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ScheduleTable schedules={schedules} />
        )}
      </div>
    </div>
  );
};

const ScheduleTable = ({ schedules }) => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="p-2 min-w-full inline-block align-middle">
          <div className="overflow-hidden rounded-lg border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-teal font-medium text-white">
                  <th className="px-6 py-2 text-start text-md font-medium">Day</th>
                  <th className="px-6 py-2 text-start text-md font-medium">Time</th>
                  <th className="px-6 py-2 text-start text-md font-medium">Class Code</th>
                  <th className="px-6 py-2 text-start text-md font-medium">Class Description</th>
                  <th className="px-6 py-2 text-start text-md font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedules.length > 0 ? (
                  schedules.map((schedule) => (
                    <tr key={schedule.schedid} className="hover:bg-gray-100">
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-teal-800">{schedule.day}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-teal-800">{schedule.time}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-teal-800">{schedule.classCode}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-teal-800">{schedule.classDescription}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-teal-800">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-4">
                      No schedules available.   
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSchedules;