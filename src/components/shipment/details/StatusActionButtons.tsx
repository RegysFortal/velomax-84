
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShipmentStatus } from "@/types/shipment";

interface StatusActionButtonsProps {
  status: ShipmentStatus;
  onStatusChangeClick: (status: ShipmentStatus) => void;
  documentCount?: number;
  deliveredDocumentCount?: number;
}

export function StatusActionButtons({ 
  status, 
  onStatusChangeClick,
  documentCount = 0,
  deliveredDocumentCount = 0
}: StatusActionButtonsProps) {
  // Determine if we show the partial delivery option based on document counts
  const shouldShowPartialDelivery = documentCount > 1 && deliveredDocumentCount > 0 && deliveredDocumentCount < documentCount;
  
  return (
    <div className="flex items-center space-x-4 mt-2 flex-wrap gap-2">
      {status !== "in_transit" && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onStatusChangeClick("in_transit")}
        >
          Marcar como Em Trânsito
        </Button>
      )}
      {status !== "at_carrier" && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onStatusChangeClick("at_carrier")}
        >
          Marcar como Na Transportadora
        </Button>
      )}
      {status !== "retained" && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onStatusChangeClick("retained")}
        >
          Marcar como Retido
        </Button>
      )}
      {status !== "delivered" && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onStatusChangeClick("delivered")}
        >
          Marcar como Retirado
        </Button>
      )}
      {status !== "delivered_final" && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onStatusChangeClick("delivered_final")}
        >
          Marcar como Entregue
        </Button>
      )}
      {status !== "partially_delivered" && !shouldShowPartialDelivery && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onStatusChangeClick("partially_delivered")}
        >
          Marcar como Entregue Parcial
        </Button>
      )}
      {/* Mensagem informativa para entregas parciais automáticas */}
      {shouldShowPartialDelivery && status !== "partially_delivered" && (
        <span className="text-sm text-amber-600">
          Status será automaticamente atualizado para Entregue Parcial ao salvar
        </span>
      )}
    </div>
  );
}
