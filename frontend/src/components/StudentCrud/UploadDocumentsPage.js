import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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
    <div>
      <h2>Upload Documents for Appointment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      <form onSubmit={handleSubmit}>
        {documents.map((doc, index) => (
          <div key={index}>
            <div>
              <label htmlFor={`description-${index}`}>Document Description:</label>
              <input
                type="text"
                id={`description-${index}`}
                value={doc.description}
                onChange={(e) => handleDescriptionChange(index, e)}
                required
              />
            </div>

            <div>
              <label htmlFor={`file-${index}`}>Upload File:</label>
              <input
                type="file"
                id={`file-${index}`}
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => handleFileChange(index, e)}
                required
              />
            </div>
          </div>
        ))}

        {/* Add More Button */}
        <button type="button" onClick={handleAddMore}>Add More</button>

        <button type="submit">Upload</button>
      </form>

      <button onClick={() => navigate(-1)}>Back to Approved Appointments</button>
    </div>
  );
};

export default UploadDocumentsPage;
