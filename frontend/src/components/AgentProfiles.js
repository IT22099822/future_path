import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Agent Profiles</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div
              key={agent._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '20px',
                width: '300px',
                textAlign: 'center',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Display agent's profile image */}
              <img
                src={`/${agent.profileImage}`}
                alt={agent.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '10px',
                }}
              />
              {/* Agent's name */}
              <h3 style={{ fontSize: '1.5em', margin: '10px 0' }}>{agent.name}</h3>
              {/* Agent's bio */}
              <p style={{ fontSize: '1em', color: '#555' }}>{agent.bio}</p>
              {/* Button to navigate to the agent's public profile page */}
              <button
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
                onClick={() => handleUserClick(agent.user._id)}
              >
                View {agent.name}'s Profile
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No agent profiles found.</p>
        )}
      </div>
    </div>
  );
};

export default AgentProfiles;
