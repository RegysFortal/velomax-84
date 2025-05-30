
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
import { DatePicker } from '@/components/ui/date-picker';

interface DateAndTimeSectionProps {
  form: UseFormReturn<z.infer<typeof logbookFormSchema>>;
}

export function DateAndTimeSection({ form }: DateAndTimeSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data</FormLabel>
            <FormControl>
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  field.onChange(date ? date.toISOString().split('T')[0] : '');
                }}
                placeholder="Selecione a data"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="departureTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hora de Saída</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="departureOdometer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Km de Saída</FormLabel>
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
