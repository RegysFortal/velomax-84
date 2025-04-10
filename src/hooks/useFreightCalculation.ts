
import { useCallback } from 'react';
import { Delivery } from '@/types';
import { useClients } from '@/contexts';
import { usePriceTables } from '@/contexts/PriceTablesContext';
import { useCities } from '@/contexts/CitiesContext';
import { calculateFreight as calculateFreightUtil } from '@/utils/deliveryUtils';

export const useFreightCalculation = () => {
  const { clients } = useClients();
  const { priceTables } = usePriceTables();
  const { cities } = useCities();

  const calculateFreight = useCallback((
    clientId: string,
    weight: number,
    deliveryType: Delivery['deliveryType'],
    cargoType: Delivery['cargoType'],
    cargoValue?: number,
    _distance?: number,
    cityId?: string
  ): number => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return 0;
    
    const priceTable = priceTables.find(pt => pt.id === client.priceTableId);
    if (!priceTable) return 0;
    
    const city = cityId ? cities.find(c => c.id === cityId) : undefined;
    
    return calculateFreightUtil(
      priceTable,
      weight,
      deliveryType,
      cargoType,
      cargoValue,
      _distance,
      city
    );
  }, [clients, priceTables, cities]);

  return { calculateFreight };
};
