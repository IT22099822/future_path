import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authorized. No token found.');
        }

        const response = await axios.get('http://localhost:5000/api/payments/student', {
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
  }, []);

  const handleDeletePayment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted payment from the state
      setPayments((prevPayments) => prevPayments.filter((payment) => payment._id !== id));
      alert('Payment deleted successfully');
    } catch (err) {
      console.error('Error deleting payment:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'An error occurred while deleting the payment');
    }
  };

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Your Payments</h2>
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
              <p><strong>Notes:</strong> {payment.studentNotes}</p>
              {payment.paymentSlip && (
                <div>
                  <strong>Payment Slip:</strong>
                  <br />
                  <a 
                    href={`http://localhost:5000/${payment.paymentSlip}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Slip
                  </a>
                  <br />
                  <p>
                    <strong>File Name:</strong> {payment.paymentSlip.split('/').pop()}
                  </p>
                </div>
              )}
              <button onClick={() => handleDeletePayment(payment._id)}>Delete Payment</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentsPage;
