
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { Control } from 'react-hook-form';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useAuth } from '@/contexts/AuthContext';

interface DeliveryFormBasicFieldsProps {
  control: Control<any>;
  isEditMode: boolean;
}

export function DeliveryFormBasicFields({ control, isEditMode }: DeliveryFormBasicFieldsProps) {
  const { users } = useAuth();
  
  // Create options for employee selection
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
              <FormLabel>Selecione quem retirou</FormLabel>
              <FormControl>
                <SearchableSelect
                  options={employeeOptions}
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Clear manual name field if employee is selected
                    if (value) {
                      control.setValue('pickupName', '');
                    }
                  }}
                  placeholder="Selecione um funcionário"
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
              <FormLabel>Ou informe outro nome de quem retirou</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome de quem retirou"
                  disabled={!!control.getValues().pickupId}
                  onChange={(e) => {
                    field.onChange(e);
                    // Clear employee selection if manual name is entered
                    if (e.target.value) {
                      control.setValue('pickupId', '');
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
            <FormLabel>Recebedor Final</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome do recebedor final" />
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
            <FormLabel>Ou selecione um funcionário que recebeu</FormLabel>
            <FormControl>
              <SearchableSelect
                options={employeeOptions}
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  // Clear manual receiver if employee is selected
                  if (value) {
                    control.setValue('receiver', '');
                  }
                }}
                placeholder="Selecione um funcionário"
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
