
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShipmentFormContent } from "./ShipmentFormContent";
import { DuplicateShipmentAlert } from "./DuplicateShipmentAlert";
import { useShipmentFormState } from "./hooks/useShipmentFormState";
import { useShipmentFormSubmit } from "./hooks/useShipmentFormSubmit";
import { useClients } from "@/contexts/clients";
import { useShipments } from '@/contexts/shipments';

interface ShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShipmentDialog({ open, onOpenChange }: ShipmentDialogProps) {
  const { clients } = useClients();
  const { addShipment } = useShipments();
  
  const {
    companyId,
    setCompanyId,
    companyName,
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
    resetForm
  } = useShipmentFormState();

  const checkDuplicateTrackingNumber = (trackingNum: string) => {
    return false; // Simplified for example
  };

  const {
    showDuplicateAlert,
    setShowDuplicateAlert,
    handleSubmit,
    handleConfirmDuplicate
  } = useShipmentFormSubmit({
    companyId,
    companyName,
    carrierName,
    trackingNumber,
    packages,
    weight,
    transportMode,
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

  useEffect(() => {
    if (open) {
      console.log("ShipmentDialog - Reset form");
      resetForm();
    }
  }, [open, resetForm]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
      
      <DuplicateShipmentAlert
        open={showDuplicateAlert}
        onOpenChange={setShowDuplicateAlert}
        onConfirm={handleConfirmDuplicate}
      />
    </>
  );
}
