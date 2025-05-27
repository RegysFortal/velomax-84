
import React from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { FormItem } from '@/components/ui/form';
import { FormLabel } from '@/components/ui/form';
import { FormControl } from '@/components/ui/form';
import { FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface ReceiverFieldsProps {
  control: Control<any>;
  setValue?: UseFormSetValue<any>;
}

export function ReceiverFields({ control, setValue }: ReceiverFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="receiver"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Destinatário</FormLabel>
            <FormControl>
              <Input placeholder="Nome do recebedor" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="receiverId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Documento do Recebedor</FormLabel>
            <FormControl>
              <Input placeholder="CPF ou RG do recebedor" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="arrivalKnowledgeNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Conhecimento de Chegada</FormLabel>
            <FormControl>
              <Input placeholder="Nº do conhecimento" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
