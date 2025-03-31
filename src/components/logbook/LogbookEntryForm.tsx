
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogbook } from '@/contexts/LogbookContext';
import { DialogFooter } from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';

// Schema de validação do formulário
const formSchema = z.object({
  vehicleId: z.string({
    required_error: "Selecione um veículo",
  }),
  driverId: z.string({
    required_error: "Selecione um motorista",
  }),
  assistantId: z.string().optional(),
  date: z.string({
    required_error: "Insira a data",
  }),
  departureTime: z.string({
    required_error: "Insira a hora de saída",
  }),
  departureOdometer: z.coerce.number({
    required_error: "Insira o odômetro de saída",
    invalid_type_error: "Insira um número válido",
  }).positive(),
  returnTime: z.string().optional(),
  returnOdometer: z.coerce.number().positive().optional(),
  notes: z.string().max(300).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LogbookEntryFormProps {
  entryId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const LogbookEntryForm = ({ entryId, onSuccess, onCancel }: LogbookEntryFormProps) => {
  const { 
    vehicles,
    employees,
    getLogbookEntryById,
    addLogbookEntry,
    updateLogbookEntry
  } = useLogbook();

  // Se temos um ID, busca a entrada para edição
  const existingEntry = entryId ? getLogbookEntryById(entryId) : undefined;

  // Motoristas (apenas funcionários com role = 'driver')
  const drivers = employees.filter(emp => emp.role === 'driver');
  
  // Assistentes (apenas funcionários com role = 'assistant')
  const assistants = employees.filter(emp => emp.role === 'assistant');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: existingEntry ? {
      vehicleId: existingEntry.vehicleId,
      driverId: existingEntry.driverId,
      assistantId: existingEntry.assistantId || "",
      date: existingEntry.date,
      departureTime: existingEntry.departureTime,
      departureOdometer: existingEntry.departureOdometer,
      returnTime: existingEntry.returnTime || "",
      returnOdometer: existingEntry.returnOdometer || undefined,
      notes: existingEntry.notes || "",
    } : {
      vehicleId: "",
      driverId: "",
      assistantId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      departureTime: format(new Date(), "HH:mm"),
      departureOdometer: 0,
      returnTime: "",
      returnOdometer: undefined,
      notes: "",
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (existingEntry) {
        await updateLogbookEntry(existingEntry.id, {
          ...data,
          returnOdometer: data.returnOdometer || undefined,
        });
      } else {
        await addLogbookEntry({
          vehicleId: data.vehicleId,
          driverId: data.driverId,
          assistantId: data.assistantId || undefined,
          date: data.date,
          departureTime: data.departureTime,
          departureOdometer: data.departureOdometer,
          returnTime: data.returnTime || undefined,
          returnOdometer: data.returnOdometer || undefined,
          notes: data.notes || ""
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {vehicle.plate} - {vehicle.model} ({vehicle.make})
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
                    {drivers.map(driver => (
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
                <FormLabel>Ajudante (opcional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um ajudante" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {assistants.map(assistant => (
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
            name="departureTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de saída</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departureOdometer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odômetro saída (km)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="returnTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de retorno (opcional)</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormDescription>
                  Preencha apenas quando o veículo retornar
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="returnOdometer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odômetro retorno (km)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="1" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                  />
                </FormControl>
                <FormDescription>
                  Preencha apenas quando o veículo retornar
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea placeholder="Observações sobre a viagem..." {...field} />
              </FormControl>
              <FormDescription>
                Máximo de 300 caracteres
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {existingEntry ? 'Atualizar registro' : 'Criar registro'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default LogbookEntryForm;
