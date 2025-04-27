
import React, { useState } from "react";
import { useClients } from "@/contexts/clients";
import { useShipments } from "@/contexts/shipments";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShipmentFormContent } from "./ShipmentFormContent";
import { ShipmentStatus, TransportMode } from "@/types/shipment";
import { DuplicateTrackingAlert } from "./DuplicateTrackingAlert";
import { useShipmentFormSubmit } from "./hooks/useShipmentFormSubmit";

interface ShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShipmentDialog({ open, onOpenChange }: ShipmentDialogProps) {
  const { clients } = useClients();
  const { addShipment, checkDuplicateTrackingNumber } = useShipments();
  
  // Form state
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [transportMode, setTransportMode] = useState<TransportMode>("air");
  const [carrierName, setCarrierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [packages, setPackages] = useState("");
  const [weight, setWeight] = useState("");
  const [arrivalFlight, setArrivalFlight] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [observations, setObservations] = useState("");
  const [status, setStatus] = useState<ShipmentStatus>("in_transit");
  
  // Retention data
  const [retentionReason, setRetentionReason] = useState("");
  const [retentionAmount, setRetentionAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [actionNumber, setActionNumber] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [fiscalNotes, setFiscalNotes] = useState("");
  
  const { 
    showDuplicateAlert,
    setShowDuplicateAlert,
    handleSubmit,
    handleConfirmDuplicate 
  } = useShipmentFormSubmit({
    companyId,
    companyName,
    transportMode,
    carrierName,
    trackingNumber,
    packages,
    weight,
    arrivalFlight,
    arrivalDate,
    observations,
    status,
    retentionReason,
    retentionAmount,
    paymentDate,
    releaseDate,
    actionNumber,
    fiscalNotes,
    clients,
    addShipment,
    checkDuplicateTrackingNumber,
    closeDialog: () => onOpenChange(false)
  });
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Novo Embarque</DialogTitle>
          </DialogHeader>
          
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
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
      
      <DuplicateTrackingAlert
        open={showDuplicateAlert}
        onOpenChange={setShowDuplicateAlert}
        onConfirm={handleConfirmDuplicate}
      />
    </>
  );
}
