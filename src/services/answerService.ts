import axios from 'axios';
import { Answer, AnswerResponse } from '@/types/answer';

const HOST = 'https://kahoot.nos-apps.com';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const answerService = {
  createAnswer: async (formData: FormData): Promise<AnswerResponse> => {
    try {
      console.log('FormData envoyée:', {
        reponse_texte: formData.get('reponse_texte'),
        etat: formData.get('etat'),
        question: formData.get('question'),
        file: formData.get('file')
      });

      const response = await axios.post(`${HOST}/api/reponse`, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création de la réponse:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      throw error;
    }
  },
};