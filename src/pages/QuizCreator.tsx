import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Check, X, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { quizService } from '@/services/quizService';
import { GameCreator } from '@/components/quiz/GameCreator';
import { QuestionCreator } from '@/components/quiz/QuestionCreator';

export default function QuizCreator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameId, setGameId] = useState<string | null>(null);

  const handleGameCreated = (newGameId: string) => {
    setGameId(newGameId);
    toast({
      title: "Succès",
      description: "Le jeu a été créé. Vous pouvez maintenant ajouter des questions.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      {/* Header */}
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
          // Étape 1: Création du jeu
          <GameCreator onGameCreated={handleGameCreated} />
        ) : (
          // Étape 2: Création des questions
          <QuestionCreator 
            gameId={gameId} 
            onQuestionCreated={(question) => {
              toast({
                title: "Succès",
                description: "La question a été ajoutée avec succès",
              });
            }} 
          />
        )}
      </div>
    </div>
  );
}