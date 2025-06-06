
import React from 'react';
import { Delivery } from '@/types';
import { formatToReadableDate } from '@/utils/dateUtils';
import { useAuth } from '@/contexts/auth/AuthContext';

interface DeliveryInfoProps {
  delivery: Delivery;
}

export function DeliveryInfo({ delivery }: DeliveryInfoProps) {
  const { users } = useAuth();

  // Get name for employee ID if available
  const getEmployeeName = (id: string | undefined) => {
    if (!id) return '';
    const user = users.find(u => u.id === id);
    return user ? user.name : '';
  };

  // For receiver - prefer employee name if ID exists, otherwise use manually entered name
  const receiverName = delivery.receiverId 
    ? getEmployeeName(delivery.receiverId) 
    : delivery.receiver || 'Não informado';

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Informações de Entrega</h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Recebedor</p>
          <p className="font-medium">{receiverName}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Data e Hora da Entrega</p>
          <p className="font-medium">
            {delivery.deliveryDate && formatToReadableDate(delivery.deliveryDate)}
            {delivery.deliveryTime && ` às ${delivery.deliveryTime}`}
          </p>
        </div>
      </div>
    </div>
  );
}
