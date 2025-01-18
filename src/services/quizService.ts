import axios from 'axios';
import { GameResponse, QuestionTypeResponse, PointTypeResponse } from '@/types/quiz';

const HOST = 'https://kahoot.nos-apps.com';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const quizService = {
  createGame: async (formData: FormData): Promise<GameResponse> => {
    try {
      console.log('Creating game with data:', Object.fromEntries(formData));
      const response = await axios.post(`${HOST}/api/jeux`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader(),
        },
      });
      console.log('Game creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  },

  getQuestionTypes: async (): Promise<QuestionTypeResponse> => {
    try {
      console.log('Fetching question types');
      const response = await axios.get(`${HOST}/api/type-question`, {
        headers: getAuthHeader(),
      });
      console.log('Question types response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching question types:', error);
      throw error;
    }
  },

  getPointTypes: async (): Promise<PointTypeResponse> => {
    try {
      console.log('Fetching point types');
      const response = await axios.get(`${HOST}/api/points`, {
        headers: getAuthHeader(),
      });
      console.log('Point types response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching point types:', error);
      throw error;
    }
  },

  createQuestion: async (questionData: FormData): Promise<any> => {
    try {
      console.log('Creating question with data:', Object.fromEntries(questionData));
      const response = await axios.post(`${HOST}/api/questions`, questionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader(),
        },
      });
      console.log('Question creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }
};