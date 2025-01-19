import * as React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const answerSchema = z.object({
  reponse_texte: z.string().min(1, "Le texte de la réponse est requis"),
  etat: z.boolean(),
});

export type AnswerFormData = z.infer<typeof answerSchema>;

interface AnswerFormProps {
  onSubmit: (values: AnswerFormData) => Promise<void>;
  isLoading: boolean;
  isVraiFaux?: boolean;
}

export const AnswerForm = ({ onSubmit, isLoading, isVraiFaux = false }: AnswerFormProps) => {
  const form = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      reponse_texte: isVraiFaux ? "Vrai" : "",
      etat: false,
    }
  });

  const handleSubmit = async (values: AnswerFormData) => {
    await onSubmit(values);
    if (!isLoading) {
      form.reset();
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
                <Input 
                  {...field} 
                  placeholder="Entrez le texte de la réponse"
                  disabled={isVraiFaux} 
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

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Création en cours..." : "Ajouter la réponse"}
        </Button>
      </form>
    </Form>
  );
};