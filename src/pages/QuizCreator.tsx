import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { GameCreator } from '@/components/quiz/GameCreator';
import { QuestionCreator } from '@/components/quiz/QuestionCreator';
import { GameDetails } from '@/components/quiz/GameDetails';
import { Game } from '@/types/game';
import { quizService } from '@/services/quizService';

export default function QuizCreator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameDetails, setGameDetails] = useState<Game | null>(null);

  const handleGameCreated = async (newGameId: string) => {
    setGameId(newGameId);
    try {
      const response = await quizService.getGameDetails(newGameId);
      setGameDetails(response.data);
      toast({
        title: "Succès",
        description: "Le jeu a été créé. Vous pouvez maintenant ajouter des questions.",
      });
    } catch (error) {
      console.error('Error fetching game details:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails du jeu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <header className="bg-card border-b px-6 py-4 rounded-t-xl shadow-md flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Création d'un jeu</h1>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl">
        {!gameId ? (
          <GameCreator onGameCreated={handleGameCreated} />
        ) : (
          <div className="space-y-6">
            {gameDetails && <GameDetails game={gameDetails} />}
            <QuestionCreator 
              gameId={gameId} 
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