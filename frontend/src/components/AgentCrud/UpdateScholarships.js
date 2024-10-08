import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png'; // Adjust this path to your logo

function UpdateScholarships() {
    const [scholarships, setScholarships] = useState([]);
    const [filteredScholarships, setFilteredScholarships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

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
                setFilteredScholarships(data); // Initialize with all scholarships
            })
            .catch((error) => {
                console.error('Error fetching scholarships:', error);
                setError(error.message);
            });
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        // Filter scholarships based on the search term
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
    
            // Add generation date and time
            const date = new Date();
            const formattedDate = `Report generated on: ${date.toLocaleString()}`;
            pdf.text(formattedDate, textX, headerY + 60); // Position for date and time
    
            // Add a line separating the header from the content
            pdf.setLineWidth(0.5); // Set line width
            pdf.line(10, headerY + 70, 200, headerY + 70); // Draw the line from left to right
    
            // Add an extra line after the separator
            let yPosition = headerY + 80; // Move content down one line
    
            // Title for the report
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Scholarship Listings Report', 10, yPosition); // Adjusted position for report title
    
            // Iterate over each scholarship and add the details to the PDF
            yPosition += 10; // Add space after the title
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
        <div>
            <h1>Your Scholarships</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <input 
                type="text" 
                placeholder="Search Scholarships..." 
                value={searchTerm} 
                onChange={handleSearch} 
            />
            <button onClick={generatePDF}>Download Scholarships as PDF</button>

            <ul>
                {filteredScholarships.map((scholarship) => (
                    <li key={scholarship._id}>
                        <h2>{scholarship.scholarshipTitle}</h2>
                        <p><strong>Organization:</strong> {scholarship.organization}</p>
                        <p><strong>Application Deadline:</strong> {new Date(scholarship.applicationDeadline).toLocaleDateString()}</p>
                        <p><strong>Eligibility Criteria:</strong> {scholarship.eligibilityCriteria}</p>
                        <p><strong>Application Link:</strong> <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer">{scholarship.applicationLink}</a></p>
                        <p><strong>Description:</strong> {scholarship.description}</p>
                        <p><strong>Type:</strong> {scholarship.scholarshipType}</p>
                        <p><strong>Field of Study:</strong> {scholarship.fieldOfStudy}</p>
                        <p><strong>Country:</strong> {scholarship.country}</p>
                        <p><strong>Application Requirements:</strong> {scholarship.applicationRequirements}</p>

                        {/* Display scholarship image if available */}
                        {scholarship.image && (
                            <div>
                                <img src={scholarship.image} alt="Scholarship" style={{ width: '200px', height: 'auto' }} />
                            </div>
                        )}

                        <button onClick={() => handleDelete(scholarship._id)}>Delete</button>
                        <button onClick={() => window.location.href = `/update-scholarship/${scholarship._id}`}>Update</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UpdateScholarships;
