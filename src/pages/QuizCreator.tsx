import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QuizNavigation } from "@/components/quiz/QuizNavigation";
import { GameSetup } from "@/components/quiz/GameSetup";
import { QuestionCreator } from '@/components/quiz/QuestionCreator';
import { QueryClientProvider, QueryClient, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
    },
  },
});

const QuizCreatorContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState("");
  const [gameCoverImage, setGameCoverImage] = useState<File | null>(null);
  const [showGameSetup, setShowGameSetup] = useState(true);

  const handleGameCreated = async (gameId: string) => {
    setCurrentGameId(gameId);
    await queryClient.invalidateQueries();
    toast({
      title: "Configuration terminée",
      description: "Vous pouvez maintenant ajouter des questions à votre jeu",
    });
  };

  const handleQuestionCreated = async () => {
    await queryClient.invalidateQueries();
    toast({
      title: "Question ajoutée",
      description: "La question a été ajoutée avec succès à votre jeu",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <QuizNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Création de Quiz
          </h1>
          <p className="text-muted-foreground">
            Configurez votre jeu et ajoutez des questions pour créer une expérience interactive
          </p>
        </Card>

        <div className="space-y-8">
          <section>
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={() => setShowGameSetup(!showGameSetup)}
                className="bg-primary/10 hover:bg-primary/20 text-primary border-2 border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {showGameSetup ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Masquer la configuration
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Afficher la configuration
                  </>
                )}
              </Button>
            </div>

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
          </section>

          {currentGameId && (
            <section className="space-y-6">
              <Separator className="my-8" />
              <div className="bg-primary/5 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold text-primary mb-2">
                  Gestion des Questions
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ajoutez et gérez les questions de votre quiz
                </p>
              </div>
              <QuestionCreator 
                gameId={currentGameId} 
                onQuestionCreated={handleQuestionCreated}
              />
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