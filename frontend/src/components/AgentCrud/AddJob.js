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
        websiteURL: ''
    });
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

        try {
            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Authorization token
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Job added successfully');
                navigate('/update-jobs'); // Redirect to update page after adding the job
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the job');
        }
    };

    return (
        <div>
            <h1>Add Job</h1>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Add Job</button>
            </form>
            <button onClick={() => navigate('/update-jobs')}>Update Jobs</button>
        </div>
    );
}

export default AddJob;
