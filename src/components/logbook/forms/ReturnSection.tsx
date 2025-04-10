
import React from 'react';
import { Input } from '@/components/ui/input';
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

interface ReturnSectionProps {
  form: UseFormReturn<z.infer<typeof logbookFormSchema>>;
}

export function ReturnSection({ form }: ReturnSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="returnTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hora de Retorno</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="endOdometer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Km de Retorno</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
