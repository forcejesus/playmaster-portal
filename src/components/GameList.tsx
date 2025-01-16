import { Button } from "@/components/ui/button";
import { Game } from "@/types/game";
import { Trash2 } from "lucide-react";

interface GameListProps {
  games: Game[];
  onDelete: (game: Game) => void;
}

const GameList = ({ games, onDelete }: GameListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {games?.map((game) => (
        <div
          key={game._id}
          className="bg-card text-card-foreground rounded-lg shadow-md p-4 relative"
        >
          <div className="absolute top-2 right-2">
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(game)}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="font-semibold mb-2">{game.titre}</h3>
          <p className="text-sm text-muted-foreground">
            {game.planification.length} planification(s)
          </p>
        </div>
      ))}
    </div>
  );
};

export default GameList;