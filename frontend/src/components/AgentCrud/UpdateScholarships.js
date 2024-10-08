import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import LogoWithSocial from '../components/LogoWithSocial';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png'; // Adjust this path to your logo

function UpdateScholarships() {
    const [scholarships, setScholarships] = useState([]);
    const [filteredScholarships, setFilteredScholarships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [selectedScholarship, setSelectedScholarship] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/scholarships', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch scholarships');
                }
                return response.json();
            })
            .then((data) => {
                setScholarships(data);
                setFilteredScholarships(data);
            })
            .catch((error) => {
                console.error('Error fetching scholarships:', error);
                setError(error.message);
            });
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        const filtered = scholarships.filter(scholarship =>
            scholarship.scholarshipTitle.toLowerCase().includes(value.toLowerCase()) ||
            scholarship.organization.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredScholarships(filtered);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/scholarships/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setScholarships(scholarships.filter((scholarship) => scholarship._id !== id));
                setFilteredScholarships(filteredScholarships.filter((scholarship) => scholarship._id !== id));
                alert('Scholarship deleted successfully');
            } else {
                const result = await response.json();
                alert(result.error || 'Failed to delete scholarship');
            }
        } catch (error) {
            console.error('Error deleting scholarship:', error);
            alert('Error deleting scholarship');
        }
    };

    const generatePDF = () => {
        const pdf = new jsPDF();
        const logoImg = new Image();
        logoImg.src = logo;
        logoImg.onload = () => {
            pdf.addImage(logoImg, 'PNG', 10, 10, 50, 20);
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Scholarship Listings Report', 10, 40);

            let yPosition = 50;
            pdf.setFontSize(12);
            filteredScholarships.forEach((scholarship, index) => {
                pdf.text(`Scholarship #${index + 1}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Title: ${scholarship.scholarshipTitle}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Organization: ${scholarship.organization}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Application Deadline: ${new Date(scholarship.applicationDeadline).toLocaleDateString()}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Eligibility Criteria: ${scholarship.eligibilityCriteria}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Application Link: ${scholarship.applicationLink}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Description: ${scholarship.description}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Type: ${scholarship.scholarshipType}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Field of Study: ${scholarship.fieldOfStudy}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Country: ${scholarship.country}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Application Requirements: ${scholarship.applicationRequirements}`, 10, yPosition);
                yPosition += 20;

                pdf.setLineWidth(0.5);
                pdf.line(10, yPosition, 200, yPosition);
                yPosition += 10;

                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 20;
                }
            });

            pdf.save('scholarships_report.pdf');
        };
    };

    const handleScholarshipClick = (scholarship) => {
        setSelectedScholarship(scholarship);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedScholarship(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a]">
            <div className={`min-h-screen p-4 ${modalOpen ? 'backdrop-blur-xs' : ''}`}>
                <LogoWithSocial />
                <NavBar />

                <div className="container mx-auto mt-10 p-6 bg-opacity-70 shadow-lg rounded-lg">
                    {/* Centering the title and search bar */}
                    <div className="flex flex-col items-center mb-4">
                        <h1 className="text-4xl font-bold text-white mb-4">Your Scholarships</h1>
                        <div className="flex justify-center w-full max-w-xs">
                            <input
                                type="text"
                                placeholder="Search Scholarships..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generatePDF}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 transition duration-300"
                    >
                        Download Scholarships as PDF
                    </button>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredScholarships.map((scholarship) => (
                            <div
                                key={scholarship._id}
                                className="bg-white shadow-md rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:scale-105"
                                onClick={() => handleScholarshipClick(scholarship)} // Open modal on click
                            >
                                {scholarship.image && (
                                    <img src={scholarship.image} alt="Scholarship" className="h-24 w-full object-cover rounded-t-lg mb-2 shadow-lg" />
                                )}
                                <h2 className="text-lg font-semibold mb-1">{scholarship.scholarshipTitle}</h2>
                                <p className="text-gray-600 mb-1"><strong>Organization:</strong> {scholarship.organization}</p>
                                <p className="text-gray-600 mb-1"><strong>Application Deadline:</strong> {new Date(scholarship.applicationDeadline).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal for displaying scholarship details */}
                {modalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 w-11/12 sm:w-2/3 lg:w-1/2">
                            <h2 className="text-2xl font-semibold mb-2">{selectedScholarship?.scholarshipTitle}</h2>
                            <p className="text-gray-700 mb-1"><strong>Organization:</strong> {selectedScholarship?.organization}</p>
                            <p className="text-gray-700 mb-1"><strong>Application Deadline:</strong> {new Date(selectedScholarship?.applicationDeadline).toLocaleDateString()}</p>
                            <p className="text-gray-700 mb-1"><strong>Eligibility Criteria:</strong> {selectedScholarship?.eligibilityCriteria}</p>
                            <p className="text-gray-700 mb-1"><strong>Description:</strong> {selectedScholarship?.description}</p>
                            <p className="text-gray-700 mb-1"><strong>Type:</strong> {selectedScholarship?.scholarshipType}</p>
                            <p className="text-gray-700 mb-1"><strong>Field of Study:</strong> {selectedScholarship?.fieldOfStudy}</p>
                            <p className="text-gray-700 mb-1"><strong>Country:</strong> {selectedScholarship?.country}</p>
                            <p className="text-gray-700 mb-1"><strong>Application Requirements:</strong> {selectedScholarship?.applicationRequirements}</p>

                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mr-2"
                                    onClick={() => handleDelete(selectedScholarship?._id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UpdateScholarships;
