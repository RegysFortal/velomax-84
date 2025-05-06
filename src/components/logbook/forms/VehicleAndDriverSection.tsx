
import React from 'react';
import { Employee, Vehicle } from '@/types';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { logbookFormSchema } from '../schema';

interface VehicleAndDriverSectionProps {
  form: UseFormReturn<z.infer<typeof logbookFormSchema>>;
  vehicles: Vehicle[];
  drivers: Employee[];
  assistants: Employee[];
}

export function VehicleAndDriverSection({ 
  form, 
  vehicles, 
  drivers, 
  assistants 
}: VehicleAndDriverSectionProps) {
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
                    {vehicle.plate} - {vehicle.model}
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
        name="driverId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Motorista</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um motorista" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
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
        name="assistantId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ajudante</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um ajudante" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no_assistant">Nenhum</SelectItem> {/* Changed from "none" to "no_assistant" */}
                {assistants.map((assistant) => (
                  <SelectItem key={assistant.id} value={assistant.id}>
                    {assistant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
