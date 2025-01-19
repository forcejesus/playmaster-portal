import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface QuestionTypeSelectProps {
  form: UseFormReturn<any>;
}

export const QuestionTypeSelect = ({ form }: QuestionTypeSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="questionType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de question</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type de question" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="quiz">Question à choix unique</SelectItem>
              <SelectItem value="true-false">Vrai/Faux</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};