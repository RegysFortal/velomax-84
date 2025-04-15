
import React, { useEffect } from 'react';
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
  shipmentId: string;
  disabled?: boolean;
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
  clients,
  shipmentId,
  disabled
}: ShipmentFormSectionProps) {
  // Handler to update client name when client ID changes
  const handleClientChange = (id: string) => {
    try {
      console.log("ShipmentFormSection - Client selected:", id);
      setCompanyId(id);
      // Find client and set name
      const selectedClient = clients.find(client => client.id === id);
      if (selectedClient) {
        const displayName = selectedClient.tradingName || selectedClient.name;
        console.log("ShipmentFormSection - Setting company name to:", displayName);
        setCompanyName(displayName);
      }
    } catch (error) {
      console.error("Error handling client change:", error);
    }
  };

  // Debug output to help diagnose issues
  useEffect(() => {
    if (clients.length > 0) {
      console.log("ShipmentFormSection - Available clients:", clients.length);
    }
  }, [clients]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ClientSelection 
        companyId={companyId}
        onCompanyChange={handleClientChange}
        disabled={disabled}
      />
      
      <TransportSection 
        transportMode={transportMode}
        setTransportMode={setTransportMode}
        carrierName={carrierName}
        setCarrierName={setCarrierName}
        trackingNumber={trackingNumber}
        setTrackingNumber={setTrackingNumber}
        disabled={disabled}
      />
      
      <PackageDetailsSection 
        packages={packages}
        setPackages={setPackages}
        weight={weight}
        setWeight={setWeight}
        disabled={disabled}
      />
      
      <ShipmentInfoSection 
        transportMode={transportMode}
        arrivalFlight={arrivalFlight}
        setArrivalFlight={setArrivalFlight}
        arrivalDate={arrivalDate}
        setArrivalDate={setArrivalDate}
        observations={observations}
        setObservations={setObservations}
        disabled={disabled}
      />
      
      <StatusSection 
        status={status}
        setStatus={setStatus}
        shipmentId={shipmentId}
        disabled={disabled}
      />
    </div>
  );
}
