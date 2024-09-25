const express = require('express');
const multer = require('multer');
const path = require('path');
const Employee = require('../models/Employee'); // Adjust the path as necessary

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid filename clashes
  },
});

const upload = multer({ storage });

// Create new employee
router.post('/employees', upload.single('image'), async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      image: req.file.path, // Save the path of the uploaded image
    };

    const newEmployee = new Employee(employeeData);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

module.exports = router;
