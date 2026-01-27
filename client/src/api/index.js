import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// User Authentication
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Portfolio Tracking
export const fetchPortfolio = async (userId) => {
  try {
    const response = await apiClient.get(`/portfolio/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updatePortfolio = async (userId, portfolioData) => {
  try {
    const response = await apiClient.put(`/portfolio/${userId}`, portfolioData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Recommendations
export const getRecommendations = async (userId) => {
  try {
    const response = await apiClient.get(`/recommendations/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Error Handling
const handleError = (error) => {
  if (error.response) {
    console.error('Error Response:', error.response.data);
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    console.error('Error Request:', error.request);
    throw new Error('No response received from server');
  } else {
    console.error('Error Message:', error.message);
    throw new Error('An unexpected error occurred');
  }
};