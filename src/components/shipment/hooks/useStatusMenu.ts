
import { ShipmentStatus } from "@/types/shipment";
import { useStatusLabel } from './useStatusLabel';
import { DeliveryDetailsType } from './useStatusAction';
import { useStatusDialogs } from './useStatusDialogs';
import { useStatusTransition } from './useStatusTransition';
import { useDeliveryStatusHandler } from './useDeliveryStatusHandler';
import { useRetentionStatusHandler } from './useRetentionStatusHandler';

interface UseStatusMenuProps {
  shipmentId: string;
  status: ShipmentStatus;
  onStatusChange?: () => void;
}

export function useStatusMenu({ 
  shipmentId, 
  status, 
  onStatusChange 
}: UseStatusMenuProps) {
  const { getStatusLabel } = useStatusLabel();
  
  // Use dialog state hook
  const dialogState = useStatusDialogs({
    shipmentId,
    status,
    onStatusChange
  });
  
  // Use status transition hook
  const statusTransition = useStatusTransition({
    shipmentId,
    status,
    setShowDocumentSelection: dialogState.setShowDocumentSelection,
    setShowRetentionSheet: dialogState.setShowRetentionSheet,
    onStatusChange
  });
  
  // Use delivery status handler
  const deliveryHandler = useDeliveryStatusHandler({
    shipmentId,
    receiverName: dialogState.receiverName,
    deliveryDate: dialogState.deliveryDate,
    deliveryTime: dialogState.deliveryTime,
    selectedDocumentIds: dialogState.selectedDocumentIds,
    handleStatusUpdate: statusTransition.handleStatusUpdate,
    onStatusChange,
    resetForms: dialogState.resetForms
  });
  
  // Use retention status handler
  const retentionHandler = useRetentionStatusHandler({
    shipmentId,
    retentionReason: dialogState.retentionReason,
    retentionAmount: dialogState.retentionAmount,
    paymentDate: dialogState.paymentDate,
    releaseDate: dialogState.releaseDate,
    actionNumber: dialogState.actionNumber,
    fiscalNotes: dialogState.fiscalNotes,
    handleStatusUpdate: statusTransition.handleStatusUpdate,
    onStatusChange,
    resetForms: dialogState.resetForms
  });
  
  return {
    // Dialog state
    ...dialogState,
    
    // Action handlers
    handleStatusChange: statusTransition.handleStatusChange,
    handleDeliveryConfirm: deliveryHandler.handleDeliveryConfirm,
    handleRetentionConfirm: retentionHandler.handleRetentionConfirm,
    
    // Utilities
    getStatusLabel
  };
}
