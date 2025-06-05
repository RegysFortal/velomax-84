
import React from "react";
import { useClients } from "@/contexts/clients";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shipment } from "@/types/shipment";
import { useShipmentEditForm } from "./hooks/useShipmentEditForm";
import { ShipmentEditContent } from "./edit/ShipmentEditContent";

interface ShipmentEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: Shipment | null;
}

export function ShipmentEditDialog({ 
  open, 
  onOpenChange, 
  shipment 
}: ShipmentEditDialogProps) {
  const { clients } = useClients();
  const formState = useShipmentEditForm(shipment, onOpenChange);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Embarque</DialogTitle>
        </DialogHeader>
        
        <ShipmentEditContent
          isFormReady={formState.isFormReady}
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
          shipmentDate={formState.shipmentDate}
          setShipmentDate={formState.setShipmentDate}
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
      </DialogContent>
    </Dialog>
  );
}
