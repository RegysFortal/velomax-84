
import { ShipmentStatus } from "@/types/shipment";
import { useStatusDialogState } from './useStatusDialogState';
import { useStatusTransition } from './useStatusTransition';
import { useDeliveryStatusHandler } from './useDeliveryStatusHandler';
import { useRetentionStatusHandler } from './useRetentionStatusHandler';

export type DeliveryDetailsType = {
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
  selectedDocumentIds: string[]; // Changed from optional to required
};

interface UseStatusActionProps {
  status: ShipmentStatus;
  shipmentId: string;
  onStatusChange: (status: ShipmentStatus, deliveryDetails?: any) => void;
}

export function useStatusAction({ status, shipmentId, onStatusChange }: UseStatusActionProps) {
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
    resetAllDialogs
  } = dialogState;
  
  // Use status transition hook
  const statusTransition = useStatusTransition({
    shipmentId,
    status,
    setShowDocumentSelection,
    setShowRetentionSheet,
    onStatusChange: () => onStatusChange(status)
  });
  
  // Use delivery status handler
  const deliveryHandler = useDeliveryStatusHandler({
    shipmentId,
    receiverName,
    deliveryDate,
    deliveryTime,
    selectedDocumentIds,
    handleStatusUpdate: statusTransition.handleStatusUpdate,
    onStatusChange: () => onStatusChange(status),
    resetForms: resetAllDialogs
  });
  
  // Use retention status handler
  const retentionHandler = useRetentionStatusHandler({
    shipmentId,
    retentionReason,
    retentionAmount,
    paymentDate,
    releaseDate,
    actionNumber,
    fiscalNotes,
    handleStatusUpdate: statusTransition.handleStatusUpdate,
    onStatusChange: () => onStatusChange(status),
    resetForms: resetAllDialogs
  });
  
  return {
    // Dialog state
    ...dialogState,
    
    // Action handlers
    handleStatusChangeClick: statusTransition.handleStatusChange,
    handleDeliveryConfirm: deliveryHandler.handleDeliveryConfirm,
    handleRetentionConfirm: retentionHandler.handleRetentionConfirm
  };
}
