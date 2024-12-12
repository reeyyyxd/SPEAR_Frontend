import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../services/AuthContext";
import axios from "axios";

const Settings = () => {
  const { authState } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    interests: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState || !authState.uid) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [authState, navigate]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/get-teacher/${authState.uid}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      const { email, firstname, lastname, interests } = response.data;
      setUserData((prevData) => ({
        ...prevData,
        email,
        firstname,
        lastname,
        interests,
      }));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      alert("Error fetching user data. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (userData.newPassword !== userData.confirmNewPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/teacher/update/${authState.uid}`,
        {
          ...userData,
          password: userData.currentPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Profile and password updated successfully!");
        navigate(`/teacher/class/${classData.courseCode}`);
      } else {
        alert(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please check your current password.");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="TEACHER" />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Teacher Settings</h1>
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
                />
                </div>

                <div>
                <label htmlFor="interests" className="block mb-2 font-medium">
                    Interests
                </label>
                <input
                    type="text"
                    id="interests"
                    name="interests"
                    value={userData.interests}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-3"
                />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["currentPassword", "newPassword", "confirmNewPassword"].map((field) => (
                <div key={field}>
                    <label htmlFor={field} className="block mb-2 font-medium">
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <div className="relative">
                    <input
                        type={showPassword[field] ? "text" : "password"}
                        id={field}
                        name={field}
                        value={userData[field]}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-3"
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field)}
                        className="absolute right-3 top-3 text-gray-500"
                    >
                        {showPassword[field] ? "Hide" : "Show"}
                    </button>
                    </div>
                </div>
                ))}
            </div>
            <div className="flex justify-end mt-6">
                <button
                type="submit"
                className="bg-teal text-white px-6 py-2 rounded-lg hover:bg-teal-dark transition duration-300"
                >
                Save Changes
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
