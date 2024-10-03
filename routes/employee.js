const express = require('express');
const multer = require('multer');
const Employee = require('../models/Employee');
const router = express.Router();

// Handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.use('/uploads', express.static('uploads'));

// POST /api/employees - Create new employee
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, courses } = req.body;

    // Ensure required fields
    if (!name || !email || !mobile || !designation || !gender || !courses) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create new employee
    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      courses,
      image: req.file ? req.file.path : null,
      createdAt: new Date() // Set createdAt to the current date
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// GET /api/employees - Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// GET /api/employees/:id - Get employee by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id); // Assuming MongoDB with Mongoose
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { name, email, mobile, designation, gender, courses } = req.body;

    // Ensure required fields
    if (!name || !email || !mobile || !designation || !gender || !courses) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Prepare update object
    const updatedData = {
      name: name || employee.name,
      email: email || employee.email,
      mobile: mobile || employee.mobile,
      designation: designation || employee.designation,
      gender: gender || employee.gender,
      courses: courses || employee.courses,
      image: req.file ? req.file.path : employee.image, // Update image if a new one is uploaded
      createdAt: employee.createdAt // Keep the original createdAt
    };

    // Update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updatedData,
      { new: true, runValidators: true } // Return the updated document
    );

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = router;
