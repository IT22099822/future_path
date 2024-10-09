import React, { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa6";
import Logo from "../../images/future_path_logo.png";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 5); // Delay the animation slightly for a smoother effect
  }, []);

  return (
    <>
      <div
        className={`max-w-[1820px] ps-2 mx-4 md:flex md:mx-16 mt-5 bg-gray-300/70 rounded-2xl h-16.5
        transition-transform duration-700 ease-in-out transform ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }  top-0 z-50 backdrop-blur-1xl`}
        style={{ background: "rgba(255, 255, 255, 0.8)" }} // Optional: Semi-transparent background
      >
        {/* Navigation Items */}
        <div className="flex flex-col md:flex-row md:gap-2 gap-2 justify-start">
          {/* Left Side (Mobile & Desktop) */}
          <div className="flex flex-wrap md:flex-row gap-4">
            <Link
              to="/home"
              className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-center"
            >
              Home
            </Link>
            <Link
              to="/see-all-universities"
              className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-center"
            >
              Discover Universities
            </Link>
            <Link
              to="/see-all-jobs"
              className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-center"
            >
              Discover Jobs
            </Link>
            <Link
              to="/see-all-scholarships"
              className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-center"
            >
              Discover Scholarships
            </Link>
            <Link
              to="/agents"
              className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-center"
            >
              View Agents
            </Link>
            <Link
              to="/students"
              className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-center"
            >
              View Students
            </Link>
            <Link
              to="/login"
              className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-center"
            >
              LogOut
            </Link>
          </div>
        </div>

        {/* Right Side Button */}
        <div className="hidden relative w-full md:w-48 md:flex items-center p-2 md:p-8 h-24 bg-teal-500 skew-left md:-me-5 md:m-auto mt-4 md:mt-0 cursor-pointer rounded-2xl">
          <Link
            className="text-white transform -skew-x-20 text-lg flex items-center justify-center"
            to="/students/:id/edit"
          >
            Your Profile
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavBar;
