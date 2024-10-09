import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentNavBar from '../components/AgentNavbar';

function AddUniversities() {
    const [formData, setFormData] = useState({
        universityName: '',
        country: '',
        city: '',
        websiteURL: '',
        availablePrograms: '',
        admissionRequirements: '',
        establishedYear: '',
        image: null, // Image state
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Helper function to validate letters only
    const isLettersOnly = (value) => /^[A-Za-z\s]+$/.test(value);

    // Helper function to validate URL
    const isValidURL = (value) => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    };

    // Handle input changes with validation
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
        } else if (name === 'universityName' || name === 'country' || name === 'city') {
            if (isLettersOnly(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else if (name === 'establishedYear') {
            if (/^\d{0,4}$/.test(value)) { // Only allow up to 4 digits
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle form submission with validation
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Validations
        if (!isValidURL(formData.websiteURL)) {
            setErrorMessage('Please enter a valid URL.');
            return;
        }

        const universityData = new FormData();
        Object.keys(formData).forEach((key) => {
            universityData.append(key, formData[key]);
        });

        try {
            const response = await fetch('http://localhost:5000/api/universities', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: universityData,
            });
            const result = await response.json();
            if (response.ok) {
                alert('University added successfully');
                navigate('/update-universities');
            } else {
                alert(result.error || 'Failed to add university');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the university.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
            <AgentNavBar />
            <div className="flex justify-center items-center w-full mt-10">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
                    <h1 className="text-3xl font-semibold mb-6">Add University</h1>
                    {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-4">
                            <input
                                type="text"
                                name="universityName"
                                placeholder="University Name"
                                value={formData.universityName}
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
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="url"
                                name="websiteURL"
                                placeholder="Website URL"
                                value={formData.websiteURL}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                name="availablePrograms"
                                placeholder="Available Programs"
                                value={formData.availablePrograms}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <textarea
                                name="admissionRequirements"
                                placeholder="Admission Requirements"
                                value={formData.admissionRequirements}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="number"
                                name="establishedYear"
                                placeholder="Established Year"
                                value={formData.establishedYear}
                                onChange={handleChange}
                                min="1000"
                                max="2100"
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
                            Add University
                        </button>
                    </form>
                    <button className="mt-4 w-full bg-white border border-teal-500 text-teal-500 p-3 rounded-lg hover:bg-teal-500 hover:text-white transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg" onClick={() => navigate('/update-universities')}>
                        Update Universities
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddUniversities;
