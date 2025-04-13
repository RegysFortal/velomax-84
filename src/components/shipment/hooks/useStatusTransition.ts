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
    // Convert both status and newStatus to strings before comparison to avoid TypeScript errors
    const currentStatusStr = status as string;
    const newStatusStr = newStatus as string;

    // If changing to delivered_final, show document selection
    if (newStatusStr === "delivered_final") {
      setShowDocumentSelection(true);
      return;
    }
    
    // If changing to "retained", show the retention sheet
    if (newStatusStr === "retained") {
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
