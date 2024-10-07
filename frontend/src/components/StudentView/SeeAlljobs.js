import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SeeAllJobs.module.css'; // Import the CSS module

function SeeAllJobs() {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/api/jobs?search=${searchTerm}`)
            .then(response => response.json())
            .then(data => setJobs(data))
            .catch(error => console.error('Error:', error));
    }, [searchTerm]); // Fetch jobs whenever the searchTerm changes

    const handleUserClick = (id) => {
        navigate(`/agents/${id}`);
    };

    return (
        <div className={styles.jobsPage}> {/* Apply the jobsPage class */}
            <h1 className={styles.title}>All Jobs</h1>
            <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
                className={styles.searchInput} // Optional: Add a class for styling
            />
            <ul className={styles.jobList}> {/* Apply the jobList class */}
                {jobs.map(job => (
                    <li key={job._id} className={styles.jobCard}> {/* Apply the jobCard class */}
                        <h2 className={styles.jobTitle}>{job.jobTitle}</h2>

                        {/* Display job image if available */}
                        {job.image && (
                            <img 
                                src={job.image} // Use the full image URL returned by the backend
                                alt={`${job.jobTitle}`} 
                                className={styles.jobImage} // Add class for image styling
                            />
                        )}

                        <div className={styles.jobDetails}>
                            <p><strong>Company:</strong> {job.companyName}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Employment Type:</strong> {job.employmentType}</p>
                            {job.salaryRange && <p><strong>Salary Range:</strong> {job.salaryRange}</p>}
                            <p><strong>Job Description:</strong> {job.jobDescription}</p>
                            <p><strong>Requirements:</strong> {job.requirements}</p>
                            {job.applicationDeadline && (
                                <p><strong>Application Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                            )}
                            {job.websiteURL && (
                                <p>
                                    <strong>Website:</strong>{' '}
                                    <a href={job.websiteURL} target="_blank" rel="noopener noreferrer">
                                        {job.websiteURL}
                                    </a>
                                </p>
                            )}
                        </div>

                        <p>
                            <strong>Added by:</strong>{' '}
                            <button
                                className={styles.addedByBtn}
                                onClick={() => handleUserClick(job.addedBy._id)}
                            >
                                {job.addedBy.name}
                            </button>
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SeeAllJobs;
