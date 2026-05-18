import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ title, value, icon, color }) => (
  <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeService.getAllEmployees();
        setEmployees(res.data.data);
      } catch {
        // silently fail on dashboard
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const totalEmployees = employees.length;
  const avgScore =
    totalEmployees > 0
      ? (employees.reduce((acc, e) => acc + e.performanceScore, 0) / totalEmployees).toFixed(1)
      : 0;
  const topPerformers = employees.filter((e) => e.performanceScore >= 80).length;
  const needsImprovement = employees.filter((e) => e.performanceScore < 60).length;

  const departments = [...new Set(employees.map((e) => e.department))];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Welcome back, {user?.name} 👋</h1>
        <p>Here's an overview of your organization's performance</p>
      </div>

      {loading ? (
        <div className="loading">Loading analytics...</div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard title="Total Employees" value={totalEmployees} icon="👥" color="#6366f1" />
            <StatCard title="Avg Performance Score" value={`${avgScore}/100`} icon="📈" color="#22c55e" />
            <StatCard title="Top Performers (≥80)" value={topPerformers} icon="🏆" color="#f59e0b" />
            <StatCard title="Needs Improvement (<60)" value={needsImprovement} icon="⚠️" color="#ef4444" />
          </div>

          <div className="dashboard-panels">
            <div className="panel">
              <h2>Top Performers</h2>
              {employees
                .sort((a, b) => b.performanceScore - a.performanceScore)
                .slice(0, 5)
                .map((emp) => (
                  <div key={emp._id} className="ranking-item">
                    <div className="avatar-sm">{emp.name.charAt(0)}</div>
                    <div className="rank-info">
                      <strong>{emp.name}</strong>
                      <span>{emp.department}</span>
                    </div>
                    <div
                      className="score-pill"
                      style={{ backgroundColor: emp.performanceScore >= 80 ? '#22c55e' : emp.performanceScore >= 60 ? '#f59e0b' : '#ef4444' }}
                    >
                      {emp.performanceScore}
                    </div>
                  </div>
                ))}
              {totalEmployees === 0 && <p className="empty-msg">No employees yet.</p>}
            </div>

            <div className="panel">
              <h2>Departments ({departments.length})</h2>
              {departments.map((dept) => {
                const deptEmployees = employees.filter((e) => e.department === dept);
                const deptAvg = (
                  deptEmployees.reduce((a, e) => a + e.performanceScore, 0) /
                  deptEmployees.length
                ).toFixed(1);
                return (
                  <div key={dept} className="dept-item">
                    <span className="dept-name">{dept}</span>
                    <span className="dept-count">{deptEmployees.length} employees</span>
                    <span className="dept-avg">Avg: {deptAvg}</span>
                  </div>
                );
              })}
              {departments.length === 0 && <p className="empty-msg">No departments found.</p>}
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="btn-primary" onClick={() => navigate('/add-employee')}>
                ➕ Add Employee
              </button>
              <button className="btn-ai" onClick={() => navigate('/ai-recommendations')}>
                🤖 Get AI Insights
              </button>
              <button className="btn-secondary" onClick={() => navigate('/employees')}>
                👥 View All Employees
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
