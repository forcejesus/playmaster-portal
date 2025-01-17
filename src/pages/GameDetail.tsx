import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Game } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Copy, Share, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://kahoot.nos-apps.com";

interface GamesResponse {
  success: boolean;
  message: string;
  data: Game[];
}

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: game, isLoading, error } = useQuery({
    queryKey: ["games"],
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Une erreur est survenue lors du chargement du jeu.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p>Aucun jeu trouvé</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
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
            <h1 className="text-lg font-semibold">{game.titre}</h1>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Créé par {game.createdBy?.name || "Utilisateur inconnu"}
            </p>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6 space-y-6">
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
        <CardContent>
          <div className="space-y-4">
            {game.questions?.map((question, index) => (
              <Card key={question._id}>
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
            ))}
          </div>
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
                      <div className="col-span-2 flex items-center gap-2">
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
      </div>
    </div>
  );
};

export default GameDetail;
