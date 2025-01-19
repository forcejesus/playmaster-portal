import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Plus, Copy, Trash, Check, X, ChevronLeft } from 'lucide-react';
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
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { quizService } from '@/services/quizService';

interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
  file?: File;
}

type QuestionType = 'true-false' | 'single';

export default function QuizCreator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameTitle, setGameTitle] = useState("");
  const [gameCoverImage, setGameCoverImage] = useState<File | null>(null);
  const [questionType, setQuestionType] = useState<QuestionType>('single');
  const [questionText, setQuestionText] = useState("");
  const [questionMedia, setQuestionMedia] = useState<File | null>(null);
  const [timeLimit, setTimeLimit] = useState("30");
  const [limitResponse, setLimitResponse] = useState(true);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);

  const initializeAnswers = (type: QuestionType) => {
    if (type === 'true-false') {
      setAnswers([
        { id: 1, text: 'Vrai', isCorrect: false },
        { id: 2, text: 'Faux', isCorrect: false }
      ]);
    } else {
      setAnswers([
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false },
        { id: 3, text: '', isCorrect: false },
        { id: 4, text: '', isCorrect: false }
      ]);
    }
  };

  const handleQuestionTypeChange = (value: QuestionType) => {
    setQuestionType(value);
    initializeAnswers(value);
  };

  const handleCorrectAnswer = (answerId: number) => {
    setAnswers(answers.map(answer => ({
      ...answer,
      isCorrect: answer.id === answerId
    })));
  };

  const getAnswerColor = (index: number) => {
    const colors = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];
    return colors[index % colors.length];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'question' | 'cover') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'question') {
        setQuestionMedia(file);
      } else {
        setGameCoverImage(file);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, type: 'question' | 'cover') => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (type === 'question') {
        setQuestionMedia(file);
      } else {
        setGameCoverImage(file);
      }
    }
  };

  const handleSave = async () => {
    try {
      // Create game
      const gameFormData = new FormData();
      gameFormData.append('titre', gameTitle);
      if (gameCoverImage) {
        gameFormData.append('image', gameCoverImage);
      }

      const gameResponse = await quizService.createGame(gameFormData);
      console.log('Game created:', gameResponse);

      if (gameResponse.jeu && gameResponse.jeu._id) {
        // Create question
        const questionFormData = new FormData();
        questionFormData.append('libelle', questionText);
        questionFormData.append('jeu', gameResponse.jeu._id);
        questionFormData.append('type_fichier', 'image');
        questionFormData.append('temps', timeLimit);
        questionFormData.append('limite_response', String(limitResponse));
        questionFormData.append('typeQuestion', '670e7d8996acbaac49443987');
        questionFormData.append('point', '670e7e659c660d6c34411348');
        
        if (questionMedia) {
          questionFormData.append('fichier', questionMedia);
        }

        const questionResponse = await quizService.createQuestion(questionFormData);
        console.log('Question created:', questionResponse);

        toast({
          title: "Succès",
          description: "Le jeu a été créé avec succès",
        });

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving game:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du jeu",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
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
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Enregistrer
            </Button>
          </div>
        </header>

        <div className="container mx-auto grid grid-cols-[1fr,300px] gap-6">
          <main>
            {/* Game Setup */}
            <Card className="p-8 mb-6">
              <h2 className="text-xl font-semibold mb-6">Configuration du jeu</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Titre du jeu
                  </label>
                  <Input 
                    value={gameTitle}
                    onChange={(e) => setGameTitle(e.target.value)}
                    placeholder="Entrez le titre du jeu"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Image de couverture
                  </label>
                  <div 
                    className={`
                      bg-secondary/10 rounded-xl p-10
                      border-2 border-dashed transition-all duration-300 cursor-pointer
                      ${gameCoverImage ? 'border-green-500' : 'border-primary hover:border-primary/80'}
                    `}
                    onClick={() => coverImageRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'cover')}
                  >
                    <input
                      type="file"
                      ref={coverImageRef}
                      onChange={(e) => handleFileChange(e, 'cover')}
                      className="hidden"
                      accept="image/*"
                    />
                    <div className="flex flex-col items-center gap-3">
                      {gameCoverImage ? (
                        <>
                          <Check className="w-12 h-12 text-green-500" />
                          <p className="text-center text-lg font-medium text-green-600">
                            {gameCoverImage.name}
                          </p>
                          <Button 
                            variant="outline" 
                            className="mt-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              setGameCoverImage(null);
                            }}
                          >
                            <X className="w-5 h-5 mr-2" />
                            Supprimer l'image
                          </Button>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12" />
                          <p className="text-center text-lg font-medium">
                            Ajouter une image de couverture
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Cliquez ou déposez une image ici
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Question Area */}
            <Card className="p-8 mb-6">
              <Input 
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Écrivez votre question"
                className="text-2xl mb-6"
              />

              {/* Media Upload */}
              <div 
                className={`
                  bg-secondary/10 rounded-xl p-10 mb-6 
                  border-2 border-dashed transition-all duration-300 cursor-pointer
                  ${questionMedia ? 'border-green-500' : 'border-primary hover:border-primary/80'}
                `}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'question')}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e, 'question')}
                  className="hidden"
                  accept="image/*"
                />
                <div className="flex flex-col items-center gap-3">
                  {questionMedia ? (
                    <>
                      <Check className="w-12 h-12 text-green-500" />
                      <p className="text-center text-lg font-medium text-green-600">
                        {questionMedia.name}
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuestionMedia(null);
                        }}
                      >
                        <X className="w-5 h-5 mr-2" />
                        Supprimer l'image
                      </Button>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12" />
                      <p className="text-center text-lg font-medium">
                        Ajouter une image à la question
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Cliquez ou déposez une image ici
                      </p>
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
                        value={answer.text}
                        onChange={(e) => {
                          const newAnswers = [...answers];
                          newAnswers[index].text = e.target.value;
                          setAnswers(newAnswers);
                        }}
                        placeholder={questionType === 'true-false' ? answer.text : `Réponse ${index + 1}`}
                        className="w-full pr-12"
                        disabled={questionType === 'true-false'}
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
                                : 'bg-card border-input hover:border-primary text-muted-foreground hover:text-foreground'
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

              {questionType === 'single' && (
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => setAnswers([...answers, { id: answers.length + 1, text: '', isCorrect: false }])}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ajouter une réponse
                </Button>
              )}
            </Card>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Type de question
                  </label>
                  <Select 
                    value={questionType}
                    onValueChange={(value: QuestionType) => handleQuestionTypeChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Question à réponse unique</SelectItem>
                      <SelectItem value="true-false">Vrai/Faux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Temps imparti (secondes)
                  </label>
                  <Select 
                    value={timeLimit}
                    onValueChange={setTimeLimit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le temps" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 secondes</SelectItem>
                      <SelectItem value="10">10 secondes</SelectItem>
                      <SelectItem value="20">20 secondes</SelectItem>
                      <SelectItem value="30">30 secondes</SelectItem>
                      <SelectItem value="60">60 secondes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <label className="text-sm font-medium">
                    Chronométrer le temps
                  </label>
                  <Switch
                    checked={limitResponse}
                    onCheckedChange={setLimitResponse}
                  />
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </TooltipProvider>
  );
}