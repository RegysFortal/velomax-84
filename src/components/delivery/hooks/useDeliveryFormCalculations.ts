
import { useCallback, useEffect, useRef } from 'react';
import { Delivery, DeliveryType, CargoType } from '@/types';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { UseFormReturn } from 'react-hook-form';
import { DeliveryFormValues } from '../context/DeliveryFormContext';
import { usePriceTables } from '@/contexts';
import { useClientPriceTable } from '@/contexts/budget/useClientPriceTable';
import { calculateFreight as utilsCalculateFreight } from '@/utils/deliveryUtils';
import { useClients } from '@/contexts';
import { useCities } from '@/contexts/CitiesContext';

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
  const { clients } = useClients();
  const { cities } = useCities();
  
  // Use a ref to track if the freight was manually changed
  const manuallyChanged = useRef(false);
  const initialCalculationDone = useRef(false);

  const recalculateFreight = useCallback(() => {
    // Reset manual flag when explicitly calling recalculate
    manuallyChanged.current = false;
    
    const watchClientId = form.watch('clientId');
    const watchWeight = form.watch('weight');
    const watchDeliveryType = form.watch('deliveryType');
    const watchCargoType = form.watch('cargoType');
    const watchCargoValue = form.watch('cargoValue');
    const watchCityId = form.watch('cityId');

    console.log("Recalculando frete com valores:", {
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
        const cargoValueValue = watchCargoValue ? parseFloat(watchCargoValue) : 0;
        
        // Get the client's price table - this is the critical part we need to fix
        const priceTable = getClientPriceTable(watchClientId);
        console.log("Usando tabela de preço:", priceTable);
        
        // Get city if specified
        const selectedCity = watchCityId 
          ? cities.find(city => city.id === watchCityId)
          : undefined;
        
        let calculatedFreight = 0;
        
        if (priceTable) {
          // Calculate freight based on the client's price table
          calculatedFreight = utilsCalculateFreight(
            priceTable,
            weightValue,
            deliveryTypeValue,
            cargoTypeValue,
            cargoValueValue,
            undefined,
            selectedCity
          );
          
          console.log("Frete calculado usando tabela de preço:", calculatedFreight);
        } else {
          // Fallback calculation if price table not available
          calculatedFreight = contextCalculateFreight(
            watchClientId,
            weightValue,
            deliveryTypeValue,
            cargoTypeValue,
            cargoValueValue,
            undefined,
            watchCityId || undefined
          );
          console.log("Frete calculado usando contexto (sem tabela específica):", calculatedFreight);
        }
        
        // Round to two decimal places
        calculatedFreight = Math.round(calculatedFreight * 100) / 100;
        
        // Ensure we have a reasonable minimum value
        if (calculatedFreight <= 0) {
          calculatedFreight = calculateBasicFreight(cargoTypeValue, weightValue);
          console.log("Usando cálculo básico de frete (valor zero ou negativo):", calculatedFreight);
        }
        
        console.log("Definindo valor final do frete:", calculatedFreight);
        setFreight(calculatedFreight);
      } catch (error) {
        console.error('Erro calculando frete:', error);
        // Set a default freight value
        const defaultFreight = 50;
        console.log("Usando valor padrão de frete devido a erro:", defaultFreight);
        setFreight(defaultFreight);
      }
    } else {
      console.log("Não é possível calcular frete, valores necessários ausentes");
      if (delivery?.totalFreight) {
        // Manter valor de frete existente para modo de edição
        setFreight(delivery.totalFreight);
      } else {
        setFreight(50); // Ensure a default value is always set
      }
    }
    
    initialCalculationDone.current = true;
  }, [form, contextCalculateFreight, setFreight, getClientPriceTable, delivery, cities]);
  
  // Basic alternative freight calculation
  const calculateBasicFreight = (cargoType: CargoType, weight: number): number => {
    const baseRate = cargoType === 'perishable' ? 25 : 15;
    const multiplier = weight <= 5 ? 1 : weight <= 10 ? 1.5 : weight <= 20 ? 2 : 3;
    return Math.max(baseRate * multiplier, 50); // Ensure minimum freight is 50
  };

  // Initial calculation with a small delay to ensure form values are loaded
  useEffect(() => {
    if (!initialCalculationDone.current) {
      const timer = setTimeout(() => {
        recalculateFreight();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [recalculateFreight]);
  
  // Listen to input events to detect manual changes to freight value
  useEffect(() => {
    const handleInputEvent = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.type === 'number' && target.classList.contains('w-32')) {
        console.log("Manual freight input detected", target.value);
        manuallyChanged.current = true;
      }
    };
    
    document.addEventListener('input', handleInputEvent);
    
    return () => {
      document.removeEventListener('input', handleInputEvent);
    };
  }, []);
  
  // React to changes in form values that affect freight
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (!manuallyChanged.current && initialCalculationDone.current) {
        if (['clientId', 'weight', 'deliveryType', 'cargoType', 'cargoValue', 'cityId'].includes(name || '')) {
          console.log(`Valor ${name} mudou, recalculando frete automaticamente`);
          recalculateFreight();
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, recalculateFreight]);

  return {
    calculateFreight: recalculateFreight
  };
};
