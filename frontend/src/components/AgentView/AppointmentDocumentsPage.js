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
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
  
      // Set up the header
      const headerY = 10; // Y position for header
      const textX = 90; // Increased X position for text to move it further right
      pdf.text('Future Path (PVT) LTD', textX, headerY + 10);
      pdf.text('SLIIT, Malabe, Colombo', textX, headerY + 20);
      pdf.text('+94 771165416', textX, headerY + 30);
      pdf.text('contact@future_path.com', textX, headerY + 40);
      pdf.text('www.futurepath.com', textX, headerY + 50);
  
      // Add generation date and time
      const date = new Date();
      const formattedDate = `Report generated on: ${date.toLocaleString()}`;
      pdf.text(formattedDate, textX, headerY + 60); // Position for date and time
  
      // Add a line separating the header from the content
      pdf.setLineWidth(0.5);
      pdf.line(10, headerY + 70, 200, headerY + 70); // Draw the line from left to right
  
      // Move content down after the separator
      let yPosition = headerY + 80;
  
      // Set the title below the header
      pdf.setFontSize(16); // Set a smaller font size for the title
      pdf.setFont('helvetica', 'bold');
      const titleText = 'Documents for Appointment ID:';
      const titleIdText = appointmentId;
      
      // Calculate the position for the appointment ID to align it
      const titleWidth = pdf.getTextWidth(titleText);
      const idWidth = pdf.getTextWidth(titleIdText);
      const titleX = 10; // X position for the title text
      const idX = titleX + titleWidth + 5; // X position for the appointment ID (5 units space)
  
      pdf.text(titleText, titleX, yPosition);
      pdf.text(titleIdText, idX, yPosition); // Position the ID next to the title
      yPosition += 10;
  
      // Add another line below the title
      pdf.setLineWidth(0.5);
      pdf.line(10, yPosition, 200, yPosition);
      yPosition += 5;
  
      // Set font for document details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
  
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
