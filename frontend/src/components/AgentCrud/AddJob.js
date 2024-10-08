import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoWithSocial from "../components/LogoWithSocial";
import AgentNavBar from '../components/AgentNavbar';

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
        image: null,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('You must be logged in to add a job.');
            return;
        }

        const jobData = new FormData();
        Object.keys(formData).forEach((key) => {
            jobData.append(key, formData[key]);
        });

        try {
            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: jobData,
            });

            const result = await response.json();
            if (response.ok) {
                alert('Job added successfully');
                navigate('/update-jobs');
            } else {
                alert(result.error || 'Failed to add job');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the job.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
            
            <AgentNavBar/>
            
            <div className="flex justify-center items-center w-full mt-10">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
                    <h1 className="text-3xl font-semibold mb-6">Add Job</h1>
                    {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-4">
                            <input 
                                type="text" 
                                name="jobTitle" 
                                placeholder="Job Title" 
                                value={formData.jobTitle} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="text" 
                                name="companyName" 
                                placeholder="Company Name" 
                                value={formData.companyName} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="text" 
                                name="location" 
                                placeholder="Location" 
                                value={formData.location} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <select 
                                name="employmentType" 
                                value={formData.employmentType} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required
                            >
                                <option value="">Employment Type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <input 
                                type="text" 
                                name="salaryRange" 
                                placeholder="Salary Range (optional)" 
                                value={formData.salaryRange} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                            />
                        </div>
                        <div className="mb-4">
                            <textarea 
                                name="jobDescription" 
                                placeholder="Job Description" 
                                value={formData.jobDescription} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <textarea 
                                name="requirements" 
                                placeholder="Requirements" 
                                value={formData.requirements} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="date" 
                                name="applicationDeadline" 
                                value={formData.applicationDeadline} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="url" 
                                name="websiteURL" 
                                placeholder="Website URL (optional)" 
                                value={formData.websiteURL} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                            />
                        </div>
                        <div className="mb-6">
                            <input 
                                type="file" 
                                name="image" 
                                accept="image/*" 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <button className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg" type="submit">
                            Add Job
                        </button>
                    </form>
                    <button className="mt-4 w-full bg-white border border-teal-500 text-teal-500 p-3 rounded-lg hover:bg-teal-500 hover:text-white transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg" onClick={() => navigate('/update-jobs')}>
                        Update Jobs
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddJob;
