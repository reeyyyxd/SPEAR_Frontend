import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";
import axios from "axios";

//fix the schedule
const AdminRecycleBin = () => {
  const [deletedData, setDeletedData] = useState([]);
  const [category, setCategory] = useState("users"); // Default filter
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const address = getIpAddress();

  function getIpAddress() {
      const hostname = window.location.hostname;
      const indexOfColon = hostname.indexOf(':');
      return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  // Fetch deleted data based on selected category
  const fetchDeletedData = async (selectedCategory) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Placeholder API URL (Replace when you provide the actual API)
      const response = await axios.get(`http://${address}:8080/recycle-bin/${selectedCategory}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDeletedData(response.data || []);
    } catch (err) {
      console.error("Error fetching deleted data:", err);
      toast.error("Failed to load deleted records. Please try again.");
      setError(err.message || "Failed to load deleted records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedData(category);
  }, [category]);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={"ADMIN"} />
      <div className="main-content bg-white text-teal p-11">
        {/* Header Section */}
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Admin Recycle Bin</h1>
          <Header />
        </div>

        {/* Filter by Category Section */}
        <div className="flex justify-between items-center mb-4">
          <label htmlFor="categoryFilter" className="font-medium text-gray-700">
            View Deleted:
          </label>
          <select
            id="categoryFilter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 bg-white"
          >
            <option value="users">Users</option>
            <option value="classes">Classes</option>
            <option value="teams">Teams</option>
          </select>
        </div>

        {/* Conditional Content (Loading, Error, Deleted Data) */}
        {isLoading ? (
          <p className="text-center text-gray-500">Loading deleted records...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <DeletedTable deletedData={deletedData} category={category} />
        )}
      </div>
    </div>
  );
};

const DeletedTable = ({ deletedData, category }) => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="p-2 min-w-full inline-block align-middle">
          <div className="overflow-hidden rounded-lg border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-teal font-medium text-white">
                  <th className="px-6 py-2 text-start text-md font-medium">ID</th>
                  <th className="px-6 py-2 text-start text-md font-medium">Name</th>
                  <th className="px-6 py-2 text-start text-md font-medium">Deleted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deletedData.length > 0 ? (
                  deletedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-teal-800">
                        {item.id}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-teal-800">
                        {item.name || "N/A"}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-teal-800">
                        {item.deletedAt || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 py-4">
                      No deleted records available.
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

export default AdminRecycleBin;
