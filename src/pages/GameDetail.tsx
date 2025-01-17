import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const API_URL = "http://kahoot.nos-apps.com";

interface Game {
  _id: string;
  titre: string;
  description: string;
  questions: Array<{
    _id: string;
    titre: string;
    reponses: string[];
    bonneReponse: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: game, isLoading, error } = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      console.log("Fetching game with ID:", id);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get<Game>(`${API_URL}/api/jeux/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Game data received:", response.data);
      return response.data;
    },
    retry: 1,
    onError: (error: any) => {
      console.error("Error fetching game:", error);
      toast.error(error.response?.data?.message || "Erreur lors du chargement du jeu");
    },
  });

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
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{game.titre}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{game.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {game.questions.map((question, index) => (
              <Card key={question._id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {index + 1}: {question.titre}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Réponses possibles:</h4>
                    <ul className="list-disc pl-6">
                      {question.reponses.map((reponse, rIndex) => (
                        <li
                          key={rIndex}
                          className={
                            reponse === question.bonneReponse
                              ? "text-primary font-medium"
                              : ""
                          }
                        >
                          {reponse}
                          {reponse === question.bonneReponse && " (Bonne réponse)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameDetail;