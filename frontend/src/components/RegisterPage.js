import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterStyles.module.css'; // Import the CSS module

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password, userType })
    });

    const data = await response.json();
    if (data.message === 'User registered successfully') {
      navigate('/login');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.backgroundBlur}></div>
      <div className={styles.wrapper}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputBox}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <label className={styles.selectLabel}>Register as a</label>
          <select value={userType} onChange={(e) => setUserType(e.target.value)} className={styles.select}>
            <option value="student">Student</option>
            <option value="agent">Agent</option>
          </select>
          <button type="submit" className={styles.btn}>Register</button>
        </form>
        <div className={styles.loginPrompt}>
          <p>Already registered? <a href="/login" className={styles.loginLink}>Log in</a></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
