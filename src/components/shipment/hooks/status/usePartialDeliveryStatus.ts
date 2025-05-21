
import { ShipmentStatus } from '@/types/shipment';

export function usePartialDeliveryStatus() {
  const determinePartialDeliveryStatus = (shipment: any, newStatus: ShipmentStatus, updateData: any) => {
    // Do not override retention or delivery status changes
    if (newStatus === "retained" || 
        ["delivered_final", "partially_delivered"].includes(newStatus)) {
      return updateData;
    }
    
    // Check for partial delivery status based on documents
    if (shipment.documents && shipment.documents.length > 1) {
      const totalDocuments = shipment.documents.length;
      const deliveredDocuments = shipment.documents.filter(doc => doc.isDelivered).length;
      
      // If some (but not all) documents are delivered, set to partially_delivered
      if (deliveredDocuments > 0 && deliveredDocuments < totalDocuments) {
        updateData.status = "partially_delivered";
      }
    }
    
    return updateData;
  };
  
  return { determinePartialDeliveryStatus };
}
