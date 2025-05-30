import React, { useEffect } from "react";
import { ClientSelection } from "@/components/shipment/ClientSelection";
import { TransportSection } from "@/components/shipment/TransportSection";
import { PackageDetailsSection } from "@/components/shipment/PackageDetailsSection";
import { ShipmentInfoSection } from "@/components/shipment/ShipmentInfoSection";
import { StatusSection } from "@/components/shipment/StatusSection";
import { RetentionFormSection } from "./form-sections/RetentionFormSection";
import { ObservationsSection } from "./form-sections/ObservationsSection";
import { FormActions } from "./form-sections/FormActions";
import { useCompanySelection } from "./hooks/useCompanySelection";
import { Client } from "@/types";
import { ShipmentStatus, TransportMode } from "@/types";

interface ShipmentFormContentProps {
  companyId: string;
  setCompanyId: (id: string) => void;
  setCompanyName: (name: string) => void;
  transportMode: TransportMode;
  setTransportMode: (mode: TransportMode) => void;
  carrierName: string;
  setCarrierName: (name: string) => void;
  trackingNumber: string;
  setTrackingNumber: (number: string) => void;
  packages: string;
  setPackages: (packages: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  arrivalFlight?: string;
  setArrivalFlight: (flight: string) => void;
  arrivalDate?: string;
  setArrivalDate: (date: string) => void;
  observations?: string;
  setObservations: (obs: string) => void;
  status: ShipmentStatus;
  setStatus: (status: ShipmentStatus) => void;
  retentionReason?: string;
  setRetentionReason: (reason: string) => void;
  retentionAmount?: string;
  setRetentionAmount: (amount: string) => void;
  paymentDate?: string;
  setPaymentDate: (date: string) => void;
  actionNumber?: string;
  setActionNumber: (number: string) => void;
  releaseDate?: string;
  setReleaseDate: (date: string) => void;
  fiscalNotes?: string;
  setFiscalNotes: (notes: string) => void;
  clients: Client[];
  onSubmit: () => void;
  onCancel: () => void;
}

export function ShipmentFormContent({
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
  retentionReason,
  setRetentionReason,
  retentionAmount,
  setRetentionAmount,
  paymentDate,
  setPaymentDate,
  actionNumber,
  setActionNumber,
  releaseDate,
  setReleaseDate,
  fiscalNotes,
  setFiscalNotes,
  clients,
  onSubmit,
  onCancel,
}: ShipmentFormContentProps) {
  useEffect(() => {
    console.log("ShipmentFormContent - Clients available:", clients.length);
    if (clients.length > 0) {
      console.log("ShipmentFormContent - First client:", clients[0].name);
    }
  }, [clients]);

  const { handleCompanyChange } = useCompanySelection({
    clients,
    setCompanyId,
    setCompanyName
  });

  return (
    <div className="space-y-8">
      {/* Client Selection */}
      <div className="space-y-2">
        <ClientSelection
          companyId={companyId}
          onCompanyChange={handleCompanyChange}
          clients={clients}
        />
      </div>
      
      {/* Transport Information */}
      <div className="space-y-4">
        <TransportSection 
          transportMode={transportMode}
          setTransportMode={setTransportMode}
          carrierName={carrierName}
          setCarrierName={setCarrierName}
          trackingNumber={trackingNumber}
          setTrackingNumber={setTrackingNumber}
        />
      </div>
      
      {/* Package Info */}
      <PackageDetailsSection 
        packages={packages}
        setPackages={setPackages}
        weight={weight}
        setWeight={setWeight}
      />
      
      {/* Arrival Information */}
      <ShipmentInfoSection 
        transportMode={transportMode}
        arrivalFlight={arrivalFlight}
        setArrivalFlight={setArrivalFlight}
        arrivalDate={arrivalDate}
        setArrivalDate={setArrivalDate}
        observations={observations}
        setObservations={setObservations}
      />
      
      {/* Status */}
      <StatusSection 
        status={status}
        setStatus={setStatus}
        shipmentId=""
      />
      
      {/* Retention Details (conditional) */}
      {status === "retained" && (
        <RetentionFormSection
          retentionReason={retentionReason}
          setRetentionReason={setRetentionReason}
          retentionAmount={retentionAmount}
          setRetentionAmount={setRetentionAmount}
          paymentDate={paymentDate}
          setPaymentDate={setPaymentDate}
          actionNumber={actionNumber}
          setActionNumber={setActionNumber}
          releaseDate={releaseDate}
          setReleaseDate={setReleaseDate}
          fiscalNotes={fiscalNotes}
          setFiscalNotes={setFiscalNotes}
        />
      )}
      
      {/* Observations */}
      <ObservationsSection 
        observations={observations}
        setObservations={setObservations}
      />
      
      {/* Form Actions */}
      <FormActions onSubmit={onSubmit} onCancel={onCancel} />
    </div>
  );
}
