import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const AgentProfilePage = () => {
  const { id } = useParams(); // Get the agent ID from the URL
  const [agent, setAgent] = useState(null); // State to hold agent data
  const [reviews, setReviews] = useState([]); // State to hold reviews data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(''); // State to handle errors

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgentProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/agents/${id}`);
        if (!response.ok) throw new Error('Failed to fetch agent profile');
        return await response.json();
      } catch (err) {
        setError('Failed to fetch agent profile');
        console.error('Error fetching agent profile:', err);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/agent/${id}`);
        if (!response.ok && response.status !== 404) throw new Error('Failed to fetch reviews');
        return await response.json();
      } catch (err) {
        setError(prev => prev || 'Failed to fetch reviews');
        console.error('Error fetching reviews:', err);
        return []; // Return an empty array if reviews fetch fails
      }
    };

    const fetchData = async () => {
      try {
        const [agentData, reviewsData] = await Promise.all([fetchAgentProfile(), fetchReviews()]);
        setAgent(agentData);
        setReviews(reviewsData || []); // Ensure reviewsData is an array
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Agent Profile</h1>
      {agent ? (
        <div>
          <p><strong>Name:</strong> {agent.name}</p>
          <p><strong>Bio:</strong> {agent.bio}</p>
          <p><strong>Contact Email:</strong> {agent.contactEmail}</p>
          <p><strong>Phone:</strong> {agent.phone}</p>
          <p><strong>Website:</strong> {agent.website}</p>

          {/* Profile Picture */}
          <div>
            <h3>Profile Picture:</h3>
            {agent.profileImage ? (
              <img src={`http://localhost:5000/${agent.profileImage}`} alt={`${agent.name}'s profile`} width="100" />
            ) : (
              <p>No agent profile photo</p>
            )}
          </div>

          {/* Additional Pictures */}
          {agent.additionalImages && agent.additionalImages.length > 0 ? (
            <div>
              <h3>Additional Pictures:</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {agent.additionalImages.map((image, index) => (
                  <img key={index} src={`http://localhost:5000/${image}`} alt={`Additional ${index + 1}`} width="100" style={{ margin: '5px' }} />
                ))}
              </div>
            </div>
          ) : (
            <p>No additional images available</p>
          )}

          {/* Book Appointment button */}
          <button onClick={() => navigate(`/agents/${id}/book-appointment`)}>Book an Appointment</button>

          {/* Add Payment button */}
          <button onClick={() => navigate(`/agents/${id}/add-payment`)}>Add Payment Slip</button>
        </div>
      ) : (
        <p>No profile found</p>
      )}

      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review._id} style={{ marginBottom: '1rem' }}>
              <p>
                <strong>Reviewer:</strong>{' '}
                <Link to={`/student-profile/${review.reviewer._id}`}>{review.reviewer.name}</Link>
              </p>
              <p><strong>Review:</strong> {review.reviewText}</p>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p><strong>Created At:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet</p>
      )}

      <button onClick={() => navigate(`/agents/${id}/add-review`)}>Add Review</button>
    </div>
  );
};

export default AgentProfilePage;
