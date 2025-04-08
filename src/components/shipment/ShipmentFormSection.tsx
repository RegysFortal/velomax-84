
import React from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { Client } from "@/types";
import { ClientSelection } from "./ClientSelection";
import { TransportSection } from "./TransportSection";
import { PackageDetailsSection } from "./PackageDetailsSection";
import { ShipmentInfoSection } from "./ShipmentInfoSection";
import { StatusSection } from "./StatusSection";

interface ShipmentFormSectionProps {
  companyId: string;
  setCompanyId: (id: string) => void;
  setCompanyName: (name: string) => void;
  transportMode: "air" | "road";
  setTransportMode: (mode: "air" | "road") => void;
  carrierName: string;
  setCarrierName: (name: string) => void;
  trackingNumber: string;
  setTrackingNumber: (number: string) => void;
  packages: string;
  setPackages: (packages: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  arrivalFlight: string;
  setArrivalFlight: (flight: string) => void;
  arrivalDate: string;
  setArrivalDate: (date: string) => void;
  observations: string;
  setObservations: (observations: string) => void;
  status: ShipmentStatus;
  setStatus: (status: ShipmentStatus) => void;
  clients: Client[];
}

export function ShipmentFormSection({
  companyId,
  setCompanyId,
  setCompanyName,
  transportMode,
  setTransportMode,
  carrierName,
  setCarrierName,
  trackingNumber,
  setTrackingNumber,
  packages,
  setPackages,
  weight,
  setWeight,
  arrivalFlight,
  setArrivalFlight,
  arrivalDate,
  setArrivalDate,
  observations,
  setObservations,
  status,
  setStatus,
  clients
}: ShipmentFormSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ClientSelection 
        companyId={companyId}
        setCompanyId={setCompanyId}
        setCompanyName={setCompanyName}
        clients={clients}
      />
      
      <TransportSection 
        transportMode={transportMode}
        setTransportMode={setTransportMode}
        carrierName={carrierName}
        setCarrierName={setCarrierName}
        trackingNumber={trackingNumber}
        setTrackingNumber={setTrackingNumber}
      />
      
      <PackageDetailsSection 
        packages={packages}
        setPackages={setPackages}
        weight={weight}
        setWeight={setWeight}
      />
      
      <ShipmentInfoSection 
        transportMode={transportMode}
        arrivalFlight={arrivalFlight}
        setArrivalFlight={setArrivalFlight}
        arrivalDate={arrivalDate}
        setArrivalDate={setArrivalDate}
        observations={observations}
        setObservations={setObservations}
      />
      
      <StatusSection 
        status={status}
        setStatus={setStatus}
      />
    </div>
  );
}
