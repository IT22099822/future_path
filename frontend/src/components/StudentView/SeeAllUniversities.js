import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import LogoWithSocial from '../components/LogoWithSocial';

function SeeAllUniversities() {
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/universities')
            .then(response => response.json())
            .then(data => setUniversities(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleUniversityClick = (university) => {
        setSelectedUniversity(university);
    };

    const handleCloseModal = () => {
        setSelectedUniversity(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] p-4">
            <LogoWithSocial />
            <NavBar />

            <div className="max-w-screen-lg mx-auto mt-12">
                <h1 className="text-3xl font-bold mb-4 text-white">All Universities</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {universities.map(university => (
                        <div
                            key={university._id}
                            className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105"
                            onClick={() => handleUniversityClick(university)}
                        >
                            {university.image && (
                                <img
                                    src={university.image}
                                    alt={university.universityName}
                                    className="h-24 w-full object-cover rounded-t-lg mb-2"
                                />
                            )}
                            <h2 className="text-lg font-semibold mb-1">{university.universityName}</h2>
                            <p className="text-gray-600 mb-1"><strong>Location:</strong> {university.city}, {university.country}</p>
                            <p className="text-gray-600 mb-1"><strong>Available Programs:</strong> 
                                {Array.isArray(university.availablePrograms) ? 
                                    university.availablePrograms.join(', ') : 'Not available'}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Modal for showing detailed university info */}
                {selectedUniversity && (
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md"></div>

                        <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl z-10">
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-bold mb-4">{selectedUniversity.universityName}</h2>
                            {selectedUniversity.image && (
                                <img
                                    src={selectedUniversity.image}
                                    alt={selectedUniversity.universityName}
                                    className="h-32 w-full object-cover rounded-lg mb-4"
                                />
                            )}
                            <div className="space-y-2">
                                <p><strong>Location:</strong> {selectedUniversity.country}, {selectedUniversity.city}</p>
                                <p><strong>Website:</strong> 
                                    <a href={selectedUniversity.websiteURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{selectedUniversity.websiteURL}</a>
                                </p>
                                <p><strong>Available Programs:</strong> 
                                    {Array.isArray(selectedUniversity.availablePrograms) ? 
                                        selectedUniversity.availablePrograms.join(', ') : 'Not available'}
                                </p>
                                <p><strong>Admission Requirements:</strong> {selectedUniversity.admissionRequirements}</p>
                                <p><strong>Established Year:</strong> {selectedUniversity.establishedYear}</p>
                                <p>
                                    <strong>Added by:</strong>{' '}
                                    {selectedUniversity.addedBy ? (
                                        <button className="text-blue-500 underline" onClick={() => navigate(`/agents/${selectedUniversity.addedBy._id}`)}>
                                            {selectedUniversity.addedBy.name}
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

export default SeeAllUniversities;
