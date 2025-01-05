import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AnswerLimit = 'single' | 'multiple';

interface QuizSidebarProps {
  setAnswerLimit: (value: AnswerLimit) => void;
}

export const QuizSidebar = ({ setAnswerLimit }: QuizSidebarProps) => {
  return (
    <aside className="space-y-6">
      <Card className="p-6 shadow-lg rounded-xl bg-white">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">
              Type de question
            </label>
            <Select defaultValue="quiz">
              <SelectTrigger className="border-2 border-primary/30 focus:ring-primary focus:border-primary transition-all duration-300">
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
              <SelectTrigger className="border-2 border-primary/30 focus:ring-primary focus:border-primary transition-all duration-300">
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
              <SelectTrigger className="border-2 border-primary/30 focus:ring-primary focus:border-primary transition-all duration-300">
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
              <SelectTrigger className="border-2 border-primary/30 focus:ring-primary focus:border-primary transition-all duration-300">
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
  );
};
