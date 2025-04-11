
import React from 'react';
import { useClients } from '@/contexts';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { BudgetFormValues } from './BudgetFormSchema';
import { Budget, BudgetDeliveryType } from '@/types/budget';

interface ClientInfoSectionProps {
  form: UseFormReturn<BudgetFormValues>;
}

export function ClientInfoSection({ form }: ClientInfoSectionProps) {
  const { clients } = useClients();
  const watchHasCollection = form.watch("hasCollection");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="deliveryType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Entrega</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de entrega" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-52 overflow-y-auto">
                <SelectItem value="standard">Normal</SelectItem>
                <SelectItem value="emergency">Emergencial</SelectItem>
                <SelectItem value="exclusive">Veículo Exclusivo</SelectItem>
                <SelectItem value="saturday">Sábado</SelectItem>
                <SelectItem value="sundayHoliday">Domingo/Feriado</SelectItem>
                <SelectItem value="difficultAccess">Difícil Acesso</SelectItem>
                <SelectItem value="metropolitanRegion">Região Metropolitana</SelectItem>
                <SelectItem value="doorToDoorInterior">Porta a Porta Interior</SelectItem>
                <SelectItem value="reshipment">Redespacho</SelectItem>
                <SelectItem value="normalBiological">Biológico Normal</SelectItem>
                <SelectItem value="infectiousBiological">Biológico Infeccioso</SelectItem>
                <SelectItem value="tracked">Veículo Rastreado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="merchandiseValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor da Mercadoria (R$)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                placeholder="Digite o valor da mercadoria"
                {...field} 
                value={field.value === undefined || field.value === null ? '' : field.value}
                onChange={e => {
                  const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="hasCollection"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Coleta</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Inclui serviço de coleta
                </p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasDelivery"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Entrega</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Inclui serviço de entrega
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>

      {watchHasCollection && (
        <FormField
          control={form.control}
          name="collectionLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local de Coleta</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
