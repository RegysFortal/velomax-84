
import { ShipmentStatus } from "@/types/shipment";
import { useStatusLabel } from './useStatusLabel';
import { useStatusChange } from './useStatusChange';
import { useDeliveryConfirm } from './useDeliveryConfirm';
import { useRetentionConfirm } from './useRetentionConfirm';
import { useStatusDialogState } from './useStatusDialogState';

interface StatusMenuHookProps {
  shipmentId: string;
  status: ShipmentStatus;
  onStatusChange?: () => void;
}

/**
 * Main hook that combines all status-related functionality
 */
export function useStatusMenu({ shipmentId, status, onStatusChange }: StatusMenuHookProps) {
  // Import dialog and form state from separate hook
  const dialogState = useStatusDialogState();
  
  // Import functionality from other hooks
  const { getStatusLabel } = useStatusLabel();
  
  const { handleStatusChange } = useStatusChange({ 
    shipmentId, 
    status, 
    onStatusChange,
    setShowDocumentSelection: dialogState.setShowDocumentSelection,
    setShowDeliveryDialog: dialogState.setShowDeliveryDialog,
    setShowRetentionSheet: dialogState.setShowRetentionSheet
  });
  
  const { handleDeliveryConfirm } = useDeliveryConfirm({
    shipmentId,
    receiverName: dialogState.receiverName,
    deliveryDate: dialogState.deliveryDate,
    deliveryTime: dialogState.deliveryTime,
    selectedDocumentIds: dialogState.selectedDocumentIds,
    onStatusChange,
    resetForm: dialogState.resetDeliveryForm
  });
  
  const { handleRetentionConfirm } = useRetentionConfirm({
    shipmentId,
    retentionReason: dialogState.retentionReason,
    retentionAmount: dialogState.retentionAmount,
    paymentDate: dialogState.paymentDate,
    releaseDate: dialogState.releaseDate,
    actionNumber: dialogState.actionNumber,
    fiscalNotes: dialogState.fiscalNotes,
    onStatusChange,
    resetForm: dialogState.resetRetentionForm
  });

  return {
    // Re-export all dialog state
    ...dialogState,
    
    // Action handlers
    handleStatusChange,
    handleDeliveryConfirm,
    handleRetentionConfirm,
    getStatusLabel
  };
}
