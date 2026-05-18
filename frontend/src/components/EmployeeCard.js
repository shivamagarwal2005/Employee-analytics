import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { employeeService } from '../services/employeeService';

const getScoreColor = (score) => {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Needs Improvement';
};

const EmployeeCard = ({ employee, onDelete, onAIRecommend }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${employee.name}?`)) return;
    try {
      await employeeService.deleteEmployee(employee._id);
      toast.success(`${employee.name} removed successfully`);
      if (onDelete) onDelete(employee._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const scoreColor = getScoreColor(employee.performanceScore);

  return (
    <div className="employee-card">
      <div className="card-header">
        <div className="avatar">{employee.name.charAt(0).toUpperCase()}</div>
        <div className="card-title">
          <h3>{employee.name}</h3>
          <span className="department-badge">{employee.department}</span>
        </div>
        <div className="score-circle" style={{ borderColor: scoreColor, color: scoreColor }}>
          <span className="score-value">{employee.performanceScore}</span>
          <span className="score-max">/100</span>
        </div>
      </div>

      <div className="card-body">
        <p className="email">📧 {employee.email}</p>
        <p className="experience">💼 {employee.experience} year{employee.experience !== 1 ? 's' : ''} experience</p>
        <div className="score-label" style={{ color: scoreColor }}>
          ⭐ {getScoreLabel(employee.performanceScore)}
        </div>
        <div className="skills-list">
          {employee.skills.length > 0 ? (
            employee.skills.map((skill, i) => (
              <span key={i} className="skill-tag">{skill}</span>
            ))
          ) : (
            <span className="no-skills">No skills listed</span>
          )}
        </div>
      </div>

      <div className="card-actions">
        <button
          className="btn-sm btn-primary"
          onClick={() => navigate(`/employees/${employee._id}/edit`)}
        >
          ✏️ Edit
        </button>
        <button
          className="btn-sm btn-ai"
          onClick={() => onAIRecommend && onAIRecommend(employee._id)}
        >
          🤖 AI Insight
        </button>
        <button className="btn-sm btn-danger" onClick={handleDelete}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
