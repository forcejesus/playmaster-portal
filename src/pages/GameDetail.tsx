import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Game } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Copy, Share, ChevronLeft, Trash2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const API_URL = "http://kahoot.nos-apps.com";

interface GamesResponse {
  success: boolean;
  message: string;
  data: Game[];
}

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: game, isLoading, error } = useQuery({
    queryKey: ["games", id],
    queryFn: async () => {
      console.log("Fetching all games to find game with ID:", id);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get<GamesResponse>(`${API_URL}/api/jeux`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const foundGame = response.data.data.find((game) => game._id === id);
      if (!foundGame) {
        throw new Error("Game not found");
      }

      console.log("Found game:", foundGame);
      return foundGame;
    },
    meta: {
      onError: (error: any) => {
        console.error("Error fetching game:", error);
        toast.error(error.response?.data?.message || "Erreur lors du chargement du jeu");
      },
    },
  });

  const deletePlanningMutation = useMutation({
    mutationFn: async (planningId: string) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(`${API_URL}/api/planification/delete/${planningId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Planification supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: ["games", id] });
    },
    meta: {
      onError: (error: any) => {
        console.error("Error deleting planning:", error);
        toast.error(error.response?.data?.message || "Erreur lors de la suppression de la planification");
      },
    },
  });

  const handleDeletePlanning = async (planningId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette planification ?")) {
      await deletePlanningMutation.mutate(planningId);
    }
  };

  const handleCopyPin = async (pin: string) => {
    try {
      await navigator.clipboard.writeText(pin);
      toast.success("PIN copié !");
    } catch (err) {
      toast.error("Erreur lors de la copie du PIN");
    }
  };

  const handleSharePin = async (pin: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'PIN du jeu',
          text: `Rejoignez le jeu avec le PIN: ${pin}`,
        });
      } else {
        await navigator.clipboard.writeText(pin);
        toast.success("PIN copié car le partage n'est pas disponible sur votre appareil");
      }
    } catch (err) {
      toast.error("Erreur lors du partage du PIN");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">{game?.titre || 'Chargement...'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Créé par {game?.createdBy?.name || "..."}
            </p>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6 space-y-6">
        {isLoading ? (
          <>
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/4" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Skeleton className="h-64 w-full" />
                  <div className="flex justify-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>
          </>
        ) : error ? (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Une erreur est survenue lors du chargement du jeu.</p>
            </CardContent>
          </Card>
        ) : game ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{game.titre}</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={`${API_URL}/${game.image}`} 
                  alt={game.titre}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Créé par:</p>
                    <p>{game.createdBy?.name || "Utilisateur inconnu"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Date de création:</p>
                    <p>{new Date(game.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Questions ({game.questions?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Carousel className="w-full max-w-4xl mx-auto">
                  <CarouselContent>
                    {game.questions?.map((question, index) => (
                      <CarouselItem key={question._id}>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Question {index + 1}: {question.libelle}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <img 
                              src={`${API_URL}/${question.fichier}`} 
                              alt={question.libelle}
                              className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <div className="space-y-2">
                              <p><span className="font-medium">Temps:</span> {question.temps} secondes</p>
                              <p><span className="font-medium">Type de fichier:</span> {question.type_fichier}</p>
                              {question.limite_response && (
                                <p className="text-yellow-600">Réponses limitées</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>

            {game.planification && game.planification.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Planifications ({game.planification.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {game.planification.map((plan) => (
                      <Card key={plan._id}>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="col-span-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">PIN:</p>
                                <p className="text-primary font-mono">{plan.pin}</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCopyPin(plan.pin)}
                                  className="ml-2"
                                >
                                  <Copy className="w-4 h-4 mr-1" />
                                  Copier
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSharePin(plan.pin)}
                                >
                                  <Share className="w-4 h-4 mr-1" />
                                  Partager
                                </Button>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeletePlanning(plan._id)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Supprimer
                              </Button>
                            </div>
                            <div>
                              <p className="font-semibold">Statut:</p>
                              <p className={plan.statut === "en cours" ? "text-green-600" : "text-yellow-600"}>
                                {plan.statut}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold">Période:</p>
                              <p>{plan.date_debut} - {plan.date_fin}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Horaires:</p>
                              <p>{plan.heure_debut} - {plan.heure_fin}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Type:</p>
                              <p>{plan.type}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Participants:</p>
                              <p>{plan.participants?.length || 0} / {plan.limite_participant}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GameDetail;