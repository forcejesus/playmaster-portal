import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { answerService } from '@/services/answerService';
import type { AnswerFormData } from '@/components/quiz/AnswerForm';

export const useAnswerCreation = (questionId: string, onAnswerCreated: () => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createAnswer = async (values: AnswerFormData, selectedFile: File | null) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      
      if (!values.reponse_texte) {
        throw new Error("Le texte de la réponse est requis");
      }
      formData.append('reponse_texte', values.reponse_texte);
      
      if (!questionId) {
        throw new Error("L'ID de la question est requis");
      }
      formData.append('question', questionId);
      
      formData.append('etat', values.etat ? '1' : '0');
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const formDataEntries: { [key: string]: any } = {};
      formData.forEach((value, key) => {
        formDataEntries[key] = value instanceof File ? value.name : value;
      });
      console.log('Contenu du FormData avant envoi:', formDataEntries);

      const response = await answerService.createAnswer(formData);
      console.log('Réponse du serveur:', response);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "La réponse a été créée avec succès",
        });
        onAnswerCreated();
      } else {
        throw new Error(response.message || "Erreur lors de la création de la réponse");
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création de la réponse",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createAnswer,
    isLoading
  };
};