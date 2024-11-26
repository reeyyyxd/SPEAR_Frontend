import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Facebook from '../../assets/icons/Facebook.svg';
import Instagram from '../../assets/icons/Instagram.svg';
import Tiktok from '../../assets/icons/Tiktok.svg';
import Youtube from '../../assets/icons/Youtube.svg';
import logo from "../../assets/imgs/logo-dark.png";
import AboutUs from "./AboutUs";
import Services from "./Services";


const LandingPage = () => {
  const [openNav, setOpenNav] = useState(false);
  const aboutUsRef = useRef(null);
  const servicesRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false); // Close nav on larger screens
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToAboutUs = () => {
    aboutUsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <nav className="bg-white w-full px-4 py-2 lg:px-8 lg:py-4 shadow-md">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <img src={logo} alt="Brand Logo" className="w-12 h-12" />

          {/* Text */}
          <p className="text-teal font-medium pl-4 hidden lg:block">
            Student Peer Evaluation and Review System
          </p>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex ml-auto space-x-6">
          <button
              className="text-blue-gray-900 px-4 py-2 rounded hover:text-teal-700 transition duration-300"
              onClick={scrollToServices}
          >
              Services
          </button>
          <button
              className="text-blue-gray-900 px-4 py-2 rounded hover:text-teal-700 transition duration-300"
              onClick={scrollToAboutUs}
            >
              About Us
            </button>
            <Link to="/login">
              <button className="bg-teal text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors">
                Go to App
              </button>
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="ml-auto lg:hidden h-6 w-6 text-blue-gray-900"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation (Dropdown) */}
        {openNav && (
          <div className="lg:hidden mt-2 space-y-2">
            <Link to="/login">
              <button className="block w-full bg-gray-100 text-blue-gray-900 py-2 rounded hover:bg-gray-200 transition-colors">
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded hover:from-blue-600 hover:to-purple-600 transition-all">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* Services Section */}
      <div className="min-h-screen flex items-center justify-center" ref={servicesRef}>
        <Services />
      </div>

      {/* About Us Section */}
      <div className="min-h-screen flex items-center justify-center" ref={aboutUsRef}>
        <AboutUs />
      </div>

      {/* Footer Section */}
      <footer className="bg-white text-gray-800 py-4">
       <div className="container mx-auto flex flex-col items-center justify-center">
      <div className="text-center mb-8 lg:mb-0">
      <p className="text-lg font-semibold mb-1">Capstone 1 Project</p>
      <p className="text-sm text-gray-500">Student Peer Evaluation and Review System</p>
    </div>

    {/* Right Section: Social Media Links */}
    <div className="text-center lg:text-center">
      <p className="text-lg font-bold mb-1">Get in Touch</p>
      <div className="flex justify-center lg:justify-start space-x-6">
        <a href="https://www.facebook.com/CITUniversity/" className="text-gray-800 hover:text-gray-600">
          <img src={Facebook} alt="Facebook Icon" className="h-7 w-7" />
        </a>
        <a href="https://www.tiktok.com/@cituniversity?lang=en" className="text-gray-800 hover:text-gray-600">
          <img src={Tiktok} alt="TikTok Icon" className="h-7 w-7" />
        </a>
        <a href="https://www.instagram.com/cituniversity/?hl=en" className="text-gray-800 hover:text-gray-600">
          <img src={Instagram} alt="Instagram Icon" className="h-7 w-7" />
        </a>
        <a href="https://www.youtube.com/@cit.university" className="text-gray-800 hover:text-gray-600">
          <img src={Youtube} alt="YouTube Icon" className="h-7 w-7" />
        </a>
      </div>
    </div>
  </div>

  {/* Bottom Section */}
  <div className="text-center mt-4 text-sm text-gray-500">
    <p>© 2024 Cebu Institute of Technology University. All rights reserved.</p>
  </div>
</footer>
</div>
  );
};

export default LandingPage;