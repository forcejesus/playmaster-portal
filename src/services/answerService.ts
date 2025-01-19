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
      const formDataObject = Object.fromEntries(answerData);
      console.log('Creating answer with data:', formDataObject);
      
      const response = await axios.post(`${HOST}/api/reponse`, answerData, {
        headers: {
          ...getAuthHeader(),
        },
      });
      
      console.log('Answer creation response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating answer:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },
};