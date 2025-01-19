import axios from 'axios';
import { Answer, AnswerResponse } from '@/types/answer';

const HOST = 'https://kahoot.nos-apps.com';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const answerService = {
  createAnswer: async (answerData: FormData): Promise<AnswerResponse> => {
    try {
      console.log('Creating answer with data:', Object.fromEntries(answerData));
      const response = await axios.post(`${HOST}/api/reponse`, answerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader(),
        },
      });
      console.log('Answer creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating answer:', error);
      throw error;
    }
  },
};