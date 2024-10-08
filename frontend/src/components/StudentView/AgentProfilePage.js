import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import LogoWithSocial from "../components/LogoWithSocial";
import NavBar from "../components/NavBar";

const AgentProfilePage = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgentProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/agents/${id}`);
        return response.data;
      } catch (err) {
        setError('Failed to fetch agent profile');
        console.error('Error fetching agent profile:', err);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/agent/${id}`);
        return response.data;
      } catch (err) {
        setError(prev => prev || 'Failed to fetch reviews');
        console.error('Error fetching reviews:', err);
        return [];
      }
    };

    const fetchData = async () => {
      try {
        const [agentData, reviewsData] = await Promise.all([fetchAgentProfile(), fetchReviews()]);
        setAgent(agentData);
        setReviews(reviewsData || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.431 8.26 1.176-5.977 5.055L20.224 24 12 19.988 3.776 24l1.773-10.751-5.977-5.055 8.26-1.176z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] font-sans">
      <LogoWithSocial />
      <NavBar />

      <div className="container mx-auto p-6">
        {/* Blue header with limited width and centered */}
        <div className="bg-teal-600 text-white py-8 rounded-t-lg relative mx-auto max-w-3xl text-center">
          {/* Profile Image */}
          {agent?.profileImage ? (
            <img
              src={`http://localhost:5000/${agent.profileImage}`}
              alt={`${agent.name}'s profile`}
              className="w-32 h-32 object-cover rounded-full border-4 border-white absolute left-1/2 transform -translate-x-1/2 -translate-y-12"
            />
          ) : (
            <p className="text-center text-gray-300">No profile photo available</p>
          )}
          <h1 className="text-5xl font-extrabold mt-20 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {agent?.name || 'Agent Profile'}
          </h1>
        </div>

        {agent ? (
          <div className="bg-white shadow-lg rounded-b-lg p-6 mx-auto mt-16 max-w-3xl">
            {/* Centered Bio Section */}
            <div className="text-center mb-6">
              <p className="text-gray-600 text-lg">{agent.bio}</p>
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
                className="flex-1 bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
              >
                Book an Appointment
              </button>
              <button
                onClick={() => navigate(`/agents/${id}/add-payment`)}
                className="flex-1 bg-white border border-teal-500 text-teal-500 p-3 rounded-lg hover:bg-teal-500 hover:text-white transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
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
                  <p><strong>Rating:</strong> {renderStars(review.rating)}</p>
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
            className="w-3/4 md:w-1/2 bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
          >
            Add Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentProfilePage;
