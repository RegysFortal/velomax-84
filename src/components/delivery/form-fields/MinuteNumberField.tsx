
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';

interface MinuteNumberFieldProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  isEditMode?: boolean;
  label?: string;
  placeholder?: string;
}

export function MinuteNumberField({ 
  control, 
  setValue,
  getValues,
  isEditMode = false, 
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
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
