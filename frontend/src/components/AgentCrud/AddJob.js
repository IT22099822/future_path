import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddJob() {
    const [formData, setFormData] = useState({
        jobTitle: '',
        companyName: '',
        location: '',
        employmentType: '',
        salaryRange: '',
        jobDescription: '',
        requirements: '',
        applicationDeadline: '',
        websiteURL: '',
        image: null, // Image state
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // Handle file input change for the image
        if (name === 'image') {
            setFormData({ ...formData, image: files[0] }); // Get the first selected file
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (!token) {
            setErrorMessage('You must be logged in to add a job.');
            return;
        }

        // Prepare form data for the request (for file uploads)
        const jobData = new FormData();
        jobData.append('jobTitle', formData.jobTitle);
        jobData.append('companyName', formData.companyName);
        jobData.append('location', formData.location);
        jobData.append('employmentType', formData.employmentType);
        jobData.append('salaryRange', formData.salaryRange);
        jobData.append('jobDescription', formData.jobDescription);
        jobData.append('requirements', formData.requirements);
        jobData.append('applicationDeadline', formData.applicationDeadline);
        jobData.append('websiteURL', formData.websiteURL);

        // Append the image file if it exists
        if (formData.image) {
            jobData.append('image', formData.image);
        }

        try {
            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Authorization token
                },
                body: jobData, // Send form data (including file)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Job added successfully');
                navigate('/update-jobs'); // Redirect to the update page after adding the job
            } else {
                alert(result.error || 'Failed to add job');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the job.');
        }
    };

    return (
        <div>
            <h1>Add Job</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input 
                    type="text" 
                    name="jobTitle" 
                    placeholder="Job Title" 
                    value={formData.jobTitle} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="companyName" 
                    placeholder="Company Name" 
                    value={formData.companyName} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="location" 
                    placeholder="Location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    required 
                />
                <select 
                    name="employmentType" 
                    value={formData.employmentType} 
                    onChange={handleChange} 
                    required
                >
                    <option value="">Employment Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                </select>
                <input 
                    type="text" 
                    name="salaryRange" 
                    placeholder="Salary Range (optional)" 
                    value={formData.salaryRange} 
                    onChange={handleChange} 
                />
                <textarea 
                    name="jobDescription" 
                    placeholder="Job Description" 
                    value={formData.jobDescription} 
                    onChange={handleChange} 
                    required 
                />
                <textarea 
                    name="requirements" 
                    placeholder="Requirements" 
                    value={formData.requirements} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="date" 
                    name="applicationDeadline" 
                    value={formData.applicationDeadline} 
                    onChange={handleChange} 
                />
                <input 
                    type="url" 
                    name="websiteURL" 
                    placeholder="Website URL (optional)" 
                    value={formData.websiteURL} 
                    onChange={handleChange} 
                />
                <input 
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    onChange={handleChange} 
                />
                <button type="submit">Add Job</button>
            </form>
            <button onClick={() => navigate('/update-jobs')}>Update Jobs</button>
        </div>
    );
}

export default AddJob;
