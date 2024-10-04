// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/universityRoutes'));
app.use('/api', require('./routes/scholarshipRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/agents', require('./routes/agentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes')); 
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
