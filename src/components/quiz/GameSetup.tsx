import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Plus } from "lucide-react";

interface GameSetupProps {
  gameTitle: string;
  setGameTitle: (title: string) => void;
  gameCoverImage: File | null;
  setGameCoverImage: (file: File | null) => void;
}

export const GameSetup = ({
  gameTitle,
  setGameTitle,
  gameCoverImage,
  setGameCoverImage,
}: GameSetupProps) => {
  const coverImageRef = useRef<HTMLInputElement>(null);

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGameCoverImage(file);
    }
  };

  return (
    <Card className="mb-8 p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">Configuration du jeu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Titre du jeu</label>
          <Input
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            placeholder="Entrez le titre du jeu"
            className="mb-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Image de couverture</label>
          <div 
            className={`
              border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
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
            {gameCoverImage ? (
              <div className="text-green-600">
                <Check className="w-8 h-8 mx-auto mb-2" />
                <p>{gameCoverImage.name}</p>
              </div>
            ) : (
              <div className="text-primary">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <p>Ajouter une image de couverture</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};