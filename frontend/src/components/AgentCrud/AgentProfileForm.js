import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentNavBar from '../components/AgentNavbar';


const AgentProfileForm = () => {
  const [agent, setAgent] = useState({
    name: '',
    bio: '',
    contactEmail: '',
    phone: '',
    website: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [newAdditionalImages, setNewAdditionalImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

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
            if (data.profileImage) {
              setProfileImage(data.profileImage);
            }
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
      setProfileImage(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewAdditionalImages(files);
  };

  const getImagePreview = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
  };

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
          navigate('/update-agent-profile');
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
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
      
      <AgentNavBar/>
      <div className="flex justify-center items-center w-full mt-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        <h2 className="text-3xl font-semibold mb-6">Update Profile Information</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={agent.name}
              onChange={(e) => setAgent({ ...agent, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <textarea
              name="bio"
              placeholder="Bio"
              value={agent.bio}
              onChange={(e) => setAgent({ ...agent, bio: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="contactEmail"
              placeholder="Contact Email"
              value={agent.contactEmail}
              onChange={(e) => setAgent({ ...agent, contactEmail: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={agent.phone}
              onChange={(e) => setAgent({ ...agent, phone: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="website"
              placeholder="Website"
              value={agent.website}
              onChange={(e) => setAgent({ ...agent, website: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full mb-2" />
            {profileImage && (
              <img src={typeof profileImage === 'string' ? profileImage : getImagePreview(profileImage)} alt="Profile Preview" className="w-24 h-24 object-cover mb-2" />
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Additional Images</label>
            <input type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange} className="w-full mb-2" />
            <div className="flex flex-wrap mt-2">
              {additionalImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Additional Preview ${index + 1}`}
                  className="w-24 h-24 object-cover mr-2 mb-2"
                />
              ))}
              {newAdditionalImages.map((image, index) => (
                <img
                  key={`new-${index}`}
                  src={getImagePreview(image)}
                  alt={`New Additional Preview ${index + 1}`}
                  className="w-24 h-24 object-cover mr-2 mb-2"
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AgentProfileForm;
