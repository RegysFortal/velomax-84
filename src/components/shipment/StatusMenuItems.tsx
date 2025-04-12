
import React from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface StatusMenuItemsProps {
  currentStatus: ShipmentStatus;
  onStatusChange: (status: ShipmentStatus) => void;
}

export function StatusMenuItems({ currentStatus, onStatusChange }: StatusMenuItemsProps) {
  return (
    <>
      {currentStatus !== "in_transit" && (
        <DropdownMenuItem onClick={() => onStatusChange("in_transit")}>
          Marcar como Em Trânsito
        </DropdownMenuItem>
      )}
      {currentStatus !== "retained" && (
        <DropdownMenuItem onClick={() => onStatusChange("retained")}>
          Marcar como Retida
        </DropdownMenuItem>
      )}
      {currentStatus !== "delivered" && (
        <DropdownMenuItem onClick={() => onStatusChange("delivered")}>
          Marcar como Retirada
        </DropdownMenuItem>
      )}
      {currentStatus !== "partially_delivered" && (
        <DropdownMenuItem onClick={() => onStatusChange("partially_delivered")}>
          Marcar como Entregue Parcial
        </DropdownMenuItem>
      )}
      {currentStatus !== "delivered_final" && (
        <DropdownMenuItem onClick={() => onStatusChange("delivered_final")}>
          Marcar como Entregue
        </DropdownMenuItem>
      )}
    </>
  );
}
