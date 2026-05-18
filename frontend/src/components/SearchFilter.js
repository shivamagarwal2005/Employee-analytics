import React, { useState } from 'react';

const DEPARTMENTS = ['', 'Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'QA'];

const SearchFilter = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    minScore: '',
    maxScore: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // Strip empty keys
    const active = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '')
    );
    onSearch(active);
  };

  const handleReset = () => {
    setFilters({ name: '', department: '', minScore: '', maxScore: '' });
    onReset();
  };

  return (
    <div className="search-filter">
      <h3>🔍 Search & Filter</h3>
      <div className="filter-row">
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleChange}
          placeholder="Search by name..."
        />
        <select name="department" value={filters.department} onChange={handleChange}>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d || 'All Departments'}</option>
          ))}
        </select>
        <input
          type="number"
          name="minScore"
          value={filters.minScore}
          onChange={handleChange}
          placeholder="Min Score"
          min="0"
          max="100"
        />
        <input
          type="number"
          name="maxScore"
          value={filters.maxScore}
          onChange={handleChange}
          placeholder="Max Score"
          min="0"
          max="100"
        />
        <button className="btn-primary" onClick={handleSearch}>Search</button>
        <button className="btn-secondary" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default SearchFilter;
