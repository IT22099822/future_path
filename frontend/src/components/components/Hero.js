import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Edu from "../../images/edu.jpg";

function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 200); // Delay for a smoother effect
  }, []);

  return (
    <div className="mx-auto top-0 fixed w-full -z-10"> {/* Ensure z-index is lower so buttons are on top */}
      <div className="max-h-full relative">
        {/* Overlay */}
        <div className="absolute w-full h-full text-gray-200 flex flex-col justify-center transition-all duration-1000 ease-in-out transform z-20"> {/* Higher z-index for content */}
          {/* "Future Path" Heading */}
          <div
            className={`${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            } transition-all duration-500 ease-in-out ml-[130px] mt-[120px]`} // Moved down
          >
            <h2 className="text-5xl font-bold text-white md:text-6xl lg:text-2xl drop-shadow-2xl">
              Future Path,
            </h2>
          </div>

          {/* Hero Main Heading */}
          <h1
            className={`px-4 text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl mt-6 transform ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            } transition-all duration-1000 ease-in-out ml-[100px] drop-shadow-3xl`} // Added more shadow
          >
             Your Gateway to <br /> Global Education
          </h1>

          {/* Buttons */}
          <div
            className={`${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            } transition-all duration-700 ease-in-out mt-10 flex gap-6 ml-[190px]`} // Positioned buttons below the text
          >
            {/* Talk to an Agent Button */}
            <Link to="/talk-to-agent">
              <button className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:bg-white hover:text-teal-500 transition-all duration-300 ease-in-out hover:shadow-xl">
                - Talk to an Agent -
              </button>
            </Link>

            {/* Get Started Button */}
            <Link to="/get-started">
              <button className="px-6 py-3 bg-white text-teal-500 font-semibold rounded-lg shadow-lg hover:bg-teal-500 hover:text-white transition-all duration-300 ease-in-out hover:shadow-xl">
                - And Get Started -
              </button>
            </Link>
          </div>
        </div>
        
        {/* Image background with lower z-index */}
        <img className="w-screen max-h-[800px] object-cover z-0" src={Edu} alt="Education" />
      </div>
    </div>
  );
}

export default Hero;
