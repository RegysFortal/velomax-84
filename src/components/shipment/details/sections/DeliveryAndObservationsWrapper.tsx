
import React from 'react';
import { DeliveryInfoSection } from "./DeliveryInfoSection";
import { ObservationsSection } from "./ObservationsSection";

interface DeliveryAndObservationsWrapperProps {
  status: string;
  receiverName?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  observations?: string;
}

export function DeliveryAndObservationsWrapper({
  status,
  receiverName,
  deliveryDate,
  deliveryTime,
  observations
}: DeliveryAndObservationsWrapperProps) {
  return (
    <>
      {/* Informações de Entrega (se aplicável) */}
      {status === "delivered_final" && (
        <DeliveryInfoSection
          receiverName={receiverName}
          deliveryDate={deliveryDate}
          deliveryTime={deliveryTime}
        />
      )}
      
      {/* Observações */}
      {observations && (
        <ObservationsSection observations={observations} />
      )}
    </>
  );
}
