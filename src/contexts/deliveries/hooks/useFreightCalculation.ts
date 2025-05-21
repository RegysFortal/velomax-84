
import { DeliveryType, CargoType } from '@/types/delivery';
import { City } from '@/types';
import { calculateFreight as utilsCalculateFreight } from '@/utils/delivery';

export function useFreightCalculation(getClientPriceTable: (clientId: string) => any, cities: City[]) {
  const calculateFreight = (
    clientId: string,
    weight: number,
    deliveryType: DeliveryType,
    cargoType: CargoType,
    cargoValue?: number,
    distance?: number,
    cityId?: string
  ): number => {
    // Usar o hook do useClientPriceTable para obter a tabela de preço do cliente
    const priceTable = getClientPriceTable(clientId);
    
    if (!priceTable) {
      console.log(`Cliente não possui tabela de preço associada`);
      return 0;
    }
    
    // Encontrar a cidade completa a partir do ID
    let cityObj = undefined;
    if (cityId) {
      cityObj = cities.find(c => c.id === cityId);
    }
    
    // Usar a função de cálculo de frete da utility
    return utilsCalculateFreight(
      priceTable,
      weight,
      deliveryType,
      cargoType,
      cargoValue,
      distance,
      cityObj
    );
  };

  return { calculateFreight };
}
