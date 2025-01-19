import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from './ImageUpload';
import { answerService } from '@/services/answerService';

const answerSchema = z.object({
  reponse_texte: z.string().min(1, "Le texte de la réponse est requis"),
  file: z.any().optional(),
  etat: z.boolean(),
});

interface AnswerCreatorProps {
  questionId: string;
  onAnswerCreated: () => void;
}

export const AnswerCreator = ({ questionId, onAnswerCreated }: AnswerCreatorProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      reponse_texte: "",
      etat: false,
    }
  });

  const onSubmit = async (values: z.infer<typeof answerSchema>) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('reponse_texte', values.reponse_texte);
      formData.append('etat', values.etat ? '1' : '0');
      formData.append('question', questionId);
      
      if (selectedFile) {
        formData.append('file', selectedFile, selectedFile.name);
        console.log('File being appended:', selectedFile.name, selectedFile.type);
      }

      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`FormData ${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      const response = await answerService.createAnswer(formData);
      console.log('Answer creation response:', response);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "La réponse a été créée avec succès",
        });

        onAnswerCreated();
        form.reset();
        setSelectedFile(null);
      } else {
        throw new Error(response.message || "Erreur lors de la création de la réponse");
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la réponse",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelected = (file: File) => {
    console.log('File selected:', file);
    setSelectedFile(file);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Ajouter une réponse</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="reponse_texte"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texte de la réponse</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Entrez le texte de la réponse" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel>Image (optionnelle)</FormLabel>
                <FormControl>
                  <ImageUpload
                    onFileSelected={handleFileSelected}
                    accept="image/*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="etat"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Réponse correcte</FormLabel>
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

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Ajouter la réponse"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};