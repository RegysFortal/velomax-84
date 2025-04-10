
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClientFormValues } from '../ClientFormSchema';
import { PriceTable } from '@/types';

interface AdditionalInfoFieldsProps {
  control: Control<ClientFormValues>;
  priceTables: PriceTable[];
}

export function AdditionalInfoFields({ control, priceTables }: AdditionalInfoFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="priceTableId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tabela de Preços</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma tabela" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {priceTables.map((priceTable) => (
                  <SelectItem key={priceTable.id} value={priceTable.id}>
                    {priceTable.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Input placeholder="Observações" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
