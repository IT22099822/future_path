import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import LogoWithSocial from '../components/LogoWithSocial';

const AgentAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState({});
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <p className="text-gray-500">Loading...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] font-sans">
      <LogoWithSocial />
      <NavBar />

      <div className="flex justify-center items-center w-full mt-10">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-5xl bg-opacity-50">
          <h1 className="text-3xl font-normal mb-6">Appointments</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {appointments.map(appointment => (
              <div key={appointment._id} className="mb-4 p-4 border rounded-lg shadow-md bg-gray-50">
                <p>
                  <strong>Student:</strong>{' '}
                  <button onClick={() => handleStudentProfileNavigation(appointment.student?._id)} className="text-blue-500 underline hover:text-blue-600">
                    {appointment.student?.name}
                  </button>
                </p>
                <p><strong>Date and Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
                <p><strong>Topic:</strong> {appointment.topic}</p>
                <p><strong>Details:</strong> {appointment.details}</p>

                <label className="block mt-2">
                  Status:
                  <select
                    value={status[appointment._id] || appointment.status}
                    onChange={(e) => setStatus(prev => ({ ...prev, [appointment._id]: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mt-1"
                  >
                    <option value="">Select status</option>
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                  </select>
                </label>

                <label className="block mt-2">
                  Message:
                  <textarea
                    value={message[appointment._id] || appointment.message || ''}
                    onChange={(e) => setMessage(prev => ({ ...prev, [appointment._id]: e.target.value }))}
                    className="w-full h-20 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mt-1"
                  />
                </label>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleStatusUpdate(appointment._id)}
                    className="flex-1 bg-teal-500 text-white px-2 py-1 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg text-sm"
                  >
                    Update Status
                  </button>

                  {/* Button to view uploaded documents, only if the appointment is approved */}
                  {appointment.status === 'Approved' && (
                    <button
                      onClick={() => handleViewDocuments(appointment._id)}
                      className="flex-1 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg text-sm"
                    >
                      View Uploaded Documents
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAppointmentsPage;
