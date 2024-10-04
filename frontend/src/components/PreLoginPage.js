import React from 'react';
import { Link } from 'react-router-dom';

function PreLoginPage() {
  return (
    <div>
      <h1>Welcome</h1>
      <Link to="/login">Login</Link>
      <br />
      <Link to="/register">Register</Link>
    </div>
  );
}

export default PreLoginPage;

