
import { useCallback, useEffect } from 'react';
import { Delivery, DeliveryType, CargoType } from '@/types';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { UseFormReturn } from 'react-hook-form';
import { DeliveryFormValues } from '../context/DeliveryFormContext';
import { usePriceTables } from '@/contexts';
import { useClientPriceTable } from '@/contexts/budget/useClientPriceTable';
import { calculateFreight as utilsCalculateFreight } from '@/utils/deliveryUtils';
import { calculateBudgetValue } from '@/contexts/priceTables/priceTableUtils';

export interface UseDeliveryFormCalculationsProps {
  form: UseFormReturn<DeliveryFormValues>;
  setFreight: (value: number) => void;
  delivery: Delivery | null | undefined;
  isEditMode: boolean;
}

export const useDeliveryFormCalculations = ({
  form,
  setFreight,
  delivery,
  isEditMode
}: UseDeliveryFormCalculationsProps) => {
  const { calculateFreight: contextCalculateFreight } = useDeliveries();
  const { priceTables } = usePriceTables();
  const { getClientPriceTable } = useClientPriceTable();

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
        const weightValue = parseFloat(watchWeight);
        const deliveryTypeValue = watchDeliveryType as DeliveryType;
        const cargoTypeValue = watchCargoType as CargoType;
        const cargoValueValue = watchCargoValue ? parseFloat(watchCargoValue) : undefined;
        
        // Get client's price table
        const priceTable = getClientPriceTable(watchClientId);
        console.log("Using price table:", priceTable);
        
        let calculatedFreight = 0;
        
        if (priceTable) {
          // Using the updated budgetValue calculation, but adapting for delivery
          calculatedFreight = calculateBudgetValue(
            priceTable,
            deliveryTypeValue,
            weightValue,
            cargoValueValue,
            [], // No additional services for deliveries
            true, // Assume both collection and delivery for deliveries
            true
          );
          
          console.log("Calculated freight using price table:", calculatedFreight);
        } else {
          // Fall back to context calculation if price table isn't available
          calculatedFreight = contextCalculateFreight(
            watchClientId,
            weightValue,
            deliveryTypeValue,
            cargoTypeValue,
            cargoValueValue,
            undefined,
            watchCityId || undefined
          );
          console.log("Calculated freight using context:", calculatedFreight);
        }
        
        // Ensure we have a reasonable minimum value
        if (calculatedFreight <= 0) {
          calculatedFreight = calculateBasicFreight(cargoTypeValue, weightValue);
          console.log("Using basic freight calculation:", calculatedFreight);
        }
        
        setFreight(calculatedFreight);
      } catch (error) {
        console.error('Error calculating freight:', error);
        // Set a default freight value
        const defaultFreight = 50;
        console.log("Using default freight value due to error:", defaultFreight);
        setFreight(defaultFreight);
      }
    } else {
      console.log("Can't calculate freight, missing required values");
      if (delivery?.totalFreight) {
        // Keep existing freight value for edit mode
        setFreight(delivery.totalFreight);
      } else {
        setFreight(50); // Ensure a default value is always set
      }
    }
  }, [form, contextCalculateFreight, setFreight, getClientPriceTable, delivery]);
  
  // Basic fallback freight calculation
  const calculateBasicFreight = (cargoType: CargoType, weight: number): number => {
    const baseRate = cargoType === 'perishable' ? 25 : 15;
    const multiplier = weight <= 5 ? 1 : weight <= 10 ? 1.5 : weight <= 20 ? 2 : 3;
    return Math.max(baseRate * multiplier, 50); // Ensure minimum freight is 50
  };
  
  // Execute initial calculation when component mounts or when 
  // delivery/isEditMode changes
  useEffect(() => {
    // Initial calculation with a slight delay to ensure form values are loaded
    const timer = setTimeout(() => {
      recalculateFreight();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [recalculateFreight, delivery, isEditMode]);
  
  // React to changes in form values that affect freight
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (['clientId', 'weight', 'deliveryType', 'cargoType', 'cargoValue', 'cityId'].includes(name || '')) {
        console.log(`${name} changed, recalculating freight`);
        recalculateFreight();
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, recalculateFreight]);

  return {
    calculateFreight: recalculateFreight
  };
};
