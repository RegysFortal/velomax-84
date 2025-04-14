
import { ShipmentStatus } from "@/types/shipment";
import { toast } from "sonner";
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from "@/contexts/DeliveriesContext";
import { DeliveryDetailsType } from './useStatusAction';

interface UseDeliveryStatusHandlerProps {
  shipmentId: string;
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
  selectedDocumentIds: string[];
  handleStatusUpdate: (shipmentId: string, status: ShipmentStatus, details?: any) => void;
  onStatusChange?: () => void;
  resetForms: () => void;
}

export function useDeliveryStatusHandler({
  shipmentId,
  receiverName,
  deliveryDate,
  deliveryTime,
  selectedDocumentIds,
  handleStatusUpdate,
  onStatusChange,
  resetForms
}: UseDeliveryStatusHandlerProps) {
  const { getShipmentById } = useShipments();
  const { createDeliveriesFromShipment } = useDeliveries();
  const shipment = getShipmentById(shipmentId);
  
  // Handler for delivery confirmation
  const handleDeliveryConfirm = () => {
    try {
      // Validate form
      if (!receiverName.trim() || !deliveryDate || !deliveryTime) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      
      // Process the delivery
      const deliveryDetails: DeliveryDetailsType = {
        receiverName,
        deliveryDate,
        deliveryTime,
        selectedDocumentIds: selectedDocumentIds
      };
      
      // Update shipment status with delivery details
      handleStatusUpdate(shipmentId, "delivered_final", deliveryDetails);
      
      // Create deliveries from shipment documents
      if (shipment && selectedDocumentIds.length > 0) {
        createDeliveriesFromShipment(shipment, deliveryDetails);
      }
      
      // Call the onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
      
      // Reset forms and close dialogs
      resetForms();
    } catch (error) {
      toast.error("Erro ao finalizar entrega");
      console.error(error);
    }
  };
  
  return {
    handleDeliveryConfirm
  };
}
