import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts/ClientsContext';
import { useCities } from '@/contexts/CitiesContext';
import { Delivery } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Textarea } from '@/components/ui/textarea';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { toast } from "sonner";

const deliveryFormSchema = z.object({
  clientId: z.string({ required_error: 'Cliente é obrigatório' }),
  minuteNumber: z.string().optional(),
  deliveryDate: z.string({ required_error: 'Data de entrega é obrigatória' }),
  deliveryTime: z.string({ required_error: 'Hora de entrega é obrigatória' }),
  receiver: z.string({ required_error: 'Destinatário é obrigatório' }).min(3, 'Mínimo de 3 caracteres'),
  weight: z.string({ required_error: 'Peso é obrigatório' }).refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Peso deve ser maior que zero',
  }),
  packages: z.string({ required_error: 'Quantidade de volumes é obrigatória' }).refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: 'Volumes devem ser maior que zero',
  }),
  deliveryType: z.string({ required_error: 'Tipo de entrega é obrigatório' }),
  cargoType: z.string({ required_error: 'Tipo de carga é obrigatório' }),
  cargoValue: z.string().optional(),
  cityId: z.string().optional(),
  notes: z.string().optional(),
  occurrence: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

interface DeliveryFormProps {
  delivery?: Delivery | null;
  onComplete: () => void;
}

export const DeliveryForm = ({ delivery, onComplete }: DeliveryFormProps) => {
  const { addDelivery, updateDelivery, calculateFreight, isDoorToDoorDelivery, checkMinuteNumberExists } = useDeliveries();
  const { clients } = useClients();
  const { cities } = useCities();
  const { addLog } = useActivityLog();
  const [showDoorToDoor, setShowDoorToDoor] = useState(false);
  const [freight, setFreight] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialClientId, setInitialClientId] = useState('');

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      clientId: '',
      minuteNumber: '',
      deliveryDate: format(new Date(), 'yyyy-MM-dd'),
      deliveryTime: format(new Date(), 'HH:mm'),
      receiver: '',
      weight: '',
      packages: '',
      deliveryType: 'standard',
      cargoType: 'standard',
      cargoValue: '',
      cityId: '',
      notes: '',
      occurrence: '',
    },
  });

  useEffect(() => {
    if (delivery) {
      console.log("DeliveryForm - Entrega a ser editada:", delivery);
      console.log("DeliveryForm - Cliente ID:", delivery.clientId);
      console.log("DeliveryForm - Clientes disponíveis:", clients);
    }
  }, [delivery, clients]);

  useEffect(() => {
    if (delivery) {
      setIsEditMode(true);
      setInitialClientId(delivery.clientId);
      
      console.log("DeliveryForm - Resetando form com valores:", {
        clientId: delivery.clientId,
        minuteNumber: delivery.minuteNumber,
        receiver: delivery.receiver,
        weight: delivery.weight.toString(),
        packages: delivery.packages.toString(),
        deliveryType: delivery.deliveryType,
        cargoType: delivery.cargoType,
        cargoValue: delivery.cargoValue?.toString() || '',
        cityId: delivery.cityId || '',
        notes: delivery.notes || '',
        occurrence: delivery.occurrence || '',
      });
      
      form.reset({
        clientId: delivery.clientId,
        minuteNumber: delivery.minuteNumber,
        deliveryDate: delivery.deliveryDate,
        deliveryTime: delivery.deliveryTime,
        receiver: delivery.receiver,
        weight: delivery.weight.toString(),
        packages: delivery.packages.toString(),
        deliveryType: delivery.deliveryType,
        cargoType: delivery.cargoType,
        cargoValue: delivery.cargoValue?.toString() || '',
        cityId: delivery.cityId || '',
        notes: delivery.notes || '',
        occurrence: delivery.occurrence || '',
      });
      
      setFreight(delivery.totalFreight);
      
      if (isDoorToDoorDelivery(delivery.deliveryType)) {
        setShowDoorToDoor(true);
      }
    }
  }, [delivery, isDoorToDoorDelivery, form]);

  const watchClientId = form.watch('clientId');
  const watchWeight = form.watch('weight');
  const watchDeliveryType = form.watch('deliveryType');
  const watchCargoType = form.watch('cargoType');
  const watchCargoValue = form.watch('cargoValue');
  const watchCityId = form.watch('cityId');

  useEffect(() => {
    console.log("DeliveryForm - clientId mudou para:", watchClientId);
  }, [watchClientId]);

  useEffect(() => {
    if (watchClientId && watchWeight && !isNaN(parseFloat(watchWeight))) {
      try {
        const calculatedFreight = calculateFreight(
          watchClientId,
          parseFloat(watchWeight),
          watchDeliveryType as Delivery['deliveryType'],
          watchCargoType as Delivery['cargoType'],
          watchCargoValue ? parseFloat(watchCargoValue) : undefined,
          undefined,
          watchCityId || undefined
        );
        
        setFreight(calculatedFreight);
      } catch (error) {
        console.error('Error calculating freight:', error);
      }
    }
  }, [watchClientId, watchWeight, watchDeliveryType, watchCargoType, watchCargoValue, watchCityId, calculateFreight]);

  useEffect(() => {
    if (watchDeliveryType) {
      setShowDoorToDoor(isDoorToDoorDelivery(watchDeliveryType as Delivery['deliveryType']));
    }
  }, [watchDeliveryType, isDoorToDoorDelivery]);

  const onSubmit = async (data: DeliveryFormValues) => {
    try {
      console.log("DeliveryForm - Dados do formulário enviado:", data);
      
      const weight = parseFloat(data.weight);
      const packages = parseInt(data.packages);
      const cargoValue = data.cargoValue ? parseFloat(data.cargoValue) : undefined;
      
      const client = clients.find(c => c.id === data.clientId);
      const clientName = client ? (client.tradingName || client.name) : 'Cliente desconhecido';
      
      console.log("DeliveryForm - Cliente selecionado:", client);
      
      if (isEditMode && delivery) {
        const updatedDelivery: Partial<Delivery> = {
          clientId: data.clientId,
          deliveryDate: data.deliveryDate,
          deliveryTime: data.deliveryTime,
          receiver: data.receiver,
          weight,
          packages,
          deliveryType: data.deliveryType as Delivery['deliveryType'],
          cargoType: data.cargoType as Delivery['cargoType'],
          cargoValue,
          totalFreight: freight,
          notes: data.notes,
          occurrence: data.occurrence,
          cityId: data.cityId || undefined,
        };
        
        console.log("DeliveryForm - Atualizando entrega:", updatedDelivery);
        
        updateDelivery(delivery.id, updatedDelivery);
        
        addLog({
          action: 'update',
          entityType: 'delivery',
          entityId: delivery.id,
          entityName: `Minuta ${delivery.minuteNumber} - ${clientName}`,
          details: `Entrega atualizada: ${delivery.minuteNumber}`
        });
        
        toast.success("Entrega atualizada com sucesso");
      } else {
        if (data.minuteNumber && checkMinuteNumberExists(data.minuteNumber, data.clientId)) {
          toast.error("Número de minuta já existe para este cliente");
          return;
        }
        
        const newDelivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> = {
          minuteNumber: data.minuteNumber || '',
          clientId: data.clientId,
          deliveryDate: data.deliveryDate,
          deliveryTime: data.deliveryTime,
          receiver: data.receiver,
          weight,
          packages,
          deliveryType: data.deliveryType as Delivery['deliveryType'],
          cargoType: data.cargoType as Delivery['cargoType'],
          cargoValue,
          totalFreight: freight,
          notes: data.notes,
          occurrence: data.occurrence,
          cityId: data.cityId || undefined,
        };
        
        console.log("DeliveryForm - Criando nova entrega:", newDelivery);
        
        addDelivery(newDelivery);
        
        addLog({
          action: 'create',
          entityType: 'delivery',
          entityName: `Nova entrega - ${clientName}`,
          details: `Nova entrega criada para ${clientName}`
        });
        
        toast.success("Entrega registrada com sucesso");
      }
      
      onComplete();
    } catch (error) {
      console.error('Error submitting delivery form:', error);
      toast.error("Erro ao salvar entrega");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <ClientSearchSelect
                      value={field.value}
                      onValueChange={(value) => {
                        console.log("DeliveryForm - ClientSearchSelect - Valor alterado para:", value);
                        field.onChange(value);
                      }}
                      placeholder="Selecione um cliente"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="minuteNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da Minuta</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Gerado automaticamente se vazio"
                    disabled={isEditMode}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Entrega</FormLabel>
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
                  <FormLabel>Hora</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="receiver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destinatário</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome do destinatário" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (kg)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="packages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volumes</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      placeholder="1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="deliveryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Entrega</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de entrega" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-80">
                    <SelectItem value="standard">Normal</SelectItem>
                    <SelectItem value="emergency">Emergencial</SelectItem>
                    <SelectItem value="exclusive">Exclusivo</SelectItem>
                    <SelectItem value="saturday">Sábado</SelectItem>
                    <SelectItem value="sundayHoliday">Domingo/Feriado</SelectItem>
                    <SelectItem value="difficultAccess">Acesso Difícil</SelectItem>
                    <SelectItem value="metropolitanRegion">Região Metropolitana</SelectItem>
                    <SelectItem value="doorToDoorInterior">Interior</SelectItem>
                    <SelectItem value="reshipment">Redespacho</SelectItem>
                    <SelectItem value="normalBiological">Biológico Normal</SelectItem>
                    <SelectItem value="infectiousBiological">Biológico Infeccioso</SelectItem>
                    <SelectItem value="tracked">Rastreado</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
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
          
          {watchDeliveryType === 'reshipment' && (
            <FormField
              control={form.control}
              name="cargoValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Carga (R$)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {showDoorToDoor && (
            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a cidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-80">
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name} - {city.distance}km
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Observações sobre a entrega"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="occurrence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ocorrência</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Registre qualquer ocorrência durante a entrega"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-md">
          <div className="flex justify-between items-center">
            <Label className="font-semibold">Valor Total do Frete:</Label>
            <div className="text-xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(freight)}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditMode ? 'Atualizar Entrega' : 'Registrar Entrega'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
