
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogbook } from '@/contexts/LogbookContext';
import { DialogFooter } from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

// Schema de validação do formulário
const formSchema = z.object({
  vehicleId: z.string({
    required_error: "Selecione um veículo",
  }),
  date: z.string({
    required_error: "Insira a data",
  }),
  odometer: z.coerce.number({
    required_error: "Insira o odômetro atual",
    invalid_type_error: "Insira um número válido",
  }).positive(),
  liters: z.coerce.number({
    required_error: "Insira a quantidade de litros",
    invalid_type_error: "Insira um número válido",
  }).positive(),
  pricePerLiter: z.coerce.number({
    required_error: "Insira o preço por litro",
    invalid_type_error: "Insira um número válido",
  }).positive(),
});

type FormValues = z.infer<typeof formSchema>;

interface FuelRecordFormProps {
  recordId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const FuelRecordForm = ({ recordId, onSuccess, onCancel }: FuelRecordFormProps) => {
  const { 
    vehicles,
    getFuelRecordById,
    addFuelRecord,
    updateFuelRecord
  } = useLogbook();

  // Se temos um ID, busca o registro para edição
  const existingRecord = recordId ? getFuelRecordById(recordId) : undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: existingRecord ? {
      vehicleId: existingRecord.vehicleId,
      date: existingRecord.date,
      odometer: existingRecord.odometer,
      liters: existingRecord.liters,
      pricePerLiter: existingRecord.pricePerLiter,
    } : {
      vehicleId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      odometer: 0,
      liters: 0,
      pricePerLiter: 0,
    }
  });

  // Calcular o valor total do abastecimento
  const watchLiters = form.watch('liters');
  const watchPricePerLiter = form.watch('pricePerLiter');
  const totalValue = (watchLiters || 0) * (watchPricePerLiter || 0);

  const onSubmit = async (data: FormValues) => {
    try {
      // Calcular o valor total
      const totalCost = data.liters * data.pricePerLiter;
      
      if (existingRecord) {
        await updateFuelRecord(existingRecord.id, {
          ...data,
          totalCost
        });
      } else {
        await addFuelRecord({
          vehicleId: data.vehicleId,
          date: data.date,
          odometer: data.odometer,
          liters: data.liters,
          pricePerLiter: data.pricePerLiter,
          totalCost,
          fuelType: 'flex' // Default fuel type
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar registro de abastecimento:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.plate} - {vehicle.model} ({vehicle.brand})
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data do abastecimento</FormLabel>
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
                <FormLabel>Odômetro (km)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} />
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
                <FormLabel>Litros abastecidos</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
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
                <FormLabel>Preço por litro (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-muted p-4 rounded-md">
          <div className="flex justify-between">
            <span className="font-medium">Total do abastecimento:</span>
            <span className="font-bold">R$ {totalValue.toFixed(2)}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {existingRecord ? 'Atualizar registro' : 'Registrar abastecimento'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default FuelRecordForm;
