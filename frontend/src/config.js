const API_BASE_URL = 'http://localhost:3000/api';

export default {
  API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: `${API_BASE_URL}/auth/login`,
      REGISTER: `${API_BASE_URL}/auth/register`,
    },
    DEPARTMENTS: `${API_BASE_URL}/departments`,
    EMPLOYEES: `${API_BASE_URL}/employees`,
  },
};
