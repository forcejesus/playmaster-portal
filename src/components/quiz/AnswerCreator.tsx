import { Card } from '@/components/ui/card';
import { AnswerForm } from './AnswerForm';
import { useAnswerCreation } from '@/hooks/useAnswerCreation';

interface AnswerCreatorProps {
  questionId: string;
  onAnswerCreated: (newAnswer: any) => void;
}

export const AnswerCreator = ({ questionId, onAnswerCreated }: AnswerCreatorProps) => {
  const { createAnswer, isLoading } = useAnswerCreation(questionId, onAnswerCreated);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Ajouter une réponse</h3>
      <AnswerForm 
        onSubmit={createAnswer}
        isLoading={isLoading}
      />
    </Card>
  );
};