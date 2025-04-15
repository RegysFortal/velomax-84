
import React, { createContext, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deliveryFormSchema } from '../schema/deliveryFormSchema';
import { Delivery, Client, DeliveryType } from '@/types';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts';
import { useDeliveryFormEffects } from '../hooks/useDeliveryFormEffects';

export interface DeliveryFormValues {
  clientId: string;
  minuteNumber: string;
  pickupName: string;
  pickupDate: string;
  pickupTime: string;
  receiver: string;
  receiverId: string;
  deliveryDate: string;
  deliveryTime: string;
  weight: string;
  packages: string;
  deliveryType: string;
  cargoType: string;
  cargoValue: string;
  cityId: string;
  notes: string;
  occurrence: string;
  totalFreight: string;
}

interface DeliveryFormContextType {
  form: ReturnType<typeof useForm<DeliveryFormValues>>;
  delivery: Delivery | null;
  isEditMode: boolean;
  freight: number;
  showDoorToDoor: boolean;
  showDuplicateAlert: boolean;
  setShowDuplicateAlert: React.Dispatch<React.SetStateAction<boolean>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  clients: Client[];
  setFreight: React.Dispatch<React.SetStateAction<number>>;
  setManualFreight?: (value: number) => void;
}

const DeliveryFormContext = createContext<DeliveryFormContextType | undefined>(undefined);

export const DeliveryFormProvider: React.FC<{
  children: React.ReactNode;
  delivery?: Delivery | null;
}> = ({ children, delivery = null }) => {
  const [formData, setFormData] = useState<any>(null);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [freight, setFreight] = useState(0);
  const { calculateFreight, isDoorToDoorDelivery } = useDeliveries();
  const isEditMode = !!delivery;
  const { clients, loading: clientsLoading } = useClients();
  
  // Initialize the form
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      clientId: delivery?.clientId || '',
      minuteNumber: delivery?.minuteNumber || '',
      pickupName: delivery?.pickupName || '',
      pickupDate: delivery?.pickupDate || new Date().toISOString().split('T')[0],
      pickupTime: delivery?.pickupTime || '',
      receiver: delivery?.receiver || '',
      receiverId: delivery?.receiverId || '',
      deliveryDate: delivery?.deliveryDate || new Date().toISOString().split('T')[0],
      deliveryTime: delivery?.deliveryTime || '',
      weight: delivery?.weight?.toString() || '',
      packages: delivery?.packages?.toString() || '',
      deliveryType: delivery?.deliveryType || 'standard',
      cargoType: delivery?.cargoType || 'standard',
      cargoValue: delivery?.cargoValue?.toString() || '',
      cityId: delivery?.cityId || '',
      notes: delivery?.notes || '',
      occurrence: delivery?.occurrence || '',
      totalFreight: delivery?.totalFreight?.toString() || '',
    },
  });
  
  // Use the effects hook but pass all required dependencies directly instead of via context
  const { watchDeliveryType } = useDeliveryFormEffects(
    form, 
    delivery, 
    isEditMode, 
    setFreight,
    calculateFreight
  );
  
  console.log("DeliveryFormContext initialized with", clients.length, "clients");
  
  // Calculate showDoorToDoor based on current delivery type
  const deliveryType = form.watch('deliveryType');
  const showDoorToDoor = isDoorToDoorDelivery(deliveryType as DeliveryType);

  // Function to manually set freight
  const setManualFreight = (value: number) => {
    console.log("Setting manual freight:", value);
    setFreight(value);
  };

  return (
    <DeliveryFormContext.Provider
      value={{
        form,
        delivery,
        isEditMode,
        freight,
        showDoorToDoor,
        showDuplicateAlert,
        setShowDuplicateAlert,
        formData,
        setFormData,
        clients,
        setFreight: setManualFreight,
      }}
    >
      {children}
    </DeliveryFormContext.Provider>
  );
};

export const useDeliveryFormContext = () => {
  const context = useContext(DeliveryFormContext);
  if (!context) {
    throw new Error('useDeliveryFormContext must be used within a DeliveryFormProvider');
  }
  return context;
};
