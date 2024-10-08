import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoWithSocial from "../components/LogoWithSocial";
import NavBar from "../components/NavBar";

function AddScholarships() {
    const [formData, setFormData] = useState({
        scholarshipTitle: '',
        organization: '',
        applicationDeadline: '',
        eligibilityCriteria: '',
        applicationLink: '',
        description: '',
        scholarshipType: '',
        fieldOfStudy: '',
        country: '',
        applicationRequirements: '',
        image: null
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
            setErrorMessage('You must be logged in to add a scholarship.');
            return;
        }

        const scholarshipData = new FormData();
        Object.keys(formData).forEach((key) => {
            scholarshipData.append(key, formData[key]);
        });

        try {
            const response = await fetch('http://localhost:5000/api/scholarships', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: scholarshipData
            });

            const result = await response.json();
            if (response.ok) {
                alert('Scholarship added successfully');
                navigate('/update-scholarships');
            } else {
                alert(result.error || 'Failed to add scholarship');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the scholarship.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
            <LogoWithSocial />
            <NavBar />
            
            <div className="flex justify-center items-center w-full mt-10">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
                    <h1 className="text-3xl font-semibold mb-6">Add Scholarship</h1>
                    {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-4">
                            <input 
                                type="text" 
                                name="scholarshipTitle" 
                                placeholder="Scholarship Title" 
                                value={formData.scholarshipTitle} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="text" 
                                name="organization" 
                                placeholder="Organization" 
                                value={formData.organization} 
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
                                type="text" 
                                name="eligibilityCriteria" 
                                placeholder="Eligibility Criteria" 
                                value={formData.eligibilityCriteria} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="url" 
                                name="applicationLink" 
                                placeholder="Application Link" 
                                value={formData.applicationLink} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <textarea 
                                name="description" 
                                placeholder="Description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="text" 
                                name="scholarshipType" 
                                placeholder="Scholarship Type" 
                                value={formData.scholarshipType} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="text" 
                                name="fieldOfStudy" 
                                placeholder="Field of Study" 
                                value={formData.fieldOfStudy} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="text" 
                                name="country" 
                                placeholder="Country" 
                                value={formData.country} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <textarea 
                                name="applicationRequirements" 
                                placeholder="Application Requirements" 
                                value={formData.applicationRequirements} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg" 
                                required 
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
                            Add Scholarship
                        </button>
                    </form>
                    <button className="mt-4 w-full bg-white border border-teal-500 text-teal-500 p-3 rounded-lg hover:bg-teal-500 hover:text-white transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg" onClick={() => navigate('/update-scholarships')}>
                        Update Scholarships
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddScholarships;
