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

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 font-sans">
      {/* Blue header with limited width and centered */}
      <div className="bg-blue-600 text-white py-8 rounded-t-lg relative mx-auto max-w-3xl text-center">
        {/* Profile Image with absolute positioning */}
        {agent?.profileImage ? (
          <img
            src={`http://localhost:5000/${agent.profileImage}`}
            alt={`${agent.name}'s profile`}
            className="w-32 h-32 object-cover rounded-full border-4 border-white absolute left-1/2 transform -translate-x-1/2 -translate-y-12"
          />
        ) : (
          <p className="text-center text-gray-300">No profile photo available</p>
        )}
        {/* Agent name */}
        <h1 className="text-5xl font-extrabold mt-20 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {agent?.name || 'Agent Profile'}
        </h1>
      </div>

      {agent ? (
        <div className="bg-white shadow-md rounded-b-lg p-6 mx-auto mt-16 max-w-3xl">
          {/* Centered Bio Section */}
          <div className="text-center mb-6">
            <p className="text-gray-600">{agent.bio}</p>
          </div>

          {/* Centered Contact Info */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <p className="text-lg"><strong>Contact Email:</strong> {agent.contactEmail}</p>
            <p className="text-lg"><strong>Phone:</strong> {agent.phone}</p>
            <p className="text-lg"><strong>Website:</strong> <a href={agent.website} className="text-blue-500 hover:underline">{agent.website}</a></p>
          </div>

          {/* Additional Pictures */}
          {agent.additionalImages && agent.additionalImages.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2 text-center">Additional Pictures:</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {agent.additionalImages.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/${image}`}
                    alt={`Additional ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 mb-6">No additional images available</p>
          )}

          {/* Book Appointment and Add Payment buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => navigate(`/agents/${id}/book-appointment`)}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Book an Appointment
            </button>
            <button
              onClick={() => navigate(`/agents/${id}/add-payment`)}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Add Payment Slip
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No profile found</p>
      )}

      {/* Reviews Section */}
      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Reviews</h2>
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <p className="text-lg font-semibold">
                  Reviewer: <Link to={`/student-profile/${review.reviewer._id}`} className="text-blue-500 hover:underline">{review.reviewer.name}</Link>
                </p>
                <p><strong>Review:</strong> {review.reviewText}</p>
                <p><strong>Rating:</strong> {review.rating}</p>
                <p><strong>Created At:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No reviews yet</p>
        )}
      </div>

      {/* Add Review button */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate(`/agents/${id}/add-review`)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Add Review
        </button>
      </div>
    </div>
  );
};

export default AgentProfilePage;
