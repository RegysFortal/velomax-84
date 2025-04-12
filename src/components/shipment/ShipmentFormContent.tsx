import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ShipmentFormSection } from "./ShipmentFormSection";
import { RetentionFormSection } from "./RetentionFormSection";
import { ShipmentStatus } from "@/types/shipment";
import { Client } from "@/types";

interface ShipmentFormContentProps {
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
  retentionReason: string;
  setRetentionReason: (reason: string) => void;
  retentionAmount: string;
  setRetentionAmount: (amount: string) => void;
  paymentDate: string;
  setPaymentDate: (date: string) => void;
  actionNumber?: string;
  setActionNumber?: (action: string) => void;
  releaseDate?: string;
  setReleaseDate?: (date: string) => void;
  fiscalNotes?: string;
  setFiscalNotes?: (notes: string) => void;
  clients: Client[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: (e?: React.MouseEvent) => void;
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
  actionNumber = "",
  setActionNumber = () => {},
  releaseDate = "",
  setReleaseDate = () => {},
  fiscalNotes = "",
  setFiscalNotes = () => {},
  clients,
  onSubmit,
  onCancel
}: ShipmentFormContentProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ShipmentFormSection 
        companyId={companyId}
        setCompanyId={setCompanyId}
        setCompanyName={setCompanyName}
        transportMode={transportMode}
        setTransportMode={setTransportMode}
        carrierName={carrierName}
        setCarrierName={setCarrierName}
        trackingNumber={trackingNumber}
        setTrackingNumber={setTrackingNumber}
        packages={packages}
        setPackages={setPackages}
        weight={weight}
        setWeight={setWeight}
        arrivalFlight={arrivalFlight}
        setArrivalFlight={setArrivalFlight}
        arrivalDate={arrivalDate}
        setArrivalDate={setArrivalDate}
        observations={observations}
        setObservations={setObservations}
        status={status}
        setStatus={setStatus}
        clients={clients}
        shipmentId=""
      />
      
      {status === "retained" && (
        <RetentionFormSection 
          actionNumber={actionNumber}
          setActionNumber={setActionNumber}
          retentionReason={retentionReason}
          setRetentionReason={setRetentionReason}
          retentionAmount={retentionAmount}
          setRetentionAmount={setRetentionAmount}
          paymentDate={paymentDate}
          setPaymentDate={setPaymentDate}
          releaseDate={releaseDate}
          setReleaseDate={setReleaseDate}
          fiscalNotes={fiscalNotes}
          setFiscalNotes={setFiscalNotes}
        />
      )}
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Criar
        </Button>
      </DialogFooter>
    </form>
  );
}
