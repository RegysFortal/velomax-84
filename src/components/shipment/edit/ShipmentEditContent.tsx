
import React from "react";
import { Client } from "@/types";
import { Shipment } from "@/types/shipment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormLoadingState } from "../components/FormLoadingState";
import { ShipmentFormContent } from "../ShipmentFormContent";

interface ShipmentEditContentProps {
  isFormReady: boolean;
  companyId: string;
  setCompanyId: (id: string) => void;
  setCompanyName: (name: string) => void;
  transportMode: any;
  setTransportMode: (mode: any) => void;
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
  setObservations: (obs: string) => void;
  status: any;
  setStatus: (status: any) => void;
  retentionReason: string;
  setRetentionReason: (reason: string) => void;
  retentionAmount: string;
  setRetentionAmount: (amount: string) => void;
  paymentDate: string;
  setPaymentDate: (date: string) => void;
  actionNumber: string;
  setActionNumber: (number: string) => void;
  releaseDate: string;
  setReleaseDate: (date: string) => void;
  fiscalNotes: string;
  setFiscalNotes: (notes: string) => void;
  clients: Client[];
  onSubmit: () => void;
  onCancel: () => void;
}

export function ShipmentEditContent({
  isFormReady,
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
  onCancel
}: ShipmentEditContentProps) {
  return (
    <ScrollArea className="h-[calc(90vh-120px)] pr-4">
      {!isFormReady ? (
        <FormLoadingState />
      ) : (
        <div className="px-1 py-2">
          <ShipmentFormContent
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
            clients={clients}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </div>
      )}
    </ScrollArea>
  );
}
