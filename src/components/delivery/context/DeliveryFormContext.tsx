
import React, { createContext, useContext, useState } from 'react';
import { Delivery } from '@/types';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { deliveryFormSchema } from '../schema/deliveryFormSchema';

type DeliveryFormContextType = {
  form: UseFormReturn<any>;
  delivery: Delivery | null | undefined;
  isEditMode: boolean;
  freight: number;
  setFreight: (freight: number) => void;
  showDoorToDoor: boolean;
  setShowDoorToDoor: (show: boolean) => void;
  showDuplicateAlert: boolean;
  setShowDuplicateAlert: (show: boolean) => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

export const DeliveryFormContext = createContext<DeliveryFormContextType | null>(null);

export const useDeliveryFormContext = () => {
  const context = useContext(DeliveryFormContext);
  if (!context) {
    throw new Error('useDeliveryFormContext must be used within a DeliveryFormProvider');
  }
  return context;
};

interface DeliveryFormProviderProps {
  children: React.ReactNode;
  delivery: Delivery | null | undefined;
}

export const DeliveryFormProvider: React.FC<DeliveryFormProviderProps> = ({ 
  children, 
  delivery 
}) => {
  const [freight, setFreight] = useState(0);
  const [showDoorToDoor, setShowDoorToDoor] = useState(false);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const isEditMode = !!delivery;

  const form = useForm({
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

  return (
    <DeliveryFormContext.Provider
      value={{
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
      }}
    >
      {children}
    </DeliveryFormContext.Provider>
  );
};
