
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  plate: z.string().min(1, { message: 'Placa é obrigatória' }),
  model: z.string().min(1, { message: 'Modelo é obrigatório' }),
  year: z.string().min(1, { message: 'Ano é obrigatório' }),
  color: z.string().min(1, { message: 'Cor é obrigatória' }),
  capacity: z.string().optional(),
});

interface VehicleInfoFormProps {
  data?: any;
  onComplete: (data: any) => void;
}

export function VehicleInfoForm({ data, onComplete }: VehicleInfoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate: data?.plate || '',
      model: data?.model || '',
      year: data?.year || '',
      color: data?.color || '',
      capacity: data?.capacity || '',
    },
  });

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    onComplete({
      vehicle: {
        plate: formData.plate,
        model: formData.model,
        year: formData.year,
        color: formData.color,
        capacity: formData.capacity,
      }
    });
  };

  return (
    <ScrollArea className="max-h-[450px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="plate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa</FormLabel>
                  <FormControl>
                    <Input placeholder="Placa do veículo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Modelo do veículo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <FormControl>
                    <Input placeholder="Ano do veículo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <Input placeholder="Cor do veículo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidade de Carga (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 1.5 ton" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
