import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png';
import LogoWithSocial from '../components/LogoWithSocial';
import NavBar from '../components/NavBar';

const AppointmentDocumentsPage = () => {
    const { appointmentId } = useParams();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/documents/${appointmentId}?search=${searchTerm}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDocuments(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while fetching documents');
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [appointmentId, searchTerm]);

    const downloadPDF = () => {
        const pdf = new jsPDF();
    
        // Add logo to the PDF
        const logoImg = new Image();
        logoImg.src = logo;
        logoImg.onload = () => {
            pdf.addImage(logoImg, 'PNG', 10, 10, 50, 20);
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
    
            // Set up the header
            const headerY = 10; 
            const textX = 90; 
    
            pdf.text('Future Path (PVT) LTD', textX, headerY + 10);
            pdf.text('SLIIT, Malabe, Colombo', textX, headerY + 20);
            pdf.text('+94 771165416', textX, headerY + 30);
            pdf.text('contact@future_path.com', textX, headerY + 40);
            pdf.text('www.futurepath.com', textX, headerY + 50);
    
            // Add generation date and time
            const date = new Date();
            const formattedDate = `Report generated on: ${date.toLocaleString()}`;
            pdf.text(formattedDate, textX, headerY + 60);
    
            // Add a line separating the header from the content
            pdf.setLineWidth(0.5);
            pdf.line(10, headerY + 70, 200, headerY + 70);
    
            let yPosition = headerY + 80;
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            const titleText = 'Documents for Appointment ID:';
            const titleIdText = appointmentId;
    
            const titleWidth = pdf.getTextWidth(titleText);
            const idWidth = pdf.getTextWidth(titleIdText);
            const titleX = 10; 
            const idX = titleX + titleWidth + 5; 
    
            pdf.text(titleText, titleX, yPosition);
            pdf.text(titleIdText, idX, yPosition);
            yPosition += 10;
    
            pdf.setLineWidth(0.5);
            pdf.line(10, yPosition, 200, yPosition);
            yPosition += 5;
    
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
    
            documents.forEach((doc) => {
                const fileLink = `http://localhost:5000/${doc.filePath.replace(/\\/g, '/')}`;
    
                pdf.setFont('helvetica', 'bold');
                pdf.text(`Description: ${doc.description}`, 10, yPosition);
                yPosition += 10;
    
                pdf.setFont('helvetica', 'normal');
                pdf.text(`File: ${doc.filePath.split('/').pop()}`, 10, yPosition);
                yPosition += 10;
    
                pdf.textWithLink(`Link: ${fileLink}`, 10, yPosition, { url: fileLink });
                yPosition += 15;
    
                pdf.setLineWidth(0.5);
                pdf.line(10, yPosition, 200, yPosition);
                yPosition += 5;
            });
    
            pdf.save(`documents_report_${appointmentId}.pdf`);
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] font-sans">
            <LogoWithSocial />
            <NavBar />
            
            <div className="flex justify-center items-center w-full mt-10">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
                    <h1 className="text-3xl font-normal mb-6">Uploaded Documents for Appointment ID: {appointmentId}</h1>
                    <input
                        type="text"
                        placeholder="Search by description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        onClick={downloadPDF}
                        className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg mb-4"
                    >
                        Download PDF
                    </button>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : documents.length === 0 ? (
                        <p>No documents uploaded for this appointment.</p>
                    ) : (
                        <ul>
                            {documents.map((doc) => (
                                <li key={doc._id} className="mb-4 p-4 border rounded-lg shadow-md bg-gray-50">
                                    <p className="font-normal text-lg"><strong>Description:</strong> {doc.description}</p>
                                    <p className="font-normal text-lg">
                                        <strong>File:</strong> 
                                        <a 
                                            href={`http://localhost:5000/${doc.filePath.replace(/\\/g, '/')}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline hover:text-blue-600"
                                        >
                                            {doc.filePath.split('/').pop()}
                                        </a>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentDocumentsPage;
