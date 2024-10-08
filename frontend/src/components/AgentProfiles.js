import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './components/NavBar';
import LogoWithSocial from './components/LogoWithSocial';

const AgentProfiles = () => {
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate();

  // Function to fetch agent profiles from the backend
  const fetchAgents = async () => {
    try {
      const response = await axios.get('/api/agents');  // API call to get all agent profiles
      setAgents(response.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  // Navigate to the specific agent's public profile page
  const handleUserClick = (userId) => {
    navigate(`/agents/${userId}`);  // Navigate to agent's public profile page
  };

  // Use useEffect to fetch agent profiles when component mounts
  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
      <LogoWithSocial />
      <NavBar />

      <div className="flex justify-center items-center w-full mt-10">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">Agent Profiles</h1>
          <div className="flex flex-wrap gap-6 justify-center">
            {agents.length > 0 ? (
              agents.map((agent) => (
                <div
                  key={agent._id}
                  className="border rounded-lg p-6 w-full sm:w-1/3 text-center shadow-md"
                >
                  {/* Display agent's profile image */}
                  <img
                    src={`/${agent.profileImage}`}
                    alt={agent.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  {/* Agent's name */}
                  <h3 className="text-xl font-semibold mb-2">{agent.name}</h3>
                  {/* Agent's bio */}
                  <p className="text-gray-600 mb-4">{agent.bio}</p>
                  {/* Button to navigate to the agent's public profile page */}
                  <button
                    className="bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 transition duration-300"
                    onClick={() => handleUserClick(agent.user._id)}
                  >
                    View {agent.name}'s Profile
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center">No agent profiles found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfiles;
