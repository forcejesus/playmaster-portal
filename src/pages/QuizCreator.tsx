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
    // Invalidate all queries to force a fresh reload
    await queryClient.invalidateQueries();
    toast({
      title: "Configuration terminée",
      description: "Vous pouvez maintenant ajouter des questions à votre jeu",
    });
  };

  const handleQuestionCreated = async () => {
    // Invalidate all queries to force a fresh reload
    await queryClient.invalidateQueries();
    toast({
      title: "Question ajoutée",
      description: "La question a été ajoutée avec succès à votre jeu",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <QuizNavigation />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex justify-end"
        >
          <Button
            variant="outline"
            onClick={() => setShowGameSetup(!showGameSetup)}
            className="bg-[#9b87f5] hover:bg-[#D6BCFA] text-[#1A1F2C] border-2 border-[#9b87f5]/30 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {showGameSetup ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Cacher la configuration
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Afficher la configuration
              </>
            )}
          </Button>
        </motion.div>

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

        {currentGameId && (
          <div className="space-y-6">
            <QuestionCreator 
              gameId={currentGameId} 
              onQuestionCreated={handleQuestionCreated}
            />
          </div>
        )}
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