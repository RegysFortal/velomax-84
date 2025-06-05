
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
import { City } from '@/types';

interface CitySelectionSectionProps {
  control: Control<any>;
  cities: City[];
  showDoorToDoor: boolean;
}

export function CitySelectionSection({ control, cities, showDoorToDoor }: CitySelectionSectionProps) {
  if (!showDoorToDoor) return null;

  return (
    <FormField
      control={control}
      name="cityId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cidade de Destino</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name} - {city.state}
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
