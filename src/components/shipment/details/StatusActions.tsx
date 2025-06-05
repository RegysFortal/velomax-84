
import React from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { DeliveryDetailsType } from "../hooks/useStatusAction";
import { StatusActionDialogs } from "./StatusActionDialogs";
import { useStatusActionsHandler } from "./hooks/useStatusActionsHandler";
import { useShipments } from "@/contexts/shipments";

interface StatusActionsProps {
  status: ShipmentStatus;
  shipmentId: string;
  onStatusChange: (status: ShipmentStatus, deliveryDetails?: DeliveryDetailsType) => void;
}

export function StatusActions({ status, shipmentId, onStatusChange }: StatusActionsProps) {
  const { getShipmentById } = useShipments();
  const shipment = getShipmentById(shipmentId);
  
  const {
    // Dialog visibility states
    showDocumentSelection,
    setShowDocumentSelection,
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    
    // Document selection
    selectedDocumentIds,
    setSelectedDocumentIds,
    
    // Delivery form states
    receiverName,
    setReceiverName,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    
    // Retention form states
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
    
    // Handlers
    handleStatusChangeClick,
    handleDeliveryConfirm,
    handleRetentionConfirm,
    handleRetentionUpdate,
    handleDocumentSelectionContinue,
    handleDocumentSelectionCancel
  } = useStatusActionsHandler({
    shipmentId,
    status,
    onStatusChange
  });

  return (
    <div className="md:col-span-2">
      <StatusActionDialogs
        shipment={shipment}
        showDocumentSelection={showDocumentSelection}
        setShowDocumentSelection={setShowDocumentSelection}
        showDeliveryDialog={showDeliveryDialog}
        setShowDeliveryDialog={setShowDeliveryDialog}
        showRetentionSheet={showRetentionSheet}
        setShowRetentionSheet={setShowRetentionSheet}
        selectedDocumentIds={selectedDocumentIds}
        receiverName={receiverName}
        setReceiverName={setReceiverName}
        deliveryDate={deliveryDate}
        setDeliveryDate={setDeliveryDate}
        deliveryTime={deliveryTime}
        setDeliveryTime={setDeliveryTime}
        retentionReason={retentionReason}
        setRetentionReason={setRetentionReason}
        retentionAmount={retentionAmount}
        setRetentionAmount={setRetentionAmount}
        paymentDate={paymentDate}
        setPaymentDate={setPaymentDate}
        releaseDate={releaseDate}
        setReleaseDate={setReleaseDate}
        actionNumber={actionNumber}
        setActionNumber={setActionNumber}
        fiscalNotes={fiscalNotes}
        setFiscalNotes={setFiscalNotes}
        onDeliveryConfirm={handleDeliveryConfirm}
        onRetentionConfirm={status === 'retained' ? () => handleRetentionUpdate() : handleRetentionConfirm}
        onDocumentSelectionContinue={handleDocumentSelectionContinue}
        onDocumentSelectionCancel={handleDocumentSelectionCancel}
        isRetentionEditing={status === 'retained'}
        shipmentId={shipmentId}
      />
    </div>
  );
}
