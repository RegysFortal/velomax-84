
import { useState } from 'react';
import { useStatusDialogState } from './useStatusDialogState';
import { toast } from "sonner";
import { ShipmentStatus } from "@/types/shipment";
import { DeliveryDetailsType } from './useStatusAction';

/**
 * Hook for handling dialog-related state and actions for shipment status changes
 */
export function useStatusDialogs({
  shipmentId,
  status,
  onStatusChange
}: {
  shipmentId: string,
  status: ShipmentStatus,
  onStatusChange?: () => void
}) {
  // Get all dialog state from the base hook
  const dialogState = useStatusDialogState();
  
  // Destructure the dialog state
  const {
    showDocumentSelection,
    setShowDocumentSelection,
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    
    // Document selection state
    selectedDocumentIds,
    setSelectedDocumentIds,
    
    // Delivery form state
    receiverName,
    setReceiverName,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    
    // Retention form state
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
    
    // Reset functions
    resetDeliveryForm,
    resetRetentionForm,
    resetAllDialogs
  } = dialogState;
  
  return {
    ...dialogState,
    
    // Add additional methods that can be reused
    resetForms: resetAllDialogs
  };
}
