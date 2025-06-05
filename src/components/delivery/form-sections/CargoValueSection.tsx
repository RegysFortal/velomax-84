
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DeliveryType } from '@/types';

interface CargoValueSectionProps {
  control: Control<any>;
  watchDeliveryType: DeliveryType;
  onCargoValueChange?: (value: number) => void;
}

export function CargoValueSection({ 
  control, 
  watchDeliveryType, 
  onCargoValueChange 
}: CargoValueSectionProps) {
  if (watchDeliveryType !== 'reshipment') return null;

  return (
    <FormField
      control={control}
      name="cargoValue"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Valor da Carga (R$)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder="0,00"
              {...field}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                field.onChange(e);
                onCargoValueChange?.(value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
