
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShipmentStatus } from "@/types/shipment";

interface StatusActionButtonsProps {
  status: ShipmentStatus;
  onStatusChangeClick: (status: ShipmentStatus) => void;
}

export function StatusActionButtons({ status, onStatusChangeClick }: StatusActionButtonsProps) {
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
      {status !== "partially_delivered" && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onStatusChangeClick("partially_delivered")}
        >
          Marcar como Entregue Parcial
        </Button>
      )}
    </div>
  );
}
