import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageLoader } from "@/components/ui/image-loader";
import { Game } from "@/types/game";

interface GameDetailsProps {
  game: Game;
}

export const GameDetails = ({ game }: GameDetailsProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Détails du jeu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">{game.titre}</h3>
            <p className="text-sm text-muted-foreground">
              Créé le {new Date(game.date).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="relative h-48">
            <ImageLoader
              src={`http://kahoot.nos-apps.com/${game.image}`}
              alt={game.titre}
              className="w-full h-full object-cover rounded-lg"
              fallback="/placeholder.svg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};