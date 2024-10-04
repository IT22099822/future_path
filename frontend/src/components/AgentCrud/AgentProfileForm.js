import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AgentProfileForm = () => {
  const [agent, setAgent] = useState({
    name: '',
    bio: '',
    contactEmail: '',
    phone: '',
    website: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]); // Store URLs for additional images
  const [newAdditionalImages, setNewAdditionalImages] = useState([]); // Store new files to upload
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // Fetch the agent's profile if it exists
  useEffect(() => {
    const fetchAgentProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated. Please login.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/agents/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setAgent({
              name: data.name || '',
              bio: data.bio || '',
              contactEmail: data.contactEmail || '',
              phone: data.phone || '',
              website: data.website || '',
            });
            // Set the profile image if it exists
            if (data.profileImage) {
              setProfileImage(data.profileImage);
            }
            // Set additional images
            if (data.additionalImages) {
              setAdditionalImages(data.additionalImages);
            }
            setError('');
          }
        } else {
          setError('Failed to fetch profile');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchAgentProfile();
  }, [navigate]);

  // Handle form submission for creating or updating the profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User not authenticated. Please login.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', agent.name);
    formData.append('bio', agent.bio);
    formData.append('contactEmail', agent.contactEmail);
    formData.append('phone', agent.phone);
    formData.append('website', agent.website);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    newAdditionalImages.forEach(image => {
      if (image instanceof File) {
        formData.append('additionalImages', image);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/api/agents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSuccess('Profile saved successfully!');
        setError('');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setError('Failed to save profile');
      }
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfileImage(file); // Set the selected image file
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewAdditionalImages(files); // Store new files to upload
  };

  const getImagePreview = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
  };

  // Clear the object URL after component unmounts to avoid memory leaks
  useEffect(() => {
    return () => {
      if (profileImage && typeof profileImage !== 'string') {
        URL.revokeObjectURL(profileImage);
      }
      newAdditionalImages.forEach((img) => {
        if (img instanceof File) {
          URL.revokeObjectURL(getImagePreview(img));
        }
      });
    };
  }, [profileImage, newAdditionalImages]);

  // Handle profile deletion
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('User not authenticated. Please login.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/agents', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess('Profile deleted successfully!');
        setError('');
        setTimeout(() => {
          navigate('/update-agent-profile'); // Navigate to update agent profile page after deletion
        }, 2000);
      } else {
        setError('Failed to delete profile');
      }
    } catch (err) {
      setError('Failed to delete profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Update Profile Information</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            defaultValue={agent.name}
            onChange={(e) => setAgent({ ...agent, name: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label>Bio</label>
          <textarea
            defaultValue={agent.bio}
            onChange={(e) => setAgent({ ...agent, bio: e.target.value })}
            disabled={loading}
          ></textarea>
        </div>
        <div>
          <label>Contact Email</label>
          <input
            type="email"
            defaultValue={agent.contactEmail}
            onChange={(e) => setAgent({ ...agent, contactEmail: e.target.value })}
            disabled={loading}
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            defaultValue={agent.phone}
            onChange={(e) => setAgent({ ...agent, phone: e.target.value })}
            disabled={loading}
          />
        </div>
        <div>
          <label>Website</label>
          <input
            type="text"
            defaultValue={agent.website}
            onChange={(e) => setAgent({ ...agent, website: e.target.value })}
            disabled={loading}
          />
        </div>
        <div>
          <label>Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {profileImage && (
            <img src={typeof profileImage === 'string' ? profileImage : getImagePreview(profileImage)} alt="Profile Preview" width="100" />
          )}
        </div>
        <div>
          <label>Additional Images</label>
          <input type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange} />
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
            {additionalImages.map((image, index) => (
              <img
                key={index}
                src={image} // Directly using the URL for additional images
                alt={`Additional Preview ${index + 1}`}
                style={{ width: '100px', marginRight: '10px', marginBottom: '10px' }}
              />
            ))}
            {newAdditionalImages.map((image, index) => (
              <img
                key={`new-${index}`}
                src={getImagePreview(image)}
                alt={`New Additional Preview ${index + 1}`}
                style={{ width: '100px', marginRight: '10px', marginBottom: '10px' }}
              />
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading}>Save</button>
      </form>
      <button onClick={handleDelete} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }} disabled={loading}>
        Delete Profile
      </button>
    </div>
  );
};

export default AgentProfileForm;
