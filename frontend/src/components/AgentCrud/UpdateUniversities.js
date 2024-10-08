import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import LogoWithSocial from '../components/LogoWithSocial';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png'; // Adjust path to your logo image

function UpdateUniversities() {
    const [universities, setUniversities] = useState([]);
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState(null); // For pop-up
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/universities', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch universities');
            }
            return response.json();
        })
        .then((data) => {
            setUniversities(data);
            setFilteredUniversities(data); // Set initial filtered universities
        })
        .catch((error) => {
            setError(error.message);
        });
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        const filtered = universities.filter((university) => 
            university.universityName.toLowerCase().includes(query.toLowerCase()) ||
            university.country.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredUniversities(filtered);
    };

    const handleUniversityClick = (university) => {
        setSelectedUniversity(university);
    };

    const handleCloseModal = () => {
        setSelectedUniversity(null);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/universities/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setUniversities(universities.filter((uni) => uni._id !== id));
                setFilteredUniversities(filteredUniversities.filter((uni) => uni._id !== id));
                alert('University deleted successfully');
            } else {
                const result = await response.json();
                alert(result.error || 'Failed to delete university');
            }
        } catch (error) {
            alert('Error deleting university');
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
            const headerWidth = 180; // Width of the header box
            const headerHeight = 65; // Height of the header box

            // Move company information further to the right
            const textX = 90; // Increased X position for text to move it further right
            pdf.text('Future Path (PVT) LTD', textX, headerY + 10);
            pdf.text('SLIIT, Malabe, Colombo', textX, headerY + 20);
            pdf.text('+94 771165416', textX, headerY + 30);
            pdf.text('contact@future_path.com', textX, headerY + 40);
            pdf.text('www.futurepath.com', textX, headerY + 50);

            // Add a line separating the header from the content
            pdf.setLineWidth(0.5); // Set line width
            pdf.line(10, headerY + 70, 200, headerY + 70); // Draw the line from left to right

            // Add an extra line after the separator
            let yPosition = headerY + 80; // Move content down one line

            // Add generation date and time
            const date = new Date();
            const formattedDate = `Report generated on: ${date.toLocaleString()}`;
            pdf.text(formattedDate, textX, headerY + 60); // Position for date and time

            // Title for the report
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.text('University Listings Report', 10, yPosition); // Adjusted position for report title

            // Iterate over each university and add the details to the PDF
            yPosition += 10; // Add space after the title
            pdf.setFontSize(12);
            filteredUniversities.forEach((university, index) => {
                pdf.text(`University #${index + 1}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Name: ${university.universityName}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Country: ${university.country}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`City: ${university.city}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Website: ${university.websiteURL}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Available Programs: ${university.availablePrograms}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Admission Requirements: ${university.admissionRequirements}`, 10, yPosition);
                yPosition += 10;
                pdf.text(`Established Year: ${university.establishedYear}`, 10, yPosition);
                yPosition += 20;

                // Draw a line between university entries
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
            pdf.save('universities_report.pdf');
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] p-4">
            <LogoWithSocial />
            <NavBar />

            <div className="container mx-auto mt-10 p-6 bg-opacity-70 shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-4xl font-bold text-white">Universities</h1>
                    <input
                        type="text"
                        placeholder="Search Universities..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="p-2 border border-gray-300 rounded w-full max-w-xs"
                    />
                </div>

                <button 
                    onClick={generatePDF} 
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                >
                    Download Universities as PDF
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUniversities.map((university) => (
                        <div
                            key={university._id}
                            className="bg-white shadow-md rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:scale-105"
                            onClick={() => handleUniversityClick(university)}
                        >
                            {university.image && (
                                <img
                                    src={university.image}
                                    alt={`${university.universityName} image`}
                                    className="w-full h-32 object-cover rounded-md mb-4"
                                />
                            )}
                            <h2 className="text-lg font-semibold mb-1">{university.universityName}</h2>
                            <p className="text-gray-600"><strong>Country:</strong> {university.country}</p>
                            
                            {/* Delete and Update buttons */}
                            <div className="flex justify-between mt-4">
                                <button 
                                    onClick={() => handleDelete(university._id)} 
                                    className="px-2 py-1 bg-red-600 text-white rounded shadow hover:bg-red-700"
                                >
                                    Delete
                                </button>
                                <button 
                                    onClick={() => window.location.href = `/update-university/${university._id}`} 
                                    className="px-2 py-1 bg-yellow-600 text-white rounded shadow hover:bg-yellow-700"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

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
                            {selectedUniversity.image && (
                                <img
                                    src={selectedUniversity.image}
                                    alt={`${selectedUniversity.universityName} image`}
                                    className="w-full h-64 object-cover rounded-md mb-4"
                                />
                            )}
                            <h2 className="text-2xl font-bold mb-4">{selectedUniversity.universityName}</h2>
                            <p><strong>Country:</strong> {selectedUniversity.country}</p>
                            <p><strong>City:</strong> {selectedUniversity.city}</p>
                            <p><strong>Available Programs:</strong> {selectedUniversity.availablePrograms}</p>
                            <p><strong>Admission Requirements:</strong> {selectedUniversity.admissionRequirements}</p>
                            <p><strong>Established Year:</strong> {selectedUniversity.establishedYear}</p>
                            <p><strong>Website:</strong> <a href={selectedUniversity.websiteURL} target="_blank" rel="noopener noreferrer">{selectedUniversity.websiteURL}</a></p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UpdateUniversities;
