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
    
    // If changing to delivered_final, show document selection
    if (newStatus === "delivered_final") {
      setShowDocumentSelection(true);
      return;
    }
    
    // If changing to "retained", show the retention sheet
    if (newStatus === "retained") {
      setShowRetentionSheet(true);
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
