import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { employeeService } from '../services/employeeService';

const initialState = {
  name: '',
  email: '',
  department: '',
  skills: '',
  performanceScore: '',
  experience: '',
};

const DEPARTMENTS = ['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'QA'];

const EmployeeForm = ({ existingEmployee, onSuccess }) => {
  const navigate = useNavigate();
  const isEdit = Boolean(existingEmployee);

  const [formData, setFormData] = useState(
    isEdit
      ? {
          ...existingEmployee,
          skills: existingEmployee.skills.join(', '),
        }
      : initialState
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.department) errs.department = 'Department is required';
    if (formData.performanceScore === '') errs.performanceScore = 'Performance score is required';
    else if (formData.performanceScore < 0 || formData.performanceScore > 100)
      errs.performanceScore = 'Score must be between 0 and 100';
    if (formData.experience === '') errs.experience = 'Experience is required';
    else if (formData.experience < 0) errs.experience = 'Experience cannot be negative';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience),
      };

      if (isEdit) {
        await employeeService.updateEmployee(existingEmployee._id, payload);
        toast.success('Employee updated successfully!');
        if (onSuccess) onSuccess();
      } else {
        await employeeService.addEmployee(payload);
        toast.success('Employee added successfully!');
        setFormData(initialState);
        navigate('/employees');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Aman Verma"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. aman@gmail.com"
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Department *</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={errors.department ? 'input-error' : ''}
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.department && <span className="error-msg">{errors.department}</span>}
        </div>

        <div className="form-group">
          <label>Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB"
          />
          <small>Enter skills separated by commas</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Performance Score (0-100) *</label>
            <input
              type="number"
              name="performanceScore"
              value={formData.performanceScore}
              onChange={handleChange}
              placeholder="0-100"
              min="0"
              max="100"
              className={errors.performanceScore ? 'input-error' : ''}
            />
            {errors.performanceScore && <span className="error-msg">{errors.performanceScore}</span>}
          </div>

          <div className="form-group">
            <label>Years of Experience *</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 3"
              min="0"
              className={errors.experience ? 'input-error' : ''}
            />
            {errors.experience && <span className="error-msg">{errors.experience}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Employee' : 'Add Employee'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/employees')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
