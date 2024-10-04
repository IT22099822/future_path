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
    <div>
      <h2>Book an Appointment with Agent</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        {/* Date and Time */}
        <label htmlFor="dateTime">Date and Time:</label>
        <input
          type="datetime-local"
          id="dateTime"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />

        {/* Topic */}
        <label htmlFor="topic">Topic:</label>
        <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} required>
          <option value="">Select a topic</option>
          <option value="Job">Job</option>
          <option value="University Admission">University Admission</option>
          <option value="Scholarship Opportunity">Scholarship Opportunity</option>
          <option value="Other">Other</option>
        </select>

        {/* Details */}
        <label htmlFor="details">Details:</label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          required
        ></textarea>

        {/* Submit Button */}
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
