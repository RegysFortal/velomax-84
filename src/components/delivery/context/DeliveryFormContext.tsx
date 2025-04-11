
import React, { createContext, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Delivery, DeliveryType } from '@/types';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useDeliveryFormCalculations } from '../hooks/useDeliveryFormCalculations';

interface DeliveryFormContextType {
  form: ReturnType<typeof useForm>;
  delivery: Delivery | null | undefined;
  isEditMode: boolean;
  freight: number;
  showDoorToDoor: boolean;
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
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  
  // Initialize form with default values from delivery (if in edit mode)
  const form = useForm({
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
  const deliveryType = form.watch('deliveryType') as DeliveryType;
  const showDoorToDoor = isDoorToDoorDelivery(deliveryType);
  
  // Update freight when relevant fields change
  const { calculateFreight } = useDeliveryFormCalculations({ 
    form, 
    setFreight, 
    delivery, 
    isEditMode 
  });
  
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
      showDoorToDoor,
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
