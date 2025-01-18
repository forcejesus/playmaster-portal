import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Copy, Trash, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { MediaUpload } from "@/components/quiz/MediaUpload";
import { QuizSidebar } from "@/components/quiz/QuizSidebar";
import { QuizNavigation } from "@/components/quiz/QuizNavigation";
import { GameSetup } from "@/components/quiz/GameSetup";
import { GameCreator } from '@/components/quiz/GameCreator';
import { QuestionCreator } from '@/components/quiz/QuestionCreator';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Question, Answer } from '@/types/quiz';
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

const QuizCreator = () => {
  const { toast } = useToast();
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState("");
  const [gameCoverImage, setGameCoverImage] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([
    { id: 1, text: '', isOptional: false, isCorrect: false },
    { id: 2, text: '', isOptional: false, isCorrect: false }
  ]);
  const [answerLimit, setAnswerLimit] = useState<'single' | 'multiple'>('single');
  const [questionMedia, setQuestionMedia] = useState<File | null>(null);
  const [showGameSetup, setShowGameSetup] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCorrectAnswer = (answerId: number) => {
    setAnswers(answers.map(answer => {
      if (answerLimit === 'single') {
        return {
          ...answer,
          isCorrect: answer.id === answerId
        };
      } else {
        if (answer.id === answerId) {
          return { ...answer, isCorrect: !answer.isCorrect };
        }
        return answer;
      }
    }));
  };

  const getAnswerColor = (index: number) => {
    const colors = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];
    return colors[index % colors.length];
  };

  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      libelle: "",
      type_fichier: "png",
      temps: 30,
      limite_response: true,
      typeQuestion: "670e7d8996acbaac49443987",
      point: "670e7e659c660d6c34411348",
      answers: [
        { id: 1, text: '', isOptional: false, isCorrect: false },
        { id: 2, text: '', isOptional: false, isCorrect: false }
      ]
    };
    setQuestions([...questions, newQuestion]);
    toast({
      title: "Question ajoutée",
      description: "Une nouvelle question a été ajoutée au quiz",
    });
  };

  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
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
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <Card key={question.id} className="p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                      Question {index + 1}
                    </h3>
                    <Button 
                      variant="outline" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setQuestions(questions.filter(q => q.id !== question.id));
                        toast({
                          title: "Question supprimée",
                          description: "La question a été supprimée du quiz",
                        });
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Input 
                    value={question.libelle}
                    onChange={(e) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[index].libelle = e.target.value;
                      setQuestions(updatedQuestions);
                    }}
                    placeholder="Libellé de la question"
                    className="mb-4 border-2 focus:ring-2 transition-all duration-300"
                  />

                  <MediaUpload 
                    questionMedia={questionMedia}
                    fileInputRef={fileInputRef}
                    handleFileChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setQuestionMedia(file);
                      }
                    }}
                    handleDragOver={(e) => e.preventDefault()}
                    handleDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        setQuestionMedia(file);
                      }
                    }}
                    setQuestionMedia={setQuestionMedia}
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Temps (secondes)</label>
                      <Input 
                        type="number"
                        value={question.temps}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[index].temps = parseInt(e.target.value);
                          setQuestions(updatedQuestions);
                        }}
                        min={5}
                        max={120}
                        className="border-2 focus:ring-2 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Type de fichier</label>
                      <Input 
                        value={question.type_fichier}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[index].type_fichier = e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                        className="border-2 focus:ring-2 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {answers.map((answer, index) => (
                      <motion.div
                        key={answer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-3 items-center mb-4"
                      >
                        <div 
                          className="w-2 h-14 rounded-full"
                          style={{ backgroundColor: getAnswerColor(index) }}
                        />
                        <div className="flex-1 relative group">
                          <Input 
                            placeholder={`Ajoute une réponse ${answer.id}${answer.isOptional ? ' (facultatif)' : ''}`}
                            className="w-full pr-12 border-2 focus:ring-2 transition-all duration-300"
                            style={{ 
                              borderColor: getAnswerColor(index),
                              '--tw-ring-color': getAnswerColor(index),
                            } as React.CSSProperties}
                          />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className={`
                                  absolute right-2 top-1/2 transform -translate-y-1/2
                                  w-8 h-8 rounded-full border-2 flex items-center justify-center
                                  transition-all duration-300 ease-in-out cursor-pointer
                                  ${answer.isCorrect 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'bg-white border-gray-300 hover:border-gray-400 text-gray-400 hover:text-gray-600'
                                  }
                                `}
                                onClick={() => handleCorrectAnswer(answer.id)}
                              >
                                <Check className="w-5 h-5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {answer.isCorrect ? 'Réponse correcte' : 'Marquer comme correcte'}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Card>
              ))}
            </div>

            <Button 
              className="mt-6 w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={addNewQuestion}
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter une nouvelle question
            </Button>

            <QuizSidebar setAnswerLimit={setAnswerLimit} />
          </div>
        </div>
      </QueryClientProvider>
    </TooltipProvider>
  );
};

export default QuizCreator;