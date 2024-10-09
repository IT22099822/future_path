import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LogoWithSocial from './components/LogoWithSocial'; // Import LogoWithSocial
import Footer from './components/Footer'; // Import Footer

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform registration logic here
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Registration successful! You can now log in.');
      navigate('/login'); // Redirect to login page after successful registration
    } else {
      alert(data.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9fc3c9] to-[#2a525a] flex flex-col justify-between">
      <LogoWithSocial /> {/* Add Logo with Social Media Links */}

      <div className="flex justify-center items-center flex-grow mt-10"> {/* Add margin-top */}
        <div className="bg-white bg-opacity-50 shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-semibold text-center mb-6">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition duration-300"
            >
              Register
            </button>
          </form>
          <div className="text-center mt-4">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-teal-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="py-20"> {/* Add padding for separation */}
        <Footer /> {/* Add Footer */}
      </div>
    </div>
  );
}

export default RegisterPage;
