
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";
import { useStatusDisplay } from "./status/useStatusDisplay";
import { useDeliveryStatusUpdate } from "./status/useDeliveryStatusUpdate";
import { useRetentionStatusUpdate } from "./status/useRetentionStatusUpdate";
import { useDocumentStatusUpdate } from "./status/useDocumentStatusUpdate";

export function useShipmentStatusChange(
  shipment: Shipment, 
  setStatus: (status: ShipmentStatus) => void,
  setRetentionReason: (reason: string) => void,
  setRetentionAmount: (amount: string) => void,
  setPaymentDate: (date: string) => void,
  setReleaseDate: (date: string) => void,
  setActionNumber: (number: string) => void,
  setFiscalNotes: (notes: string) => void,
  setReceiverName: (name: string) => void,
  setDeliveryDate: (date: string) => void,
  setDeliveryTime: (time: string) => void
) {
  const { updateShipment } = useShipments();
  const { getStatusLabel } = useStatusDisplay();
  const { updateDeliveryStatus } = useDeliveryStatusUpdate();
  const { updateRetentionStatus, clearRetentionStatus } = useRetentionStatusUpdate();
  const { determineStatusFromDocuments } = useDocumentStatusUpdate();

  const handleStatusChange = async (newStatus: ShipmentStatus, details?: any) => {
    try {
      console.log(`Changing status to: ${newStatus}`, details);
      
      let finalStatus = newStatus;
      let updateData = {
        status: newStatus,
        isRetained: newStatus === "retained"
      };

      // Handle document delivery
      if ((newStatus === "delivered_final" || newStatus === "partially_delivered") && 
          details && details.selectedDocumentIds) {
        
        const updatedStatus = await updateDeliveryStatus({
          shipmentId: shipment.id,
          documents: shipment.documents,
          selectedDocumentIds: details.selectedDocumentIds,
          receiverName: details.receiverName,
          deliveryDate: details.deliveryDate,
          deliveryTime: details.deliveryTime,
          newStatus
        });
        
        finalStatus = updatedStatus;
        
        // Update UI state
        setStatus(finalStatus);
        setReceiverName(details.receiverName);
        setDeliveryDate(details.deliveryDate);
        setDeliveryTime(details.deliveryTime);
        
        toast.success(`Status alterado para ${getStatusLabel(finalStatus)} e entregas criadas`);
        return;
      }
      
      // Handle full shipment delivery without document selection
      if (newStatus === "delivered_final" && details) {
        const { receiverName, deliveryDate, deliveryTime } = details;
        
        // Update shipment with delivery details
        await updateShipment(shipment.id, {
          ...updateData,
          receiverName,
          deliveryDate,
          deliveryTime
        });
        
        // Update UI state
        setStatus(newStatus);
        setReceiverName(receiverName);
        setDeliveryDate(deliveryDate);
        setDeliveryTime(deliveryTime);
        
        toast.success(`Status alterado para ${getStatusLabel(newStatus)}`);
        return;
      }
      
      // Handle retention status
      if (newStatus === "retained" && details && details.retentionReason) {
        finalStatus = await updateRetentionStatus(shipment.id, {
          shipmentId: shipment.id,  // Add shipmentId here
          actionNumber: details.actionNumber,
          retentionReason: details.retentionReason,
          retentionAmount: details.retentionAmount,
          paymentDate: details.paymentDate,
          releaseDate: details.releaseDate,
          fiscalNotes: details.fiscalNotes
        });
        
        // Update UI state
        setStatus(finalStatus);
        setRetentionReason(details.retentionReason);
        setRetentionAmount(details.retentionAmount);
        setPaymentDate(details.paymentDate || '');
        setReleaseDate(details.releaseDate || '');
        setActionNumber(details.actionNumber || '');
        setFiscalNotes(details.fiscalNotes || '');
        return;
      }
      
      // Check for partially delivered status based on document state
      finalStatus = determineStatusFromDocuments(shipment, newStatus);
      updateData.status = finalStatus;
      
      // Update shipment with new status
      await updateShipment(shipment.id, updateData);
      
      // Clean up fiscal action if status is no longer retained
      await clearRetentionStatus(shipment.id, shipment.status);
      
      // Refresh deliveries list if needed
      setTimeout(() => {
        window.dispatchEvent(new Event('deliveries-updated'));
      }, 1000);
      
      // Show appropriate toast message
      toast.success(`Status alterado para ${getStatusLabel(finalStatus)}`);
      
      // Update UI state
      setStatus(finalStatus);
      
      // Update delivery details if provided
      if (details && (finalStatus === "delivered_final" || finalStatus === "partially_delivered")) {
        setReceiverName(details.receiverName || '');
        setDeliveryDate(details.deliveryDate || '');
        setDeliveryTime(details.deliveryTime || '');
      }
    } catch (error) {
      toast.error("Erro ao alterar status");
      console.error(error);
    }
  };

  return { handleStatusChange, getStatusLabel };
}
