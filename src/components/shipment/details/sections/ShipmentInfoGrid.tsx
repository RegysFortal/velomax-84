
import React from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { GeneralInfoWrapper } from "./InfoSections/GeneralInfoWrapper";
import { CargoDetailsWrapper } from "./InfoSections/CargoDetailsWrapper";
import { StatusActionsWrapper } from "./InfoSections/StatusActionsWrapper";

interface ShipmentInfoGridProps {
  companyName: string;
  transportMode: "air" | "road";
  carrierName: string;
  trackingNumber: string;
  packages: number;
  weight: number;
  arrivalFlight?: string;
  arrivalDate?: string;
  status: ShipmentStatus;
  shipmentId: string;
  onStatusChange: () => void;
}

export function ShipmentInfoGrid({
  companyName,
  transportMode,
  carrierName,
  trackingNumber,
  packages,
  weight,
  arrivalFlight,
  arrivalDate,
  status,
  shipmentId,
  onStatusChange
}: ShipmentInfoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <GeneralInfoWrapper
        companyName={companyName}
        transportMode={transportMode}
        carrierName={carrierName}
        trackingNumber={trackingNumber}
      />
      
      <CargoDetailsWrapper
        packages={packages}
        weight={weight}
        transportMode={transportMode}
        arrivalFlight={arrivalFlight}
        arrivalDate={arrivalDate}
      />
      
      <StatusActionsWrapper 
        status={status} 
        shipmentId={shipmentId} 
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
