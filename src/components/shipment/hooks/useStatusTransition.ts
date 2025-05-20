import { ShipmentStatus } from "@/types/shipment";
import { useStatusChange } from './useStatusChange';

interface UseStatusTransitionProps {
  shipmentId: string;
  status: ShipmentStatus;
  setShowDocumentSelection: (show: boolean) => void;
  setShowRetentionSheet: (show: boolean) => void;
  onStatusChange?: () => void;
}

export function useStatusTransition({
  shipmentId,
  status,
  setShowDocumentSelection,
  setShowRetentionSheet,
  onStatusChange
}: UseStatusTransitionProps) {
  // Use status change hook to get the correct handler
  const { handleStatusUpdate } = useStatusChange({
    onStatusChange: newStatus => {
      if (onStatusChange) onStatusChange();
    }
  });
  
  // Handler for status change button click
  const handleStatusChange = (newStatus: ShipmentStatus) => {
    console.log(`Status transition from ${status} to ${newStatus}`);
    
    // If changing to delivered_final or partially_delivered, show document selection
    if (newStatus === "delivered_final" || newStatus === "partially_delivered") {
      setShowDocumentSelection(true);
      return;
    }
    
    // If changing to "retained", show document selection first
    if (newStatus === "retained") {
      setShowDocumentSelection(true);
      return;
    }
    
    // Otherwise, update the status directly
    handleStatusUpdate(shipmentId, newStatus);
    
    // Call the onStatusChange callback if provided
    if (onStatusChange) {
      onStatusChange();
    }
  };
  
  return {
    handleStatusChange,
    handleStatusUpdate
  };
}
