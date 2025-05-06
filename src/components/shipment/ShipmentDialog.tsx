
import React, { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { useClients } from "@/contexts/clients";
import { useShipments } from "@/contexts/shipments";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShipmentFormContent } from "./ShipmentFormContent";
import { ShipmentStatus, TransportMode } from "@/types/shipment";
import { DuplicateTrackingAlert } from "./DuplicateTrackingAlert";
import { useShipmentFormSubmit } from "./hooks/useShipmentFormSubmit";
import { ScrollArea } from "@/components/ui/scroll-area";

// Loading state component
const FormLoadingState = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    <p className="mt-4 text-sm text-muted-foreground">Carregando formulário...</p>
  </div>
);

interface ShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShipmentDialog({ open, onOpenChange }: ShipmentDialogProps) {
  const { clients } = useClients();
  const { addShipment, checkDuplicateTrackingNumber } = useShipments();
  const [isFormReady, setIsFormReady] = useState(false);
  
  // Form state - using lazy initialization where appropriate
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
  
  // Delay form initialization to prevent UI freezing
  useEffect(() => {
    if (open) {
      setIsFormReady(false);
      const timer = setTimeout(() => {
        setIsFormReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);
  
  // Memoize functions to prevent unnecessary re-renders
  const setTransportModeMemo = useCallback((mode: TransportMode) => {
    // Use requestAnimationFrame to prevent UI blocking
    window.requestAnimationFrame(() => {
      setTransportMode(mode);
    });
  }, []);
  
  const setCarrierNameMemo = useCallback((name: string) => {
    // Use requestAnimationFrame to prevent UI blocking
    window.requestAnimationFrame(() => {
      setCarrierName(name);
    });
  }, []);
  
  // If checkDuplicateTrackingNumber doesn't exist in the context, provide a fallback
  const checkDuplicateNumber = checkDuplicateTrackingNumber || ((number: string) => {
    console.log("Checking for duplicate tracking number:", number);
    return false; // Default implementation returns false
  });
  
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
    checkDuplicateTrackingNumber: checkDuplicateNumber,
    closeDialog: () => onOpenChange(false)
  });
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Novo Embarque</DialogTitle>
          </DialogHeader>
          
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
                  setTransportMode={setTransportModeMemo}
                  carrierName={carrierName}
                  setCarrierName={setCarrierNameMemo}
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
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <DuplicateTrackingAlert
        open={showDuplicateAlert}
        onOpenChange={setShowDuplicateAlert}
        onConfirm={handleConfirmDuplicate}
        trackingNumber={trackingNumber}
      />
    </>
  );
}
