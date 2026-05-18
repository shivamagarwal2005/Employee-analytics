import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EmployeeForm from '../components/EmployeeForm';
import { employeeService } from '../services/employeeService';

const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await employeeService.getEmployeeById(id);
        setEmployee(res.data.data);
      } catch {
        toast.error('Employee not found');
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      {employee && (
        <EmployeeForm
          existingEmployee={employee}
          onSuccess={() => navigate('/employees')}
        />
      )}
    </div>
  );
};

export default EditEmployeePage;
