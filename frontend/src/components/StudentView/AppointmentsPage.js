import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png';

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authorized. No token found.');
                }

                const response = await axios.get(`http://localhost:5000/api/appointments/my?search=${searchTerm}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAppointments(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching appointments:', err.response?.data?.message || err.message);
                setError(err.response?.data?.message || 'An error occurred while fetching appointments');
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [searchTerm]); // Trigger fetch on search term change

    const handleAgentClick = (id) => {
        navigate(`/agents/${id}`);
    };

    const handleDeleteAppointment = async (appointmentId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/appointments/${appointmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAppointments(appointments.filter(app => app._id !== appointmentId));
        } catch (err) {
            console.error('Error deleting appointment:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'An error occurred while deleting the appointment');
        }
    };

    const generatePDF = () => {
        const pdf = new jsPDF();
        const logoImg = new Image();
        logoImg.src = logo;
        logoImg.onload = () => {
            pdf.addImage(logoImg, 'PNG', 10, 10, 50, 20);
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Appointment Report', 10, 40);

            let yPosition = 50;
            pdf.setFontSize(12);
            appointments.forEach((appointment) => {
                pdf.text(`Date: ${new Date(appointment.dateTime).toLocaleString()}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Topic: ${appointment.topic}`, 10, yPosition);
                yPosition += 10;
                if (appointment.agent) {
                    pdf.text(`Agent: ${appointment.agent.name}`, 10, yPosition);
                } else {
                    pdf.text('Agent: Unknown Agent', 10, yPosition);
                }
                yPosition += 10;
                pdf.text(`Status: ${appointment.status}`, 10, yPosition);
                yPosition += 10;

                if (appointment.message) {
                    pdf.text(`Message from agent: ${appointment.message}`, 10, yPosition);
                    yPosition += 10;
                }

                yPosition += 10; // Add space between appointments
            });

            pdf.save('appointments.pdf');
        };
    };

    return (
        <div>
            <h2>Your Appointments</h2>
            <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
            <button onClick={generatePDF}>Download Appointments as PDF</button>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : appointments.length === 0 ? (
                <p>No appointments found.</p>
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
                            <p><strong>Status:</strong> {appointment.status}</p>
                            {appointment.message && (
                                <p><strong>Message from agent:</strong> {appointment.message}</p>
                            )}
                            {appointment.status !== 'Approved' && (
                                <button onClick={() => handleDeleteAppointment(appointment._id)}>
                                    Delete Appointment
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AppointmentsPage;
