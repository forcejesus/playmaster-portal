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
      // Vérification du contenu du FormData avant envoi
      const formDataContent: { [key: string]: any } = {};
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`Fichier détecté pour ${key}:`, value.name, value.type, value.size);
        }
        formDataContent[key] = value instanceof File ? value.name : value;
      });
      console.log('Contenu du FormData avant envoi:', formDataContent);

      // Vérification des champs requis
      const requiredFields = ['reponse_texte', 'question', 'etat'];
      for (const field of requiredFields) {
        if (!formData.get(field)) {
          throw new Error(`Le champ ${field} est requis`);
        }
      }

      const response = await axios.post(`${HOST}/api/reponse`, formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data',
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