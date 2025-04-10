
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts';
import { useCities } from '@/contexts/CitiesContext';
import { Delivery } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Form } from '@/components/ui/form';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { toast } from "sonner";
import { DeliveryFormBasicFields } from './DeliveryFormBasicFields';
import { DeliveryFormTypeFields } from './DeliveryFormTypeFields';
import { DeliveryFormNotes } from './DeliveryFormNotes';
import { deliveryFormSchema } from './schema/deliveryFormSchema';
import { useDeliveryFormSubmit } from './hooks/useDeliveryFormSubmit';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

interface DeliveryFormProps {
  delivery?: Delivery | null;
  onComplete: () => void;
  onCancel?: () => void;
}

export const DeliveryForm = ({ delivery, onComplete, onCancel }: DeliveryFormProps) => {
  const { calculateFreight, isDoorToDoorDelivery, checkMinuteNumberExists } = useDeliveries();
  const { clients } = useClients();
  const { cities } = useCities();
  
  const [showDoorToDoor, setShowDoorToDoor] = useState(false);
  const [freight, setFreight] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialClientId, setInitialClientId] = useState('');
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const { handleSubmit, handleConfirmDuplicate } = useDeliveryFormSubmit({
    isEditMode,
    delivery,
    setFormData,
    setShowDuplicateAlert,
    onComplete
  });

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
      pickupName: '',
      pickupDate: '',
      pickupTime: '',
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
      
      const safeToString = (value: any) => {
        return value !== undefined && value !== null ? String(value) : '';
      };
      
      console.log("DeliveryForm - Resetando form com valores:", {
        clientId: delivery.clientId,
        minuteNumber: delivery.minuteNumber,
        receiver: delivery.receiver,
        weight: safeToString(delivery.weight),
        packages: safeToString(delivery.packages),
        deliveryType: delivery.deliveryType,
        cargoType: delivery.cargoType,
        cargoValue: safeToString(delivery.cargoValue),
        cityId: delivery.cityId || '',
        notes: delivery.notes || '',
        occurrence: delivery.occurrence || '',
      });
      
      form.reset({
        clientId: delivery.clientId,
        minuteNumber: delivery.minuteNumber || '',
        deliveryDate: delivery.deliveryDate || format(new Date(), 'yyyy-MM-dd'),
        deliveryTime: delivery.deliveryTime || format(new Date(), 'HH:mm'),
        receiver: delivery.receiver || '',
        weight: safeToString(delivery.weight),
        packages: safeToString(delivery.packages),
        deliveryType: delivery.deliveryType || 'standard',
        cargoType: delivery.cargoType || 'standard',
        cargoValue: safeToString(delivery.cargoValue),
        cityId: delivery.cityId || '',
        notes: delivery.notes || '',
        occurrence: delivery.occurrence || '',
        pickupName: delivery.pickupName || '',
        pickupDate: delivery.pickupDate || '',
        pickupTime: delivery.pickupTime || '',
      });
      
      setFreight(delivery.totalFreight || 0);
      
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

  const onSubmit = (data: DeliveryFormValues) => {
    handleSubmit(data, freight);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onComplete();
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DeliveryFormBasicFields 
              control={form.control}
              isEditMode={isEditMode}
              setValue={form.setValue}
              getValues={form.getValues}
            />
            
            <DeliveryFormTypeFields 
              control={form.control}
              watchDeliveryType={watchDeliveryType}
              showDoorToDoor={showDoorToDoor}
              cities={cities}
            />
            
            <DeliveryFormNotes 
              control={form.control}
            />
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
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditMode ? 'Atualizar Entrega' : 'Registrar Entrega'}
            </Button>
          </div>
        </form>
      </Form>
      
      <AlertDialog open={showDuplicateAlert} onOpenChange={setShowDuplicateAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Número de minuta duplicado</AlertDialogTitle>
            <AlertDialogDescription>
              Já existe uma entrega com o número de minuta <span className="font-semibold">{form.watch('minuteNumber')}</span> para este cliente.
              Deseja realmente criar outra entrega com o mesmo número?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDuplicateAlert(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConfirmDuplicate(formData)} className="bg-orange-600 hover:bg-orange-700">
              Sim, criar mesmo assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
