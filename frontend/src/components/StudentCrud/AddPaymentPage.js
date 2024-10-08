// AddPaymentPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
 // Update the path to your PDF icon image

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-50 to-blue-400">
      <div className="bg-blue-400 bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h1 className="text-3xl text-white text-center mb-6">Add Payment Slip</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-white">Payment Amount:</label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
              className="w-full p-2 mt-1 bg-transparent border-b-2 border-white text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="text-white">Payment Date:</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="w-full p-2 mt-1 bg-transparent border-b-2 border-white text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="text-white">Payment Description:</label>
            <input
              type="text"
              value={paymentDescription}
              onChange={(e) => setPaymentDescription(e.target.value)}
              required
              className="w-full p-2 mt-1 bg-transparent border-b-2 border-white text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="text-white">Bank/Financial Institution:</label>
            <input
              type="text"
              value={bankInstitution}
              onChange={(e) => setBankInstitution(e.target.value)}
              required
              className="w-full p-2 mt-1 bg-transparent border-b-2 border-white text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
              placeholder="Enter institution"
            />
          </div>
          <div>
            <label className="text-white">Student Notes:</label>
            <textarea
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              className="w-full p-2 mt-1 bg-transparent border-b-2 border-white text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
              placeholder="Any notes..."
            ></textarea>
          </div>
          <div>
            <label className="text-white">Payment Slip:</label>
            <div className="flex items-center">
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.type === 'application/pdf') {
                    setPaymentSlip(file);
                  } else {
                    setPaymentSlip(null);
                    alert('Please upload a PDF file.');
                  }
                }}
                required
                className="w-full p-2 mt-1 bg-transparent border-b-2 border-white text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
              />
              {paymentSlip && paymentSlip.type === 'application/pdf' && (
                <div className="flex items-center ml-2">
                  {/* <img src={pdfIcon} alt="PDF Icon" className="w-6 h-6" /> */}
                  <span className="text-white ml-1">{paymentSlip.name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-white text-blue-600 py-2 px-6 rounded-md hover:bg-gray-100 transition-all duration-200"
            >
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentPage;
