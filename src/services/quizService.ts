import axios from 'axios';
import { GameResponse, QuestionTypeResponse, PointTypeResponse } from '@/types/quiz';

const HOST = 'https://kahoot.nos-apps.com';

export const quizService = {
  createGame: async (formData: FormData): Promise<GameResponse> => {
    try {
      console.log('Creating game with data:', Object.fromEntries(formData));
      const response = await axios.post(`${HOST}/api/jeux`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
      const response = await axios.get(`${HOST}/api/type-question`);
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
      const response = await axios.get(`${HOST}/api/points`);
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