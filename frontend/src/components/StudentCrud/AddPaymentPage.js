// AddPaymentPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LogoWithSocial from "../components/LogoWithSocial";
import NavBar from "../components/NavBar";

const AddPaymentPage = () => {
  const { id } = useParams();
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

    // Payment amount validation
    if (Number(paymentAmount) < 1000) {
      setError('Payment amount must be at least 1000.');
      return;
    }

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPaymentSlip(file);
    } else {
      setPaymentSlip(null);
      alert('Please upload a PDF file.');
    }
  };

  const handleBankInstitutionChange = (e) => {
    // Allow only letters in the bank institution input
    const value = e.target.value;
    const regex = /^[a-zA-Z\s]*$/; // Regular expression to allow only letters and spaces
    if (regex.test(value) || value === '') {
      setBankInstitution(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
      <LogoWithSocial />
      <NavBar />

      <div className="flex justify-center items-center w-full mt-10">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
          <h1 className="text-3xl font-semibold mb-6">Add Payment Slip</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <input
                type="number"
                name="paymentAmount"
                placeholder="Payment Amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="date"
                name="paymentDate"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="paymentDescription"
                placeholder="Payment Description"
                value={paymentDescription}
                onChange={(e) => setPaymentDescription(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="bankInstitution"
                placeholder="Bank/Financial Institution"
                value={bankInstitution}
                onChange={handleBankInstitutionChange} // Updated handler
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                name="studentNotes"
                placeholder="Student Notes"
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="mb-6">
              <input
                type="file"
                name="paymentSlip"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              {paymentSlip && paymentSlip.type === 'application/pdf' && (
                <div className="mt-2 text-gray-500">{paymentSlip.name}</div>
              )}
            </div>
            <button
              className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
              type="submit"
            >
              Submit Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentPage;
