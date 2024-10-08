import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoWithSocial from "../components/LogoWithSocial";
import NavBar from "../components/NavBar";

function UpdateJob() {
  const { id } = useParams(); // Get the job ID from the URL
  const [job, setJob] = useState(null); // State to hold job data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [image, setImage] = useState(null); // State to handle the uploaded image
  const [preview, setPreview] = useState(null); // State to preview the selected image
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        setJob(data);
        setPreview(data.image); // Set the current image as preview
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
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
    formData.append('jobTitle', job.jobTitle);
    formData.append('companyName', job.companyName);
    formData.append('location', job.location);
    formData.append('employmentType', job.employmentType);
    formData.append('salaryRange', job.salaryRange);
    formData.append('jobDescription', job.jobDescription);
    formData.append('requirements', job.requirements);
    formData.append('applicationDeadline', job.applicationDeadline);
    formData.append('websiteURL', job.websiteURL);
    
    // Append the image if a new one is uploaded
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // Token for authorization
        },
        body: formData, // Send formData with text fields and image
      });

      if (response.ok) {
        alert('Job updated successfully');
        navigate('/update-jobs'); // Redirect to the list of jobs after update
      } else {
        alert('Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
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
          <h1 className="text-3xl font-semibold mb-6 text-center">Update Job</h1>
          
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          
          <form onSubmit={handleUpdate} encType="multipart/form-data" className="space-y-4">
            {/* Job Title */}
            <input
              type="text"
              placeholder="Job Title"
              value={job?.jobTitle || ''}
              onChange={(e) => setJob({ ...job, jobTitle: e.target.value })}
              required
              className="w-full p-2 border rounded-lg"
            />
            {/* Company Name */}
            <input
              type="text"
              placeholder="Company Name"
              value={job?.companyName || ''}
              onChange={(e) => setJob({ ...job, companyName: e.target.value })}
              required
              className="w-full p-2 border rounded-lg"
            />
            {/* Location */}
            <input
              type="text"
              placeholder="Location"
              value={job?.location || ''}
              onChange={(e) => setJob({ ...job, location: e.target.value })}
              required
              className="w-full p-2 border rounded-lg"
            />
            {/* Employment Type */}
            <input
              type="text"
              placeholder="Employment Type"
              value={job?.employmentType || ''}
              onChange={(e) => setJob({ ...job, employmentType: e.target.value })}
              required
              className="w-full p-2 border rounded-lg"
            />
            {/* Salary Range */}
            <input
              type="text"
              placeholder="Salary Range"
              value={job?.salaryRange || ''}
              onChange={(e) => setJob({ ...job, salaryRange: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            {/* Job Description */}
            <textarea
              placeholder="Job Description"
              value={job?.jobDescription || ''}
              onChange={(e) => setJob({ ...job, jobDescription: e.target.value })}
              required
              className="w-full p-2 border rounded-lg"
            />
            {/* Requirements */}
            <textarea
              placeholder="Requirements"
              value={job?.requirements || ''}
              onChange={(e) => setJob({ ...job, requirements: e.target.value })}
              required
              className="w-full p-2 border rounded-lg"
            />
            {/* Application Deadline */}
            <input
              type="date"
              placeholder="Application Deadline"
              value={job?.applicationDeadline ? new Date(job.applicationDeadline).toISOString().substring(0, 10) : ''}
              onChange={(e) => setJob({ ...job, applicationDeadline: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            {/* Website URL */}
            <input
              type="url"
              placeholder="Website URL"
              value={job?.websiteURL || ''}
              onChange={(e) => setJob({ ...job, websiteURL: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            
            {/* File input for image upload */}
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="w-full p-2 border rounded-lg"
            />
            
            {/* Image preview */}
            {preview && (
              <div>
                <img src={preview} alt="Job Preview" style={{ width: '200px', height: 'auto' }} />
              </div>
            )}

            {/* Update Job Button */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg"
            >
              Update Job
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateJob;
