
import React from 'react';
import { StatusActions } from "../../StatusActions";
import { ShipmentStatus } from "@/types/shipment";

interface StatusActionsWrapperProps {
  status: ShipmentStatus;
  shipmentId: string;
  onStatusChange: () => void;
}

export function StatusActionsWrapper({
  status,
  shipmentId,
  onStatusChange
}: StatusActionsWrapperProps) {
  return (
    <StatusActions 
      status={status} 
      shipmentId={shipmentId} 
      onStatusChange={onStatusChange}
    />
  );
}
