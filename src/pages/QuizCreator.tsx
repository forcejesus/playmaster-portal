import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameSetup } from "@/components/quiz/GameSetup";
import { QuestionCreator } from '@/components/quiz/QuestionCreator';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
    },
  },
});

const QuizCreatorContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState("");
  const [gameCoverImage, setGameCoverImage] = useState<File | null>(null);
  const [showGameSetup, setShowGameSetup] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestionCreator, setShowQuestionCreator] = useState(false);

  const handleGameCreated = async (gameId: string) => {
    setCurrentGameId(gameId);
    setShowQuestionCreator(true);
    toast({
      title: "Configuration terminée",
      description: "Vous pouvez maintenant ajouter des questions à votre jeu",
    });
  };

  const handleQuestionCreated = () => {
    setShowQuestionCreator(false);
    toast({
      title: "Question ajoutée",
      description: "La question a été ajoutée avec succès à votre jeu",
    });
  };

  const handleAddNewQuestion = () => {
    setShowQuestionCreator(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Création d'un jeux</h1>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <section>
            {currentGameId ? (
              <Card className="p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {gameCoverImage && (
                      <img 
                        src={URL.createObjectURL(gameCoverImage)} 
                        alt={gameTitle}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold">{gameTitle}</h2>
                      <p className="text-sm text-muted-foreground">Configuration du jeu terminée</p>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <AnimatePresence>
                {showGameSetup && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GameSetup
                      gameTitle={gameTitle}
                      setGameTitle={setGameTitle}
                      gameCoverImage={gameCoverImage}
                      setGameCoverImage={setGameCoverImage}
                      onGameCreated={handleGameCreated}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </section>

          {currentGameId && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary">Questions</h2>
                  <p className="text-muted-foreground">
                    Gérez les questions de votre quiz
                  </p>
                </div>
                {!showQuestionCreator && (
                  <Button onClick={handleAddNewQuestion} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter une question
                  </Button>
                )}
              </div>

              <div className="grid gap-6">
                {questions.map((question, index) => (
                  <Card key={question._id || index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Question {index + 1}: {question.libelle}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Temps: {question.temps} secondes
                        </p>
                      </div>
                      {question.fichier && (
                        <img 
                          src={`http://kahoot.nos-apps.com/${question.fichier}`}
                          alt={question.libelle}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {showQuestionCreator && (
                <QuestionCreator 
                  gameId={currentGameId} 
                  onQuestionCreated={handleQuestionCreated}
                />
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const QuizCreator = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <QuizCreatorContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default QuizCreator;