
import React, { useEffect } from 'react';
import { Control, useWatch } from 'react-hook-form';
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
  // Observa o valor atual de priceTableId para debugging
  const priceTableId = useWatch({
    control,
    name: "priceTableId"
  });
  
  useEffect(() => {
    console.log("Current priceTableId value:", priceTableId);
  }, [priceTableId]);

  return (
    <>
      <FormField
        control={control}
        name="priceTableId"
        render={({ field }) => {
          console.log("Rendering price table field with value:", field.value);
          return (
            <FormItem>
              <FormLabel>Tabela de Preços</FormLabel>
              <Select 
                onValueChange={(value) => {
                  console.log("Price table selected:", value);
                  field.onChange(value);
                }} 
                value={field.value || "none"} // Changed from "" to "none"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma tabela" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priceTables && priceTables.length > 0 ? (
                    priceTables.map((priceTable) => (
                      <SelectItem 
                        key={priceTable.id} 
                        value={priceTable.id}
                      >
                        {priceTable.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no_tables"> {/* Changed from "none" to "no_tables" */}
                      Nenhuma tabela disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
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
