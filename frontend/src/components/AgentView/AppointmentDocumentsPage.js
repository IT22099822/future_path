import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png'; // Adjust the path according to your structure

const AppointmentDocumentsPage = () => {
  const { appointmentId } = useParams(); // Get appointment ID from URL
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

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
  }, [appointmentId, searchTerm]); // Refetch documents when searchTerm changes

  const downloadPDF = () => {
    const pdf = new jsPDF();

    // Add logo to the PDF
    const logoImg = new Image();
    logoImg.src = logo;
    logoImg.onload = () => {
      pdf.addImage(logoImg, 'PNG', 10, 10, 50, 20); // Adjust size and position as needed

      // Set the title below the logo
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Documents for Appointment ID: ' + appointmentId, 10, 40);
      pdf.setLineWidth(0.5);
      pdf.line(10, 45, 200, 45);

      // Set font for document details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');

      let yPosition = 50; // Starting y position for documents after the logo

      // Iterate through each document and add to PDF
      documents.forEach((doc) => {
        const fileLink = `http://localhost:5000/${doc.filePath.replace(/\\/g, '/')}`;

        pdf.setFont('helvetica', 'bold');
        pdf.text(`Description: ${doc.description}`, 10, yPosition);
        yPosition += 10;

        pdf.setFont('helvetica', 'normal');
        pdf.text(`File: ${doc.filePath.split('/').pop()}`, 10, yPosition); // Show only the file name
        yPosition += 10;

        // Add clickable link to the PDF
        pdf.textWithLink(`Link: ${fileLink}`, 10, yPosition, { url: fileLink });
        yPosition += 15; // Extra space between documents

        // Add line between documents
        pdf.setLineWidth(0.5);
        pdf.line(10, yPosition, 200, yPosition);
        yPosition += 5; // Extra space after the line
      });

      // Save the PDF
      pdf.save(`documents_report_${appointmentId}.pdf`);
    };
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Uploaded Documents for Appointment ID: {appointmentId}</h1>
      <input
        type="text"
        placeholder="Search by description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
      />
      <button onClick={downloadPDF}>Download PDF</button>
      {documents.length === 0 ? (
        <p>No documents uploaded for this appointment.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc._id}>
              <p><strong>Description:</strong> {doc.description}</p>
              <p>
                <strong>File:</strong> 
                <a 
                  href={`http://localhost:5000/${doc.filePath.replace(/\\/g, '/')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {doc.filePath.split('/').pop()} {/* Show only the file name */}
                </a>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentDocumentsPage;
