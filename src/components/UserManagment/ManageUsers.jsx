import React, { useState, useContext, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import AuthContext from "../../services/AuthContext";
import UsersTable from "../Tables/UsersTable";
import AddUsersModal from "../Modals/AddUsersModal";

const ManageUsers = () => {
  const { authState } = useContext(AuthContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  // Fetch active users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/admin/users/active", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch active users.");
      }

      const fetchedUsers = await response.json();
      setUsers(fetchedUsers || []);
    } catch (error) {
      console.error("Failed to fetch active users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAdded = () => {
    fetchUsers(); 
  };

  const handleUserDeleted = (deletedEmail) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.email !== deletedEmail));
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Welcome, Admin</h1>
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
        {/* Pass `handleUserDeleted` to UsersTable */}
        <UsersTable users={users} onUserDeleted={handleUserDeleted} />
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
