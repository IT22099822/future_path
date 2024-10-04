import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewDocumentsPage = () => {
  const { appointmentId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authorized. No token found.');
        }

        const response = await axios.get(`http://localhost:5000/api/documents/${appointmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDocuments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching documents:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'An error occurred while fetching documents');
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [appointmentId]);

  const handleDelete = async (documentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the document from state
      setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc._id !== documentId));
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting the document');
    }
  };

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Uploaded Documents for Appointment</h2>
      {documents.length === 0 ? (
        <p>No documents found for this appointment.</p>
      ) : (
        <ul>
          {documents.map((document) => (
            <li key={document._id}>
              <p><strong>Description:</strong> {document.description}</p>
              <p>
                <strong>File:</strong> 
                <a href={`http://localhost:5000/${document.filePath}`} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              </p>
              <button onClick={() => handleDelete(document._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewDocumentsPage;
