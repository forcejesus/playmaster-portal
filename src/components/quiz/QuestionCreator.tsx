import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MediaUpload } from '@/components/quiz/MediaUpload';
import { quizService } from '@/services/quizService';

const questionSchema = z.object({
  libelle: z.string().min(1, "Le libellé est requis"),
  fichier: z.any().optional(),
  type_fichier: z.string().min(1, "Le type de fichier est requis"),
  temps: z.number().min(1, "Le temps est requis"),
  limite_response: z.boolean(),
  typeQuestion: z.string().min(1, "Le type de question est requis"),
  point: z.string().min(1, "Le type de points est requis"),
});

interface QuestionCreatorProps {
  gameId: string;
  onQuestionCreated: () => void;
}

export const QuestionCreator = ({ gameId, onQuestionCreated }: QuestionCreatorProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: questionTypes } = useQuery({
    queryKey: ['questionTypes'],
    queryFn: quizService.getQuestionTypes,
  });

  const { data: pointTypes } = useQuery({
    queryKey: ['pointTypes'],
    queryFn: quizService.getPointTypes,
  });

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      libelle: "",
      temps: 30,
      limite_response: false,
      type_fichier: "image",
      typeQuestion: "",
      point: "",
    }
  });

  const onSubmit = async (values: z.infer<typeof questionSchema>) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // Add all form values to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'fichier' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      });
      
      // Add game ID
      formData.append('jeu', gameId);

      await quizService.createQuestion(formData);
      
      toast({
        title: "Succès",
        description: "La question a été créée avec succès",
      });

      onQuestionCreated();
      form.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la question",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Ajouter une question</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="libelle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Libellé de la question</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Entrez le libellé de la question" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fichier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fichier multimédia</FormLabel>
                <FormControl>
                  <MediaUpload
                    questionMedia={field.value}
                    setQuestionMedia={(file) => form.setValue('fichier', file)}
                    fileInputRef={fileInputRef}
                    handleFileChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        form.setValue('fichier', file);
                      }
                    }}
                    handleDragOver={(event) => {
                      event.preventDefault();
                    }}
                    handleDrop={(event) => {
                      event.preventDefault();
                      const file = event.dataTransfer.files?.[0];
                      if (file) {
                        form.setValue('fichier', file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="temps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temps (secondes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limite_response"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Limite de réponses</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="typeQuestion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de question</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type de question" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {questionTypes?.data.map((type) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="point"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de points</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type de points" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pointTypes?.data.map((type) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.nature} ({type.valeur} points)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Ajouter la question"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};
