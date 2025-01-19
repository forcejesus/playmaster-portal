import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MediaUpload } from '@/components/quiz/MediaUpload';
import { quizService } from '@/services/quizService';

const gameSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  image: z.instanceof(File, { message: "L'image est requise" })
});

interface GameCreatorProps {
  onGameCreated: (gameId: string) => void;
}

export const GameCreator = ({ onGameCreated }: GameCreatorProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof gameSchema>>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      titre: "",
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  const onSubmit = async (values: z.infer<typeof gameSchema>) => {
    try {
      setIsLoading(true);
      console.log('Submitting game with values:', values);
      
      const formData = new FormData();
      formData.append('titre', values.titre);
      formData.append('image', values.image);

      const response = await quizService.createGame(formData);
      console.log('Game created successfully:', response);
      
      toast({
        title: "Succès",
        description: "Le jeu a été créé avec succès",
      });

      if (response.jeu && response.jeu._id) {
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
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Créer un nouveau jeu</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="titre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre du jeu</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Entrez le titre du jeu" className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image du jeu</FormLabel>
                <FormControl>
                  <MediaUpload
                    questionMedia={field.value}
                    setQuestionMedia={(file) => form.setValue('image', file)}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Création en cours..." : "Créer le jeu"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};