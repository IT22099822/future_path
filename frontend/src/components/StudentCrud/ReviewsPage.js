import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import logo from '../../images/future_path_logo.png'; // Adjust this path to your logo

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]); // State for filtered reviews
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStudentReviews = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

        const response = await fetch('http://localhost:5000/api/reviews/my-reviews', {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token for authentication
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        setReviews(data);
        setFilteredReviews(data); // Initialize filtered reviews with all reviews
      } catch (error) {
        setError('Failed to fetch reviews');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentReviews();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = reviews.filter(review =>
        review.reviewText.toLowerCase().includes(lowerCaseQuery) || 
        review.rating.toString().includes(lowerCaseQuery) // Assuming rating can also be searched
      );
      setFilteredReviews(filtered);
    } else {
      setFilteredReviews(reviews); // Reset filtered reviews when query is empty
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review._id);
    setNewReviewText(review.reviewText);
    setNewRating(review.rating);
  };

  const handleEditSubmit = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: newRating,
          reviewText: newReviewText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      const updatedReview = await response.json();
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        )
      );
      setFilteredReviews((prevFiltered) =>
        prevFiltered.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        )
      );
      setEditingReview(null);
    } catch (error) {
      setError('Failed to update review');
      console.error(error);
    }
  };

  const handleDeleteClick = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
      setFilteredReviews((prevFiltered) => prevFiltered.filter((review) => review._id !== reviewId));
    } catch (error) {
      setError('Failed to delete review');
      console.error(error);
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
      pdf.setLineWidth(0.5);
      pdf.line(10, headerY + 70, 200, headerY + 70); // Draw the line from left to right
  
      // Move content down after the separator
      let yPosition = headerY + 80;
  
      // Title for the report
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Student Reviews Report', 10, yPosition);
  
      // Add space after the title and set font for content
      yPosition += 10;
      pdf.setFontSize(12);
  
      // Iterate over each review and add details to the PDF
      filteredReviews.forEach((review, index) => {
        pdf.text(`Review #${index + 1}`, 10, yPosition);
        yPosition += 10;
        pdf.text(`Review: ${review.reviewText}`, 10, yPosition);
        yPosition += 10;
        pdf.text(`Rating: ${review.rating}`, 10, yPosition);
        yPosition += 10;
        pdf.text(`Date: ${new Date(review.createdAt).toLocaleDateString()}`, 10, yPosition);
        yPosition += 15; // Extra space between reviews
  
        // Draw a line between reviews
        pdf.setLineWidth(0.5);
        pdf.line(10, yPosition, 200, yPosition);
        yPosition += 10;
  
        // Check if the yPosition exceeds the page height, add new page if necessary
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20; // Reset position for the new page
        }
      });
  
      // Save the generated PDF
      pdf.save('Student_Reviews_Report.pdf');
    };
  };
  

  return (
    <div>
      <h1>My Reviews</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)} // Update search on input change
        placeholder="Search reviews"
      />
      <button onClick={generatePDF}>Download PDF</button>

      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {filteredReviews.map((review) => (
            <li key={review._id}>
              <p>{review.reviewText}</p>
              <p>Rating: {review.rating}</p>
              <button onClick={() => handleEditClick(review)}>Edit</button>
              <button onClick={() => handleDeleteClick(review._id)}>Delete</button>
              {editingReview === review._id && (
                <div>
                  <input
                    type="number"
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    min="1"
                    max="5"
                  />
                  <input
                    type="text"
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                  />
                  <button onClick={() => handleEditSubmit(review._id)}>Submit</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsPage;
