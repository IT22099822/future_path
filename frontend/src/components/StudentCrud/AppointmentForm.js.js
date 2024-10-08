import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoWithSocial from "../components/LogoWithSocial";
import NavBar from "../components/NavBar";

const AppointmentForm = () => {
  const { id: agentId } = useParams(); // Get agent ID from URL params
  const navigate = useNavigate();

  const [dateTime, setDateTime] = useState('');
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [minDateTime, setMinDateTime] = useState('');

  // Set the minimum datetime to the current date and time
  useEffect(() => {
    const getCurrentDateTime = () => {
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
      const localISOTime = new Date(now - offset).toISOString().slice(0, 16); // Adjust timezone and slice off seconds
      setMinDateTime(localISOTime); // Set the minimum date-time allowed
    };
    getCurrentDateTime();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const token = localStorage.getItem('token'); // Ensure token exists
      if (!token) {
        throw new Error('Not authorized. No token found.');
      }

      const response = await axios.post(
        'http://localhost:5000/api/appointments', // Ensure this matches your backend API URL
        {
          agent: agentId,  // Use the agentId from useParams
          dateTime,
          topic,
          details
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is valid
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Appointment created:', response.data);
      navigate('/appointments'); // Redirect to appointments page after success
    } catch (err) {
      console.error('Error booking appointment:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
       <LogoWithSocial />
       <NavBar />
       
      <div className="flex justify-center items-center w-full mt-10">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">Book an Appointment</h1>
          
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date and Time */}
            <div className="mb-4">
              <input
                type="datetime-local"
                id="dateTime"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                min={minDateTime}  // Set the min attribute to the current date and time
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Topic */}
            <div className="mb-4">
              <select
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="w-full p-2 border rounded-lg"
              >
                <option value="" className="text-gray-500">Select a topic</option>
                <option value="Job" className="text-gray-500">Job</option>
                <option value="University Admission" className="text-gray-500">University Admission</option>
                <option value="Scholarship Opportunity" className="text-gray-500">Scholarship Opportunity</option>
                <option value="Other" className="text-gray-500">Other</option>
              </select>
            </div>

            {/* Details */}
            <div className="mb-4">
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
                placeholder="Details"
                className="w-full p-2 border rounded-lg"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
            >
              Book Appointment
            </button>
          </form>

          <button
            className="mt-4 w-full bg-white border border-teal-500 text-teal-500 p-3 rounded-lg hover:bg-teal-500 hover:text-white transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
            onClick={() => navigate('/appointments')}
          >
            View Appointments
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
