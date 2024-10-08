import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoWithSocial from "../components/LogoWithSocial";
import NavBar from "../components/NavBar";

function UpdateUniversity() {
  const { id } = useParams(); // Get the university ID from the URL
  const [university, setUniversity] = useState(null); // State to hold university data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [image, setImage] = useState(null); // State to handle the uploaded image
  const [preview, setPreview] = useState(null); // State to preview the selected image
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversity = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/api/universities/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch university details');
        const data = await response.json();
        setUniversity(data);
        // Set the current image as preview if it exists
        setPreview(data.image);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Preview the image before uploading
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Create a new FormData object
    const formData = new FormData();
    formData.append('universityName', university.universityName);
    formData.append('country', university.country);
    formData.append('city', university.city);
    formData.append('websiteURL', university.websiteURL);
    formData.append('availablePrograms', university.availablePrograms);
    formData.append('admissionRequirements', university.admissionRequirements);
    formData.append('establishedYear', university.establishedYear);
    
    // Append the image if a new one is uploaded
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/universities/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}` // Token for authorization
        },
        body: formData, // Send formData with text fields and image
      });

      if (response.ok) {
        alert('University updated successfully');
        navigate('/update-universities'); // Redirect to the list of universities after update
      } else {
        alert('Failed to update university');
      }
    } catch (error) {
      console.error('Error updating university:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
      <LogoWithSocial />
      <NavBar />
      
      <div className="flex justify-center items-center w-full mt-10">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">Update University</h1>
          
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          
          <form onSubmit={handleUpdate} encType="multipart/form-data" className="space-y-4">
            <input
              type="text"
              placeholder="University Name"
              value={university?.universityName || ''}
              onChange={(e) => setUniversity({ ...university, universityName: e.target.value })}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Country"
              value={university?.country || ''}
              onChange={(e) => setUniversity({ ...university, country: e.target.value })}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="City"
              value={university?.city || ''}
              onChange={(e) => setUniversity({ ...university, city: e.target.value })}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="url"
              placeholder="Website URL"
              value={university?.websiteURL || ''}
              onChange={(e) => setUniversity({ ...university, websiteURL: e.target.value })}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Available Programs"
              value={university?.availablePrograms || ''}
              onChange={(e) => setUniversity({ ...university, availablePrograms: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <textarea
              placeholder="Admission Requirements"
              value={university?.admissionRequirements || ''}
              onChange={(e) => setUniversity({ ...university, admissionRequirements: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Established Year"
              value={university?.establishedYear || ''}
              onChange={(e) => setUniversity({ ...university, establishedYear: e.target.value })}
              min="1000" max="2100"
              className="w-full p-2 border rounded-lg"
            />
            
            {/* File input for image upload */}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="w-full p-2 border rounded-lg" 
            />
            
            {/* Image preview */}
            {preview && (
              <div>
                <img src={preview} alt="University Preview" className="w-52 h-auto my-4" />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
            >
              Update University
            </button>
          </form>

          <button
            className="mt-4 w-full bg-white border border-teal-500 text-teal-500 p-3 rounded-lg hover:bg-teal-500 hover:text-white transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
            onClick={() => navigate('/update-universities')}
          >
            Back to University List
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateUniversity;
