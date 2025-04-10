
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { TireMaintenance } from '@/types';

const tireMaintenanceSchema = z.object({
  date: z.string({ required_error: 'Data é obrigatória' }),
  maintenanceType: z.enum(['replacement', 'puncture', 'purchase'], {
    required_error: 'Tipo de manutenção é obrigatório',
  }),
  mileage: z.string({ required_error: 'Quilometragem é obrigatória' }).refine(val => !isNaN(parseInt(val)), {
    message: 'Quilometragem deve ser um número',
  }),
  tirePosition: z.string({ required_error: 'Posição do pneu é obrigatória' }),
  cost: z.string({ required_error: 'Custo é obrigatório' }).refine(val => !isNaN(parseFloat(val)), {
    message: 'Custo deve ser um número',
  }),
  brand: z.string().optional(),
  tireSize: z.string().optional(),
  description: z.string().optional(),
  provider: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof tireMaintenanceSchema>;

export interface TireMaintenanceFormProps {
  maintenance?: TireMaintenance | null;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export function TireMaintenanceForm({ maintenance, onSubmit, onCancel }: TireMaintenanceFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(tireMaintenanceSchema),
    defaultValues: {
      date: maintenance?.date || '',
      maintenanceType: (maintenance?.maintenanceType as any) || 'replacement',
      mileage: maintenance?.mileage?.toString() || '',
      tirePosition: maintenance?.tirePosition || '',
      cost: maintenance?.cost?.toString() || '',
      brand: maintenance?.brand || '',
      tireSize: maintenance?.tireSize || '',
      description: maintenance?.description || '',
      provider: maintenance?.provider || '',
      notes: maintenance?.notes || '',
    },
  });

  const handleSubmit = (data: FormData) => {
    // Ensure the maintenanceType is one of the allowed values
    const maintenanceType = data.maintenanceType as "replacement" | "puncture" | "purchase";
  
    onSubmit({ ...data, maintenanceType });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
          name="maintenanceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Manutenção</FormLabel>
              <FormControl>
                <select {...field} className="border rounded px-2 py-1 w-full">
                  <option value="replacement">Substituição</option>
                  <option value="puncture">Furo</option>
                  <option value="purchase">Compra</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quilometragem</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tirePosition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posição do Pneu</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tireSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tamanho do Pneu</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fornecedor</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
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
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
