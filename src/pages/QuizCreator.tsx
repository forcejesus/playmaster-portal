import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { GameCreator } from '@/components/quiz/GameCreator';
import { QuestionCreator } from '@/components/quiz/QuestionCreator';
import { QuizHeader } from '@/components/quiz/QuizHeader';
import { Game } from '@/types/game';

export default function QuizCreator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameDetails, setGameDetails] = useState<Game | null>(null);
  const [gameTitle, setGameTitle] = useState("");

  const handleGameCreated = (newGameDetails: Game) => {
    setGameDetails(newGameDetails);
    setGameTitle(newGameDetails.titre);
    toast({
      title: "Succès",
      description: "Le jeu a été créé. Vous pouvez maintenant ajouter des questions.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <QuizHeader gameTitle={gameTitle} setGameTitle={setGameTitle} />

      <div className="container mx-auto max-w-4xl p-6">
        {!gameDetails ? (
          <GameCreator onGameCreated={handleGameCreated} />
        ) : (
          <div className="space-y-6">
            <QuestionCreator 
              gameId={gameDetails._id} 
              onQuestionCreated={(question) => {
                toast({
                  title: "Succès",
                  description: "La question a été ajoutée avec succès",
                });
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}