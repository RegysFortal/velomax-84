
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DeliveryTypeSectionProps {
  control: Control<any>;
}

export function DeliveryTypeSection({ control }: DeliveryTypeSectionProps) {
  const deliveryTypeOptions = [
    { value: 'standard', label: 'Padrão' },
    { value: 'emergency', label: 'Emergência' },
    { value: 'exclusive', label: 'Exclusivo' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sundayHoliday', label: 'Domingo/Feriado' },
    { value: 'difficultAccess', label: 'Acesso Difícil' },
    { value: 'metropolitanRegion', label: 'Região Metropolitana' },
    { value: 'doorToDoorInterior', label: 'Porta a Porta Interior' },
    { value: 'reshipment', label: 'Redespacho' },
    { value: 'normalBiological', label: 'Biológico Normal' },
    { value: 'infectiousBiological', label: 'Biológico Infeccioso' },
    { value: 'tracked', label: 'Rastreado' },
  ];

  return (
    <FormField
      control={control}
      name="deliveryType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Entrega</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {deliveryTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
