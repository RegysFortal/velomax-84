
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
              min="0"
              placeholder="0,00"
              value={field.value || ''}
              onChange={(e) => {
                const stringValue = e.target.value;
                let numericValue = 0;
                
                if (stringValue && stringValue !== '') {
                  numericValue = parseFloat(stringValue);
                  if (isNaN(numericValue)) {
                    numericValue = 0;
                  }
                }
                
                // Atualizar o campo do formulário com o valor numérico
                field.onChange(numericValue);
                
                // Chamar callback com valor numérico para cálculos
                if (onCargoValueChange) {
                  onCargoValueChange(numericValue);
                }
              }}
            />
          </FormControl>
          <FormMessage />
          <p className="text-sm text-muted-foreground mt-1">
            Será aplicado 1% do valor da carga como seguro no frete
          </p>
        </FormItem>
      )}
    />
  );
}
