import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GameCreator } from '@/components/quiz/GameCreator';
import { QuestionCreator } from '@/components/quiz/QuestionCreator';
import { Game } from '@/types/game';

export default function QuizCreator() {
  const navigate = useNavigate();
  const [gameDetails, setGameDetails] = useState<Game | null>(null);

  const handleGameCreated = (newGameDetails: Game) => {
    setGameDetails(newGameDetails);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {gameDetails ? gameDetails.titre : "Création d'un nouveau jeu"}
        </h1>
      </header>

      <div className="container mx-auto max-w-4xl p-6">
        {!gameDetails ? (
          <GameCreator onGameCreated={handleGameCreated} />
        ) : (
          <div className="space-y-6">
            <QuestionCreator 
              gameId={gameDetails._id}
              onQuestionCreated={() => {
                console.log("Question créée avec succès");
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}