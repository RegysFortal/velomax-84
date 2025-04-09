import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogbook } from '@/contexts/LogbookContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Maintenance, Vehicle } from '@/types';
import { DialogFooter } from '@/components/ui/dialog';

const maintenanceFormSchema = z.object({
  vehicleId: z.string({
    required_error: "Selecione um veículo",
  }),
  maintenanceType: z.string({
    required_error: "Selecione o tipo de manutenção",
  }),
  date: z.string({
    required_error: "Informe a data da manutenção",
  }),
  odometer: z.coerce.number({
    required_error: "Informe a quilometragem",
  }).min(0, {
    message: "A quilometragem deve ser um número positivo",
  }),
  description: z.string({
    required_error: "Informe uma descrição",
  }).min(3, {
    message: "A descrição deve ter pelo menos 3 caracteres",
  }),
  cost: z.coerce.number({
    required_error: "Informe o custo",
  }).min(0, {
    message: "O custo deve ser um número positivo",
  }),
  provider: z.string().optional(),
  invoiceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

interface GeneralMaintenanceFormProps {
  maintenance?: Maintenance | null;
  onComplete: () => void;
}

export function GeneralMaintenanceForm({ maintenance, onComplete }: GeneralMaintenanceFormProps) {
  const { vehicles, addMaintenance, updateMaintenance } = useLogbook();
  
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      vehicleId: maintenance?.vehicleId || '',
      maintenanceType: maintenance?.maintenanceType || '',
      date: maintenance?.date || new Date().toISOString().split('T')[0],
      odometer: maintenance?.odometer || 0,
      description: maintenance?.description || '',
      cost: maintenance?.cost || 0,
      provider: maintenance?.provider || '',
      invoiceNumber: maintenance?.invoiceNumber || '',
      notes: maintenance?.notes || '',
    }
  });

  const onSubmit = (values: MaintenanceFormValues) => {
    // Make sure all required fields are present
    const maintenanceData = {
      vehicleId: values.vehicleId,
      maintenanceType: values.maintenanceType,
      date: values.date,
      odometer: values.odometer,
      description: values.description,
      cost: values.cost,
      provider: values.provider || '',
      invoiceNumber: values.invoiceNumber || '',
      notes: values.notes || '',
    };
    
    if (maintenance) {
      updateMaintenance(maintenance.id, maintenanceData);
    } else {
      addMaintenance(maintenanceData);
    }
    onComplete();
  };

  const activeVehicles = vehicles.filter(v => v.status !== 'inactive');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <ScrollArea className="h-[70vh] pr-4">
          <div className="pr-2">
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
                      {activeVehicles.map((vehicle) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maintenanceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Manutenção</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="oil_change">Troca de Óleo</SelectItem>
                        <SelectItem value="brakes">Freios</SelectItem>
                        <SelectItem value="engine">Motor</SelectItem>
                        <SelectItem value="transmission">Transmissão</SelectItem>
                        <SelectItem value="filters">Filtros</SelectItem>
                        <SelectItem value="electrical">Elétrico</SelectItem>
                        <SelectItem value="cooling">Arrefecimento</SelectItem>
                        <SelectItem value="suspension">Suspensão</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="odometer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Odômetro (km)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                    <FormLabel>Custo (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prestador de Serviço</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Nota Fiscal</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onComplete}>
                Cancelar
              </Button>
              <Button type="submit">
                {maintenance ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </div>
        </ScrollArea>
      </form>
    </Form>
  );
}
