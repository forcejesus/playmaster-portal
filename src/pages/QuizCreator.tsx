import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Copy, Trash, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { MediaUpload } from "@/components/quiz/MediaUpload";
import { QuizSidebar } from "@/components/quiz/QuizSidebar";

type AnswerLimit = 'single' | 'multiple';

interface Answer {
  id: number;
  text: string;
  isOptional: boolean;
  isCorrect: boolean;
}

export default function QuizCreator() {
  const [answers, setAnswers] = useState<Answer[]>([
    { id: 1, text: '', isOptional: false, isCorrect: false },
    { id: 2, text: '', isOptional: false, isCorrect: false }
  ]);
  const [answerLimit, setAnswerLimit] = useState<AnswerLimit>('single');
  const [questionMedia, setQuestionMedia] = useState<File | null>(null);
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
        <QuizHeader />

        <div className="container mx-auto grid grid-cols-[1fr,300px] gap-6">
          <main>
            <Card className="p-8 mb-6 shadow-xl rounded-xl bg-white">
              <Input 
                placeholder="Écris ta question"
                className="text-2xl mb-6 border-2 border-primary/30 focus:ring-primary focus:border-primary transition-all duration-300"
              />

              <MediaUpload 
                questionMedia={questionMedia}
                fileInputRef={fileInputRef}
                setQuestionMedia={setQuestionMedia}
              />

              {/* Answer Options */}
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

              <Button 
                variant="outline" 
                className="mt-6 border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                onClick={() => setAnswers([...answers, { id: answers.length + 1, text: '', isOptional: true, isCorrect: false }])}
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter plus de réponses
              </Button>
            </Card>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors">
                <Trash className="w-5 h-5 mr-2" />
                Supprimer
              </Button>
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 transition-colors">
                <Copy className="w-5 h-5 mr-2" />
                Dupliquer
              </Button>
            </div>
          </main>

          <QuizSidebar setAnswerLimit={setAnswerLimit} />
        </div>
      </div>
    </TooltipProvider>
  );
}