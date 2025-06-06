
import React from 'react';
import { CheckSquare, User, Calendar, Clock } from "lucide-react";
import { Document } from "@/types/shipment";

interface DeliveryInfoProps {
  document: Document;
  shipment: any;
  shouldShowPriorityBackground: boolean;
}

export function DeliveryInfo({ document, shipment, shouldShowPriorityBackground }: DeliveryInfoProps) {
  if (!document.isDelivered) return null;
  
  const deliveryInfo = document.deliveryInfo;
  
  return (
    <div className={`mt-3 border-t ${shouldShowPriorityBackground ? 'border-red-300' : 'border-green-200'} pt-2`}>
      <div className={`${shouldShowPriorityBackground ? 'bg-red-100' : 'bg-green-50'} p-3 rounded text-sm`}>
        <div className={`flex items-center ${shouldShowPriorityBackground ? 'text-red-800' : 'text-green-800'} font-medium mb-2`}>
          <CheckSquare className={`h-4 w-4 mr-1 ${shouldShowPriorityBackground ? 'text-red-600' : 'text-green-600'}`} />
          Informações de Entrega
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 ${shouldShowPriorityBackground ? 'text-red-700' : 'text-green-700'}`}>
          {deliveryInfo?.receiverName && (
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span className="font-medium">Recebedor:</span> {deliveryInfo.receiverName}
            </div>
          )}
          
          {deliveryInfo?.deliveryDate && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="font-medium">Data:</span> {new Date(deliveryInfo.deliveryDate).toLocaleDateString('pt-BR')}
            </div>
          )}
          
          {deliveryInfo?.deliveryTime && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span className="font-medium">Hora:</span> {deliveryInfo.deliveryTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
