import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ImageUpload } from './ImageUpload';

const answerSchema = z.object({
  reponse_texte: z.string().min(1, "Le texte de la réponse est requis"),
  file: z.any().optional(),
  etat: z.boolean(),
});

export type AnswerFormData = z.infer<typeof answerSchema>;

interface AnswerFormProps {
  onSubmit: (values: AnswerFormData, file: File | null) => Promise<void>;
  isLoading: boolean;
}

export const AnswerForm = ({ onSubmit, isLoading }: AnswerFormProps) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const form = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      reponse_texte: "",
      etat: false,
    }
  });

  const handleSubmit = async (values: AnswerFormData) => {
    await onSubmit(values, selectedFile);
    if (!isLoading) {
      form.reset();
      setSelectedFile(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  onFileSelected={(file) => setSelectedFile(file)}
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
  );
};