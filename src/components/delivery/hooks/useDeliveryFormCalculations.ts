
import { useCallback } from 'react';
import { useClients } from '@/contexts';
import { usePriceTables } from '@/contexts/priceTables/PriceTablesContext';
import { Delivery, DeliveryType, CargoType, City } from '@/types';
import { calculateFreight as calculateFreightUtil } from '@/utils/delivery';
import { useCities } from '@/contexts/cities';
import { useClientPriceTable } from '@/contexts/budget/useClientPriceTable';

interface UseDeliveryFormCalculationsProps {
  form: any;
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
  const { clients } = useClients();
  const { priceTables } = usePriceTables();
  const { cities } = useCities();
  const { getClientPriceTable } = useClientPriceTable();
  
  const calculateFreight = useCallback(() => {
    const formValues = form.getValues();
    const clientId = formValues.clientId;
    const deliveryType = formValues.deliveryType as DeliveryType;
    
    // Se for cortesia, zerar o frete
    if (deliveryType === 'cortesia') {
      console.log("Tipo cortesia selecionado - zerando frete");
      setFreight(0);
      return 0;
    }
    
    if (!clientId) {
      console.log("Não é possível calcular o frete: ID do cliente não fornecido");
      return 0; // Return 0 instead of undefined
    }
    
    // Usar o hook do useClientPriceTable para obter a tabela de preço
    const priceTable = getClientPriceTable(clientId);
    if (!priceTable) {
      console.log(`Cliente não possui tabela de preço associada`);
      return 0; // Return 0 instead of undefined
    }
    
    // Obter valores do formulário
    const weight = parseFloat(formValues.weight) || 0;
    const cargoType = formValues.cargoType as CargoType;
    const cargoValue = formValues.cargoValue ? parseFloat(formValues.cargoValue) : undefined;
    const cityId = formValues.cityId;
    
    console.log(`Calculando frete para cliente com tabela ${priceTable.name}`);
    console.log(`Parâmetros: peso=${weight}, tipo=${deliveryType}, carga=${cargoType}, valor=${cargoValue || 0}`);
    
    // Encontrar a cidade completa a partir do ID
    let cityObj: City | undefined;
    if (cityId) {
      cityObj = cities.find(c => c.id === cityId);
      if (!cityObj) {
        console.log(`Cidade com ID ${cityId} não encontrada`);
      } else {
        console.log(`Cidade encontrada: ${cityObj.name}, distância: ${cityObj.distance || 'N/A'}`);
      }
    }
    
    // Calcular o frete
    const calculatedFreight = calculateFreightUtil(
      priceTable,
      weight,
      deliveryType,
      cargoType,
      cargoValue,
      undefined,
      cityObj
    );
    
    console.log(`Frete calculado: ${calculatedFreight}`);
    
    setFreight(calculatedFreight);
    return calculatedFreight;
  }, [form, cities, getClientPriceTable, setFreight]);

  // Nova função para permitir a definição manual do frete, independente da tabela de preço do cliente
  const setManualFreight = useCallback((value: number) => {
    console.log(`Definindo frete manualmente para: ${value}`);
    setFreight(value);
  }, [setFreight]);
  
  return {
    calculateFreight,
    setManualFreight
  };
};
