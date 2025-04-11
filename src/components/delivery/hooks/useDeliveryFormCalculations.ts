
import { useCallback, useEffect } from 'react';
import { Delivery } from '@/types';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { UseFormReturn } from 'react-hook-form';
import { DeliveryFormValues } from '../context/DeliveryFormContext';
import { usePriceTables } from '@/contexts';
import { useClientPriceTable } from '@/contexts/budget/useClientPriceTable';

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
  const { calculateFreight } = useDeliveries();
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
        const deliveryTypeValue = watchDeliveryType as Delivery['deliveryType'];
        const cargoTypeValue = watchCargoType as Delivery['cargoType'];
        const cargoValueValue = watchCargoValue ? parseFloat(watchCargoValue) : undefined;
        
        // Try to get client-specific price table first
        const priceTable = getClientPriceTable(watchClientId);
        
        // Calculate freight
        let calculatedFreight;
        try {
          calculatedFreight = calculateFreight(
            watchClientId,
            weightValue,
            deliveryTypeValue,
            cargoTypeValue,
            cargoValueValue,
            undefined,
            watchCityId || undefined
          );
        } catch (error) {
          console.warn("Failed to calculate client-specific freight, using fallback:", error);
          // Fallback to basic calculation
          calculatedFreight = calculateBasicFreight(cargoTypeValue, weightValue);
        }
        
        console.log("Calculated freight:", calculatedFreight);
        
        // If calculated value is too low, use a reasonable default
        if (calculatedFreight <= 0) {
          calculatedFreight = calculateBasicFreight(cargoTypeValue, weightValue);
        }
        
        setFreight(calculatedFreight);
      } catch (error) {
        console.error('Error calculating freight:', error);
        // Set a default freight value
        const defaultFreight = 50;
        console.log("Using default freight value:", defaultFreight);
        setFreight(defaultFreight);
      }
    } else {
      console.log("Can't calculate freight, missing required values");
      setFreight(50); // Ensure a default value is always set
    }
  }, [form, calculateFreight, setFreight, getClientPriceTable]);
  
  // Execute initial calculation when component mounts or when 
  // delivery/isEditMode changes
  useEffect(() => {
    // Initial calculation with a slight delay to ensure form values are loaded
    const timer = setTimeout(() => {
      recalculateFreight();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [recalculateFreight, delivery, isEditMode]);
  
  // Basic fallback freight calculation
  const calculateBasicFreight = (cargoType: Delivery['cargoType'], weight: number): number => {
    const baseRate = cargoType === 'perishable' ? 25 : 15;
    const multiplier = weight <= 5 ? 1 : weight <= 10 ? 1.5 : weight <= 20 ? 2 : 3;
    return Math.max(baseRate * multiplier, 50); // Ensure minimum freight is 50
  };

  return {
    calculateFreight: recalculateFreight
  };
};
