
import React, { createContext, useContext, useState } from 'react';
import { useForm, FieldValues, UseFormReturn } from 'react-hook-form';
import { Delivery, DeliveryType } from '@/types';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useDeliveryFormCalculations } from '../hooks/useDeliveryFormCalculations';

// Define the form values interface
export interface DeliveryFormValues {
  clientId: string;
  minuteNumber: string;
  deliveryDate: string;
  deliveryTime: string;
  receiver: string;
  weight: string;
  packages: string;
  deliveryType: DeliveryType;
  cargoType: Delivery['cargoType'];
  cargoValue: string;
  notes: string;
  occurrence: string;
  cityId: string;
  pickupName: string;
  pickupDate: string;
  pickupTime: string;
}

interface DeliveryFormContextType {
  form: UseFormReturn<DeliveryFormValues>;
  delivery: Delivery | null | undefined;
  isEditMode: boolean;
  freight: number;
  setFreight: React.Dispatch<React.SetStateAction<number>>;
  showDoorToDoor: boolean;
  setShowDoorToDoor?: React.Dispatch<React.SetStateAction<boolean>>;
  showDuplicateAlert: boolean;
  setShowDuplicateAlert: React.Dispatch<React.SetStateAction<boolean>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

interface DeliveryFormProviderProps {
  children: React.ReactNode;
  delivery?: Delivery | null;
}

const DeliveryFormContext = createContext<DeliveryFormContextType | undefined>(undefined);

export const DeliveryFormProvider: React.FC<DeliveryFormProviderProps> = ({ 
  children, 
  delivery 
}) => {
  const { isDoorToDoorDelivery } = useDeliveries();
  const isEditMode = !!delivery;
  
  const [freight, setFreight] = useState(delivery?.totalFreight || 0);
  const [showDoorToDoor, setShowDoorToDoor] = useState(false);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  
  // Initialize form with default values from delivery (if in edit mode)
  const form = useForm<DeliveryFormValues>({
    defaultValues: {
      clientId: delivery?.clientId || '',
      minuteNumber: delivery?.minuteNumber || '',
      deliveryDate: delivery?.deliveryDate || new Date().toISOString().split('T')[0],
      deliveryTime: delivery?.deliveryTime || '12:00',
      receiver: delivery?.receiver || '',
      weight: delivery?.weight?.toString() || '',
      packages: delivery?.packages?.toString() || '',
      deliveryType: delivery?.deliveryType || 'standard',
      cargoType: delivery?.cargoType || 'standard',
      cargoValue: delivery?.cargoValue?.toString() || '',
      notes: delivery?.notes || '',
      occurrence: delivery?.occurrence || '',
      cityId: delivery?.cityId || '',
      pickupName: delivery?.pickupName || '',
      pickupDate: delivery?.pickupDate || '',
      pickupTime: delivery?.pickupTime || '',
    }
  });
  
  // Watch delivery type to determine if it's a door-to-door delivery
  const deliveryType = form.watch('deliveryType');
  
  // Update freight when relevant fields change
  const { calculateFreight } = useDeliveryFormCalculations({
    form,
    setFreight,
    delivery,
    isEditMode
  });
  
  // Update door-to-door status when mounting or delivery type changes
  React.useEffect(() => {
    if (isDoorToDoorDelivery(deliveryType)) {
      setShowDoorToDoor(true);
    } else {
      setShowDoorToDoor(false);
    }
  }, [deliveryType, isDoorToDoorDelivery]);
  
  // Initial freight calculation
  React.useEffect(() => {
    if (!isEditMode) {
      calculateFreight();
    }
  }, [calculateFreight, isEditMode]);
  
  return (
    <DeliveryFormContext.Provider value={{
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
      setFormData
    }}>
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
