import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import LogoWithSocial from '../components/LogoWithSocial';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png'; // Adjust path to your logo image

function UpdateJobs() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/jobs?search=${searchTerm}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setJobs(data))
      .catch(error => setError('Failed to fetch jobs'));
  }, [searchTerm]);

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
        setJobs(jobs.filter(job => job._id !== id));
        alert('Job deleted successfully');
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to delete job');
      }
    } catch (error) {
      alert('Error deleting job');
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
      pdf.text('Job Listings Report', 10, 40);
      let yPosition = 50;
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
        pdf.setLineWidth(0.5);
        pdf.line(10, yPosition, 200, yPosition);
        yPosition += 10;
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
      });
      pdf.save('jobs_report.pdf');
    };
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] p-4">
      <LogoWithSocial />
      <NavBar />

      <div className="container mx-auto mt-10 p-6 bg-opacity-70 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-white">Update Jobs</h1>

          {/* Search Bar Positioned to the Right */}
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full max-w-xs" // Adjust width as needed
          />
        </div>

        <button
          onClick={generatePDF}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 transition duration-300"
        >
          Download Jobs as PDF
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div
              key={job._id}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer transition-all duration-300 transform hover:scale-105"
              onClick={() => handleJobClick(job)}
            >
              {job.image && (
                <img
                  src={job.image}
                  alt={job.jobTitle}
                  className="h-24 w-full object-cover rounded-t-lg mb-2 shadow-lg"
                />
              )}
              <h2 className="text-lg font-semibold mb-1">{job.companyName}</h2>
              <p className="text-gray-600 mb-1">{job.location}</p>
              {job.applicationDeadline && (
                <p className="text-gray-600">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
              )}
              <button
                onClick={() => handleDelete(job._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-full mt-2 transition duration-300 hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => navigate(`/update-job/${job._id}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded-full mt-2 ml-4 transition duration-300 hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          ))}
        </div>

        {selectedJob && (
          <div className="fixed inset-0 flex items-center justify-center">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateJobs;
