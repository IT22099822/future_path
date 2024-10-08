import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoWithSocial from '../components/LogoWithSocial';
import NavBar from '../components/NavBar';

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
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] font-sans">
      <LogoWithSocial />
      <NavBar />

      <div className="flex justify-center items-center w-full mt-10">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
          <h2 className="text-3xl font-semibold mb-6 text-center">Your Approved Appointments</h2>
          {appointments.length === 0 ? (
            <p>No approved appointments found.</p>
          ) : (
            <ul className="space-y-4">
              {appointments.map((appointment) => (
                <li key={appointment._id} className="p-4 border rounded-lg shadow-md bg-gray-50">
                  <p className="font-light mb-2"><strong>Date:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
                  <p className="font-light mb-2"><strong>Topic:</strong> {appointment.topic}</p>
                  <p className="font-light mb-2">
                    <strong>Agent:</strong>{' '}
                    {appointment.agent ? (
                      <button onClick={() => handleAgentClick(appointment.agent._id)} className="text-teal-500 underline hover:text-teal-600">
                        {appointment.agent.name}
                      </button>
                    ) : (
                      'Unknown Agent'
                    )}
                  </p>
                  <div className="flex space-x-2">
                    {/* Upload Documents Button */}
                    <button 
                      onClick={() => handleUploadClick(appointment._id)} 
                      className="flex-1 bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-700 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
                    >
                      Upload Documents
                    </button>
                    {/* View Documents Button */}
                    <button 
                      onClick={() => handleViewDocumentsClick(appointment._id)} 
                      className="flex-1 bg-slate-500 text-white p-2 rounded-lg hover:bg-slate-700 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
                    >
                      View Documents
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovedAppointmentsPage;
