const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const path = require('path');
const dotenv = require('dotenv');

// Initialize app
const app = express();
dotenv.config(); // Load environment variables from .env file

// Middleware
app.use(express.json()); // Parse incoming requests with JSON payloads

// CORS setup
app.use(cors({
    origin: ['https://papaya-praline-c53106.netlify.app', 'http://localhost:5000'] // Add your frontend URLs here
}));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);         // Authentication routes
app.use('/api/employees', employeeRoutes); // Employee routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
