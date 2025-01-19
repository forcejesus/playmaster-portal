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
      // Log pour vérifier le contenu du FormData avant l'envoi
      const formDataContent: any = {};
      formData.forEach((value, key) => {
        formDataContent[key] = value instanceof File ? value.name : value;
      });
      console.log('Contenu du FormData avant envoi:', formDataContent);

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