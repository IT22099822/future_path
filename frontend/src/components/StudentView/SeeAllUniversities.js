import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SeeAllUniversities.module.css'; // Import CSS module

function SeeAllUniversities() {
    const [universities, setUniversities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/universities')
            .then(response => response.json())
            .then(data => setUniversities(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleUserClick = (id) => {
        navigate(`/agents/${id}`);
    };

    return (
        <div className={styles.universitiesPage}>
            <h1>All Universities</h1>
            <ul className={styles.universityList}>
                {universities.map(university => (
                    <li key={university._id} className={styles.universityCard}>
                        <h2 className={styles.universityName}>{university.universityName}</h2>
                        <p className={styles.universityLocation}>{university.country}, {university.city}</p>
                        <p>
                            <strong>Website:</strong> 
                            <a href={university.websiteURL} target="_blank" rel="noopener noreferrer">
                                {university.websiteURL}
                            </a>
                        </p>
                        <p><strong>Available Programs:</strong> {university.availablePrograms}</p>
                        <p><strong>Admission Requirements:</strong> {university.admissionRequirements}</p>
                        <p><strong>Established Year:</strong> {university.establishedYear}</p>
                        <p>
                            <strong>Added by:</strong>{' '}
                            {university.addedBy ? (
                                <button className={styles.addedByBtn} onClick={() => handleUserClick(university.addedBy._id)}>
                                    {university.addedBy.name}
                                </button>
                            ) : (
                                'Unknown'
                            )}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SeeAllUniversities;
