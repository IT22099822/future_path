import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png'; // Adjust path to your logo image

function UpdateJobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/jobs?search=${searchTerm}`, { // Include search term in the fetch request
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        return response.json();
      })
      .then((data) => {
        setJobs(data);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
        setError(error.message);
      });
  }, [searchTerm]); // Refetch jobs when search term changes

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setJobs(jobs.filter((job) => job._id !== id));
        alert('Job deleted successfully');
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Error deleting job');
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
        pdf.text('Job Listings Report', 10, yPosition); // Adjusted position for report title

        // Iterate over each job and add the details to the PDF
        yPosition += 10; // Add space after the title
        pdf.setFontSize(12);
        jobs.forEach((job, index) => {
            pdf.text(`Job #${index + 1}`, 10, yPosition);
            yPosition += 10;
            pdf.text(`Job Title: ${job.jobTitle}`, 10, yPosition);
            yPosition += 10;
            pdf.text(`Company: ${job.companyName}`, 10, yPosition);
            yPosition += 10;
            pdf.text(`Location: ${job.location}`, 10, yPosition);
            yPosition += 10;
            pdf.text(`Employment Type: ${job.employmentType}`, 10, yPosition);
            yPosition += 10;
            pdf.text(`Salary Range: ${job.salaryRange}`, 10, yPosition);
            yPosition += 10;
            pdf.text(`Job Description: ${job.jobDescription}`, 10, yPosition);
            yPosition += 10;
            pdf.text(`Requirements: ${job.requirements}`, 10, yPosition);
            yPosition += 10;
            pdf.text(`Application Deadline: ${new Date(job.applicationDeadline).toLocaleDateString()}`, 10, yPosition);
            yPosition += 10;
            pdf.text(`Website: ${job.websiteURL}`, 10, yPosition);
            yPosition += 20;

            // Draw a line between job entries
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
        pdf.save('jobs_report.pdf');
    };
};



  return (
    <div>
      <h1>Your Jobs</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Search Input */}
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search jobs..." 
      />

      <button onClick={generatePDF}>Download Jobs as PDF</button>

      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            <h2>{job.jobTitle}</h2>
            <p><strong>Company:</strong> {job.companyName}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Employment Type:</strong> {job.employmentType}</p>
            <p><strong>Salary Range:</strong> {job.salaryRange}</p>
            <p><strong>Job Description:</strong> {job.jobDescription}</p>
            <p><strong>Requirements:</strong> {job.requirements}</p>
            <p><strong>Application Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</p>
            <p><strong>Website:</strong> <a href={job.websiteURL} target="_blank" rel="noopener noreferrer">{job.websiteURL}</a></p>

            {/* Display job image if available */}
            {job.image && (
              <div>
                <img src={job.image} alt="Job" style={{ width: '200px', height: 'auto' }} />
              </div>
            )}

            <button onClick={() => handleDelete(job._id)}>Delete</button>
            <button onClick={() => window.location.href = `/update-job/${job._id}`}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UpdateJobs;
