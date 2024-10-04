import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AgentAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState({});
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const handleStatusUpdate = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${appointmentId}`, {
        status: status[appointmentId] || '',
        message: message[appointmentId] || '',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setAppointments(appointments.map(app =>
        app._id === appointmentId ? { ...app, status: status[appointmentId], message: message[appointmentId] } : app
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating the appointment');
    }
  };

  const handleStudentProfileNavigation = (studentId) => {
    navigate(`/student-profile/${studentId}`);
  };

  const handleViewDocuments = (appointmentId) => {
    navigate(`/appointments/${appointmentId}/documents`);
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Appointments</h1>
      <ul>
        {appointments.map(appointment => (
          <li key={appointment._id}>
            <p>
              <strong>Student:</strong>{' '}
              <button onClick={() => handleStudentProfileNavigation(appointment.student?._id)}>
                {appointment.student?.name}
              </button>
            </p>
            <p><strong>Date and Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
            <p><strong>Topic:</strong> {appointment.topic}</p>
            <p><strong>Details:</strong> {appointment.details}</p>

            <label>
              Status:
              <select
                value={status[appointment._id] || appointment.status}
                onChange={(e) => setStatus(prev => ({ ...prev, [appointment._id]: e.target.value }))}
              >
                <option value="">Select status</option>
                <option value="Approved">Approve</option>
                <option value="Rejected">Reject</option>
              </select>
            </label>

            <label>
              Message:
              <textarea
                value={message[appointment._id] || appointment.message || ''}
                onChange={(e) => setMessage(prev => ({ ...prev, [appointment._id]: e.target.value }))}
              />
            </label>

            <button onClick={() => handleStatusUpdate(appointment._id)}>
              Update Status
            </button>

            {/* Button to view uploaded documents, only if the appointment is approved */}
            {appointment.status === 'Approved' && (
              <button onClick={() => handleViewDocuments(appointment._id)}>
                View Uploaded Documents
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentAppointmentsPage;
