
import React from 'react';
import { CheckSquare } from "lucide-react";
import { Document } from "@/types/shipment";

interface DeliveryInfoProps {
  document: Document;
  shipment: any;
  shouldShowPriorityBackground: boolean;
}

export function DeliveryInfo({ document, shipment, shouldShowPriorityBackground }: DeliveryInfoProps) {
  if (!document.isDelivered) return null;
  
  return (
    <div className={`mt-3 border-t ${shouldShowPriorityBackground ? 'border-red-300' : 'border-green-200'} pt-2`}>
      <div className={`${shouldShowPriorityBackground ? 'bg-red-100' : 'bg-green-50'} p-2 rounded text-sm`}>
        <div className={`flex items-center ${shouldShowPriorityBackground ? 'text-red-800' : 'text-green-800'} font-medium mb-1`}>
          <CheckSquare className={`h-4 w-4 mr-1 ${shouldShowPriorityBackground ? 'text-red-600' : 'text-green-600'}`} />
          Informações de Entrega
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 ${shouldShowPriorityBackground ? 'text-red-700' : 'text-green-700'}`}>
          {shipment?.receiverName && (
            <div>Recebido por: {shipment.receiverName}</div>
          )}
          {shipment?.deliveryDate && (
            <div>Data: {shipment.deliveryDate}</div>
          )}
          {shipment?.deliveryTime && (
            <div>Hora: {shipment.deliveryTime}</div>
          )}
        </div>
      </div>
    </div>
  );
}
