import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddScholarships.module.css';

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
        image: null // Image state
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
            setErrorMessage('You must be logged in to add a scholarship.');
            return;
        }

        // Prepare form data for the request (for file uploads)
        const scholarshipData = new FormData();
        scholarshipData.append('scholarshipTitle', formData.scholarshipTitle);
        scholarshipData.append('organization', formData.organization);
        scholarshipData.append('applicationDeadline', formData.applicationDeadline);
        scholarshipData.append('eligibilityCriteria', formData.eligibilityCriteria);
        scholarshipData.append('applicationLink', formData.applicationLink);
        scholarshipData.append('description', formData.description);
        scholarshipData.append('scholarshipType', formData.scholarshipType);
        scholarshipData.append('fieldOfStudy', formData.fieldOfStudy);
        scholarshipData.append('country', formData.country);
        scholarshipData.append('applicationRequirements', formData.applicationRequirements);

        // Append the image file if it exists
        if (formData.image) {
            scholarshipData.append('image', formData.image);
        }

        try {
            const response = await fetch('http://localhost:5000/api/scholarships', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Authorization token
                },
                body: scholarshipData, // Send form data (including file)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Scholarship added successfully');
                navigate('/update-scholarships'); // Redirect to the update page after adding the scholarship
            } else {
                alert(result.error || 'Failed to add scholarship');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the scholarship.');
        }
    };

    return (
        <div className={styles.scholarshipsPage}>
            <div className={styles.scholarshipFormWrapper}>
                <h1>Add Scholarship</h1>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className={styles.inputBox}>
                        <input 
                            type="text" 
                            name="scholarshipTitle" 
                            placeholder="Scholarship Title" 
                            value={formData.scholarshipTitle} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <input 
                            type="text" 
                            name="organization" 
                            placeholder="Organization" 
                            value={formData.organization} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <input 
                            type="date" 
                            name="applicationDeadline" 
                            value={formData.applicationDeadline} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <input 
                            type="text" 
                            name="eligibilityCriteria" 
                            placeholder="Eligibility Criteria" 
                            value={formData.eligibilityCriteria} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <input 
                            type="url" 
                            name="applicationLink" 
                            placeholder="Application Link" 
                            value={formData.applicationLink} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <textarea 
                            name="description" 
                            placeholder="Description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <input 
                            type="text" 
                            name="scholarshipType" 
                            placeholder="Scholarship Type" 
                            value={formData.scholarshipType} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <input 
                            type="text" 
                            name="fieldOfStudy" 
                            placeholder="Field of Study" 
                            value={formData.fieldOfStudy} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <input 
                            type="text" 
                            name="country" 
                            placeholder="Country" 
                            value={formData.country} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <textarea 
                            name="applicationRequirements" 
                            placeholder="Application Requirements" 
                            value={formData.applicationRequirements} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <input 
                            type="file" 
                            name="image" 
                            accept="image/*" 
                            onChange={handleChange} 
                        />
                    </div>
                    <button className={styles.submitButton} type="submit">Add Scholarship</button>
                </form>
                <button className={styles.navigateButton} onClick={() => navigate('/update-scholarships')}>Update Scholarships</button>
            </div>
        </div>
    );
}

export default AddScholarships;
