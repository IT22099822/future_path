import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png'; // Adjust the path according to your structure

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

      // Set the title
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Payments Report', 105, 35, null, null, 'center');
      pdf.setLineWidth(0.5);
      pdf.line(20, 40, 190, 40);

      // Set font for payment details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');

      let yPosition = 50; // Starting y position for payments

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
      });

      // Add footer information
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Generated on: ' + new Date().toLocaleString(), 20, yPosition + 10);

      // Save the PDF
      pdf.save('payments_report.pdf');
    };
  };

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Payments Received</h2>
      <input
        type="text"
        placeholder="Search by description, bank, or notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
      />
      <button onClick={downloadPDF}>Download PDF</button>
      <div id="pdf-content">
        {payments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          <ul>
            {payments.map((payment) => (
              <li key={payment._id}>
                <p><strong>Amount:</strong> {payment.paymentAmount}</p>
                <p><strong>Date:</strong> {new Date(payment.paymentDate).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {payment.paymentDescription}</p>
                <p><strong>Bank:</strong> {payment.bankInstitution}</p>
                <p><strong>Status:</strong> {payment.paymentStatus}</p>
                <p><strong>Student Notes:</strong> {payment.studentNotes}</p>
                <p><strong>Payment Slip:</strong>
                  {payment.paymentSlip && (
                    <a 
                      href={`http://localhost:5000/${payment.paymentSlip}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View Slip
                    </a>
                  )}
                </p>
                <div>
                  <button onClick={() => updatePaymentStatus(payment._id, 'Approved')}>Approve</button>
                  <button onClick={() => updatePaymentStatus(payment._id, 'Rejected')}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AgentPaymentsPage;
