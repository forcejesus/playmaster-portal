import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { answerService } from '@/services/answerService';
import type { AnswerFormData } from '@/components/quiz/AnswerForm';

export const useAnswerCreation = (questionId: string, onAnswerCreated: (newAnswer: any) => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createAnswer = async (values: AnswerFormData) => {
    try {
      setIsLoading(true);
      
      const answerData = {
        reponse_texte: values.reponse_texte,
        question: questionId,
        etat: values.etat
      };

      const response = await answerService.createAnswer(answerData);
      
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