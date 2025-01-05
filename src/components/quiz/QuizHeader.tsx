import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuizHeaderProps {
  gameTitle: string;
  setGameTitle: (title: string) => void;
}

export const QuizHeader = ({ gameTitle, setGameTitle }: QuizHeaderProps) => {
  return (
    <header className="bg-white border-b px-6 py-4 rounded-t-xl shadow-md flex items-center justify-between mb-6">
      <div className="flex items-center gap-6">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Khoot ECES JEUX
        </h1>
        <Input 
          placeholder="Nom du kahoot" 
          value={gameTitle}
          onChange={(e) => setGameTitle(e.target.value)}
          className="w-64 border-2 border-primary/30 focus:ring-primary focus:border-primary transition-all duration-300"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="text-primary border-primary/30 hover:bg-primary/10 transition-colors">
          Quitter
        </Button>
        <Button className="bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 transition-all duration-300">
          Enregistrer
        </Button>
      </div>
    </header>
  );
};