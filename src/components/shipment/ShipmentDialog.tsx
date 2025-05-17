
import React from "react";
import { useClients } from "@/contexts/clients";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShipmentFormContent } from "./ShipmentFormContent";
import { DuplicateTrackingAlert } from "./DuplicateTrackingAlert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormLoadingState } from "./components/FormLoadingState";
import { useShipmentDialogState } from "./hooks/useShipmentDialogState";

interface ShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShipmentDialog({ open, onOpenChange }: ShipmentDialogProps) {
  const { clients } = useClients();
  
  const formState = useShipmentDialogState({
    clients,
    onClose: () => onOpenChange(false),
    open
  });
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Novo Embarque</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[calc(90vh-120px)] pr-4">
            {!formState.isFormReady ? (
              <FormLoadingState />
            ) : (
              <div className="px-1 py-2">
                <ShipmentFormContent
                  companyId={formState.companyId}
                  setCompanyId={formState.setCompanyId}
                  setCompanyName={formState.setCompanyName}
                  transportMode={formState.transportMode}
                  setTransportMode={formState.setTransportMode}
                  carrierName={formState.carrierName}
                  setCarrierName={formState.setCarrierName}
                  trackingNumber={formState.trackingNumber}
                  setTrackingNumber={formState.setTrackingNumber}
                  packages={formState.packages}
                  setPackages={formState.setPackages}
                  weight={formState.weight}
                  setWeight={formState.setWeight}
                  arrivalFlight={formState.arrivalFlight}
                  setArrivalFlight={formState.setArrivalFlight}
                  arrivalDate={formState.arrivalDate}
                  setArrivalDate={formState.setArrivalDate}
                  observations={formState.observations}
                  setObservations={formState.setObservations}
                  status={formState.status}
                  setStatus={formState.setStatus}
                  retentionReason={formState.retentionReason}
                  setRetentionReason={formState.setRetentionReason}
                  retentionAmount={formState.retentionAmount}
                  setRetentionAmount={formState.setRetentionAmount}
                  paymentDate={formState.paymentDate}
                  setPaymentDate={formState.setPaymentDate}
                  actionNumber={formState.actionNumber}
                  setActionNumber={formState.setActionNumber}
                  releaseDate={formState.releaseDate}
                  setReleaseDate={formState.setReleaseDate}
                  fiscalNotes={formState.fiscalNotes}
                  setFiscalNotes={formState.setFiscalNotes}
                  clients={clients}
                  onSubmit={formState.handleSubmit}
                  onCancel={() => onOpenChange(false)}
                />
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <DuplicateTrackingAlert
        open={formState.showDuplicateAlert}
        onOpenChange={formState.setShowDuplicateAlert}
        onConfirm={formState.handleConfirmDuplicate}
        trackingNumber={formState.trackingNumber}
      />
    </>
  );
}
