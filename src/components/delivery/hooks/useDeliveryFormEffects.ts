
import { useEffect } from 'react';
import { format } from 'date-fns';
import { Delivery } from '@/types';
import { useDeliveryFormContext } from '../context/DeliveryFormContext';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts';

export const useDeliveryFormEffects = () => {
  const { 
    form, 
    delivery, 
    isEditMode, 
    setFreight,
    setShowDoorToDoor
  } = useDeliveryFormContext();
  
  const { calculateFreight, isDoorToDoorDelivery } = useDeliveries();
  const { clients } = useClients();

  // Initialize form with delivery data for edit mode
  useEffect(() => {
    if (delivery) {
      console.log("DeliveryForm - Entrega a ser editada:", delivery);
      console.log("DeliveryForm - Cliente ID:", delivery.clientId);
      console.log("DeliveryForm - Clientes disponíveis:", clients);
    }
  }, [delivery, clients]);

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
        pickupName: delivery.pickupName || '',
        pickupDate: delivery.pickupDate || '',
        pickupTime: delivery.pickupTime || '',
      });
      
      setFreight(delivery.totalFreight || 0);
      
      if (setShowDoorToDoor && isDoorToDoorDelivery(delivery.deliveryType)) {
        setShowDoorToDoor(true);
      }
    }
  }, [delivery, isDoorToDoorDelivery, form, setFreight, setShowDoorToDoor]);

  // Watch form values for freight calculation and door-to-door detection
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

  // Update door-to-door status when delivery type changes
  useEffect(() => {
    if (watchDeliveryType && setShowDoorToDoor) {
      setShowDoorToDoor(isDoorToDoorDelivery(watchDeliveryType as Delivery['deliveryType']));
    }
  }, [watchDeliveryType, isDoorToDoorDelivery, setShowDoorToDoor]);

  return {
    watchDeliveryType
  };
};
