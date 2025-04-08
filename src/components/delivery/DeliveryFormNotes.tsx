
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';

interface DeliveryFormNotesProps {
  control: Control<any>;
}

export function DeliveryFormNotes({ control }: DeliveryFormNotesProps) {
  return (
    <>
      <div className="md:col-span-2">
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Observações sobre a entrega"
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="md:col-span-2">
        <FormField
          control={control}
          name="occurrence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ocorrência</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Registre qualquer ocorrência durante a entrega"
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
