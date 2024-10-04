
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
        applicationRequirements: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    
        try {
            const response = await fetch('http://localhost:5000/api/scholarships', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Scholarship added successfully');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={styles.scholarshipsPage}>
            <div className={styles.scholarshipFormWrapper}>
                <h1>Add Scholarship</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputBox}>
                        <input type="text" name="scholarshipTitle" placeholder="Scholarship Title" value={formData.scholarshipTitle} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputBox}>
                        <input type="text" name="organization" placeholder="Organization" value={formData.organization} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputBox}>
                        <input type="date" name="applicationDeadline" placeholder="Application Deadline" value={formData.applicationDeadline} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputBox}>
                        <input type="text" name="eligibilityCriteria" placeholder="Eligibility Criteria" value={formData.eligibilityCriteria} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputBox}>
                        <input type="url" name="applicationLink" placeholder="Application Link" value={formData.applicationLink} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputBox}>
                        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputBox}>
                        <input type="text" name="scholarshipType" placeholder="Scholarship Type" value={formData.scholarshipType} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputBox}>
                        <input type="text" name="fieldOfStudy" placeholder="Field of Study" value={formData.fieldOfStudy} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputBox}>
                        <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
                    </div>
                    <div className={styles.inputBox}>
                        <textarea name="applicationRequirements" placeholder="Application Requirements" value={formData.applicationRequirements} onChange={handleChange} required />
                    </div>
                    <button className={styles.submitButton} type="submit">Add Scholarship</button>
                </form>
                <button className={styles.navigateButton} onClick={() => navigate('/update-scholarships')}>Update Scholarships</button>
            </div>
        </div>
    );
}

export default AddScholarships;
