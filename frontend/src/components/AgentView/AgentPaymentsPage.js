import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png'; // Adjust the path according to your structure
import LogoWithSocial from '../components/LogoWithSocial';
import NavBar from '../components/NavBar';

const AgentPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authorized. No token found.');
        }

        const response = await axios.get(`http://localhost:5000/api/payments/agent?search=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payments:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'An error occurred while fetching payments');
        setLoading(false);
      }
    };

    fetchPayments();
  }, [searchTerm]); // Refetch payments when searchTerm changes

  const updatePaymentStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/payments/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Optionally, refresh the payment list after updating status
      setPayments((prev) =>
        prev.map((payment) =>
          payment._id === id ? { ...payment, paymentStatus: status } : payment
        )
      );
    } catch (err) {
      console.error('Error updating payment status:', err);
    }
  };

  const downloadPDF = async () => {
    const pdf = new jsPDF();
  
    // Add logo
    const logoImg = new Image();
    logoImg.src = logo; // Use the imported logo
    logoImg.onload = async () => {
      pdf.addImage(logoImg, 'PNG', 10, 10, 50, 20); // Adjust dimensions as needed
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
  
      // Set the title
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Payments Report', 105, yPosition, null, null, 'center');
      yPosition += 10;
  
      // Set font for payment details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
  
      // Iterate through each payment and format as a block
      payments.forEach((payment, index) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Payment #${index + 1}`, 20, yPosition); // Payment number
        yPosition += 10;
  
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Amount: ${payment.paymentAmount}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Description: ${payment.paymentDescription}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Bank: ${payment.bankInstitution}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Status: ${payment.paymentStatus}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Student Notes: ${payment.studentNotes}`, 20, yPosition);
        yPosition += 12; // Extra space between payments
  
        // Add line between payments
        pdf.setLineWidth(0.5);
        pdf.line(20, yPosition, 190, yPosition);
        yPosition += 5; // Extra space after the line
  
        // Check if the yPosition exceeds the page height, add new page if necessary
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20; // Reset position for the new page
        }
      });
  
      // Save the generated PDF
      pdf.save('Payments_Report.pdf');
    };
  };

  if (loading) return <p className="text-gray-500">Loading payments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] font-sans">
      <LogoWithSocial />
      <NavBar />

      <div className="flex justify-center items-center w-full mt-10">
        <div className="bg-white bg-opacity-50 shadow-lg rounded-lg p-8 w-full max-w-4xl mx-4"> 
          <h2 className="text-3xl font-normal mb-6">Payments Received</h2>
          <input
            type="text"
            placeholder="Search by description, bank, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={downloadPDF}
            className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg mb-4"
          >
            Download Payments as PDF
          </button>
          <div id="pdf-content">
            {payments.length === 0 ? (
              <p>No payments found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Use grid layout for two columns */}
                {payments.map((payment) => (
                  <div key={payment._id} className="mb-4 p-4 border rounded-lg shadow-md bg-gray-50">
                    <p className="font-normal text-lg mb-2"><strong>Amount:</strong> {payment.paymentAmount}</p>
                    <p className="font-normal text-lg mb-2"><strong>Date:</strong> {new Date(payment.paymentDate).toLocaleDateString()}</p>
                    <p className="font-normal text-lg mb-2"><strong>Description:</strong> {payment.paymentDescription}</p>
                    <p className="font-normal text-lg mb-2"><strong>Bank:</strong> {payment.bankInstitution}</p>
                    <p className="font-normal text-lg mb-2"><strong>Status:</strong> {payment.paymentStatus}</p>
                    <p className="font-normal text-lg mb-2"><strong>Student Notes:</strong> {payment.studentNotes}</p>
                    <p className="font-normal text-lg mb-2"><strong>Payment Slip:</strong>
                      {payment.paymentSlip && (
                        <a 
                          href={`http://localhost:5000/${payment.paymentSlip}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 underline hover:text-blue-600"
                        >
                          View Slip
                        </a>
                      )}
                    </p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => updatePaymentStatus(payment._id, 'Approved')}
                        className="w-1/2 bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updatePaymentStatus(payment._id, 'Rejected')}
                        className="w-1/2 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPaymentsPage;
