import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ApprovedAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authorized. No token found.');
        }

        const response = await axios.get('http://localhost:5000/api/appointments/my/approved', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching approved appointments:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'An error occurred while fetching approved appointments');
        setLoading(false);
      }
    };

    fetchApprovedAppointments();
  }, []);

  const handleAgentClick = (id) => {
    navigate(`/agents/${id}`);
  };

  const handleUploadClick = (appointmentId) => {
    if (appointmentId) {
      navigate(`/appointments/${appointmentId}/upload-documents`);
    }
  };

  // Navigate to the View Documents page
  const handleViewDocumentsClick = (appointmentId) => {
    if (appointmentId) {
      navigate(`/appointments/${appointmentId}/view-documents`);
    }
  };

  if (loading) return <p>Loading approved appointments...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Your Approved Appointments</h2>
      {appointments.length === 0 ? (
        <p>No approved appointments found.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              <p><strong>Date:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
              <p><strong>Topic:</strong> {appointment.topic}</p>
              <p>
                <strong>Agent:</strong>{' '}
                {appointment.agent ? (
                  <button onClick={() => handleAgentClick(appointment.agent._id)}>
                    {appointment.agent.name}
                  </button>
                ) : (
                  'Unknown Agent'
                )}
              </p>
              {/* Upload Documents Button */}
              <button onClick={() => handleUploadClick(appointment._id)}>Upload Documents</button>
              {/* View Documents Button */}
              <button onClick={() => handleViewDocumentsClick(appointment._id)} style={{ marginLeft: '10px' }}>
                View Documents
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApprovedAppointmentsPage;
