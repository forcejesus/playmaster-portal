import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Plus } from "lucide-react";
import { ImageLoader } from "@/components/ui/image-loader";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { quizService } from "@/services/quizService";
import { useToast } from "@/hooks/use-toast";

interface GameSetupProps {
  gameTitle: string;
  setGameTitle: (title: string) => void;
  gameCoverImage: File | null;
  setGameCoverImage: (file: File | null) => void;
  onGameCreated: (gameId: string) => void;
}

export const GameSetup = ({
  gameTitle,
  setGameTitle,
  gameCoverImage,
  setGameCoverImage,
  onGameCreated,
}: GameSetupProps) => {
  const coverImageRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGameCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameTitle || !gameCoverImage) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Submitting game with title:', gameTitle);
      
      const formData = new FormData();
      formData.append('titre', gameTitle);
      formData.append('image', gameCoverImage);

      const response = await quizService.createGame(formData);
      console.log('Game created successfully:', response);
      
      if (response.jeu && response.jeu._id) {
        toast({
          title: "Succès",
          description: "Le jeu a été créé avec succès",
        });
        // Passer l'ID du jeu créé
        onGameCreated(response.jeu._id);
      } else {
        console.error('No game ID received in response');
        toast({
          title: "Erreur",
          description: "ID du jeu manquant dans la réponse",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in game creation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du jeu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit}>
        <Card className="mb-8 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Configuration du jeu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Titre du jeu</label>
              <Input
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                placeholder="Entrez le titre du jeu"
                className="mb-4 border-2 border-primary/30 focus:ring-primary focus:border-primary transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image de couverture</label>
              <div 
                className={`
                  border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                  transition-all duration-300
                  ${gameCoverImage ? 'border-green-500 bg-green-50' : 'border-primary/30 hover:border-primary'}
                `}
                onClick={() => coverImageRef.current?.click()}
              >
                <input
                  type="file"
                  ref={coverImageRef}
                  onChange={handleCoverImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {previewUrl ? (
                    <div className="text-green-600">
                      <Check className="w-8 h-8 mx-auto mb-2" />
                      <ImageLoader 
                        src={previewUrl}
                        alt="Cover preview"
                        className="max-w-full h-32 object-cover rounded-md mx-auto shadow-md"
                        fallback="/placeholder.svg"
                      />
                      <p className="mt-2 font-medium">{gameCoverImage?.name}</p>
                    </div>
                  ) : (
                    <div className="text-primary">
                      <Plus className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-medium">Ajouter une image de couverture</p>
                      <p className="text-sm text-primary/70 mt-1">
                        Cliquez ou déposez une image ici
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            disabled={isLoading}
          >
            {isLoading ? "Création en cours..." : "Créer le jeu"}
          </Button>
        </Card>
      </form>
    </motion.div>
  );
};