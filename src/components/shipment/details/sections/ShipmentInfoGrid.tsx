
import React from 'react';
import { StatusActions } from "../StatusActions";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { CargoDetailsSection } from "./CargoDetailsSection";

interface ShipmentInfoGridProps {
  companyName: string;
  transportMode: "air" | "road";
  carrierName: string;
  trackingNumber: string;
  packages: number;
  weight: number;
  arrivalFlight?: string;
  arrivalDate?: string;
  status: string;
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
      <GeneralInfoSection
        companyName={companyName}
        transportMode={transportMode}
        carrierName={carrierName}
        trackingNumber={trackingNumber}
      />
      
      <CargoDetailsSection
        packages={packages}
        weight={weight}
        transportMode={transportMode}
        arrivalFlight={arrivalFlight}
        arrivalDate={arrivalDate}
      />
      
      <StatusActions 
        status={status} 
        shipmentId={shipmentId} 
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
