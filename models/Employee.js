const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    courses: { type: [String], required: true },
    image: { type: String }, // Store image path
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt
);

module.exports = mongoose.model('Employee', EmployeeSchema);
