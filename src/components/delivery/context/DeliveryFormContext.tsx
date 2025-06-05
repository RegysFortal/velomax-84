
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Delivery, DeliveryFormData } from '@/types';
import { useDeliveryFormCalculations } from '../hooks/useDeliveryFormCalculations';
import { doorToDoorDeliveryTypes } from '@/types/delivery';

const deliveryFormSchema = z.object({
  minuteNumber: z.string().optional(),
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  deliveryDate: z.string().min(1, 'Data de entrega é obrigatória'),
  deliveryTime: z.string().min(1, 'Horário é obrigatório'),
  receiver: z.string().min(1, 'Destinatário é obrigatório'),
  receiverId: z.string().optional(),
  weight: z.number().min(0.1, 'Peso deve ser maior que 0'),
  packages: z.number().min(1, 'Quantidade deve ser maior que 0'),
  deliveryType: z.string().min(1, 'Tipo de entrega é obrigatório'),
  cargoType: z.string().min(1, 'Tipo de carga é obrigatório'),
  cargoValue: z.number().optional(),
  totalFreight: z.number().min(0, 'Frete deve ser maior ou igual a 0'),
  notes: z.string().optional(),
  occurrence: z.string().optional(),
  cityId: z.string().optional(),
  arrivalKnowledgeNumber: z.string().optional(),
  isCourtesy: z.boolean().optional(),
  hasCustomPrice: z.boolean().optional(),
});

interface DeliveryFormContextType {
  form: any;
  delivery: Delivery | null | undefined;
  isEditMode: boolean;
  showDoorToDoor: boolean;
  showDuplicateAlert: boolean;
  setShowDuplicateAlert: (show: boolean) => void;
  formData: DeliveryFormData | null;
  setFormData: (data: DeliveryFormData | null) => void;
  freight: number;
  setFreight: (value: number) => void;
  insuranceValue: number;
  setInsuranceValue: (value: number) => void;
}

const DeliveryFormContext = createContext<DeliveryFormContextType | null>(null);

export const useDeliveryFormContext = () => {
  const context = useContext(DeliveryFormContext);
  if (!context) {
    throw new Error('useDeliveryFormContext must be used within DeliveryFormProvider');
  }
  return context;
};

interface DeliveryFormProviderProps {
  children: React.ReactNode;
  delivery?: Delivery | null;
}

export const DeliveryFormProvider = ({ children, delivery }: DeliveryFormProviderProps) => {
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [formData, setFormData] = useState<DeliveryFormData | null>(null);
  const [freight, setFreight] = useState(0);
  const [insuranceValue, setInsuranceValue] = useState(0);
  
  const isEditMode = !!delivery;
  
  const form = useForm({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      minuteNumber: delivery?.minuteNumber || '',
      clientId: delivery?.clientId || '',
      deliveryDate: delivery?.deliveryDate || '',
      deliveryTime: delivery?.deliveryTime || '',
      receiver: delivery?.receiver || '',
      receiverId: delivery?.receiverId || '',
      weight: delivery?.weight || 0,
      packages: delivery?.packages || 1,
      deliveryType: delivery?.deliveryType || 'standard',
      cargoType: delivery?.cargoType || 'standard',
      cargoValue: delivery?.cargoValue || 0,
      totalFreight: delivery?.totalFreight || 0,
      notes: delivery?.notes || '',
      occurrence: delivery?.occurrence || '',
      cityId: delivery?.cityId || '',
      arrivalKnowledgeNumber: delivery?.arrivalKnowledgeNumber || '',
      isCourtesy: delivery?.isCourtesy || false,
      hasCustomPrice: false, // New field for custom pricing
    },
  });

  const { calculateFreight, setManualFreight } = useDeliveryFormCalculations({
    form,
    setFreight,
    delivery,
    isEditMode
  });

  // Watch delivery type to show/hide door to door fields
  const watchDeliveryType = form.watch('deliveryType');
  const watchIsCourtesy = form.watch('isCourtesy');
  const watchHasCustomPrice = form.watch('hasCustomPrice');
  const showDoorToDoor = doorToDoorDeliveryTypes.includes(watchDeliveryType);

  // Set initial freight value
  useEffect(() => {
    if (delivery?.totalFreight) {
      setFreight(delivery.totalFreight);
    }
  }, [delivery]);

  // Handle courtesy checkbox
  useEffect(() => {
    if (watchIsCourtesy) {
      setFreight(0);
      form.setValue('totalFreight', 0);
      form.setValue('hasCustomPrice', false);
    } else if (!watchHasCustomPrice) {
      // Recalculate freight when courtesy is unchecked and not using custom price
      const formValues = form.getValues();
      if (formValues.clientId && formValues.weight && formValues.deliveryType) {
        const newFreight = calculateFreight();
        form.setValue('totalFreight', newFreight);
      }
    }
  }, [watchIsCourtesy, form, calculateFreight, setFreight, watchHasCustomPrice]);

  // Handle custom price checkbox
  useEffect(() => {
    if (watchHasCustomPrice) {
      form.setValue('isCourtesy', false);
    }
  }, [watchHasCustomPrice, form]);

  // Recalculate freight when relevant fields change, except when it's courtesy or custom price
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (value.isCourtesy) {
        setFreight(0);
        form.setValue('totalFreight', 0);
        return;
      }
      
      if (value.hasCustomPrice) {
        // Don't auto-calculate when using custom price
        return;
      }
      
      if (['clientId', 'weight', 'deliveryType', 'cargoType', 'cargoValue', 'cityId'].includes(name || '')) {
        if (value.clientId && value.weight && value.deliveryType) {
          const newFreight = calculateFreight();
          form.setValue('totalFreight', newFreight);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, calculateFreight]);

  const contextValue: DeliveryFormContextType = {
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
    insuranceValue,
    setInsuranceValue,
  };

  return (
    <DeliveryFormContext.Provider value={contextValue}>
      {children}
    </DeliveryFormContext.Provider>
  );
};
