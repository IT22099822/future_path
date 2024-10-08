import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import LogoWithSocial from '../components/LogoWithSocial';
import NavBar from '../components/NavBar';

const UploadDocumentsPage = () => {
  const { appointmentId } = useParams(); // Fetch the appointmentId from the route
  const [documents, setDocuments] = useState([{ description: '', file: null }]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Handle file change for a specific document input
  const handleFileChange = (index, e) => {
    const newDocuments = [...documents];
    newDocuments[index].file = e.target.files[0];
    setDocuments(newDocuments);
  };

  // Handle description change for a specific document input
  const handleDescriptionChange = (index, e) => {
    const newDocuments = [...documents];
    newDocuments[index].description = e.target.value;
    setDocuments(newDocuments);
  };

  // Add a new set of inputs for an additional file and description
  const handleAddMore = () => {
    setDocuments([...documents, { description: '', file: null }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if each document has both file and description
    if (documents.some(doc => !doc.file || !doc.description)) {
      setError('All files and descriptions are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authorized. No token found.');
      }

      // Loop through each document and upload it
      for (const document of documents) {
        const formData = new FormData();
        formData.append('file', document.file);
        formData.append('description', document.description);

        await axios.post(
          `http://localhost:5000/api/documents/${appointmentId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      setSuccess('Documents uploaded successfully');
      setError('');
      setDocuments([{ description: '', file: null }]); // Reset form after successful upload
    } catch (err) {
      console.error('Error uploading document:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'An error occurred while uploading the document');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] font-sans">
      <LogoWithSocial />
      <NavBar />

      <div className="flex justify-center items-center w-full mt-10">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
          <h2 className="text-3xl font-semibold mb-6 text-center">Upload Documents for Appointment</h2>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          
          <form onSubmit={handleSubmit}>
            {documents.map((doc, index) => (
              <div key={index} className="mb-4">
                <div className="mb-2">
                  <label htmlFor={`description-${index}`} className="font-medium">Document Description:</label>
                  <input
                    type="text"
                    id={`description-${index}`}
                    value={doc.description}
                    onChange={(e) => handleDescriptionChange(index, e)}
                    required
                    className="border rounded-lg p-2 w-full"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor={`file-${index}`} className="font-medium">Upload File:</label>
                  <input
                    type="file"
                    id={`file-${index}`}
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileChange(index, e)}
                    required
                    className="border rounded-lg p-2 w-full"
                  />
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <button type="button" onClick={handleAddMore} className="bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 transition-all duration-300 mb-8 mr-4">
              Add More
            </button>

            <button type="submit" className="bg-slate-500 text-white p-2 rounded-lg hover:bg-slate-700 transition-all duration-300 mb-4">
              Upload
            </button>
          </form>

          <button onClick={() => navigate(-1)} className="text-teal-500 underline hover:text-teal-600">
            Back to Approved Appointments
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentsPage;
