
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface MinuteNumberFieldProps {
  control: Control<any>;
  isEditMode: boolean;
  label?: string;
  placeholder?: string;
}

export function MinuteNumberField({ 
  control, 
  isEditMode, 
  label = "Número da Minuta",
  placeholder = "Gerado automaticamente se vazio"
}: MinuteNumberFieldProps) {
  return (
    <FormField
      control={control}
      name="minuteNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              disabled={isEditMode}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
