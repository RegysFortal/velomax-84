
import { useCallback } from 'react';
import { Delivery } from '@/types';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { UseFormReturn } from 'react-hook-form';
import { DeliveryFormValues } from '../context/DeliveryFormContext';

interface UseDeliveryFormCalculationsProps {
  form: UseFormReturn<DeliveryFormValues>;
  setFreight: React.Dispatch<React.SetStateAction<number>>;
  delivery: Delivery | null | undefined;
  isEditMode: boolean;
}

export const useDeliveryFormCalculations = ({
  form,
  setFreight,
  delivery,
  isEditMode
}: UseDeliveryFormCalculationsProps) => {
  const { calculateFreight } = useDeliveries();

  const recalculateFreight = useCallback(() => {
    const watchClientId = form.watch('clientId');
    const watchWeight = form.watch('weight');
    const watchDeliveryType = form.watch('deliveryType');
    const watchCargoType = form.watch('cargoType');
    const watchCargoValue = form.watch('cargoValue');
    const watchCityId = form.watch('cityId');

    console.log("Recalculating freight with values:", {
      clientId: watchClientId,
      weight: watchWeight,
      deliveryType: watchDeliveryType,
      cargoType: watchCargoType,
      cargoValue: watchCargoValue,
      cityId: watchCityId
    });

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
        
        console.log("Calculated freight:", calculatedFreight);
        setFreight(calculatedFreight);
      } catch (error) {
        console.error('Error calculating freight:', error);
      }
    } else {
      console.log("Can't calculate freight, missing required values");
    }
  }, [form, calculateFreight, setFreight]);

  return {
    calculateFreight: recalculateFreight
  };
};
