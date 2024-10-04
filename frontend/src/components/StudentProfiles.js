import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentProfiles = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  // Function to fetch student profiles from the backend
  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');  // API call to get all student profiles
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Navigate to the specific student's public profile page
  const handleUserClick = (userId) => {
    navigate(`/student-profile/${userId}`);  // Navigate to student's public profile page
  };

  // Use useEffect to fetch student profiles when component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Student Profiles</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {students.length > 0 ? (
          students.map((student) => (
            <div
              key={student.user._id} // Use the user's ID for the key
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '20px',
                width: '300px',
                textAlign: 'center',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Display student's profile image */}
              <img
                src={`/${student.profileImage}`}
                alt={student.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '10px',
                }}
              />
              {/* Student's name */}
              <h3 style={{ fontSize: '1.5em', margin: '10px 0' }}>{student.name}</h3>
              {/* Student's bio */}
              <p style={{ fontSize: '1em', color: '#555' }}>{student.bio}</p>
              {/* Button to navigate to the student's public profile page */}
              <button
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
                onClick={() => handleUserClick(student.user._id)} // Use the user ID for navigation
              >
                View {student.name}'s Profile
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No student profiles found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentProfiles;
