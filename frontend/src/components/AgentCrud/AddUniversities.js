import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddUniversities() {
    const [formData, setFormData] = useState({
        universityName: '',
        country: '',
        city: '',
        websiteURL: '',
        availablePrograms: '',
        admissionRequirements: '',
        establishedYear: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    
        try {
            const response = await fetch('http://localhost:5000/api/universities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                alert('University added successfully');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    return (
        <div>
            <h1>Add University</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="universityName" placeholder="University Name" value={formData.universityName} onChange={handleChange} required />
                <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                <input type="url" name="websiteURL" placeholder="Website URL" value={formData.websiteURL} onChange={handleChange} required />
                <input type="text" name="availablePrograms" placeholder="Available Programs" value={formData.availablePrograms} onChange={handleChange} required />
                <textarea name="admissionRequirements" placeholder="Admission Requirements" value={formData.admissionRequirements} onChange={handleChange} required />
                <input type="number" name="establishedYear" placeholder="Established Year" value={formData.establishedYear} onChange={handleChange} min="1000" max="2100" />
                <button type="submit">Add University</button>
            </form>
            <button onClick={() => navigate('/update-universities')}>Update Universities</button>
        </div>
    );
}

export default AddUniversities;
