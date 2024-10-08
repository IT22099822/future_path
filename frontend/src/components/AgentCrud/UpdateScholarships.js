import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import LogoWithSocial from '../components/LogoWithSocial';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png'; // Adjust this path to your logo

function UpdateScholarships() {
    const [scholarships, setScholarships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedScholarship, setSelectedScholarship] = useState(null); // For pop-up
    const [error, setError] = useState(null);
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
            .then((data) => setScholarships(data))
            .catch((error) => {
                console.error('Error fetching scholarships:', error);
                setError(error.message);
            });
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredScholarships = scholarships.filter(scholarship =>
        scholarship.scholarshipTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.organization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleScholarshipClick = (scholarship) => {
        setSelectedScholarship(scholarship);
    };

    const handleCloseModal = () => {
        setSelectedScholarship(null);
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
            // Add the logo
            pdf.addImage(logoImg, 'PNG', 10, 10, 50, 20); // Logo Position
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
    
            // Set up the header
            const headerY = 10; // Y position for header
            const textX = 90; // Increased X position for text to move it further right
            pdf.text('Future Path (PVT) LTD', textX, headerY + 10);
            pdf.text('SLIIT, Malabe, Colombo', textX, headerY + 20);
            pdf.text('+94 771165416', textX, headerY + 30);
            pdf.text('contact@future_path.com', textX, headerY + 40);
            pdf.text('www.futurepath.com', textX, headerY + 50);
    
            // Add generation date and time
            const date = new Date();
            const formattedDate = `Report generated on: ${date.toLocaleString()}`;
            pdf.text(formattedDate, textX, headerY + 60); // Position for date and time
    
            // Add a line separating the header from the content
            pdf.setLineWidth(0.5); // Set line width
            pdf.line(10, headerY + 70, 200, headerY + 70); // Draw the line from left to right
    
            // Title for the report
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Scholarship Listings Report', 10, 80); // Adjusted position for report title
    
            // Iterate over each scholarship and add the details to the PDF
            let yPosition = 90; // Move content down one line
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
    
                // Draw a line between scholarship entries
                pdf.setLineWidth(0.5);
                pdf.line(10, yPosition, 200, yPosition);
                yPosition += 10;
    
                // Check if the yPosition exceeds the page height, and add a new page if necessary
                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 20; // Reset y position for the new page
                }
            });
    
            // Save the generated PDF
            pdf.save('scholarships_report.pdf');
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] p-4">
            <LogoWithSocial />
            <NavBar />

            <div className="container mx-auto mt-10 p-6 bg-opacity-70 shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-4xl font-bold text-white">Scholarships</h1>
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search Scholarships..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="p-2 border border-gray-300 rounded w-full max-w-xs mr-4"
                        />
                        <button 
                            onClick={generatePDF} 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Download PDF
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScholarships.map((scholarship) => (
                        <div
                            key={scholarship._id}
                            className="bg-white shadow-md rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:scale-105"
                            onClick={() => handleScholarshipClick(scholarship)}
                        >
                            <img
                                src={scholarship.image} // Assuming each scholarship has an image URL
                                alt={`${scholarship.scholarshipTitle} image`}
                                className="w-full h-32 object-cover rounded-md mb-4"
                            />
                            <h2 className="text-lg font-semibold mb-1">{scholarship.scholarshipTitle}</h2>
                            <p className="text-gray-600"><strong>Organization:</strong> {scholarship.organization}</p>
                            <p className="text-gray-600"><strong>Application Deadline:</strong> {new Date(scholarship.applicationDeadline).toLocaleDateString()}</p>
                            <div className="flex justify-between mt-4">
                                <button 
                                    onClick={() => handleDelete(scholarship._id)} 
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                                <button 
                                    onClick={() => navigate(`/update-scholarship/${scholarship._id}`)} 
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedScholarship && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg">
                            <h2 className="text-2xl font-bold mb-4">{selectedScholarship.scholarshipTitle}</h2>
                            <p><strong>Organization:</strong> {selectedScholarship.organization}</p>
                            <p><strong>Application Deadline:</strong> {new Date(selectedScholarship.applicationDeadline).toLocaleDateString()}</p>
                            <p><strong>Eligibility Criteria:</strong> {selectedScholarship.eligibilityCriteria}</p>
                            <p><strong>Description:</strong> {selectedScholarship.description}</p>
                            <p><strong>Type:</strong> {selectedScholarship.scholarshipType}</p>
                            <p><strong>Field of Study:</strong> {selectedScholarship.fieldOfStudy}</p>
                            <p><strong>Country:</strong> {selectedScholarship.country}</p>
                            <p><strong>Application Requirements:</strong> {selectedScholarship.applicationRequirements}</p>
                            <button onClick={handleCloseModal} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Close</button>
                        </div>
                    </div>
                )}

                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
}

export default UpdateScholarships;
