import React from 'react';
import { Button } from "@/components/ui/button";
import { Game } from '@/types/game';

interface GameListProps {
  games?: Game[];
  onDelete: (game: Game) => void;
}

const GameList = ({ games = [], onDelete }: GameListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <div key={game._id} className="p-4 border rounded-lg shadow">
          <h3 className="text-lg font-semibold">{game.titre}</h3>
          {game.image && (
            <img 
              src={`${game.image}`} 
              alt={game.titre}
              className="w-full h-48 object-cover rounded-md my-2"
            />
          )}
          <div className="mt-4 flex justify-end">
            <Button
              variant="destructive"
              onClick={() => onDelete(game)}
              className="ml-2"
            >
              Supprimer
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;