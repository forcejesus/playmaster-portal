import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { answerService } from '@/services/answerService';
import type { AnswerFormData } from '@/components/quiz/AnswerForm';

export const useAnswerCreation = (questionId: string, onAnswerCreated: (newAnswer: any) => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createAnswer = async (values: AnswerFormData, selectedFile: File | null) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      
      // Ajout des champs requis
      formData.append('reponse_texte', values.reponse_texte);
      formData.append('question', questionId);
      formData.append('etat', values.etat ? '1' : '0');
      
      // Ajout du fichier si présent
      if (selectedFile) {
        console.log('Ajout du fichier:', selectedFile.name, selectedFile.type, selectedFile.size);
        formData.append('file', selectedFile, selectedFile.name);
      }

      // Log pour débugger
      const formDataEntries: { [key: string]: any } = {};
      formData.forEach((value, key) => {
        formDataEntries[key] = value instanceof File ? `${value.name} (${value.type})` : value;
      });
      console.log('Données envoyées:', formDataEntries);

      const response = await answerService.createAnswer(formData);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "La réponse a été créée avec succès",
        });
        onAnswerCreated(response.data);
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