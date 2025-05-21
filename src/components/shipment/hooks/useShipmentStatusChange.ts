
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { useStatusNotifications } from "./status/useStatusNotifications";
import { useDeliveryDocumentUpdate } from "./status/useDeliveryDocumentUpdate";
import { usePartialDeliveryStatus } from "./status/usePartialDeliveryStatus";
import { useFiscalActionHandling } from "./status/useFiscalActionHandling";

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
  const { updateShipment, updateStatus, updateFiscalAction, updateDocument } = useShipments();
  const { addDelivery } = useDeliveries();
  
  const { getStatusLabel, showStatusChangeNotification, showErrorNotification } = useStatusNotifications();
  
  const { updateDeliveryDocuments } = useDeliveryDocumentUpdate({ 
    shipmentId: shipment.id, 
    updateShipment, 
    updateDocument, 
    addDelivery 
  });
  
  const { determinePartialDeliveryStatus } = usePartialDeliveryStatus();
  const { handleFiscalAction, clearFiscalActionIfNeeded } = useFiscalActionHandling();

  const handleStatusChange = async (newStatus: ShipmentStatus, details?: any) => {
    try {
      console.log(`Changing status to: ${newStatus}`, details);
      
      let updateData = {
        status: newStatus,
        isRetained: newStatus === "retained"
      };
      
      // Handle document delivery
      if ((newStatus === "delivered_final" || newStatus === "partially_delivered") && 
          details && details.selectedDocumentIds) {
        
        const finalStatus = await updateDeliveryDocuments(shipment, details, updateData, newStatus);
        
        // Update UI state with delivery details
        setStatus(finalStatus);
        setReceiverName(details.receiverName);
        setDeliveryDate(details.deliveryDate);
        setDeliveryTime(details.deliveryTime);
        
        showStatusChangeNotification(finalStatus);
        
        // Trigger refresh
        refreshDeliveriesList();
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
      }
      
      // Handle retention status
      if (newStatus === "retained" && details && details.retentionReason) {
        await updateStatus(shipment.id, newStatus);
        await updateShipment(shipment.id, updateData);
        
        await handleFiscalAction(shipment.id, updateFiscalAction, details);
        
        // Update UI state with retention details
        setStatus("retained");
        setRetentionReason(details.retentionReason);
        setRetentionAmount(details.retentionAmount);
        setPaymentDate(details.paymentDate || '');
        setReleaseDate(details.releaseDate || '');
        setActionNumber(details.actionNumber || '');
        setFiscalNotes(details.fiscalNotes || '');
        
        showStatusChangeNotification(newStatus);
        return;
      }
      
      // Check for partial delivery status
      updateData = determinePartialDeliveryStatus(shipment, newStatus, updateData);
      
      // Update shipment with new status
      await updateShipment(shipment.id, updateData);
      
      // Clean up fiscal action if needed
      await clearFiscalActionIfNeeded(
        shipment.id, 
        shipment.status, 
        updateData.status || newStatus, 
        updateFiscalAction
      );
      
      // Show notification
      showStatusChangeNotification(updateData.status || newStatus);
      
      // Update local state
      setStatus(updateData.status || newStatus);
      if (details && (newStatus === "delivered_final" || newStatus === "partially_delivered")) {
        setReceiverName(details.receiverName || '');
        setDeliveryDate(details.deliveryDate || '');
        setDeliveryTime(details.deliveryTime || '');
      }
      
      // Refresh deliveries list
      refreshDeliveriesList();
    } catch (error) {
      showErrorNotification(error);
    }
  };

  const refreshDeliveriesList = () => {
    setTimeout(() => {
      window.dispatchEvent(new Event('deliveries-updated'));
    }, 1000);
  };

  return { handleStatusChange, getStatusLabel };
}
