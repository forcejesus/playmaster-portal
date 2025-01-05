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

interface Question {
  id: string;
  libelle: string;
  type_fichier: string;
  temps: number;
  limite_response: boolean;
  typeQuestion: string;
  point: string;
  media?: File;
  answers: Answer[];
}

export default function QuizCreator() {
  const [gameTitle, setGameTitle] = useState("");
  const [gameCoverImage, setGameCoverImage] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([
    { id: 1, text: '', isOptional: false, isCorrect: false },
    { id: 2, text: '', isOptional: false, isCorrect: false }
  ]);
  const [answerLimit, setAnswerLimit] = useState<AnswerLimit>('single');
  const [questionMedia, setQuestionMedia] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setQuestionMedia(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setQuestionMedia(file);
    }
  };

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGameCoverImage(file);
    }
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
      typeQuestion: "670e7d8996acbaac49443987", // Default value
      point: "670e7e659c660d6c34411348", // Default value
      answers: [
        { id: 1, text: '', isOptional: false, isCorrect: false },
        { id: 2, text: '', isOptional: false, isCorrect: false }
      ]
    };
    setQuestions([...questions, newQuestion]);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
        {/* Game Setup Section */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">Configuration du jeu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Titre du jeu</label>
              <Input
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                placeholder="Entrez le titre du jeu"
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image de couverture</label>
              <div 
                className={`
                  border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                  ${gameCoverImage ? 'border-green-500 bg-green-50' : 'border-primary/30 hover:border-primary'}
                `}
                onClick={() => coverImageRef.current?.click()}
              >
                <input
                  type="file"
                  ref={coverImageRef}
                  onChange={handleCoverImageChange}
                  className="hidden"
                  accept="image/*"
                />
                {gameCoverImage ? (
                  <div className="text-green-600">
                    <Check className="w-8 h-8 mx-auto mb-2" />
                    <p>{gameCoverImage.name}</p>
                  </div>
                ) : (
                  <div className="text-primary">
                    <Plus className="w-8 h-8 mx-auto mb-2" />
                    <p>Ajouter une image de couverture</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Question {index + 1}</h3>
                <Button 
                  variant="outline" 
                  className="text-destructive"
                  onClick={() => setQuestions(questions.filter(q => q.id !== question.id))}
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
                className="mb-4"
              />

              <MediaUpload 
                questionMedia={questionMedia}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
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
                  />
                </div>
              </div>

              {/* Existing answers section */}
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

        {/* Add Question Button */}
        <Button 
          className="mt-6 w-full"
          onClick={addNewQuestion}
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter une nouvelle question
        </Button>

        <QuizSidebar setAnswerLimit={setAnswerLimit} />
      </div>
    </TooltipProvider>
  );
}
