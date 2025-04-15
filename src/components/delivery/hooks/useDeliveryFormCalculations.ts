
import { useCallback, useEffect } from 'react';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { usePriceTables } from '@/contexts/priceTables';
import { useClients } from '@/contexts';
import { useCities } from '@/contexts/CitiesContext';
import { Delivery, City } from '@/types';
import { calculateFreight as deliveryUtilsCalculateFreight } from '@/utils/deliveryUtils';
import { toast } from 'sonner';

interface UseDeliveryFormCalculationsProps {
  form: any;
  setFreight: (value: number) => void;
  delivery: Delivery | null;
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
  const { clients } = useClients();
  const { cities } = useCities();
  
  // Watch values that affect freight calculation
  const watchClientId = form.watch('clientId');
  const watchWeight = form.watch('weight');
  const watchDeliveryType = form.watch('deliveryType');
  const watchCargoType = form.watch('cargoType');
  const watchCargoValue = form.watch('cargoValue');
  const watchCityId = form.watch('cityId');
  
  // Calculate freight based on the form values
  const calculateFormFreight = useCallback(() => {
    try {
      if (!watchClientId) {
        console.log("Não foi possível calcular o frete: Cliente não selecionado");
        return;
      }
      
      if (!watchWeight || isNaN(parseFloat(watchWeight))) {
        console.log("Não foi possível calcular o frete: Peso inválido");
        return;
      }
      
      console.log("Recalculando frete com valores:", {
        clientId: watchClientId,
        weight: watchWeight,
        deliveryType: watchDeliveryType,
        cargoType: watchCargoType,
        cargoValue: watchCargoValue,
        cityId: watchCityId
      });
      
      // Find the client
      const client = clients.find(c => c.id === watchClientId);
      if (!client) {
        console.warn("Cliente não encontrado");
        return;
      }
      
      // Find the price table
      const priceTable = priceTables.find(pt => pt.id === client.priceTableId);
      if (!priceTable) {
        console.warn("Tabela de preço não encontrada para cliente", client.name);
        return;
      }
      
      console.log("Tabela de preço encontrada para cliente", client.name + ":", priceTable.name);
      console.log("Usando tabela de preço:", priceTable);
      
      // Find the city if needed
      let city: City | undefined;
      if (watchCityId) {
        city = cities.find(c => c.id === watchCityId);
      }
      
      const weight = parseFloat(watchWeight);
      const cargoValue = watchCargoValue ? parseFloat(watchCargoValue) : undefined;
      
      // Use the utility function from deliveryUtils.ts
      const freightValue = deliveryUtilsCalculateFreight(
        priceTable,
        weight,
        watchDeliveryType,
        watchCargoType,
        cargoValue,
        city?.distance,
        city
      );
      
      console.log("Frete calculado usando tabela de preço:", freightValue);
      console.log("Definindo valor final do frete:", freightValue);
      
      // Update the freight value
      setFreight(freightValue);
      
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      toast.error("Não foi possível calcular o frete. Verifique os dados informados.");
    }
  }, [
    watchClientId,
    watchWeight,
    watchDeliveryType,
    watchCargoType,
    watchCargoValue,
    watchCityId,
    clients,
    priceTables,
    cities,
    setFreight
  ]);
  
  return {
    calculateFreight: calculateFormFreight
  };
};
