
import React, { useEffect, useCallback, memo } from 'react';
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

// Use memoization to prevent unnecessary re-renders
export const ShipmentFormSection = memo(function ShipmentFormSection({
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
  // Handler to update client name when client ID changes - memoized to prevent re-creation
  const handleClientChange = useCallback((id: string) => {
    try {
      console.log("ShipmentFormSection - Client selected:", id);
      setCompanyId(id);
      // Find client and set name
      const selectedClient = clients.find(client => client.id === id);
      if (selectedClient) {
        const displayName = selectedClient.tradingName || selectedClient.name;
        console.log("ShipmentFormSection - Setting company name to:", displayName);
        setCompanyName(displayName);
      } else {
        console.warn("ShipmentFormSection - Client not found with ID:", id);
      }
    } catch (error) {
      console.error("Error handling client change:", error);
    }
  }, [clients, setCompanyId, setCompanyName]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <ClientSelection 
          companyId={companyId}
          onCompanyChange={handleClientChange}
          disabled={disabled}
          clients={clients}
        />
      </div>
      
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
});
