import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShipments } from "@/contexts/shipments";
import { useClients } from "@/contexts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShipmentFormContent } from "./ShipmentFormContent";
import { DuplicateTrackingAlert } from "./DuplicateTrackingAlert";
import { useShipmentFormSubmit } from "./hooks/useShipmentFormSubmit";

interface ShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShipmentDialog({ open, onOpenChange }: ShipmentDialogProps) {
  const { addShipment, shipments } = useShipments();
  const { clients } = useClients();
  
  // Form state
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [transportMode, setTransportMode] = useState<"air" | "road">("air");
  const [carrierName, setCarrierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [packages, setPackages] = useState("");
  const [weight, setWeight] = useState("");
  const [arrivalFlight, setArrivalFlight] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [status, setStatus] = useState<"in_transit" | "retained" | "delivered" | "delivered_final">("in_transit");
  const [observations, setObservations] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  
  // Retention-specific fields
  const [actionNumber, setActionNumber] = useState("");
  const [retentionReason, setRetentionReason] = useState("");
  const [retentionAmount, setRetentionAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [fiscalNotes, setFiscalNotes] = useState("");
  
  // Check for duplicate tracking number
  const checkDuplicateTrackingNumber = (trackingNum: string) => {
    return shipments.some(s => s.trackingNumber === trackingNum);
  };
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      // Reset form for a new shipment
      setCompanyId("");
      setCompanyName("");
      setTransportMode("air");
      setCarrierName("");
      setTrackingNumber("");
      setPackages("");
      setWeight("");
      setArrivalFlight("");
      setArrivalDate("");
      setStatus("in_transit");
      setObservations("");
      setDeliveryDate("");
      setDeliveryTime("");
      setActionNumber("");
      setRetentionReason("");
      setRetentionAmount("");
      setPaymentDate("");
      setReleaseDate("");
      setFiscalNotes("");
      
      console.log("ShipmentDialog - Reset form");
    }
  }, [open]);
  
  // Form submission logic using the custom hook
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
    // Retention fields
    actionNumber,
    retentionReason,
    retentionAmount,
    paymentDate,
    releaseDate,
    fiscalNotes,
    // Other
    clients,
    addShipment,
    checkDuplicateTrackingNumber,
    closeDialog: () => onOpenChange(false)
  });

  // Safe cancel function
  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Change state in a safe way to avoid unwanted re-renders
    setTimeout(() => {
      onOpenChange(false);
    }, 0);
  };

  // Handle dialog open change
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // If closing, use the safe cancel function
      handleCancel();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent 
          className="max-w-xl max-h-[95vh]"
          onEscapeKeyDown={(e) => {
            // Prevent default behavior and use our safe cancel function
            e.preventDefault();
            handleCancel();
          }}
          onInteractOutside={(e) => {
            // Prevent closure when clicking outside, use buttons instead
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Novo Embarque</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(95vh-130px)] pr-4">
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
              clients={clients}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Duplicate tracking number alert dialog */}
      <DuplicateTrackingAlert
        open={showDuplicateAlert}
        onOpenChange={setShowDuplicateAlert}
        trackingNumber={trackingNumber}
        onConfirm={handleConfirmDuplicate}
      />
    </>
  );
}
