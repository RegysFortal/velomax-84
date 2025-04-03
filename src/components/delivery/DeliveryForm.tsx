import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from '@/hooks/use-toast';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts/ClientsContext';
import { useCities } from '@/contexts/CitiesContext';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FormSchema = z.object({
  clientId: z.string().min(1, {
    message: "Selecione um cliente",
  }),
  minuteNumber: z.string().min(1, {
    message: "Número da minuta é obrigatório",
  }),
  deliveryDate: z.string().min(1, {
    message: "Data da entrega é obrigatória",
  }),
  deliveryTime: z.string().optional(),
  receiver: z.string().min(1, {
    message: "Nome do recebedor é obrigatório",
  }),
  weight: z.number(),
  deliveryType: z.string().min(1, {
    message: "Tipo de entrega é obrigatório",
  }),
  cargoType: z.string().min(1, {
    message: "Tipo de carga é obrigatório",
  }),
  cargoValue: z.number().optional(),
  notes: z.string().optional(),
  cityId: z.string().optional(),
});

interface FormData extends z.infer<typeof FormSchema> {}

export function DeliveryForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const { addDelivery, calculateFreight, isDoorToDoorDelivery, checkMinuteNumberExists } = useDeliveries();
  const { clients } = useClients();
  const { cities } = useCities();
  const [showCitySelect, setShowCitySelect] = useState(false);
  const [showCargoValue, setShowCargoValue] = useState(false);
  const [totalFreight, setTotalFreight] = useState(0);
  const [minuteNumberDuplicate, setMinuteNumberDuplicate] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clientId: "",
      minuteNumber: format(new Date(), 'yyyyMMddHHmmss'),
      deliveryDate: format(new Date(), 'yyyy-MM-dd'),
      deliveryTime: format(new Date(), 'HH:mm'),
      receiver: "",
      weight: 1,
      deliveryType: "standard",
      cargoType: "standard",
      cargoValue: 0,
      notes: "",
      cityId: "",
    },
  });

  const watchClient = form.watch('clientId');
  const watchDeliveryType = form.watch('deliveryType');
  const watchWeight = form.watch('weight');
  const watchCargoType = form.watch('cargoType');
  const watchMinuteNumber = form.watch('minuteNumber');
  const watchCargoValue = form.watch('cargoValue');
  const watchCityId = form.watch('cityId');

  // Show city select only when door to door delivery type is selected
  // And hide it specifically for 'exclusive' type
  useEffect(() => {
    if (watchDeliveryType) {
      const isDoorToDoor = isDoorToDoorDelivery(watchDeliveryType);
      const isExclusive = watchDeliveryType === 'exclusive';
      setShowCitySelect(isDoorToDoor && !isExclusive);
      
      // Only show cargo value field for "reshipment" delivery type
      setShowCargoValue(watchDeliveryType === 'reshipment');
    }
  }, [watchDeliveryType, isDoorToDoorDelivery]);

  // Check for duplicate minute number
  useEffect(() => {
    if (watchMinuteNumber && watchClient) {
      const isDuplicate = checkMinuteNumberExists(watchMinuteNumber, watchClient);
      setMinuteNumberDuplicate(isDuplicate);
    }
  }, [watchMinuteNumber, watchClient, checkMinuteNumberExists]);

  // Calculate freight whenever relevant fields change
  useEffect(() => {
    if (watchClient && watchWeight && watchDeliveryType && watchCargoType) {
      const weight = parseFloat(watchWeight.toString());
      const cargoValue = watchCargoValue ? parseFloat(watchCargoValue.toString()) : 0;
      
      const calculatedFreight = calculateFreight(
        watchClient,
        weight,
        watchDeliveryType,
        watchCargoType,
        cargoValue,
        undefined,
        watchCityId
      );
      
      setTotalFreight(calculatedFreight);
    }
  }, [watchClient, watchWeight, watchDeliveryType, watchCargoType, watchCargoValue, watchCityId, calculateFreight]);

  const onSubmit = (data: FormData) => {
    // If it's a duplicate minute number and the dialog is not open, show confirmation dialog
    if (minuteNumberDuplicate && !dialogOpen) {
      setDialogOpen(true);
      return;
    }
    
    try {
      // Convert string inputs to appropriate types
      const formattedData = {
        ...data,
        weight: parseFloat(data.weight.toString()),
        cargoValue: data.cargoValue ? parseFloat(data.cargoValue.toString()) : 0,
        totalFreight: totalFreight,
      };

      addDelivery(formattedData);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao registrar entrega",
        description: "Ocorreu um erro ao salvar a entrega. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const confirmDuplicateMinute = () => {
    setDialogOpen(false);
    const data = form.getValues();
    try {
      const formattedData = {
        ...data,
        weight: parseFloat(data.weight.toString()),
        cargoValue: data.cargoValue ? parseFloat(data.cargoValue.toString()) : 0,
        totalFreight: totalFreight,
      };

      addDelivery(formattedData);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao registrar entrega",
        description: "Ocorreu um erro ao salvar a entrega. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client selection field */}
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Cliente</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Minute Number field - Moved below client selection */}
              <FormField
                control={form.control}
                name="minuteNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Minuta</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Minuta" />
                    </FormControl>
                    {minuteNumberDuplicate && (
                      <p className="text-sm text-destructive flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Minuta já cadastrada para este cliente
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date and time fields */}
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Entrega</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora da Entrega</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Delivery Type field */}
              <FormField
                control={form.control}
                name="deliveryType"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Tipo de Entrega</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de entrega" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Normal</SelectItem>
                        <SelectItem value="emergency">Emergencial</SelectItem>
                        <SelectItem value="saturday">Sábado</SelectItem>
                        <SelectItem value="exclusive">Exclusivo</SelectItem>
                        <SelectItem value="difficultAccess">Difícil Acesso</SelectItem>
                        <SelectItem value="metropolitanRegion">Região Metropolitana</SelectItem>
                        <SelectItem value="sundayHoliday">Domingo/Feriado</SelectItem>
                        <SelectItem value="normalBiological">Biológico Normal</SelectItem>
                        <SelectItem value="infectiousBiological">Biológico Infeccioso</SelectItem>
                        <SelectItem value="tracked">Rastreado</SelectItem>
                        <SelectItem value="doorToDoorInterior">Porta a Porta Interior</SelectItem>
                        <SelectItem value="reshipment">Redespacho por Transportadora</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show City Selection only for door to door deliveries */}
              {showCitySelect && (
                <FormField
                  control={form.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Cidade</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a cidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name} - {city.distance} km
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Weight and Cargo Type */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (Kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cargoType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Carga</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de carga" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Padrão</SelectItem>
                        <SelectItem value="perishable">Perecível</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show Cargo Value only for reshipment deliveries */}
              {showCargoValue && (
                <FormField
                  control={form.control}
                  name="cargoValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Carga (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Receiver field */}
              <FormField
                control={form.control}
                name="receiver"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Recebedor</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome de quem recebeu" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes field */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Observações adicionais" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Alert className="bg-muted">
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <span>Total do frete:</span>
                  <span className="font-bold text-lg">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(totalFreight)}
                  </span>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onSuccess()}>
                Cancelar
              </Button>
              <Button type="submit">
                Registrar Entrega
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>

      {/* Confirmation dialog for duplicate minute number */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Minuta já cadastrada</DialogTitle>
            <DialogDescription>
              Uma minuta com este número já foi registrada para este cliente. 
              Deseja continuar mesmo assim?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Não
            </Button>
            <Button onClick={confirmDuplicateMinute}>
              Sim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
