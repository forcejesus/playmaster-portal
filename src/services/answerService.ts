import axios from 'axios';
import { Answer, AnswerResponse } from '@/types/answer';

const HOST = 'https://kahoot.nos-apps.com';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const answerService = {
  createAnswer: async (data: { reponse_texte: string; question: string; etat: boolean }): Promise<AnswerResponse> => {
    try {
      const response = await axios.post(`${HOST}/api/reponse`, data, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Réponse du serveur:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création de la réponse:', error);
      if (error.response?.data) {
        console.error('Détails de l\'erreur:', error.response.data);
      }
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de la réponse');
    }
  },
};