import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MediaUpload } from './MediaUpload';
import { QuestionTypeSelect } from './QuestionTypeSelect';
import { QuestionSettings } from './QuestionSettings';
import { quizService } from '@/services/quizService';

const questionSchema = z.object({
  libelle: z.string().min(1, "Le libellé est requis"),
  fichier: z.any().optional(),
  type_fichier: z.string().min(1, "Le type de fichier est requis"),
  temps: z.number().min(1, "Le temps est requis"),
  limite_response: z.boolean(),
  typeQuestion: z.string().min(1, "Le type de question est requis"),
  point: z.string().min(1, "Le type de points est requis"),
  questionType: z.enum(["quiz", "true-false"]),
});

interface QuestionCreatorProps {
  gameId: string;
  onQuestionCreated: (question: any) => void;
}

export const QuestionCreator = ({ gameId, onQuestionCreated }: QuestionCreatorProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      libelle: "",
      temps: 30,
      limite_response: false,
      type_fichier: "image",
      typeQuestion: "670e7d8996acbaac49443987",
      point: "670e7e659c660d6c34411348",
      questionType: "quiz",
    }
  });

  const onSubmit = async (values: z.infer<typeof questionSchema>) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'fichier' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      });
      
      formData.append('jeu', gameId);

      const response = await quizService.createQuestion(formData);
      
      if (response.success && response.data) {
        toast({
          title: "Succès",
          description: "La question a été créée avec succès",
        });

        onQuestionCreated(response.data);
      } else {
        throw new Error("La création de la question a échoué");
      }
    } catch (error) {
      console.error('Error creating question:', error);
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
          <QuestionTypeSelect form={form} />
          
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
                <FormLabel>Image de la question</FormLabel>
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

          <QuestionSettings form={form} />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Création en cours..." : "Ajouter la question"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};