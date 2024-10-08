import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import LogoWithSocial from '../components/LogoWithSocial';

function SeeAllScholarships() {
    const [scholarships, setScholarships] = useState([]);
    const [selectedScholarship, setSelectedScholarship] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/scholarships')
            .then(response => response.json())
            .then(data => setScholarships(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleScholarshipClick = (scholarship) => {
        setSelectedScholarship(scholarship);
    };

    const handleCloseModal = () => {
        setSelectedScholarship(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] p-4">
            <LogoWithSocial />
            <NavBar />

            {/* Adjusting top margin and width of the container */}
            <div className="max-w-screen-lg mx-auto mt-12">
                <h1 className="text-3xl font-bold mb-4 text-white">All Scholarships</h1>

                {/* Grid Layout with hover effect */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scholarships.map(scholarship => (
                        <div
                            key={scholarship._id}
                            className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105"
                            onClick={() => handleScholarshipClick(scholarship)}
                        >
                            {scholarship.image && (
                                <img
                                    src={scholarship.image}
                                    alt={scholarship.scholarshipTitle}
                                    className="h-24 w-full object-cover rounded-t-lg mb-2"
                                />
                            )}
                            <h2 className="text-lg font-semibold mb-1">{scholarship.scholarshipTitle}</h2>
                            <p className="text-gray-600 mb-1"><strong>Organization:</strong> {scholarship.organization}</p>
                            <p className="text-gray-600 mb-1"><strong>Application Deadline:</strong> {new Date(scholarship.applicationDeadline).toLocaleDateString()}</p>
                            <p className="text-gray-600 mb-1"><strong>Country:</strong> {scholarship.country}</p>
                        </div>
                    ))}
                </div>

                {/* Modal for showing detailed scholarship info */}
                {selectedScholarship && (
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
                            <h2 className="text-2xl font-bold mb-4">{selectedScholarship.scholarshipTitle}</h2>
                            {selectedScholarship.image && (
                                <img
                                    src={selectedScholarship.image}
                                    alt={selectedScholarship.scholarshipTitle}
                                    className="h-32 w-full object-cover rounded-lg mb-4"
                                />
                            )}
                            <div className="space-y-2">
                                <p><strong>Organization:</strong> {selectedScholarship.organization}</p>
                                <p><strong>Application Deadline:</strong> {new Date(selectedScholarship.applicationDeadline).toLocaleDateString()}</p>
                                <p><strong>Eligibility Criteria:</strong> {selectedScholarship.eligibilityCriteria}</p>
                                <p><strong>Application Link:</strong> <a href={selectedScholarship.applicationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{selectedScholarship.applicationLink}</a></p>
                                <p><strong>Description:</strong> {selectedScholarship.description}</p>
                                <p><strong>Type:</strong> {selectedScholarship.scholarshipType}</p>
                                <p><strong>Field of Study:</strong> {selectedScholarship.fieldOfStudy}</p>
                                <p><strong>Country:</strong> {selectedScholarship.country}</p>
                                <p><strong>Application Requirements:</strong> {selectedScholarship.applicationRequirements}</p>
                                <p>
                                    <strong>Added by:</strong>{' '}
                                    {selectedScholarship.addedBy ? (
                                        <button className="text-blue-500 underline" onClick={() => navigate(`/agents/${selectedScholarship.addedBy._id}`)}>
                                            {selectedScholarship.addedBy.name}
                                        </button>
                                    ) : (
                                        'Unknown'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SeeAllScholarships;
