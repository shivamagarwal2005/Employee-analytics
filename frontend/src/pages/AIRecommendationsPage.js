import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AIRecommendationDisplay from '../components/AIRecommendationDisplay';
import { employeeService } from '../services/employeeService';
import { aiService } from '../services/aiService';

const AIRecommendationsPage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeService.getAllEmployees();
        setEmployees(res.data.data);
      } catch {
        toast.error('Failed to load employees');
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const getRecommendation = async (payload) => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await aiService.getRecommendation(payload);
      setAiResult(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI recommendation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleIndividual = () => {
    if (!selectedId) {
      toast.warning('Please select an employee');
      return;
    }
    getRecommendation({ employeeId: selectedId });
  };

  const handleRankAll = () => getRecommendation({});

  return (
    <div className="page">
      <div className="page-header">
        <h1>🤖 AI Insights & Recommendations</h1>
        <p>Leverage AI to get promotion recommendations, training plans, and rankings.</p>
      </div>

      <div className="ai-controls">
        <div className="ai-card">
          <h3>👤 Individual Analysis</h3>
          <p>Get a detailed AI analysis for a specific employee.</p>
          <div className="ai-control-row">
            {loadingEmployees ? (
              <span>Loading employees...</span>
            ) : (
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                <option value="">— Select Employee —</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.department}) — Score: {emp.performanceScore}
                  </option>
                ))}
              </select>
            )}
            <button
              className="btn-ai"
              onClick={handleIndividual}
              disabled={aiLoading || !selectedId}
            >
              Analyze
            </button>
          </div>
        </div>

        <div className="ai-card">
          <h3>🏆 Team Ranking</h3>
          <p>Rank all employees, identify promotion candidates, and get training recommendations.</p>
          <button
            className="btn-ai"
            onClick={handleRankAll}
            disabled={aiLoading || employees.length === 0}
          >
            {aiLoading ? 'Analyzing...' : 'Rank All Employees'}
          </button>
        </div>
      </div>

      {employees.length === 0 && !loadingEmployees && (
        <div className="empty-state">
          <p>No employees found. Add employees first to get AI insights.</p>
        </div>
      )}

      <AIRecommendationDisplay result={aiResult} loading={aiLoading} />
    </div>
  );
};

export default AIRecommendationsPage;
