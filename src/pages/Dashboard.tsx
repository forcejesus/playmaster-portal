import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  LogOut,
  Calendar,
  Users,
  HelpCircle,
  Clock,
  ChevronRight,
  CalendarPlus
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Game } from "@/types/game";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageLoader } from "@/components/ui/image-loader";

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Set up automatic refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    }, 5000);

    return () => clearInterval(interval);
  }, [queryClient]);

  const { data: gamesData, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      console.log('Fetching games data...');
      const response = await axios.get('http://kahoot.nos-apps.com/api/jeux');
      console.log('Games data received:', response.data);
      return response.data;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const handleRowClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  // Force refresh function
  const handleRefresh = () => {
    console.log('Manually refreshing data...');
    queryClient.invalidateQueries({ queryKey: ['games'] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <motion.h1 variants={item} className="text-3xl font-bold">
              Tableau de bord
            </motion.h1>
            <motion.p variants={item} className="text-muted-foreground">
              Bienvenue professeur, {user?.name || 'Levi'} 👋
            </motion.p>
          </div>
          <div className="flex items-center gap-4">
            <motion.div variants={item}>
              <Button 
                variant="outline"
                onClick={handleRefresh}
                className="mr-2"
              >
                <Clock className="mr-2 h-4 w-4" />
                Actualiser
              </Button>
            </motion.div>
            <motion.div variants={item}>
              <Link to="/quiz-creator">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" /> Nouveau jeu
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={item}>
              <Link to="/game-planner">
                <Button variant="secondary" className="bg-secondary hover:bg-secondary/90">
                  <CalendarPlus className="mr-2 h-4 w-4" /> Planifier un jeu
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={item}>
              <Button
                variant="outline"
                onClick={logout}
                className="bg-destructive/10 hover:bg-destructive/20 text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des jeux</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gamesData?.data.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planifications actives</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {gamesData?.data.reduce((acc, game) => acc + game.planification.filter(p => p.statut === "en cours").length, 0) || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {gamesData?.data.reduce((acc, game) => acc + game.planification.reduce((pacc, p) => pacc + p.participants.length, 0), 0) || 0}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Liste des jeux</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Planifications</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gamesData?.data.map((game: Game) => (
                      <TableRow 
                        key={game._id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(game._id)}
                      >
                        <TableCell className="font-medium">{game.titre}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            {game.questions.length}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {game.planification.length}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(game.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedGame?.titre}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {selectedGame?.questions.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Questions</h3>
                  <div className="space-y-4">
                    {selectedGame.questions.map((question, index) => (
                      <Card key={question._id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <span className="text-muted-foreground">Q{index + 1}.</span>
                            <div className="space-y-2">
                              <p>{question.libelle}</p>
                              {question.fichier && (
                                <ImageLoader 
                                  src={`http://kahoot.nos-apps.com/${question.fichier}`}
                                  alt="Question media"
                                  className="max-w-xs rounded-md"
                                  fallback="/placeholder.svg"
                                />
                              )}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{question.temps} secondes</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Aucune question n'a encore été ajoutée à ce jeu.
                </p>
              )}

              {selectedGame?.planification.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Planifications</h3>
                  <div className="space-y-4">
                    {selectedGame.planification.map((plan) => (
                      <Card key={plan._id}>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">PIN</p>
                              <p className="font-semibold">{plan.pin}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Statut</p>
                              <p className="font-semibold capitalize">{plan.statut}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Période</p>
                              <p className="font-semibold">
                                {plan.date_debut} - {plan.date_fin}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Horaires</p>
                              <p className="font-semibold">
                                {plan.heure_debut} - {plan.heure_fin}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Participants</p>
                              <p className="font-semibold">
                                {plan.participants.length} / {plan.limite_participant}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Type</p>
                              <p className="font-semibold capitalize">{plan.type}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default Dashboard;
