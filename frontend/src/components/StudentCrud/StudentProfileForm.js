import React, { useState, useEffect } from 'react';

const StudentProfileForm = () => {
  const [student, setStudent] = useState({
    name: '',
    bio: '',
    contactEmail: '',
    phone: '',
    major: '',
    profilePhoto: '',
    birthDate: '',
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Fetch student profile
  useEffect(() => {
    const fetchStudentProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated. Please login.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/students/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setStudent({
              name: data.name || '',
              bio: data.bio || '',
              contactEmail: data.contactEmail || '',
              phone: data.phone || '',
              major: data.major || '',
              profilePhoto: data.profileImage || '',
              birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
            });
            setError('');
          }
        } else if (response.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else if (response.status === 404) {
          setError('No profile found, please create one.');
        } else {
          setError('Failed to fetch profile');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  // Handle form submission to create or update the profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User not authenticated. Please login.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', student.name);
    formData.append('bio', student.bio);
    formData.append('contactEmail', student.contactEmail);
    formData.append('phone', student.phone);
    formData.append('major', student.major);
    formData.append('birthDate', student.birthDate);

    if (profileImageFile) {
      formData.append('profileImage', profileImageFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSuccess('Profile saved successfully!');
        setError('');
      } else {
        setError('Failed to save profile');
      }
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile deletion
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated. Please login.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setStudent({
          name: '',
          bio: '',
          contactEmail: '',
          phone: '',
          major: '',
          profilePhoto: '',
          birthDate: '',
        });
        setSuccess('Profile deleted successfully');
        setError('');
      } else {
        setError('Failed to delete profile');
      }
    } catch (err) {
      setError('Failed to delete profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImageFile(file);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Update Student Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={student.name}
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label>Bio</label>
          <textarea
            value={student.bio}
            onChange={(e) => setStudent({ ...student, bio: e.target.value })}
            disabled={loading}
          ></textarea>
        </div>
        <div>
          <label>Contact Email</label>
          <input
            type="email"
            value={student.contactEmail}
            onChange={(e) => setStudent({ ...student, contactEmail: e.target.value })}
            disabled={loading}
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            value={student.phone}
            onChange={(e) => setStudent({ ...student, phone: e.target.value })}
            disabled={loading}
          />
        </div>
        <div>
          <label>Highest Educational Qualification</label>
          <input
            type="text"
            value={student.major}
            onChange={(e) => setStudent({ ...student, major: e.target.value })}
            disabled={loading}
          />
        </div>
        <div>
          <label>Birth Date</label>
          <input
            type="date"
            value={student.birthDate}
            onChange={(e) => setStudent({ ...student, birthDate: e.target.value })}
            disabled={loading}
          />
        </div>
        <div>
          <label>Profile Photo</label>
          <input type="file" accept="image/*" onChange={handleProfileImageChange} />
          {student.profilePhoto && (
            <div>
              <p>Current Profile Photo:</p>
              <img src={`http://localhost:5000/${student.profilePhoto}`} alt="Profile" width="100" />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>Save</button>
        <button type="button" onClick={handleDelete} disabled={loading}>Delete Profile</button>
      </form>
    </div>
  );
};

export default StudentProfileForm;
