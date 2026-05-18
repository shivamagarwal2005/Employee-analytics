import API from './api';

export const aiService = {
  getRecommendation: (data) => API.post('/ai/recommend', data),
};
