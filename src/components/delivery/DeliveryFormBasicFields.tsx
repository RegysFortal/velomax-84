import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useAuth } from '@/contexts/AuthContext';

interface DeliveryFormBasicFieldsProps {
  control: Control<any>;
  isEditMode: boolean;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
}

export function DeliveryFormBasicFields({ 
  control, 
  isEditMode, 
  setValue, 
  getValues 
}: DeliveryFormBasicFieldsProps) {
  const { users } = useAuth();
  
  const employeeOptions = users.map(user => ({
    value: user.id,
    label: user.name,
    description: user.position || user.department
  }));

  return (
    <>
      <div className="md:col-span-2">
        <FormField
          control={control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selecione um cliente</FormLabel>
              <FormControl>
                <ClientSearchSelect
                  value={field.value || ""}
                  onValueChange={(value) => {
                    console.log("DeliveryFormBasicFields - ClientId changed to:", value);
                    field.onChange(value);
                  }}
                  placeholder="Selecione um cliente"
                  disableAutoSelect={isEditMode}
                  showCreateOption={true}
                  createOptionLabel="Cadastrar novo cliente"
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
      
      <div className="space-y-4">
        <FormField
          control={control}
          name="pickupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selecione quem retirou na transportadora</FormLabel>
              <FormControl>
                <SearchableSelect
                  options={employeeOptions}
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value) {
                      setValue('pickupName', '');
                    }
                  }}
                  placeholder="Selecione um funcionário da transportadora"
                  emptyMessage="Nenhum funcionário encontrado"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="pickupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ou informe nome de quem retirou</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome de quem retirou na transportadora"
                  disabled={!!getValues().pickupId}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value) {
                      setValue('pickupId', '');
                    }
                  }}
                />
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
            <FormLabel>Recebedor</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Nome da pessoa que recebeu a mercadoria" 
              />
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
            <FormLabel>Ou selecione o recebedor</FormLabel>
            <FormControl>
              <SearchableSelect
                options={employeeOptions}
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value) {
                    setValue('receiver', '');
                  }
                }}
                placeholder="Selecione um funcionário que recebeu"
                emptyMessage="Nenhum funcionário encontrado"
              />
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
