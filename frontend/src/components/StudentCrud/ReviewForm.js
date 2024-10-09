import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LogoWithSocial from "../components/LogoWithSocial";
import NavBar from "../components/NavBar";

const ReviewForm = () => {
  const { id } = useParams(); // Get the agent ID from the URL
  const [review, setReview] = useState({
    studentName: '',
    content: '',
    rating: 1,
  });
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState(''); // State for name validation error
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If the field is the name field, validate it
    if (name === 'studentName') {
      const regex = /^[A-Za-z\s]*$/; // Regex to allow only letters and spaces
      if (!regex.test(value)) {
        setNameError('Name can only contain letters and spaces');
        return;
      } else {
        setNameError(''); // Clear error if validation passes
      }
    }

    setReview(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStarClick = (star) => {
    setReview(prevState => ({
      ...prevState,
      rating: star,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add the token to the headers
        },
        body: JSON.stringify({
          reviewText: review.content, // Adjust this based on your backend schema
          rating: review.rating,
          agent: id,
        }),
      });

      if (response.ok) {
        navigate(`/agents/${id}`); // Redirect back to the agent's profile page
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add review');
      }
    } catch (err) {
      setError('Failed to add review');
      console.error('Error adding review:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
      <LogoWithSocial />
      <NavBar />
      
      <div className="flex justify-center items-center w-full mt-10">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">Add Review</h1>
          
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {nameError && <p className="text-red-500 mb-4 text-center">{nameError}</p>} {/* Display name error */}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="mb-4">
              <label className="block mb-1" htmlFor="studentName">Name</label>
              <input
                type="text"
                name="studentName"
                value={review.studentName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Review Content */}
            <div className="mb-4">
              <label className="block mb-1" htmlFor="content">Review</label>
              <textarea
                name="content"
                value={review.content}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="block mb-1">Rating</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    onClick={() => handleStarClick(star)}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 cursor-pointer ${review.rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .587l3.668 7.431 8.26 1.176-5.977 5.055L20.224 24 12 19.988 3.776 24l1.773-10.751-5.977-5.055 8.26-1.176z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
