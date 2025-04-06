
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLogbook } from '@/contexts/LogbookContext';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const tireMaintenanceSchema = z.object({
  vehicleId: z.string({ required_error: 'Veículo é obrigatório' }),
  maintenanceType: z.enum(['replacement', 'puncture', 'purchase'], {
    required_error: 'Tipo de manutenção é obrigatório'
  }),
  date: z.string({ required_error: 'Data é obrigatória' }),
  tirePosition: z.string().optional(),
  tireSize: z.string().optional(),
  brand: z.string().optional(),
  cost: z.string().optional(),
  mileage: z.string().optional(),
  description: z.string().optional(),
});

type TireMaintenanceFormValues = z.infer<typeof tireMaintenanceSchema>;

interface TireMaintenanceFormProps {
  maintenance?: any;
  onComplete: () => void;
  onCancel: () => void;
}

export function TireMaintenanceForm({ maintenance, onComplete, onCancel }: TireMaintenanceFormProps) {
  const { vehicles, addTireMaintenance, updateTireMaintenance } = useLogbook();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<TireMaintenanceFormValues>({
    resolver: zodResolver(tireMaintenanceSchema),
    defaultValues: {
      vehicleId: '',
      maintenanceType: 'replacement',
      date: format(new Date(), 'yyyy-MM-dd'),
      tirePosition: '',
      tireSize: '',
      brand: '',
      cost: '',
      mileage: '',
      description: '',
    }
  });

  useEffect(() => {
    if (maintenance) {
      setIsEditing(true);
      form.reset({
        vehicleId: maintenance.vehicleId,
        maintenanceType: maintenance.maintenanceType,
        date: maintenance.date,
        tirePosition: maintenance.tirePosition || '',
        tireSize: maintenance.tireSize || '',
        brand: maintenance.brand || '',
        cost: maintenance.cost ? maintenance.cost.toString() : '',
        mileage: maintenance.mileage ? maintenance.mileage.toString() : '',
        description: maintenance.description || '',
      });
    }
  }, [maintenance, form]);

  const onSubmit = async (data: TireMaintenanceFormValues) => {
    try {
      const formattedData = {
        ...data,
        cost: data.cost ? parseFloat(data.cost) : undefined,
        mileage: data.mileage ? parseInt(data.mileage) : undefined,
      };

      if (isEditing && maintenance) {
        await updateTireMaintenance(maintenance.id, formattedData);
        toast.success("Manutenção de pneu atualizada com sucesso");
      } else {
        await addTireMaintenance({
          id: uuidv4(),
          ...formattedData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        toast.success("Manutenção de pneu registrada com sucesso");
      }
      
      onComplete();
    } catch (error) {
      console.error("Erro ao salvar manutenção de pneu:", error);
      toast.error("Erro ao salvar manutenção de pneu");
    }
  };

  const watchMaintenanceType = form.watch('maintenanceType');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Veículo</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maintenanceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Manutenção</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="replacement">Troca de Pneu</SelectItem>
                    <SelectItem value="puncture">Pneu Furado</SelectItem>
                    <SelectItem value="purchase">Compra de Pneu</SelectItem>
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

        {(watchMaintenanceType === 'replacement' || watchMaintenanceType === 'puncture') && (
          <FormField
            control={form.control}
            name="tirePosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posição do Pneu</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a posição" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="frontLeft">Dianteiro Esquerdo</SelectItem>
                    <SelectItem value="frontRight">Dianteiro Direito</SelectItem>
                    <SelectItem value="rearLeft">Traseiro Esquerdo</SelectItem>
                    <SelectItem value="rearRight">Traseiro Direito</SelectItem>
                    <SelectItem value="spare">Estepe</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tireSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tamanho do Pneu</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: 195/65R15" />
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
                  <Input {...field} placeholder="Ex: Michelin" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...field} 
                    placeholder="0.00" 
                  />
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
                <FormLabel>Odômetro (km)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    placeholder="0" 
                  />
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
                <Textarea 
                  {...field} 
                  placeholder="Detalhes adicionais" 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? 'Atualizar' : 'Registrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
