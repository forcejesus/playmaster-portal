import { Game } from "@/types/game";

interface GameListProps {
  games: Game[];
  onDelete: (game: Game) => void;
}

const GameList = ({ games, onDelete }: GameListProps) => {
  if (!games) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div key={game._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div>
            <h3 className="text-lg font-semibold">{game.titre}</h3>
            <p className="text-sm text-gray-600">Créé par: {game.createdBy.name}</p>
          </div>
          <button
            onClick={() => onDelete(game)}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
};

export default GameList;