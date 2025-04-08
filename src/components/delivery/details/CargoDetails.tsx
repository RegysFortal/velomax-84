
import React from 'react';
import { Delivery } from '@/types';
import { Badge } from '@/components/ui/badge';

interface CargoDetailsProps {
  delivery: Delivery;
}

export function CargoDetails({ delivery }: CargoDetailsProps) {
  // Map delivery type to display text
  const getDeliveryTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      'standard': 'Padrão',
      'emergency': 'Emergência',
      'exclusive': 'Exclusivo',
      'saturday': 'Sábado',
      'sundayHoliday': 'Domingo/Feriado',
      'difficultAccess': 'Acesso Difícil',
      'metropolitanRegion': 'Região Metropolitana',
      'doorToDoorInterior': 'Interior',
      'reshipment': 'Redespacho',
      'normalBiological': 'Biológico Normal',
      'infectiousBiological': 'Biológico Infeccioso',
      'tracked': 'Rastreado'
    };
    
    return typeMap[type] || type;
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-gray-500">Quantidade de Volumes</p>
        <p className="font-medium">{delivery.packages}</p>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Peso</p>
        <p className="font-medium">{delivery.weight} kg</p>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Tipo de Entrega</p>
        <Badge variant={delivery.deliveryType === 'emergency' ? 'destructive' : 'default'}>
          {getDeliveryTypeText(delivery.deliveryType)}
        </Badge>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Tipo de Carga</p>
        <p className="font-medium">{delivery.cargoType === 'perishable' ? 'Perecível' : 'Padrão'}</p>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Valor Total do Frete</p>
        <p className="font-medium">R$ {delivery.totalFreight.toFixed(2)}</p>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Valor da Carga</p>
        <p className="font-medium">
          {delivery.cargoValue ? `R$ ${delivery.cargoValue.toFixed(2)}` : 'Não informado'}
        </p>
      </div>
    </div>
  );
}
