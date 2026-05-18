import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EmployeeCard from '../components/EmployeeCard';
import SearchFilter from '../components/SearchFilter';
import AIRecommendationDisplay from '../components/AIRecommendationDisplay';
import { employeeService } from '../services/employeeService';
import { aiService } from '../services/aiService';

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchEmployees = useCallback(async (params = null) => {
    setLoading(true);
    try {
      const res = params
        ? await employeeService.searchEmployees(params)
        : await employeeService.getAllEmployees();
      setEmployees(res.data.data);
    } catch {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((e) => e._id !== id));
  };

  const handleAIRecommend = async (employeeId) => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await aiService.getRecommendation({ employeeId });
      setAiResult(res.data);
      // Scroll to AI result
      setTimeout(() => document.getElementById('ai-result')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI recommendation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleRankAll = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await aiService.getRecommendation({});
      setAiResult(res.data);
      setTimeout(() => document.getElementById('ai-result')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI ranking failed');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>👥 Employees ({employees.length})</h1>
        <div className="header-actions">
          <button className="btn-ai" onClick={handleRankAll} disabled={aiLoading || employees.length === 0}>
            🤖 Rank All with AI
          </button>
          <button className="btn-primary" onClick={() => navigate('/add-employee')}>
            ➕ Add Employee
          </button>
        </div>
      </div>

      <SearchFilter
        onSearch={(params) => fetchEmployees(params)}
        onReset={() => fetchEmployees()}
      />

      {loading ? (
        <div className="loading">Loading employees...</div>
      ) : employees.length === 0 ? (
        <div className="empty-state">
          <p>No employees found.</p>
          <button className="btn-primary" onClick={() => navigate('/add-employee')}>
            Add First Employee
          </button>
        </div>
      ) : (
        <div className="employees-grid">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp._id}
              employee={emp}
              onDelete={handleDelete}
              onAIRecommend={handleAIRecommend}
            />
          ))}
        </div>
      )}

      {(aiLoading || aiResult) && (
        <div id="ai-result" className="ai-result-section">
          <AIRecommendationDisplay result={aiResult} loading={aiLoading} />
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;
