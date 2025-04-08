
import React from 'react';
import { Delivery } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';

interface PickupInfoProps {
  delivery: Delivery;
}

export function PickupInfo({ delivery }: PickupInfoProps) {
  const { users } = useAuth();

  // Get name for employee ID if available
  const getEmployeeName = (id: string | undefined) => {
    if (!id) return '';
    const user = users.find(u => u.id === id);
    return user ? user.name : '';
  };

  // For pickup person - prefer employee name if ID exists, otherwise use manually entered name
  const pickupName = delivery.pickupId 
    ? getEmployeeName(delivery.pickupId) 
    : delivery.pickupName || 'Não informado';

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Informações de Retirada</h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Quem Retirou na Transportadora</p>
          <p className="font-medium">{pickupName}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Data e Hora da Retirada</p>
          <p className="font-medium">
            {delivery.pickupDate ? format(new Date(delivery.pickupDate), 'dd/MM/yyyy', { locale: ptBR }) : 'Não informado'}
            {delivery.pickupTime ? ` às ${delivery.pickupTime}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
