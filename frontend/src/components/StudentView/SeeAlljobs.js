import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import LogoWithSocial from '../components/LogoWithSocial';
import Hero from '../components/Hero';

function SeeAllJobs() {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/api/jobs?search=${searchTerm}`)
            .then(response => response.json())
            .then(data => setJobs(data))
            .catch(error => console.error('Error:', error));
    }, [searchTerm]);

    const handleJobClick = (job) => {
        setSelectedJob(job);
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    return (
        <div className="p-4">
            <LogoWithSocial />
            <NavBar />
            <Hero />

            {/* Top margin of around 50px */}
            <div className=" md:mt-[650px] bg-gray-200 h-full">
                <h1 className="text-3xl font-bold mb-4">All Jobs</h1>
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 mb-4 border border-gray-300 rounded w-full"
                />

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <div
                            key={job._id}
                            className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleJobClick(job)}
                        >
                            {job.image && (
                                <img
                                    src={job.image}
                                    alt={job.jobTitle}
                                    className="h-24 w-full object-cover rounded-t-lg mb-2"
                                />
                            )}
                            <h2 className="text-lg font-semibold mb-1">{job.companyName}</h2>
                            <p className="text-gray-600 mb-1">{job.location}</p>
                            {job.applicationDeadline && (
                                <p className="text-gray-600">
                                    Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Modal for showing detailed job info */}
                {selectedJob && (
                    <div className="fixed inset-0 flex items-center justify-center">
                        {/* Blurred background */}
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md"></div>

                        <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl z-10">
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-bold mb-4">{selectedJob.jobTitle}</h2>
                            {selectedJob.image && (
                                <img
                                    src={selectedJob.image}
                                    alt={selectedJob.jobTitle}
                                    className="h-32 w-full object-cover rounded-lg mb-4"
                                />
                            )}
                            <div className="space-y-2">
                                <p><strong>Company:</strong> {selectedJob.companyName}</p>
                                <p><strong>Location:</strong> {selectedJob.location}</p>
                                <p><strong>Employment Type:</strong> {selectedJob.employmentType}</p>
                                {selectedJob.salaryRange && <p><strong>Salary Range:</strong> {selectedJob.salaryRange}</p>}
                                <p><strong>Job Description:</strong> {selectedJob.jobDescription}</p>
                                <p><strong>Requirements:</strong> {selectedJob.requirements}</p>
                                {selectedJob.applicationDeadline && (
                                    <p><strong>Application Deadline:</strong> {new Date(selectedJob.applicationDeadline).toLocaleDateString()}</p>
                                )}
                                {selectedJob.websiteURL && (
                                    <p>
                                        <strong>Website:</strong>{' '}
                                        <a
                                            href={selectedJob.websiteURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            {selectedJob.websiteURL}
                                        </a>
                                    </p>
                                )}
                                <p>
                                    <strong>Added by:</strong>{' '}
                                    <button
                                        className="text-blue-500 underline"
                                        onClick={() => navigate(`/agents/${selectedJob.addedBy._id}`)}
                                    >
                                        {selectedJob.addedBy.name}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SeeAllJobs;
