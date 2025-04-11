
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Delivery } from '@/types';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deliveryFormSchema } from '../schema/deliveryFormSchema';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { formatToLocaleDate } from '@/utils/dateUtils';
import { useClients } from '@/contexts';

// Define the context type
interface DeliveryFormContextType {
  form: UseFormReturn<any>;
  delivery: Delivery | null | undefined;
  isEditMode: boolean;
  freight: number;
  setFreight: React.Dispatch<React.SetStateAction<number>>;
  showDoorToDoor: boolean;
  setShowDoorToDoor: React.Dispatch<React.SetStateAction<boolean>>;
  showDuplicateAlert: boolean;
  setShowDuplicateAlert: React.Dispatch<React.SetStateAction<boolean>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

// Create the context
const DeliveryFormContext = createContext<DeliveryFormContextType | undefined>(undefined);

interface DeliveryFormProviderProps {
  children: React.ReactNode;
  delivery?: Delivery | null;
}

// Create the provider
export const DeliveryFormProvider: React.FC<DeliveryFormProviderProps> = ({ children, delivery }) => {
  const { calculateFreight, isDoorToDoorDelivery } = useDeliveries();
  const { clients } = useClients();
  const [freight, setFreight] = useState(0);
  const [showDoorToDoor, setShowDoorToDoor] = useState(false);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  
  const isEditMode = !!delivery;
  
  // Setup form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      clientId: delivery?.clientId || '',
      minuteNumber: delivery?.minuteNumber || '',
      deliveryDate: delivery?.deliveryDate || formatToLocaleDate(new Date()),
      deliveryTime: delivery?.deliveryTime || '',
      receiver: delivery?.receiver || '',
      pickupName: delivery?.pickupName || '',
      pickupDate: delivery?.pickupDate || formatToLocaleDate(new Date()),
      pickupTime: delivery?.pickupTime || '',
      weight: delivery?.weight ? delivery.weight.toString() : '',
      packages: delivery?.packages ? delivery.packages.toString() : '',
      deliveryType: delivery?.deliveryType || 'standard',
      cargoType: delivery?.cargoType || 'package',
      cargoValue: delivery?.cargoValue ? delivery.cargoValue.toString() : '',
      cityId: delivery?.cityId || '',
      notes: delivery?.notes || '',
      occurrence: delivery?.occurrence || '',
    },
  });
  
  // Update form values when delivery changes
  useEffect(() => {
    if (delivery) {
      form.reset({
        clientId: delivery.clientId,
        minuteNumber: delivery.minuteNumber,
        deliveryDate: delivery.deliveryDate,
        deliveryTime: delivery.deliveryTime,
        receiver: delivery.receiver,
        pickupName: delivery.pickupName || '',
        pickupDate: delivery.pickupDate || formatToLocaleDate(new Date()),
        pickupTime: delivery.pickupTime || '',
        weight: delivery.weight.toString(),
        packages: delivery.packages.toString(),
        deliveryType: delivery.deliveryType,
        cargoType: delivery.cargoType,
        cargoValue: delivery.cargoValue ? delivery.cargoValue.toString() : '',
        cityId: delivery.cityId || '',
        notes: delivery.notes || '',
        occurrence: delivery.occurrence || '',
      });
    }
  }, [delivery, form]);
  
  // Watch for changes to calculate freight
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.clientId && value.weight && value.deliveryType && value.cargoType) {
        const weightValue = parseFloat(value.weight as string);
        const cargoValue = value.cargoValue ? parseFloat(value.cargoValue as string) : undefined;
        const cityId = value.cityId as string || undefined;
        
        if (!isNaN(weightValue) && weightValue > 0) {
          const calculatedFreight = calculateFreight(
            value.clientId as string,
            weightValue,
            value.deliveryType as Delivery['deliveryType'],
            value.cargoType as Delivery['cargoType'],
            cargoValue,
            undefined,
            cityId
          );
          
          setFreight(calculatedFreight);
        }
      }
      
      // Update showDoorToDoor based on deliveryType
      if (value.deliveryType) {
        setShowDoorToDoor(isDoorToDoorDelivery(value.deliveryType as Delivery['deliveryType']));
      }
    });
    
    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [form, calculateFreight, isDoorToDoorDelivery, setFreight, setShowDoorToDoor]);
  
  const contextValue: DeliveryFormContextType = {
    form,
    delivery,
    isEditMode,
    freight,
    setFreight,
    showDoorToDoor,
    setShowDoorToDoor,
    showDuplicateAlert,
    setShowDuplicateAlert,
    formData,
    setFormData,
  };
  
  return (
    <DeliveryFormContext.Provider value={contextValue}>
      {children}
    </DeliveryFormContext.Provider>
  );
};

// Create a hook to use the context
export const useDeliveryFormContext = () => {
  const context = useContext(DeliveryFormContext);
  if (context === undefined) {
    throw new Error('useDeliveryFormContext must be used within a DeliveryFormProvider');
  }
  return context;
};
