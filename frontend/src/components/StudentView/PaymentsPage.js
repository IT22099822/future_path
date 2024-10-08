import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoWithSocial from '../components/LogoWithSocial';
import NavBar from '../components/NavBar';

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
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] font-sans">
      <LogoWithSocial />
      <NavBar />

      <div className="flex justify-center items-center w-full mt-10">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-5xl">
          <h2 className="text-3xl font-semibold mb-6 text-center">Your Payments</h2>
          {payments.length === 0 ? (
            <p>No payments found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payments.map((payment) => (
                <div key={payment._id} className="p-4 border rounded-lg shadow-md bg-gray-50">
                  <p className="font-light mb-2"><strong>Amount:</strong> {payment.paymentAmount}</p>
                  <p className="font-light mb-2"><strong>Date:</strong> {new Date(payment.paymentDate).toLocaleDateString()}</p>
                  <p className="font-light mb-2"><strong>Description:</strong> {payment.paymentDescription}</p>
                  <p className="font-light mb-2"><strong>Bank:</strong> {payment.bankInstitution}</p>
                  <p className="font-light mb-2"><strong>Status:</strong> {payment.paymentStatus}</p>
                  <p className="font-light mb-2"><strong>Notes:</strong> {payment.studentNotes}</p>
                  {payment.paymentSlip && (
                    <div className="mb-2">
                      <strong>Payment Slip:</strong>
                      <br />
                      <a 
                        href={`http://localhost:5000/${payment.paymentSlip}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 underline hover:text-blue-600"
                      >
                        View Slip
                      </a>
                      <br />
                      <p className="font-light">
                        <strong>File Name:</strong> {payment.paymentSlip.split('/').pop()}
                      </p>
                    </div>
                  )}
                  <button 
                    onClick={() => handleDeletePayment(payment._id)} 
                    className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
                  >
                    Delete Payment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
