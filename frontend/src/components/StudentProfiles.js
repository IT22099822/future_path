import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './components/NavBar';  // Import NavBar
import LogoWithSocial from './components/LogoWithSocial';  // Import LogoWithSocial

const StudentProfiles = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Function to fetch student profiles from the backend
  const fetchStudents = async (searchQuery = '') => {
    try {
      const response = await axios.get('/api/students', {
        params: { search: searchQuery },
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Fetch students when the component mounts or search changes
  useEffect(() => {
    fetchStudents(search);
  }, [search]);

  // Navigate to the specific student's public profile page
  const handleUserClick = (userId) => {
    navigate(`/student-profile/${userId}`);
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    fetchStudents(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
      <LogoWithSocial /> {/* Add logo with social media links */}
      <NavBar /> {/* Add navigation bar */}

      <div className="flex justify-center items-center w-full mt-10">
        {/* Transparent container */}
        <div className="bg-white bg-opacity-50 shadow-lg rounded-lg p-8 w-full max-w-3xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">Student Profiles</h1>

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search students by name or bio..."
            value={search}
            onChange={handleSearchChange}
            className="border rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <div className="flex flex-wrap gap-6 justify-center">
            {students.length > 0 ? (
              students.map((student) => (
                <div
                  key={student.user._id}
                  className="border rounded-lg p-6 w-full sm:w-1/3 text-center shadow-md bg-white bg-opacity-70 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
                  onClick={() => handleUserClick(student.user._id)}
                >
                  {/* Display student's profile image */}
                  <img
                    src={`/${student.profileImage}`}
                    alt={student.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  {/* Student's name */}
                  <h3 className="text-xl font-semibold mb-2">{student.name}</h3>
                  {/* Student's bio */}
                  <p className="text-gray-600 mb-4">{student.bio}</p>
                  {/* Button to navigate to the student's public profile page */}
                  <button className="bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 transition duration-300">
                    View {student.name}'s Profile
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center">No student profiles found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfiles;
