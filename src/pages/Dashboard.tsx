import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Game } from '@/types/game';
import { API_URL } from '@/config';
import GameList from '@/components/GameList';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';

const Dashboard = () => {
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const queryClient = useQueryClient();

  const { data: games } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/games`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    }
  });

  const handleDeleteGame = async (game: Game) => {
    try {
      await axios.delete(`${API_URL}/api/games/${game._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setGameToDelete(null);
      await queryClient.invalidateQueries({ queryKey: ['games'] });
      toast.success('Jeu supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du jeu:', error);
      toast.error('Erreur lors de la suppression du jeu');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <GameList games={games} onDelete={setGameToDelete} />
      {gameToDelete && (
        <ConfirmDeleteDialog
          game={gameToDelete}
          onConfirm={() => handleDeleteGame(gameToDelete)}
          onCancel={() => setGameToDelete(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;