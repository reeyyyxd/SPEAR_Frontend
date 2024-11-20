import React, { useEffect, useState } from "react";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import UserService from "../../services/UserService";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Limit to 10 users per page

  // Fetch users from the backend
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedUsers = await UserService.getAllUsers();
      if (fetchedUsers && Array.isArray(fetchedUsers.userList)) {
        setUsers(fetchedUsers.userList); // Set the userList array to the users state
      } else {
        setError(
          'Invalid data format received. Expected an array inside "userList".'
        );
      }
    } catch (err) {
      console.error("Error fetching users:", err); // Detailed error logging
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a user
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await UserService.deleteUser(userId); // Call delete API
        setUsers(users.filter((user) => user.uid !== userId)); // Remove user from state
        alert("User deleted successfully.");
      } catch (err) {
        setError("Failed to delete the user.");
      }
    }
  };

  // Fetch users on component mount and set up polling
  useEffect(() => {
    fetchUsers(); // Initial fetch

    const fetchInterval = setInterval(() => {
      fetchUsers(); // Fetch users every 10 seconds
    }, 5000); // Re-fetch every 10 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(fetchInterval);
  }, []); // Empty dependency array, so it only runs on mount/unmount

  // Get current users based on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Total number of pages
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="p-2 min-w-full inline-block align-middle">
          <div className="overflow-hidden rounded-lg border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-teal font-medium text-white">
                  {["Name", "Email", "Role", "Action"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-6 py-2 text-start text-md font-medium"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-800">
                      {`${user.firstname} ${user.lastname}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-800">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-800">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => handleDelete(user.uid)}
                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <img src={deleteIcon} alt="delete-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-center text-gray-500 py-4">No users found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-2 mr-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg text-teal hover:bg-peach hover:text-white"
          >
            Previous
          </button>

          {/* Page number buttons */}
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number + 1)}
              className={`px-4 py-2 border rounded-lg mx-1 ${
                currentPage === number + 1
                  ? "bg-peach text-white"
                  : "text-teal hover:bg-peach hover:text-white"
              }`}
            >
              {number + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg text-teal-600 hover:bg-peach hover:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
