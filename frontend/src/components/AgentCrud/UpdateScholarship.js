import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateScholarship() {
    const { id } = useParams(); // Get the scholarship ID from the URL
    const [scholarship, setScholarship] = useState(null); // State to hold scholarship data
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScholarship = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:5000/api/scholarships/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch scholarship details');
                const data = await response.json();
                setScholarship(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarship();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/scholarships/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scholarship),
            });

            if (response.ok) {
                alert('Scholarship updated successfully');
                navigate('/update-scholarships'); // Redirect to the list of scholarships after update
            } else {
                alert('Failed to update scholarship');
            }
        } catch (error) {
            console.error('Error updating scholarship:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h1>Update Scholarship</h1>
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    placeholder="Scholarship Title"
                    value={scholarship.scholarshipTitle || ''}
                    onChange={(e) => setScholarship({ ...scholarship, scholarshipTitle: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Organization"
                    value={scholarship.organization || ''}
                    onChange={(e) => setScholarship({ ...scholarship, organization: e.target.value })}
                    required
                />
                <input
                    type="date"
                    placeholder="Application Deadline"
                    value={scholarship.applicationDeadline || ''}
                    onChange={(e) => setScholarship({ ...scholarship, applicationDeadline: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Eligibility Criteria"
                    value={scholarship.eligibilityCriteria || ''}
                    onChange={(e) => setScholarship({ ...scholarship, eligibilityCriteria: e.target.value })}
                    required
                />
                <input
                    type="url"
                    placeholder="Application Link"
                    value={scholarship.applicationLink || ''}
                    onChange={(e) => setScholarship({ ...scholarship, applicationLink: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={scholarship.description || ''}
                    onChange={(e) => setScholarship({ ...scholarship, description: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Scholarship Type"
                    value={scholarship.scholarshipType || ''}
                    onChange={(e) => setScholarship({ ...scholarship, scholarshipType: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Field of Study"
                    value={scholarship.fieldOfStudy || ''}
                    onChange={(e) => setScholarship({ ...scholarship, fieldOfStudy: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Country"
                    value={scholarship.country || ''}
                    onChange={(e) => setScholarship({ ...scholarship, country: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Application Requirements"
                    value={scholarship.applicationRequirements || ''}
                    onChange={(e) => setScholarship({ ...scholarship, applicationRequirements: e.target.value })}
                    required
                />
                <button type="submit">Update Scholarship</button>
            </form>
        </div>
    );
}

export default UpdateScholarship;
