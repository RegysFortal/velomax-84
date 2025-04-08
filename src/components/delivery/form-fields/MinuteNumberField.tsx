
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface MinuteNumberFieldProps {
  control: Control<any>;
  isEditMode: boolean;
}

export function MinuteNumberField({ control, isEditMode }: MinuteNumberFieldProps) {
  return (
    <FormField
      control={control}
      name="minuteNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Número da Minuta</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="Gerado automaticamente se vazio"
              disabled={isEditMode}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
