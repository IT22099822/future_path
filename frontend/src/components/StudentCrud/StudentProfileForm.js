import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoWithSocial from "../components/LogoWithSocial";
import NavBar from "../components/NavBar";

const StudentProfileForm = () => {
  const [student, setStudent] = useState({
    name: '',
    bio: '',
    contactEmail: '',
    phone: '',
    major: '',
    profilePhoto: '',
    birthDate: '',
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validation error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [birthDateError, setBirthDateError] = useState('');

  const navigate = useNavigate();

  // Calculate the maximum allowable birth date (today minus 15 years)
  const getMaxBirthDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 15);
    return today.toISOString().split('T')[0];
  };

  const [maxBirthDate, setMaxBirthDate] = useState(getMaxBirthDate());

  // Update maxBirthDate if system date changes
  useEffect(() => {
    const interval = setInterval(() => {
      setMaxBirthDate(getMaxBirthDate());
    }, 24 * 60 * 60 * 1000); // Update once a day

    return () => clearInterval(interval);
  }, []);

  // Fetch student profile
  useEffect(() => {
    const fetchStudentProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated. Please login.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/students/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setStudent({
              name: data.name || '',
              bio: data.bio || '',
              contactEmail: data.contactEmail || '',
              phone: data.phone || '',
              major: data.major || '',
              profilePhoto: data.profileImage || '',
              birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
            });
            setError('');
          }
        } else if (response.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else if (response.status === 404) {
          setError('No profile found, please create one.');
        } else {
          setError('Failed to fetch profile');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  // Handle form submission to create or update the profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset success and error messages
    setSuccess('');
    setError('');

    // Validate all fields before submission
    let valid = true;

    // Name validation
    if (!/^[A-Z][a-zA-Z]*$/.test(student.name)) {
      setNameError('Name must start with a capital letter and contain only letters.');
      valid = false;
    } else {
      setNameError('');
    }

    // Email validation
    if (!student.contactEmail.includes('@')) {
      setEmailError('Email must contain "@" symbol.');
      valid = false;
    } else {
      setEmailError('');
    }

    // Phone validation
    if (!/^\d+$/.test(student.phone)) {
      setPhoneError('Phone number must contain only digits.');
      valid = false;
    } else {
      setPhoneError('');
    }

    // BirthDate validation
    const selectedDate = new Date(student.birthDate);
    const today = new Date();
    today.setFullYear(today.getFullYear() - 15);
    if (selectedDate > today) {
      setBirthDateError('You must be at least 15 years old.');
      valid = false;
    } else {
      setBirthDateError('');
    }

    if (!valid) {
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('User not authenticated. Please login.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', student.name);
    formData.append('bio', student.bio);
    formData.append('contactEmail', student.contactEmail);
    formData.append('phone', student.phone);
    formData.append('major', student.major);
    formData.append('birthDate', student.birthDate);

    if (profileImageFile) {
      formData.append('profileImage', profileImageFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSuccess('Profile saved successfully!');
        setError('');
      } else {
        setError('Failed to save profile');
      }
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile deletion
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated. Please login.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setStudent({
          name: '',
          bio: '',
          contactEmail: '',
          phone: '',
          major: '',
          profilePhoto: '',
          birthDate: '',
        });
        setSuccess('Profile deleted successfully');
        setError('');
      } else {
        setError('Failed to delete profile');
      }
    } catch (err) {
      setError('Failed to delete profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImageFile(file);
  };

  // Handle name input change with validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    // Prevent numbers from being entered
    if (/\d/.test(value)) {
      setNameError('Name cannot contain numbers.');
      return;
    }

    // Ensure first letter is capital
    if (value && value[0] !== value[0].toUpperCase()) {
      setNameError('First letter must be capitalized.');
    } else {
      setNameError('');
    }

    setStudent({ ...student, name: value });
  };

  // Handle email input change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setStudent({ ...student, contactEmail: value });

    if (value && !value.includes('@')) {
      setEmailError('Email must contain "@" symbol.');
    } else {
      setEmailError('');
    }
  };

// Handle phone input change with validation
const handlePhoneChange = (e) => {
  const value = e.target.value;
  // Allow only numbers and check for 10 digits
  if (/^\d*$/.test(value)) {
    if (value.length > 10) {
      setPhoneError('Phone number cannot be more than 10 digits.');
    } else if (value.length < 10) {
      setPhoneError('Phone number must be exactly 10 digits.');
    } else {
      setPhoneError('');
    }
    setStudent({ ...student, phone: value });
  } else {
    setPhoneError('Phone number must contain only digits.');
  }
};

  // Handle birth date change with validation
  const handleBirthDateChange = (e) => {
    const value = e.target.value;
    setStudent({ ...student, birthDate: value });

    const selectedDate = new Date(value);
    const today = new Date();
    today.setFullYear(today.getFullYear() - 15);

    if (selectedDate > today) {
      setBirthDateError('You must be at least 15 years old.');
    } else {
      setBirthDateError('');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
      <LogoWithSocial /> {/* Add logo with social media links */}
      <NavBar /> {/* Add navigation bar */}
      
      {/* Buttons below NavBar */}
      <div className="flex justify-center mt-6">
        <div className="flex justify-between w-full max-w-4xl px-4">
          <button
            onClick={() => navigate('/reviews')}
            className="bg-white text-teal-500 p-3 rounded-lg hover:bg-teal-500 hover:text-white transition duration-300 transform hover:scale-105 mx-2 shadow-md"
          >
            Manage Reviews
          </button>
          <button
            onClick={() => navigate('/appointments')}
            className="bg-white text-teal-500 p-3 rounded-lg hover:bg-teal-500 hover:text-white transition duration-300 transform hover:scale-105 mx-2 shadow-md"
          >
            My Appointments
          </button>
          <button
            onClick={() => navigate('/appointments/approved')}
            className="bg-white text-teal-500 p-3 rounded-lg hover:bg-teal-500 hover:text-white transition duration-300 transform hover:scale-105 mx-2 shadow-md"
          >
            Upload Documents
          </button>
          <button
            onClick={() => navigate('/payments')}
            className="bg-white text-teal-500 p-3 rounded-lg hover:bg-teal-500 hover:text-white transition duration-300 transform hover:scale-105 mx-2 shadow-md"
          >
            View My Payments
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center w-full mt-10">
        <div className="bg-white bg-opacity-50 shadow-lg rounded-lg p-8 w-full max-w-3xl">
          <h2 className="text-3xl font-semibold mb-6 text-center">Update Student Profile</h2>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={student.name}
                onChange={handleNameChange}
                required
                disabled={loading}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {nameError && <p className="text-red-500 mt-1">{nameError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1">Bio</label>
              <textarea
                value={student.bio}
                onChange={(e) => setStudent({ ...student, bio: e.target.value })}
                disabled={loading}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Contact Email</label>
              <input
                type="email"
                value={student.contactEmail}
                onChange={handleEmailChange}
                disabled={loading}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {emailError && <p className="text-red-500 mt-1">{emailError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1">Phone</label>
              <input
                type="text"
                value={student.phone}
                onChange={handlePhoneChange}
                disabled={loading}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {phoneError && <p className="text-red-500 mt-1">{phoneError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1">Highest Educational Qualification</label>
              <input
                type="text"
                value={student.major}
                onChange={(e) => setStudent({ ...student, major: e.target.value })}
                disabled={loading}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Birth Date</label>
              <input
                type="date"
                value={student.birthDate}
                onChange={handleBirthDateChange}
                disabled={loading}
                max={maxBirthDate}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {birthDateError && <p className="text-red-500 mt-1">{birthDateError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1">Profile Photo</label>
              <input
                type="file"
                onChange={handleProfileImageChange}
                disabled={loading}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition duration-300 mx-2"
                disabled={loading}
              >
                Save Profile
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300 mx-2"
                disabled={loading}
              >
                Delete Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileForm;
