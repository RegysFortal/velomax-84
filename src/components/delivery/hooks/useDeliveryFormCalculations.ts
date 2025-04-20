
import { useCallback } from 'react';
import { useClients } from '@/contexts';
import { usePriceTables } from '@/contexts/priceTables/PriceTablesContext';
import { Delivery, DeliveryType, CargoType } from '@/types';
import { calculateFreight as calculateFreightUtil } from '@/utils/deliveryUtils';

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
  
  const calculateFreight = useCallback(() => {
    const formValues = form.getValues();
    const clientId = formValues.clientId;
    
    if (!clientId) {
      console.log("Não é possível calcular o frete: ID do cliente não fornecido");
      return;
    }
    
    const client = clients.find(c => c.id === clientId);
    if (!client) {
      console.log(`Cliente com ID ${clientId} não encontrado`);
      return;
    }
    
    // Obter a tabela de preço do cliente
    const priceTableId = client.priceTableId;
    if (!priceTableId) {
      console.log(`Cliente ${client.name} não possui tabela de preço associada`);
      return;
    }
    
    const priceTable = priceTables.find(pt => pt.id === priceTableId);
    if (!priceTable) {
      console.log(`Tabela de preço ${priceTableId} não encontrada`);
      return;
    }
    
    // Obter valores do formulário
    const weight = parseFloat(formValues.weight) || 0;
    const deliveryType = formValues.deliveryType as DeliveryType;
    const cargoType = formValues.cargoType as CargoType;
    const cargoValue = formValues.cargoValue ? parseFloat(formValues.cargoValue) : undefined;
    const cityId = formValues.cityId;
    
    console.log(`Calculando frete para cliente ${client.name} (${clientId}), tabela ${priceTable.name}`);
    console.log(`Parâmetros: peso=${weight}, tipo=${deliveryType}, carga=${cargoType}, valor=${cargoValue || 0}`);
    
    // Calcular o frete
    const calculatedFreight = calculateFreightUtil(
      priceTable,
      weight,
      deliveryType,
      cargoType,
      cargoValue,
      undefined,
      cityId ? { id: cityId, distance: 0 } : undefined
    );
    
    console.log(`Frete calculado: ${calculatedFreight}`);
    
    setFreight(calculatedFreight);
    return calculatedFreight;
  }, [form, clients, priceTables, setFreight]);
  
  return {
    calculateFreight
  };
};
