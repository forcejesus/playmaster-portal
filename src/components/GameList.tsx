import { Game } from "@/types/game";
import { Loader2 } from "lucide-react";

interface GameListProps {
  games: Game[];
  isLoading: boolean;
  onDelete: (game: Game) => void;
}

const GameList = ({ games, isLoading, onDelete }: GameListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!games?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Aucun jeu trouvé
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div key={game._id} className="flex items-center justify-between p-4 bg-card rounded-lg shadow">
          <div>
            <h3 className="text-lg font-semibold">{game.titre}</h3>
            <p className="text-sm text-muted-foreground">Créé par: {game.createdBy.name}</p>
          </div>
          <button
            onClick={() => onDelete(game)}
            className="px-4 py-2 text-white bg-destructive rounded hover:bg-destructive/90"
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
};

export default GameList;