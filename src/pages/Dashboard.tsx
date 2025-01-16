import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Game } from '@/types/game';
import { API_URL } from '@/config';
import GameList from '@/components/GameList';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

interface GamesResponse {
  success: boolean;
  message: string;
  data: Game[];
}

const Dashboard = () => {
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const { data: gamesResponse, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      console.log('Fetching games with token:', token);
      const response = await axios.get<GamesResponse>(`${API_URL}/api/jeux`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Games response:', response.data);
      return response.data;
    }
  });

  const handleDeleteGame = async (game: Game) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/games/${game._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div className="flex gap-4">
          <Link to="/quiz-creator">
            <Button>
              <Plus className="mr-2" />
              Créer un quiz
            </Button>
          </Link>
          <Button variant="outline" onClick={logout}>
            Déconnexion
          </Button>
        </div>
      </div>
      <GameList 
        games={gamesResponse?.data || []} 
        isLoading={isLoading}
        onDelete={setGameToDelete} 
      />
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