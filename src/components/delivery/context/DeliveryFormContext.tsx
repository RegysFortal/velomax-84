
import React, { createContext, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deliveryFormSchema } from '../schema/deliveryFormSchema';
import { Delivery } from '@/types';
import { useDuplicateMinuteCheck } from '../hooks/useDuplicateMinuteCheck';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useFreightCalculation } from '@/contexts/deliveries/hooks/useFreightCalculation';
import { useClientPriceTable } from '@/contexts/budget/useClientPriceTable';
import { useCities } from '@/contexts/cities';

interface DeliveryFormContextType {
  form: any;
  delivery: Delivery | null;
  isEditMode: boolean;
  showDoorToDoor: boolean;
  showDuplicateAlert: boolean;
  setShowDuplicateAlert: (show: boolean) => void;
  formData: any;
  setFormData: (data: any) => void;
  freight: number;
}

const DeliveryFormContext = createContext<DeliveryFormContextType | undefined>(undefined);

export const useDeliveryFormContext = () => {
  const context = useContext(DeliveryFormContext);
  if (!context) {
    throw new Error('useDeliveryFormContext must be used within a DeliveryFormProvider');
  }
  return context;
};

interface DeliveryFormProviderProps {
  children: React.ReactNode;
  delivery?: Delivery | null;
  isEditMode?: boolean;
}

export const DeliveryFormProvider: React.FC<DeliveryFormProviderProps> = ({ 
  children, 
  delivery = null, 
  isEditMode = false 
}) => {
  const { checkMinuteNumberExistsForClient } = useDeliveries();
  const { cities } = useCities();
  
  // Safely get the required hooks
  let getClientPriceTable = (clientId: string) => undefined;
  
  try {
    const clientPriceTableHook = useClientPriceTable();
    getClientPriceTable = clientPriceTableHook.getClientPriceTable;
  } catch (error) {
    console.warn("useClientPriceTable not available, using fallback");
  }

  const { calculateFreight } = useFreightCalculation(getClientPriceTable, cities);
  
  const {
    showDuplicateAlert,
    setShowDuplicateAlert,
    formData,
    setFormData
  } = useDuplicateMinuteCheck();

  const form = useForm({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: delivery ? {
      minuteNumber: delivery.minuteNumber || '',
      clientId: delivery.clientId || '',
      deliveryDate: delivery.deliveryDate || '',
      deliveryTime: delivery.deliveryTime || '',
      receiver: delivery.receiver || '',
      receiverId: delivery.receiverId || '',
      weight: delivery.weight || 0,
      packages: delivery.packages || 0,
      deliveryType: delivery.deliveryType || 'standard',
      cargoType: delivery.cargoType || 'general',
      cargoValue: delivery.cargoValue || 0,
      totalFreight: delivery.totalFreight || 0,
      notes: delivery.notes || '',
      occurrence: delivery.occurrence || '',
      cityId: delivery.cityId || '',
      arrivalKnowledgeNumber: delivery.arrivalKnowledgeNumber || ''
    } : {
      minuteNumber: '',
      clientId: '',
      deliveryDate: '',
      deliveryTime: '',
      receiver: '',
      receiverId: '',
      weight: 0,
      packages: 0,
      deliveryType: 'standard',
      cargoType: 'general',
      cargoValue: 0,
      totalFreight: 0,
      notes: '',
      occurrence: '',
      cityId: '',
      arrivalKnowledgeNumber: ''
    }
  });

  // Watch for changes to calculate freight
  const watchClientId = form.watch('clientId');
  const watchDeliveryType = form.watch('deliveryType');
  const watchCityId = form.watch('cityId');
  const watchWeight = form.watch('weight');
  const watchPackages = form.watch('packages');

  const freight = calculateFreight(
    watchDeliveryType,
    watchCityId,
    watchWeight,
    watchPackages,
    watchClientId
  );

  useEffect(() => {
    if (freight > 0) {
      form.setValue('totalFreight', freight);
    }
  }, [freight, form]);

  // Determine if door-to-door delivery type is selected
  const showDoorToDoor = ['doorToDoorInterior', 'metropolitanRegion'].includes(watchDeliveryType);

  return (
    <DeliveryFormContext.Provider
      value={{
        form,
        delivery,
        isEditMode,
        showDoorToDoor,
        showDuplicateAlert,
        setShowDuplicateAlert,
        formData,
        setFormData,
        freight
      }}
    >
      {children}
    </DeliveryFormContext.Provider>
  );
};
