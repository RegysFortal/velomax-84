
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogbookEntry, Employee } from '@/types';
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
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  vehicleId: z.string().min(1, {
    message: "Selecione um veículo.",
  }),
  driverId: z.string().min(1, {
    message: "Selecione um motorista.",
  }),
  assistantId: z.string().optional(),
  date: z.string().min(1, {
    message: "Selecione uma data.",
  }),
  departureTime: z.string().min(1, {
    message: "Informe a hora de saída.",
  }),
  departureOdometer: z.coerce.number().min(0, {
    message: "Informe a km de saída.",
  }),
  returnTime: z.string().optional(),
  endOdometer: z.coerce.number().optional(),
  notes: z.string().optional(),
});

interface LogbookEntryFormProps {
  initialData?: LogbookEntry;
  entryId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const LogbookEntryForm = ({ 
  initialData, 
  entryId, 
  onSuccess, 
  onCancel 
}: LogbookEntryFormProps) => {
  const { 
    vehicles, 
    employees, 
    addLogbookEntry, 
    updateLogbookEntry, 
    getLogbookEntryById 
  } = useLogbook();

  const drivers = employees.filter(employee => 
    employee.position === 'driver' || employee.position === 'Driver'
  );
  
  const assistants = employees.filter(employee => 
    employee.position === 'assistant' || employee.position === 'Assistant'
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: initialData?.vehicleId || "",
      driverId: initialData?.driverId || "",
      assistantId: initialData?.assistantId || "none", // Changed from "" to "none"
      date: initialData?.date || new Date().toISOString().split('T')[0],
      departureTime: initialData?.departureTime || "",
      departureOdometer: initialData?.departureOdometer || 0,
      returnTime: initialData?.returnTime || "",
      endOdometer: initialData?.endOdometer || undefined,
      notes: initialData?.notes || "",
    },
  });

  useEffect(() => {
    if (entryId) {
      const entry = getLogbookEntryById(entryId);
      if (entry) {
        form.setValue("vehicleId", entry.vehicleId);
        form.setValue("driverId", entry.driverId);
        form.setValue("assistantId", entry.assistantId || "none"); // Changed from "" to "none"
        form.setValue("date", entry.date);
        form.setValue("departureTime", entry.departureTime);
        form.setValue("departureOdometer", entry.departureOdometer);
        form.setValue("returnTime", entry.returnTime || "");
        form.setValue("endOdometer", entry.endOdometer || undefined);
        form.setValue("notes", entry.notes || "");
      }
    }
  }, [entryId, getLogbookEntryById, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (entryId) {
      updateLogbookEntry(entryId, {
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        assistantId: data.assistantId === "none" ? undefined : data.assistantId, // Changed from "" to "none"
        departureTime: data.departureTime,
        departureOdometer: Number(data.departureOdometer),
        date: data.date,
        returnTime: data.returnTime === "" ? undefined : data.returnTime,
        endOdometer: data.endOdometer ? Number(data.endOdometer) : undefined,
        notes: data.notes,
        status: data.returnTime ? 'completed' : 'ongoing',
      });
    } else {
      addLogbookEntry({
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        assistantId: data.assistantId === "none" ? undefined : data.assistantId, // Changed from "" to "none"
        departureTime: data.departureTime,
        departureOdometer: Number(data.departureOdometer),
        date: data.date,
        tripDistance: data.endOdometer && Number(data.endOdometer) > Number(data.departureOdometer) ? 
          Number(data.endOdometer) - Number(data.departureOdometer) : undefined,
        returnTime: data.returnTime === "" ? undefined : data.returnTime,
        endOdometer: data.endOdometer ? Number(data.endOdometer) : undefined,
        notes: data.notes,
        status: data.returnTime ? 'completed' : 'ongoing',
      });
    }
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
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
                      <SelectItem value="none">Nenhum</SelectItem> {/* Changed from "" to "none" */}
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
                  <FormLabel>Hora de Saída</FormLabel>
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
                  <FormLabel>Km de Saída</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
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
                  <FormLabel>Hora de Retorno</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endOdometer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Km de Retorno</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
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
                    <Textarea placeholder="Alguma observação?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {entryId ? 'Atualizar' : 'Registrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LogbookEntryForm;
