
import React from 'react';
import { StatusBadge } from "../StatusBadge";
import { ShipmentStatus } from "@/types/shipment";
import { Separator } from "@/components/ui/separator";
import { StatusActionButtons } from "./StatusActionButtons";
import { DeliveryDialog } from "../dialogs/DeliveryDialog";
import { RetentionSheet } from "../dialogs/RetentionSheet";
import { DocumentSelectionDialog } from "../dialogs/DocumentSelectionDialog";
import { useStatusAction, DeliveryDetailsType } from "../hooks/useStatusAction";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";
import { useRetentionStatusUpdate } from "../hooks/status/useRetentionStatusUpdate";

interface StatusActionsProps {
  status: ShipmentStatus;
  shipmentId: string;
  onStatusChange: (status: ShipmentStatus, deliveryDetails?: DeliveryDetailsType) => void;
}

export function StatusActions({ status, shipmentId, onStatusChange }: StatusActionsProps) {
  const { getShipmentById } = useShipments();
  const { updateRetentionInfo } = useRetentionStatusUpdate();
  const shipment = getShipmentById(shipmentId);
  
  const {
    showDocumentSelection,
    setShowDocumentSelection,
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    selectedDocumentIds,
    setSelectedDocumentIds,
    receiverName,
    setReceiverName,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    retentionReason,
    setRetentionReason,
    retentionAmount,
    setRetentionAmount,
    paymentDate,
    setPaymentDate,
    releaseDate,
    setReleaseDate,
    actionNumber,
    setActionNumber,
    fiscalNotes,
    setFiscalNotes,
    handleStatusChangeClick,
    handleDeliveryConfirm,
    handleRetentionConfirm
  } = useStatusAction({ 
    status, 
    shipmentId, 
    onStatusChange 
  });

  // Handler for document selection confirmation
  const handleDocumentSelectionContinue = (documentIds: string[]) => {
    setSelectedDocumentIds(documentIds);
    setShowDocumentSelection(false);
    setShowDeliveryDialog(true);
  };
  
  // Handler for cancellation of document selection
  const handleDocumentSelectionCancel = () => {
    setSelectedDocumentIds([]);
    setShowDocumentSelection(false);
  };

  // Handler specifically for retention details updates
  const handleRetentionUpdate = async () => {
    if (!shipmentId) return;
    
    try {
      console.log("Updating retention details with new values:", {
        shipmentId,
        actionNumber,
        retentionReason,
        retentionAmount,
        paymentDate,
        releaseDate,
        fiscalNotes
      });
      
      // Use the updateRetentionInfo method from the hook
      await updateRetentionInfo(shipmentId, {
        shipmentId,
        actionNumber,
        retentionReason,
        retentionAmount,
        paymentDate,
        releaseDate,
        fiscalNotes
      });
      
      // Close the retention sheet
      setShowRetentionSheet(false);
      
      // Trigger a status change to refresh the UI if needed
      if (onStatusChange) {
        onStatusChange('retained');
      }
    } catch (error) {
      console.error("Error updating retention details:", error);
      toast.error("Erro ao atualizar informações de retenção");
    }
  };

  return (
    <div className="md:col-span-2">
      <Separator />
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Status</h3>
        <StatusBadge status={status} />
      </div>
      
      <StatusActionButtons 
        status={status} 
        onStatusChangeClick={handleStatusChangeClick} 
      />
      
      {shipment && (
        <DocumentSelectionDialog
          open={showDocumentSelection}
          onOpenChange={setShowDocumentSelection}
          documents={shipment.documents || []}
          onContinue={handleDocumentSelectionContinue}
          onCancel={handleDocumentSelectionCancel}
        />
      )}

      <DeliveryDialog
        open={showDeliveryDialog}
        onOpenChange={setShowDeliveryDialog}
        receiverName={receiverName}
        setReceiverName={setReceiverName}
        deliveryDate={deliveryDate}
        setDeliveryDate={setDeliveryDate}
        deliveryTime={deliveryTime}
        setDeliveryTime={setDeliveryTime}
        onConfirm={handleDeliveryConfirm}
      />
      
      <RetentionSheet
        open={showRetentionSheet}
        onOpenChange={setShowRetentionSheet}
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
        onConfirm={status === 'retained' ? handleRetentionUpdate : handleRetentionConfirm}
        isEditing={status === 'retained'}
      />
    </div>
  );
}
