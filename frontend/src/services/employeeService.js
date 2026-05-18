import API from './api';

export const employeeService = {
  addEmployee: (data) => API.post('/employees', data),
  getAllEmployees: () => API.get('/employees'),
  getEmployeeById: (id) => API.get(`/employees/${id}`),
  searchEmployees: (params) => API.get('/employees/search', { params }),
  updateEmployee: (id, data) => API.put(`/employees/${id}`, data),
  deleteEmployee: (id) => API.delete(`/employees/${id}`),
};
