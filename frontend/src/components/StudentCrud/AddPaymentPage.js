// AddPaymentPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddPaymentPage = () => {
  const { id } = useParams(); // Get the agent ID from the URL
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [bankInstitution, setBankInstitution] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('paymentAmount', paymentAmount);
    formData.append('paymentDate', paymentDate);
    formData.append('paymentDescription', paymentDescription);
    formData.append('bankInstitution', bankInstitution);
    formData.append('studentNotes', studentNotes);
    if (paymentSlip) {
      formData.append('paymentSlip', paymentSlip);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/payments/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Payment slip added successfully!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating payment');
      setSuccess('');
    }
  };

  return (
    <div>
      <h1>Add Payment Slip</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Payment Amount:</label>
          <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} required />
        </div>
        <div>
          <label>Payment Date:</label>
          <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
        </div>
        <div>
          <label>Payment Description:</label>
          <input type="text" value={paymentDescription} onChange={(e) => setPaymentDescription(e.target.value)} required />
        </div>
        <div>
          <label>Bank/Financial Institution:</label>
          <input type="text" value={bankInstitution} onChange={(e) => setBankInstitution(e.target.value)} required />
        </div>
        <div>
          <label>Student Notes:</label>
          <textarea value={studentNotes} onChange={(e) => setStudentNotes(e.target.value)}></textarea>
        </div>
        <div>
          <label>Payment Slip:</label>
          <input type="file" onChange={(e) => setPaymentSlip(e.target.files[0])} required />
        </div>
        <button type="submit">Submit Payment</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default AddPaymentPage;
