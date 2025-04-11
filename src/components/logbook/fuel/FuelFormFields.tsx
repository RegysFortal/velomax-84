
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { FuelFormValues } from '../hooks/useFuelRecordForm';
import { Vehicle } from '@/types';

interface FuelFormFieldsProps {
  form: UseFormReturn<FuelFormValues>;
  vehicles: Vehicle[];
}

export function FuelFormFields({ form, vehicles }: FuelFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="vehicleId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Veículo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um veículo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.model} - {vehicle.plate}
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
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="odometer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hodômetro</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Hodômetro" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="liters"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Litros</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Litros" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="pricePerLiter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço por Litro</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Preço por Litro" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="totalCost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custo Total</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Custo Total" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="fuelType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Combustível</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="gasoline">Gasolina</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="ethanol">Etanol</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isFull"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>Tanque Cheio?</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="station"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Posto</FormLabel>
            <FormControl>
              <Input placeholder="Nome do Posto" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notas</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Informações adicionais"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
