
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deliveryFormSchema } from '../schema/deliveryFormSchema';
import { Delivery } from '@/types';
import { useDuplicateMinuteCheck } from '../hooks/useDuplicateMinuteCheck';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useFreightCalculation } from '@/contexts/deliveries/hooks/useFreightCalculation';
import { useClientPriceTable } from '@/contexts/budget/useClientPriceTable';
import { useCities } from '@/contexts/cities';
import { useClients } from '@/contexts';

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
  setFreight: (value: number) => void;
  clients: any[];
  insuranceValue: number;
  setInsuranceValue: (value: number) => void;
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
  isEditMode: propIsEditMode
}) => {
  const { checkMinuteNumberExistsForClient } = useDeliveries();
  const { cities } = useCities();
  const { clients } = useClients();
  const [freight, setFreight] = useState<number>(0);
  const [insuranceValue, setInsuranceValue] = useState<number>(0);
  
  // Determine if we're in edit mode - mais rigoroso na verificação
  const isEditMode = useMemo(() => {
    const hasDelivery = delivery !== null && delivery !== undefined;
    const hasId = hasDelivery && delivery.id !== undefined && delivery.id !== null && delivery.id !== '';
    const editModeFromProp = propIsEditMode === true;
    
    const finalEditMode = editModeFromProp && hasDelivery && hasId;
    
    console.log('DeliveryFormContext - Edit mode calculation:');
    console.log('  - propIsEditMode:', propIsEditMode);
    console.log('  - hasDelivery:', hasDelivery);
    console.log('  - hasId:', hasId);
    console.log('  - delivery.id:', delivery?.id);
    console.log('  - finalEditMode:', finalEditMode);
    
    return finalEditMode;
  }, [propIsEditMode, delivery]);
  
  // Memoize clients to prevent unnecessary re-renders
  const memoizedClients = useMemo(() => clients, [clients]);
  
  // Safely get the required hooks
  let getClientPriceTable = useCallback((clientId: string) => undefined, []);
  
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

  // Memoize default values to prevent form re-initialization
  const defaultValues = useMemo(() => {
    if (isEditMode && delivery) {
      console.log('DeliveryFormContext - Setting edit mode values for delivery:', delivery.id);
      return {
        minuteNumber: delivery.minuteNumber || '',
        clientId: delivery.clientId || '',
        deliveryDate: delivery.deliveryDate || '',
        deliveryTime: delivery.deliveryTime || '',
        receiver: delivery.receiver || '',
        receiverId: delivery.receiverId || '',
        weight: delivery.weight || 0,
        packages: delivery.packages || 0,
        deliveryType: delivery.deliveryType || 'standard',
        cargoValue: delivery.cargoValue || 0,
        totalFreight: delivery.totalFreight || 0,
        notes: delivery.notes || '',
        occurrence: delivery.occurrence || '',
        cityId: delivery.cityId || '',
        arrivalKnowledgeNumber: delivery.arrivalKnowledgeNumber || ''
      };
    } else {
      console.log('DeliveryFormContext - Setting default values for new delivery');
      return {
        minuteNumber: '',
        clientId: '',
        deliveryDate: '',
        deliveryTime: '',
        receiver: '',
        receiverId: '',
        weight: 0,
        packages: 0,
        deliveryType: 'standard',
        cargoValue: 0,
        totalFreight: 0,
        notes: '',
        occurrence: '',
        cityId: '',
        arrivalKnowledgeNumber: ''
      };
    }
  }, [delivery, isEditMode]);

  const form = useForm({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues
  });

  // Set initial freight value for edit mode
  useEffect(() => {
    if (isEditMode && delivery?.totalFreight) {
      console.log('Setting initial freight for edit mode:', delivery.totalFreight);
      setFreight(delivery.totalFreight);
    }
  }, [isEditMode, delivery?.totalFreight]);

  // Watch for changes to calculate freight - use debounced approach
  const watchClientId = form.watch('clientId');
  const watchDeliveryType = form.watch('deliveryType');
  const watchCityId = form.watch('cityId');
  const watchWeight = form.watch('weight');
  const watchPackages = form.watch('packages');
  const watchCargoValue = form.watch('cargoValue');

  // Calculate insurance for reshipment
  useEffect(() => {
    if (watchDeliveryType === 'reshipment' && watchCargoValue > 0) {
      const insurance = watchCargoValue * 0.01;
      setInsuranceValue(insurance);
    } else {
      setInsuranceValue(0);
    }
  }, [watchDeliveryType, watchCargoValue]);

  // Calculate freight automatically when relevant fields change - but only for new deliveries
  useEffect(() => {
    if (!isEditMode) {
      const timeoutId = setTimeout(() => {
        if (watchClientId && watchWeight && watchDeliveryType) {
          console.log('Calculating freight for new delivery with params:', {
            clientId: watchClientId,
            weight: watchWeight,
            deliveryType: watchDeliveryType,
            cargoValue: watchCargoValue,
            cityId: watchCityId,
            insuranceValue
          });

          const calculatedFreight = calculateFreight(
            watchClientId,
            parseFloat(String(watchWeight)) || 0,
            watchDeliveryType as any,
            'standard' as any,
            parseFloat(String(watchCargoValue)) || 0,
            undefined,
            watchCityId
          );

          // Add insurance for reshipment
          const totalWithInsurance = calculatedFreight + insuranceValue;

          console.log('Calculated freight:', calculatedFreight, 'Insurance:', insuranceValue, 'Total:', totalWithInsurance);

          if (totalWithInsurance > 0) {
            setFreight(totalWithInsurance);
            form.setValue('totalFreight', totalWithInsurance);
          }
        }
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [watchClientId, watchDeliveryType, watchCityId, watchWeight, watchPackages, watchCargoValue, calculateFreight, form, insuranceValue, isEditMode]);

  // Determine if door-to-door delivery type is selected
  const showDoorToDoor = useMemo(() => {
    return ['doorToDoorInterior', 'metropolitanRegion'].includes(watchDeliveryType);
  }, [watchDeliveryType]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    form,
    delivery,
    isEditMode,
    showDoorToDoor,
    showDuplicateAlert,
    setShowDuplicateAlert,
    formData,
    setFormData,
    freight,
    setFreight,
    clients: memoizedClients,
    insuranceValue,
    setInsuranceValue
  }), [
    form,
    delivery,
    isEditMode,
    showDoorToDoor,
    showDuplicateAlert,
    setShowDuplicateAlert,
    formData,
    setFormData,
    freight,
    setFreight,
    memoizedClients,
    insuranceValue,
    setInsuranceValue
  ]);

  return (
    <DeliveryFormContext.Provider value={contextValue}>
      {children}
    </DeliveryFormContext.Provider>
  );
};
