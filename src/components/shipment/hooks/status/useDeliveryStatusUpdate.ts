
import { ShipmentStatus } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { toast } from "sonner";

interface DeliveryUpdateOptions {
  shipmentId: string;
  documents?: any[];
  selectedDocumentIds?: string[];
  receiverName?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  newStatus: ShipmentStatus;
}

/**
 * Hook for handling delivery status updates
 */
export function useDeliveryStatusUpdate() {
  const { updateShipment, updateDocument } = useShipments();
  const { addDelivery } = useDeliveries();

  /**
   * Updates shipment status related to delivery
   */
  const updateDeliveryStatus = async ({
    shipmentId,
    documents = [],
    selectedDocumentIds = [],
    receiverName = '',
    deliveryDate = '',
    deliveryTime = '',
    newStatus
  }: DeliveryUpdateOptions) => {
    try {
      console.log(`Updating delivery status to ${newStatus}`);
      
      const updateData = {
        status: newStatus,
        receiverName,
        deliveryDate,
        deliveryTime
      };
      
      // If dealing with documents and have document selection
      if (documents.length > 0 && selectedDocumentIds.length > 0) {
        const totalDocuments = documents.length;
        const updatedDocuments = [...documents];
        
        // Mark selected documents as delivered
        selectedDocumentIds.forEach(docId => {
          const docIndex = updatedDocuments.findIndex(doc => doc.id === docId);
          if (docIndex >= 0) {
            updatedDocuments[docIndex] = {
              ...updatedDocuments[docIndex],
              isDelivered: true
            };
          }
        });
        
        // Determine correct status based on delivered document count
        const deliveredCount = updatedDocuments.filter(doc => doc.isDelivered).length;
        
        if (deliveredCount > 0 && deliveredCount < totalDocuments) {
          updateData.status = "partially_delivered";
          console.log(`Auto-setting status to partially_delivered. Delivered: ${deliveredCount}/${totalDocuments}`);
        } else if (deliveredCount === totalDocuments) {
          updateData.status = "delivered_final";
          console.log(`Auto-setting status to delivered_final. All documents delivered: ${deliveredCount}/${totalDocuments}`);
        }
        
        // Update shipment with documents
        await updateShipment(shipmentId, {
          ...updateData,
          documents: updatedDocuments
        });
      } else {
        // Simple update without document changes
        await updateShipment(shipmentId, updateData);
        
        // If there are document IDs but not updating documents array
        if (selectedDocumentIds.length > 0) {
          // Update each selected document
          for (const docId of selectedDocumentIds) {
            await updateDocument(shipmentId, docId, [{
              ...documents.find(doc => doc.id === docId),
              isDelivered: true
            }]);
          }
        }
      }
      
      // Create delivery entries for delivered documents
      if (selectedDocumentIds.length > 0) {
        for (const docId of selectedDocumentIds) {
          await addDelivery({
            clientId: documents.find(doc => doc.id === docId)?.clientId || '',
            deliveryDate,
            deliveryTime,
            receiver: receiverName,
            weight: 0,
            packages: 0,
            deliveryType: 'standard',
            cargoType: 'standard',
            totalFreight: 0,
            notes: `Documento do embarque ${shipmentId}`
          });
        }
        
        setTimeout(() => {
          window.dispatchEvent(new Event('deliveries-updated'));
        }, 1000);
      }
      
      return updateData.status;
    } catch (error) {
      console.error("Error updating delivery status:", error);
      toast.error("Erro ao atualizar status de entrega");
      throw error;
    }
  };
  
  return {
    updateDeliveryStatus
  };
}
