
import { useCallback, useEffect } from 'react';
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

  const recalculateFreight = useCallback(() => {
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
        const cargoValueValue = watchCargoValue ? parseFloat(watchCargoValue) : undefined;
        
        // Obter a tabela de preço do cliente
        const priceTable = getClientPriceTable(watchClientId);
        console.log("Usando tabela de preço:", priceTable);
        
        // Obter a cidade, se especificada
        const selectedCity = watchCityId 
          ? cities.find(city => city.id === watchCityId)
          : undefined;
        
        let calculatedFreight = 0;
        
        if (priceTable) {
          // Usar a função de cálculo de frete baseada na tabela de preços
          calculatedFreight = utilsCalculateFreight(
            priceTable,
            weightValue,
            deliveryTypeValue,
            cargoTypeValue,
            cargoValueValue || 0,
            undefined,
            selectedCity
          );
          
          console.log("Frete calculado usando tabela de preço:", calculatedFreight);
        } else {
          // Usar cálculo de fallback se tabela de preço não estiver disponível
          calculatedFreight = contextCalculateFreight(
            watchClientId,
            weightValue,
            deliveryTypeValue,
            cargoTypeValue,
            cargoValueValue,
            undefined,
            watchCityId || undefined
          );
          console.log("Frete calculado usando contexto:", calculatedFreight);
        }
        
        // Garantir que temos um valor mínimo razoável
        if (calculatedFreight <= 0) {
          calculatedFreight = calculateBasicFreight(cargoTypeValue, weightValue);
          console.log("Usando cálculo básico de frete:", calculatedFreight);
        }
        
        setFreight(calculatedFreight);
      } catch (error) {
        console.error('Erro calculando frete:', error);
        // Definir um valor padrão de frete
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
        setFreight(50); // Garantir que um valor padrão é sempre definido
      }
    }
  }, [form, contextCalculateFreight, setFreight, getClientPriceTable, delivery, cities]);
  
  // Cálculo básico de frete alternativo
  const calculateBasicFreight = (cargoType: CargoType, weight: number): number => {
    const baseRate = cargoType === 'perishable' ? 25 : 15;
    const multiplier = weight <= 5 ? 1 : weight <= 10 ? 1.5 : weight <= 20 ? 2 : 3;
    return Math.max(baseRate * multiplier, 50); // Garantir que frete mínimo é 50
  };
  
  // Executar cálculo inicial quando componente é montado ou quando 
  // delivery/isEditMode muda
  useEffect(() => {
    // Cálculo inicial com um pequeno atraso para garantir que valores do formulário são carregados
    const timer = setTimeout(() => {
      recalculateFreight();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [recalculateFreight, delivery, isEditMode]);
  
  // Reagir a mudanças nos valores do formulário que afetam o frete
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (['clientId', 'weight', 'deliveryType', 'cargoType', 'cargoValue', 'cityId'].includes(name || '')) {
        console.log(`${name} mudou, recalculando frete`);
        recalculateFreight();
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, recalculateFreight]);

  return {
    calculateFreight: recalculateFreight
  };
};
