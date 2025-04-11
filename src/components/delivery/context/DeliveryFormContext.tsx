
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deliveryFormSchema } from '../schema/deliveryFormSchema';
import { Delivery, Client } from '@/types';
import { useDeliveryFormCalculations } from '../hooks/useDeliveryFormCalculations';
import { useDeliveryFormEffects } from '../hooks/useDeliveryFormEffects';
import { useDuplicateMinuteCheck } from '../hooks/useDuplicateMinuteCheck';
import { useClients } from '@/contexts';

interface DeliveryFormContextType {
  form: ReturnType<typeof useForm>;
  delivery: Delivery | null;
  isEditMode: boolean;
  freight: number;
  showDoorToDoor: boolean;
  showDuplicateAlert: boolean;
  setShowDuplicateAlert: React.Dispatch<React.SetStateAction<boolean>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  clients: Client[];
}

const DeliveryFormContext = createContext<DeliveryFormContextType | undefined>(undefined);

export const DeliveryFormProvider: React.FC<{
  children: React.ReactNode;
  delivery?: Delivery | null;
}> = ({ children, delivery = null }) => {
  const [formData, setFormData] = useState<any>(null);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const isEditMode = !!delivery;
  const { clients, loading: clientsLoading } = useClients();
  
  // Initialize the form
  const form = useForm({
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
  
  console.log("DeliveryFormContext initialized with", clients.length, "clients");
  
  // Calculate freight based on form values
  const { freight, showDoorToDoor } = useDeliveryFormCalculations(form);
  
  // Setup form effects (watchers, etc)
  useDeliveryFormEffects(form);
  
  // Check for duplicates
  useDuplicateMinuteCheck(form);

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
        clients
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
