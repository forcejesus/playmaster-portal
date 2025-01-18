import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageUpload } from '@/components/quiz/MediaUpload';
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

  const form = useForm<z.infer<typeof gameSchema>>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      titre: "",
    }
  });

  const onSubmit = async (values: z.infer<typeof gameSchema>) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('titre', values.titre);
      formData.append('image', values.image);

      const response = await quizService.createGame(formData);
      
      toast({
        title: "Succès",
        description: "Le jeu a été créé avec succès",
      });

      onGameCreated(response.jeu._id);
    } catch (error) {
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
    <Card className="p-6">
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
                  <Input {...field} placeholder="Entrez le titre du jeu" />
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
                  <ImageUpload
                    onFileSelected={(file) => form.setValue('image', file)}
                    accept="image/*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Créer le jeu"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};