import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FuelRecord } from '@/types';
import { useLogbook } from '@/contexts/LogbookContext';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  vehicleId: z.string().min(1, {
    message: "Selecione um veículo.",
  }),
  date: z.string().min(1, {
    message: "Selecione uma data.",
  }),
  odometer: z.coerce.number().min(0, {
    message: "O hodômetro deve ser um número positivo.",
  }),
  liters: z.coerce.number().min(0, {
    message: "O número de litros deve ser um número positivo.",
  }),
  pricePerLiter: z.coerce.number().min(0, {
    message: "O preço por litro deve ser um número positivo.",
  }),
  totalCost: z.coerce.number().min(0, {
    message: "O custo total deve ser um número positivo.",
  }),
  fuelType: z.enum(['gasoline', 'diesel', 'ethanol', 'other'], {
    required_error: "Selecione um tipo de combustível.",
  }),
  isFull: z.boolean().default(true),
  station: z.string().min(2, {
    message: "O nome do posto deve ter pelo menos 2 caracteres.",
  }),
  notes: z.string().optional(),
});

interface FuelRecordFormProps {
  initialData?: FuelRecord;
  recordId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const FuelRecordForm = ({ 
  initialData, 
  recordId, 
  onSuccess, 
  onCancel 
}: FuelRecordFormProps) => {
  const { 
    vehicles, 
    addFuelRecord, 
    updateFuelRecord, 
    getFuelRecordById 
  } = useLogbook();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: initialData?.vehicleId || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      odometer: initialData?.odometer || 0,
      liters: initialData?.liters || 0,
      pricePerLiter: initialData?.pricePerLiter || 0,
      totalCost: initialData?.totalCost || 0,
      fuelType: initialData?.fuelType || 'gasoline',
      isFull: initialData?.isFull || true,
      station: initialData?.station || '',
      notes: initialData?.notes || '',
    },
  });

  useEffect(() => {
    if (recordId) {
      const record = getFuelRecordById(recordId);
      if (record) {
        form.setValue("vehicleId", record.vehicleId);
        form.setValue("date", record.date);
        form.setValue("odometer", record.odometer);
        form.setValue("liters", record.liters);
        form.setValue("pricePerLiter", record.pricePerLiter);
        form.setValue("totalCost", record.totalCost);
        form.setValue("fuelType", record.fuelType);
        form.setValue("isFull", record.isFull);
        form.setValue("station", record.station);
        form.setValue("notes", record.notes || "");
      }
    }
  }, [recordId, getFuelRecordById, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const fuelData = {
      vehicleId: data.vehicleId,
      date: data.date,
      odometer: Number(data.odometer),
      liters: Number(data.liters),
      pricePerLiter: Number(data.pricePerLiter),
      totalCost: Number(data.totalCost),
      fuelType: data.fuelType,
      isFull: data.isFull,
      station: data.station,
      notes: data.notes,
    };

    if (recordId) {
      updateFuelRecord(recordId, fuelData);
    } else {
      addFuelRecord(fuelData);
    }
    onSuccess();
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      {vehicle.model} - {vehicle.licensePlate}
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
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {recordId ? 'Atualizar' : 'Registrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FuelRecordForm;
