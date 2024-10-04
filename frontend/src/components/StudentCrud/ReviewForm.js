import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ReviewForm = () => {
  const { id } = useParams(); // Get the agent ID from the URL
  const [review, setReview] = useState({
    studentName: '',
    content: '',
    rating: 1,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview(prevState => ({
      ...prevState,
      [name]: value,
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
    <div>
      <h1>Add Review</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="studentName"
            value={review.studentName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Review</label>
          <textarea
            name="content"
            value={review.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rating</label>
          <select
            name="rating"
            value={review.rating}
            onChange={handleChange}
            required
          >
            {[1, 2, 3, 4, 5].map(star => (
              <option key={star} value={star}>
                {star}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;
