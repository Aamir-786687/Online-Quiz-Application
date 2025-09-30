import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const quizAPI = {
  // Fetch all quiz questions
  getQuestions: async () => {
    try {
      const response = await api.get('/quiz');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch questions');
    }
  },

  // Submit quiz answers
  submitAnswers: async (answers) => {
    try {
      const response = await api.post('/quiz/submit', { answers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to submit answers');
    }
  },

  // Health check
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('API is not available');
    }
  }
};

export default api;
