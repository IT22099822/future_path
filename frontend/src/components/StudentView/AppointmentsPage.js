import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png';
import LogoWithSocial from '../components/LogoWithSocial';
import NavBar from '../components/NavBar';

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null); // State to manage the appointment ID for confirmation
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
    }, [searchTerm]);

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
            setConfirmDeleteId(null); // Reset confirmation
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
            // Add logo to the PDF
            pdf.addImage(logoImg, 'PNG', 10, 10, 50, 20); // Logo Position
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
    
            // Adjust the X position to move the text further to the right
            const textX = 110; // Move company info to the right side of the report
    
            // Add company information aligned to the right
            const headerY = 10; // Y position for header
            pdf.text('Future Path (PVT) LTD', textX, headerY + 10);
            pdf.text('SLIIT, Malabe, Colombo', textX, headerY + 20);
            pdf.text('+94 771165416', textX, headerY + 30);
            pdf.text('contact@future_path.com', textX, headerY + 40);
            pdf.text('www.futurepath.com', textX, headerY + 50);
            
            // Add generation date and time
            const date = new Date();
            const formattedDate = `Report generated on: ${date.toLocaleString()}`;
            pdf.text(formattedDate, textX, headerY + 60); // Position for date and time
    
            // Add a horizontal line separator after the header
            pdf.setLineWidth(0.5); // Set line width
            pdf.line(10, headerY + 70, 200, headerY + 70); // Draw the line from left to right
    
            // Add title below the header and separator
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Appointment Report', 10, headerY + 85); // Adjusted position for report title
    
            // Adjust the position for the appointment details
            let yPosition = headerY + 95; // Adjusted initial yPosition for appointments
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
    
            // Save the generated PDF
            pdf.save('appointments.pdf');
        };
    };
    
    
    

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] font-sans">
            <LogoWithSocial />
            <NavBar />

            <div className="flex justify-center items-center w-full mt-10">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
                    <h1 className="text-3xl font-normal mb-6">Your Appointments</h1>
                    <input
                        type="text"
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        onClick={generatePDF}
                        className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg mb-4"
                    >
                        Download Appointments as PDF
                    </button>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : appointments.length === 0 ? (
                        <p>No appointments found.</p>
                    ) : (
                        <ul>
                            {appointments.map((appointment) => (
                                <li key={appointment._id} className="mb-4 p-4 border rounded-lg shadow-md bg-gray-50">
                                    <p className="font-normal text-lg"><strong>Date:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
                                    <p className="font-normal text-lg"><strong>Topic:</strong> {appointment.topic}</p>
                                    <p className="font-normal text-lg">
                                        <strong>Agent:</strong>{' '}
                                        {appointment.agent ? (
                                            <button onClick={() => handleAgentClick(appointment.agent._id)} className="text-blue-500 underline hover:text-blue-600">
                                                {appointment.agent.name}
                                            </button>
                                        ) : (
                                            'Unknown Agent'
                                        )}
                                    </p>
                                    <p className="font-normal text-lg"><strong>Status:</strong> {appointment.status}</p>
                                    {appointment.message && (
                                        <p className="font-normal text-lg"><strong>Message from agent:</strong> {appointment.message}</p>
                                    )}
                                    {appointment.status !== 'Approved' && (
                                        <>
                                            <button
                                                onClick={() => setConfirmDeleteId(appointment._id)}
                                                className="w-1/2 bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg mb-4"
                                            >
                                                Delete Appointment
                                            </button>
                                            {confirmDeleteId === appointment._id && (
                                                <div className="mt-2">
                                                    <p className="text-red-600">Are you sure you want to delete this appointment?</p>
                                                    <button
                                                        onClick={() => handleDeleteAppointment(appointment._id)}
                                                        className="bg-red-500 text-white p-2 rounded mr-2"
                                                    >
                                                        Yes
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteId(null)}
                                                        className="bg-gray-300 p-2 rounded"
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsPage;
