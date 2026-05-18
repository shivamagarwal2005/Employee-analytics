const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// Validation rules
const employeeValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('performanceScore')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Performance score must be between 0 and 100'),
  body('experience')
    .isFloat({ min: 0 })
    .withMessage('Experience must be a non-negative number'),
];

const updateValidation = [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('performanceScore')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Performance score must be between 0 and 100'),
  body('experience')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Experience must be a non-negative number'),
];

// Routes
router.get('/search', protect, searchEmployees);
router.get('/', protect, getAllEmployees);
router.get('/:id', protect, getEmployeeById);
router.post('/', protect, employeeValidation, addEmployee);
router.put('/:id', protect, updateValidation, updateEmployee);
router.delete('/:id', protect, deleteEmployee);

module.exports = router;
