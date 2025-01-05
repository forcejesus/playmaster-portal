import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Plus, Copy, Trash, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Answer {
  id: number;
  text: string;
  isOptional: boolean;
  isCorrect: boolean;
}

type AnswerLimit = 'single' | 'multiple';

const QuizCreator = () => {
  const [answers, setAnswers] = useState<Answer[]>([
    { id: 1, text: '', isOptional: false, isCorrect: false },
    { id: 2, text: '', isOptional: false, isCorrect: false },
    { id: 3, text: '', isOptional: true, isCorrect: false },
    { id: 4, text: '', isOptional: true, isCorrect: false },
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-6">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 rounded-t-xl shadow-md flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Khoot ECES JEUX</h1>
            <Input 
              placeholder="Nom du kahoot" 
              className="w-64 border-2 border-purple-300 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-100 transition-colors">Passer à l...</Button>
            <Button variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-100 transition-colors">Thèmes</Button>
            <Button variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-100 transition-colors">Quitter</Button>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-300">Enregistrer</Button>
          </div>
        </header>

        <div className="container mx-auto grid grid-cols-[1fr,300px] gap-6">
          <main>
            {/* Question Area */}
            <Card className="p-8 mb-6 shadow-xl rounded-xl bg-white">
              <Input 
                placeholder="Écris ta question"
                className="text-2xl mb-6 border-2 border-purple-300 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              />

              {/* Media Upload */}
              <div 
                className={`
                  bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-10 mb-6 
                  border-2 border-dashed transition-all duration-300 cursor-pointer
                  ${questionMedia ? 'border-green-400 bg-green-50' : 'border-purple-300 hover:border-purple-500'}
                `}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,video/*"
                />
                <div className="flex flex-col items-center gap-3 text-purple-600">
                  {questionMedia ? (
                    <>
                      <Check className="w-12 h-12 text-green-500" />
                      <p className="text-center text-lg font-medium text-green-600">{questionMedia.name}</p>
                      <Button 
                        variant="outline" 
                        className="mt-3 border-green-400 text-green-600 hover:bg-green-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuestionMedia(null);
                        }}
                      >
                        <X className="w-5 h-5 mr-2" />
                        Supprimer le fichier
                      </Button>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12" />
                      <p className="text-center text-lg font-medium">Trouve et insère un contenu multimédia</p>
                      <p className="text-sm text-purple-500 mt-2">Cliquez ou déposez un fichier ici</p>
                    </>
                  )}
                </div>
              </div>

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
                className="mt-6 border-purple-300 text-purple-600 hover:bg-purple-100 transition-colors"
                onClick={() => setAnswers([...answers, { id: answers.length + 1, text: '', isOptional: true, isCorrect: false }])}
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter plus de réponses
              </Button>
            </Card>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100 transition-colors">
                <Trash className="w-5 h-5 mr-2" />
                Supprimer
              </Button>
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-100 transition-colors">
                <Copy className="w-5 h-5 mr-2" />
                Dupliquer
              </Button>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="p-6 shadow-lg rounded-xl bg-white">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
                    Type de question
                  </label>
                  <Select defaultValue="quiz">
                    <SelectTrigger className="border-2 border-purple-300 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300">
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="true-false">Vrai/Faux</SelectItem>
                      <SelectItem value="survey">Sondage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
                    Temps imparti
                  </label>
                  <Select defaultValue="20">
                    <SelectTrigger className="border-2 border-purple-300 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300">
                      <SelectValue placeholder="Sélectionner le temps" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 secondes</SelectItem>
                      <SelectItem value="10">10 secondes</SelectItem>
                      <SelectItem value="20">20 secondes</SelectItem>
                      <SelectItem value="30">30 secondes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
                    Points
                  </label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="border-2 border-purple-300 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300">
                      <SelectValue placeholder="Sélectionner les points" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="no-points">Pas de points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
                    Limite de réponse
                  </label>
                  <Select 
                    defaultValue="single"
                    onValueChange={(value: AnswerLimit) => setAnswerLimit(value)}
                  >
                    <SelectTrigger className="border-2 border-purple-300 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300">
                      <SelectValue placeholder="Sélectionner la limite" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Sélection unique</SelectItem>
                      <SelectItem value="multiple">Sélection multiple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default QuizCreator;