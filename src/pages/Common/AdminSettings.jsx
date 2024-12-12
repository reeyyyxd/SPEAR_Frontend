import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

const AdminSettings = () => {
  const [userData, setUserData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    // Replace with API call to fetch admin user details
    const mockUserData = {
      email: "admin@example.com",
      firstname: "Admin",
      lastname: "User",
    };
    setUserData((prevData) => ({
      ...prevData,
      ...mockUserData,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    if (userData.newPassword !== userData.confirmNewPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    // Replace with API call to save user data
    console.log("Updated Admin Data:", userData);
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="ADMIN" />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Settings</h1>
          <Header />
        </div>

        <form
          className="bg-gray-100 shadow-md rounded-lg p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveChanges();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="w-full border rounded-md p-3"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="firstname" className="block mb-2 font-medium">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={userData.firstname}
                onChange={handleInputChange}
                className="w-full border rounded-md p-3"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block mb-2 font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={userData.lastname}
                onChange={handleInputChange}
                className="w-full border rounded-md p-3"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="currentPassword" className="block mb-2 font-medium">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={userData.currentPassword}
                onChange={handleInputChange}
                className="w-full border rounded-md p-3"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block mb-2 font-medium">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={userData.newPassword}
                onChange={handleInputChange}
                className="w-full border rounded-md p-3"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block mb-2 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={userData.confirmNewPassword}
                onChange={handleInputChange}
                className="w-full border rounded-md p-3"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-teal text-white px-6 py-2 rounded-lg hover:bg-teal-dark transition duration-300"
              >
                Edit Profile
              </button>
            ) : (
              <button
                type="submit"
                className="bg-teal text-white px-6 py-2 rounded-lg hover:bg-teal-dark transition duration-300"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
