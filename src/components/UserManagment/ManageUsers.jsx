import React, { useState, useContext, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import AuthContext from "../../services/AuthContext";
import UsersTable from "../Tables/UsersTable";
import AddUsersModal from "../Modals/AddUsersModal";
import UserService from "../../services/UserService";


const ManageUsers = () => {
  const { authState } = useContext(AuthContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  // Function to fetch active users from the server
  const fetchUsers = async () => {
    try {
      const fetchedUsers = await UserService.getAllActiveUsers(); // Updated to use the new endpoint
      setUsers(fetchedUsers); // Update the state with the fetched data
    } catch (error) {
      console.error("Failed to fetch active users", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users initially when the component mounts
  }, []);

  const handleUserAdded = () => {
    fetchUsers(); // Refresh the user list when a new user is added
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Welcome, admin</h1>
          <Header />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-teal text-white text-sm m-2 px-4 py-2 rounded-md hover:bg-teal-600"
          >
            Add Users
          </button>
        </div>
        <UsersTable users={users} /> {/* Pass users to UsersTable */}
        <AddUsersModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onUserAdded={handleUserAdded}
        />
      </div>
    </div>
  );
};

export default ManageUsers;
