
import { useEffect } from 'react';
import { format } from 'date-fns';
import { Delivery } from '@/types';

export const useDeliveryFormEffects = (
  form: any,
  delivery: Delivery | null,
  isEditMode: boolean,
  setFreight: (value: number) => void,
  calculateFreight: (
    clientId: string,
    weight: number,
    deliveryType: Delivery['deliveryType'],
    cargoType: Delivery['cargoType'],
    cargoValue?: number,
    distance?: number,
    cityId?: string
  ) => number
) => {
  // Initialize form with delivery data for edit mode
  useEffect(() => {
    if (delivery) {
      console.log("DeliveryForm - Entrega a ser editada:", delivery);
      console.log("DeliveryForm - Cliente ID:", delivery.clientId);
    }
  }, [delivery]);

  useEffect(() => {
    if (delivery) {
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
      });
      
      setFreight(delivery.totalFreight || 0);
    }
  }, [delivery, form, setFreight]);

  // Watch form values for freight calculation
  const watchClientId = form.watch('clientId');
  const watchWeight = form.watch('weight');
  const watchDeliveryType = form.watch('deliveryType');
  const watchCargoType = form.watch('cargoType');
  const watchCargoValue = form.watch('cargoValue');
  const watchCityId = form.watch('cityId');

  useEffect(() => {
    console.log("DeliveryForm - clientId mudou para:", watchClientId);
  }, [watchClientId]);

  // Calculate freight when relevant form values change
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
  }, [watchClientId, watchWeight, watchDeliveryType, watchCargoType, watchCargoValue, watchCityId, calculateFreight, setFreight]);

  return {
    watchDeliveryType
  };
};
