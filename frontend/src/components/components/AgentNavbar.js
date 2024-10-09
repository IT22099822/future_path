import React, { useState, useEffect } from "react";
import Logo from "../../images/future_path_logo.png"; // Assuming you still want the logo
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
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-gray-300/70 rounded-tr-2xl rounded-br-2xl
      transition-transform duration-700 ease-in-out transform ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } z-50 backdrop-blur-1xl`}
      style={{ background: "rgba(255, 255, 255, 0.8)" }} // Optional: Semi-transparent background
    >
      {/* Logo Section (Optional) */}
      <div className="flex justify-center py-4">
        <img src={Logo} alt="Logo" className="h-12" />
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-4 p-4">
        <Link
          to="/add-universities"
          className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-start"
        >
          Add Universities
        </Link>
        <Link
          to="/add-job"
          className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-start"
        >
          Add Jobs
        </Link>
        <Link
          to="/add-scholarships"
          className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-start"
        >
          Add Scholarships
        </Link>
        <Link
          to="/update-agent-profile"
          className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-start"
        >
          Update My Profile
        </Link>
        <Link
          to="/agent/appointments"
          className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-start"
        >
          Manage Appointments
        </Link>
        <Link
          to="/agent/payments"
          className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-start"
        >
          View My Payments
        </Link>

        <Link
          to="/login"
          className="hover:bg-teal-500 hover:scale-105 hover:shadow-lg p-3 rounded-2xl hover:text-white transition text-lg flex items-center justify-start"
        >
          Log
        </Link>
      </div>

      {/* Right Side Button */}
      <div className="flex items-center p-4 mt-auto mb-4">
        <Link
          className="bg-teal-500 text-white font-semibold py-2 px-4 rounded-2xl flex items-center justify-center w-full"
          to="/update-agent-profile"
        >
          Your Profile
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
