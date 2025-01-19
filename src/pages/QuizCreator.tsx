import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GameCreator } from '@/components/quiz/GameCreator';
import { QuestionCreator } from '@/components/quiz/QuestionCreator';
import { Game, Question } from '@/types/game';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function QuizCreator() {
  const navigate = useNavigate();
  const [gameDetails, setGameDetails] = useState<Game | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleGameCreated = (newGameDetails: Game) => {
    setGameDetails(newGameDetails);
  };

  const handleQuestionCreated = (newQuestion: Question) => {
    setQuestions(prev => [...prev, newQuestion]);
    console.log("Question ajoutée avec succès");
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
              onQuestionCreated={handleQuestionCreated}
            />
            
            {questions.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Questions ajoutées ({questions.length})</h3>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <Card key={question._id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Question {index + 1}</h4>
                            <p className="text-sm text-gray-600">{question.libelle}</p>
                            {question.fichier && (
                              <img 
                                src={`http://kahoot.nos-apps.com/${question.fichier}`}
                                alt={`Question ${index + 1}`}
                                className="mt-2 w-32 h-32 object-cover rounded"
                              />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            <p>Temps: {question.temps}s</p>
                            <p>Réponses: {question.reponses?.length || 0}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}