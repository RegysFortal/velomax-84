
import { ShipmentStatus } from "@/types/shipment";
import { DeliveryDetailsType } from "@/components/shipment/hooks/useStatusAction";

interface UseDialogConfirmHandlersProps {
  selectedDocumentIds: string[];
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
  showDeliveryDialog: boolean;
  setShowDeliveryDialog: (show: boolean) => void;
  showRetentionSheet: boolean;
  setShowRetentionSheet: (show: boolean) => void;
  onStatusChange: (status: ShipmentStatus, deliveryDetails?: DeliveryDetailsType) => void;
}

export function useDialogConfirmHandlers({
  selectedDocumentIds,
  receiverName,
  deliveryDate,
  deliveryTime,
  showDeliveryDialog,
  setShowDeliveryDialog,
  showRetentionSheet,
  setShowRetentionSheet,
  onStatusChange
}: UseDialogConfirmHandlersProps) {
  // Handler for delivery dialog confirmation
  const handleDeliveryConfirm = () => {
    console.log('Delivery dialog confirmed with:', {
      receiverName,
      deliveryDate,
      deliveryTime,
      selectedDocumentIds
    });
    
    setShowDeliveryDialog(false);
    
    // Determine if this is a partial or full delivery
    const newStatus = selectedDocumentIds.length > 0 
      ? (selectedDocumentIds.length < 2 ? "partially_delivered" : "delivered_final") 
      : "delivered_final";
    
    console.log(`Setting status to ${newStatus} based on selected documents:`, selectedDocumentIds);
    
    // Call parent handler with delivery details
    onStatusChange(newStatus, {
      receiverName,
      deliveryDate,
      deliveryTime,
      selectedDocumentIds
    });
  };
  
  // Handler for retention sheet confirmation
  const handleRetentionConfirm = () => {
    setShowRetentionSheet(false);
    
    // Call parent handler with retention details
    onStatusChange("retained");
  };

  return {
    handleDeliveryConfirm,
    handleRetentionConfirm
  };
}
