
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { logbookFormSchema } from '../schema';

interface NotesSectionProps {
  form: UseFormReturn<z.infer<typeof logbookFormSchema>>;
}

export function NotesSection({ form }: NotesSectionProps) {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observações</FormLabel>
          <FormControl>
            <Textarea placeholder="Alguma observação?" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
