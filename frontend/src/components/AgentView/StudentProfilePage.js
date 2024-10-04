// src/StudentProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png'; // Adjust the path according to your folder structure

const StudentProfilePage = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const [student, setStudent] = useState(null); // State to hold student data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/students/${id}`);
        if (!response.ok) throw new Error('Failed to fetch student profile');
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError('Failed to fetch student profile');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [id]);

  const downloadPDF = () => {
    const pdf = new jsPDF();

    // Add logo to the PDF
    const logoImg = new Image();
    logoImg.src = logo;
    logoImg.onload = () => {
      pdf.addImage(logoImg, 'PNG', 10, 10, 50, 20); // Adjust size and position of logo

      // Add student profile information
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Student Profile Report', 10, 40);

      pdf.setFontSize(16);
      pdf.text(`Name: ${student.name}`, 10, 50);
      pdf.text(`Bio: ${student.bio || 'N/A'}`, 10, 60);
      pdf.text(`Contact Email: ${student.contactEmail}`, 10, 70);
      pdf.text(`Phone: ${student.phone || 'N/A'}`, 10, 80);
      pdf.text(`Major: ${student.major || 'N/A'}`, 10, 90);
      pdf.text(`Birth Date: ${new Date(student.birthDate).toLocaleDateString()}`, 10, 100);

      // If profile photo exists, add link to the image file
      if (student.profileImage) {
        const imageLink = `http://localhost:5000/${student.profileImage.replace(/\\/g, '/')}`;
        pdf.textWithLink(`Profile Photo: ${imageLink}`, 10, 110, { url: imageLink });
      } else {
        pdf.text('Profile Photo: N/A', 10, 110);
      }

      // Save the PDF
      pdf.save(`student_profile_${student.name}.pdf`);
    };
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Student Profile</h1>
      <button onClick={downloadPDF}>Download Profile as PDF</button>
      {student ? (
        <div>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Bio:</strong> {student.bio}</p>
          <p><strong>Contact Email:</strong> {student.contactEmail}</p>
          <p><strong>Phone:</strong> {student.phone}</p>
          <p><strong>Major:</strong> {student.major}</p>
          <p><strong>Birth Date:</strong> {new Date(student.birthDate).toLocaleDateString()}</p>

          {/* Display the profile photo if available */}
          {student.profileImage ? (
            <div>
              <img
                src={`http://localhost:5000/${student.profileImage}`}
                alt="Profile"
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <p>No profile photo available</p>
          )}
        </div>
      ) : (
        <p>No profile found</p>
      )}
    </div>
  );
};

export default StudentProfilePage;
