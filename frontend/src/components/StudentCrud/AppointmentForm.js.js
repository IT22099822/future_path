import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppointmentForm = () => {
  const { id: agentId } = useParams(); // Get agent ID from URL params
  const navigate = useNavigate();

  const [dateTime, setDateTime] = useState('');
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-50 to-blue-400">
      <div className="bg-blue-400 bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-3xl text-white text-center mb-6">Book an Appointment</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time */}
          <div>
            <label htmlFor="dateTime" className="block text-white mb-1">Date and Time:</label>
            <input
              type="datetime-local"
              id="dateTime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              className="w-full p-2 bg-transparent border border-white text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
          </div>

          {/* Topic */}
          <div>
            <label htmlFor="topic" className="block text-white mb-1">Topic:</label>
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="w-full p-2 bg-transparent border border-white text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            >
              <option value="" className="bg-slate-300">Select a topic</option>
              <option value="Job" className="bg-slate-300">Job</option>
              <option value="University Admission" className="bg-slate-300">University Admission</option>
              <option value="Scholarship Opportunity" className="bg-slate-300">Scholarship Opportunity</option>
              <option value="Other" className="bg-slate-300">Other</option>
            </select>
          </div>

          {/* Details */}
          <div>
            <label htmlFor="details" className="block text-white mb-1">Details:</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              className="w-full p-2 bg-transparent border border-white text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-white text-blue-600 py-2 px-6 rounded-md hover:bg-gray-100 transition-all duration-200"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
