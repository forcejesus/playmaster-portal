import axios from 'axios';
import { GameResponse, QuestionTypeResponse, PointTypeResponse } from '@/types/quiz';

const HOST = 'http://kahoot.nos-apps.com';

export const quizService = {
  createGame: async (formData: FormData): Promise<GameResponse> => {
    const response = await axios.post(`${HOST}/api/jeux`, formData);
    return response.data;
  },

  getQuestionTypes: async (): Promise<QuestionTypeResponse> => {
    const response = await axios.get(`${HOST}/api/type-question`);
    return response.data;
  },

  getPointTypes: async (): Promise<PointTypeResponse> => {
    const response = await axios.get(`${HOST}/api/points`);
    return response.data;
  },

  createQuestion: async (questionData: FormData) => {
    const response = await axios.post(`${HOST}/api/questions`, questionData);
    return response.data;
  }
};