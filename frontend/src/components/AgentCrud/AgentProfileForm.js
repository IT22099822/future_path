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

    // Validation for phone number length
    if (agent.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    // Validation for website URL
    const urlPattern = new RegExp(/^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([\w-.,@?^=%&:\/~+#]*[\w@?^=%&\/~+#])?$/);
    if (!urlPattern.test(agent.website)) {
      setError('Please enter a valid URL.');
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
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (file && validExtensions.includes(file.type)) {
      setProfileImage(file);
    } else {
      alert('Please upload a valid image file (jpg, jpeg, or png).');
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
      return validExtensions.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      alert('Some files are not valid. Only .jpg, .jpeg, .png files are allowed.');
    } else {
      setNewAdditionalImages(validFiles);
    }
  };

  const getImagePreview = (file) => {
    // Ensure the file is a valid File or Blob object before creating a URL
    if (file && (file instanceof File || file instanceof Blob)) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  useEffect(() => {
    return () => {
      // Clean up object URLs to prevent memory leaks
      if (profileImage && typeof profileImage !== 'string') {
        URL.revokeObjectURL(getImagePreview(profileImage));
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

  const handleNameChange = (e) => {
    const value = e.target.value;
    const regex = /^[A-Za-z\s]*$/; // Allows only letters and spaces
    if (regex.test(value)) {
      setAgent({ ...agent, name: value });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const regex = /^\d{0,10}$/; // Allows only digits and limits to 10 digits
    if (regex.test(value)) {
      setAgent({ ...agent, phone: value });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
      <AgentNavBar />
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
                onChange={handleNameChange}
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
                onChange={handlePhoneChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <input
                type="url"
                name="website"
                placeholder="Website"
                value={agent.website}
                onChange={(e) => setAgent({ ...agent, website: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
                disabled={loading}
              />
            </div>

            {/* Image upload */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Profile Image</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                disabled={loading}
              />
              {profileImage && (
                <div className="mt-2">
                  <img src={getImagePreview(profileImage)} alt="Profile" className="h-24 w-24 object-cover rounded-lg" />
                </div>
              )}
            </div>

            {/* Additional images upload */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Additional Images</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={handleAdditionalImagesChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                disabled={loading}
              />
              <div className="flex flex-wrap mt-2">
                {additionalImages.map((img, idx) => (
                  <img key={idx} src={img} alt="Additional" className="h-16 w-16 object-cover rounded-lg m-2" />
                ))}
                {newAdditionalImages.map((img, idx) => (
                  <img key={idx} src={getImagePreview(img)} alt="Additional" className="h-16 w-16 object-cover rounded-lg m-2" />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg ml-4"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgentProfileForm;
