
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { Control } from 'react-hook-form';

interface DeliveryFormBasicFieldsProps {
  control: Control<any>;
  isEditMode: boolean;
}

export function DeliveryFormBasicFields({ control, isEditMode }: DeliveryFormBasicFieldsProps) {
  return (
    <>
      <div className="md:col-span-2">
        <FormField
          control={control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <ClientSearchSelect
                  value={field.value}
                  onValueChange={(value) => {
                    console.log("DeliveryFormBasicFields - ClientId changed to:", value);
                    field.onChange(value);
                  }}
                  placeholder="Selecione um cliente"
                  disableAutoSelect={isEditMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
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
      
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={control}
          name="deliveryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Entrega</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="deliveryTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="receiver"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Destinatário</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome do destinatário" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso (kg)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="packages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volumes</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="1"
                  placeholder="1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
