import React, { useEffect } from "react";
import loginRegisterBg from "./login_register_bg.jpg"; // Adjust the path if necessary
import uni from "./uni.jpg";
import job from "./job.jpg";

function HeadLineCards() {
  useEffect(() => {
    const images = document.querySelectorAll(".animated-image");
    images.forEach((img) => {
      img.classList.add("translate-x-[-100%]");
      img.classList.add("opacity-0");
      setTimeout(() => {
        img.classList.remove("translate-x-[-100%]");
        img.classList.add("translate-x-0", "opacity-100");
      }, 100); // Adjust the timeout for animation delay if needed
    });
  }, []);

  return (
    <div className="max-w-full px-4 md:px-20 mx-auto p-4 py-12 grid grid-cols-1 md:grid-cols-3 mt-10 gap-6 bg-gray-200">
      {/* Card 1 */}
      <div className="relative h-[400px] shadow-lg">
        {/* overlay */}
        <div className="absolute w-full h-full bg-white text-teal-500 flex flex-col justify-between p-4">
          <p className="font-bold text-2xl">Universities</p>
          <div className="relative overflow-hidden">
            <img
              className="w-full h-[200px] object-cover rounded-lg shadow-md animated-image transition-transform duration-700 ease-in-out"
              src={uni} // Use the imported image
              alt="Course Thumbnail"
            />
          </div>
          <button className="border border-teal-400 p-3 bg-white text-teal-500 hover:scale-105 duration-300 mt-4">
            View More Details
          </button>
        </div>
      </div>

      {/* Card 2 */}
      <div className="relative h-[400px] shadow-lg">
        {/* overlay */}
        <div className="absolute w-full h-full bg-white text-teal-500 flex flex-col justify-between p-4">
          <p className="font-bold text-2xl">Jobs</p>
          <div className="relative overflow-hidden">
            <img
              className="w-full h-[200px] object-cover rounded-lg shadow-md animated-image transition-transform duration-700 ease-in-out"
              src={job} // Use the imported image
              alt="Course Thumbnail"
            />
          </div>
          <button className="border border-teal-400 p-3 bg-white text-teal-500 hover:scale-105 duration-300 mt-4">
            View More Details
          </button>
        </div>
      </div>

      {/* Card 3 */}
      <div className="relative h-[400px] shadow-lg">
        {/* overlay */}
        <div className="absolute w-full h-full bg-white text-teal-500 flex flex-col justify-between p-4">
          <p className="font-bold text-2xl">Scholarships</p>
          <div className="relative overflow-hidden">
            <img
              className="w-full h-[200px] object-cover rounded-lg shadow-md animated-image transition-transform duration-700 ease-in-out"
              src={loginRegisterBg} // Use the imported image
              alt="Course Thumbnail"
            />
          </div>
          <button className="border border-teal-400 p-3 bg-white text-teal-500 hover:scale-105 duration-300 mt-4">
            View More Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeadLineCards;
