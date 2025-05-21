
import { ShipmentStatus } from "@/types/shipment";

interface UseStatusChangeHandlerProps {
  status: ShipmentStatus;
  setShowDocumentSelection: (show: boolean) => void;
  setShowRetentionSheet: (show: boolean) => void;
}

export function useStatusChangeHandler({
  status,
  setShowDocumentSelection,
  setShowRetentionSheet
}: UseStatusChangeHandlerProps) {
  // Handler for status change click
  const handleStatusChangeClick = (newStatus: ShipmentStatus) => {
    console.log(`Status action requested: ${status} -> ${newStatus}`);
    
    // If changing to delivered_final, show document selection
    if (newStatus === "delivered_final" || newStatus === "partially_delivered") {
      setShowDocumentSelection(true);
      return;
    }
    
    // If changing to "retained", show the retention sheet
    if (newStatus === "retained") {
      setShowRetentionSheet(true);
      return;
    }
    
    // For other statuses, return the new status to be handled by the parent
    return newStatus;
  };

  return {
    handleStatusChangeClick
  };
}
