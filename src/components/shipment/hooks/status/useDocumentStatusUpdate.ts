
import { Shipment, ShipmentStatus, DocumentStatus } from "@/types/shipment";
import { toast } from "sonner";

/**
 * Hook to handle document-related status updates
 */
export function useDocumentStatusUpdate() {
  /**
   * Checks if shipment status should be partially delivered based on document delivery state
   * @returns appropriate status based on document delivery state
   */
  const determineStatusFromDocuments = (
    shipment: Shipment,
    requestedStatus: ShipmentStatus
  ): ShipmentStatus => {
    // Skip checking if changing to retained or delivery-related status
    if (
      requestedStatus === "retained" || 
      requestedStatus === "delivered_final" || 
      requestedStatus === "partially_delivered"
    ) {
      return requestedStatus;
    }
    
    // If shipment has multiple documents, check their delivery state
    if (shipment.documents && shipment.documents.length > 1) {
      const totalDocuments = shipment.documents.length;
      const deliveredDocuments = shipment.documents.filter(doc => doc.isDelivered).length;
      
      // If some (but not all) documents are delivered, set to partially_delivered
      if (deliveredDocuments > 0 && deliveredDocuments < totalDocuments) {
        console.log(`Maintaining partially_delivered status. Delivered: ${deliveredDocuments}/${totalDocuments}`);
        toast.info("Embarque possui documentos entregues. Status mantido como Entrega Parcial");
        return "partially_delivered";
      }
      
      // If all documents are delivered, set to delivered_final
      if (deliveredDocuments === totalDocuments) {
        return "delivered_final";
      }
    }
    
    return requestedStatus;
  };
  
  return {
    determineStatusFromDocuments
  };
}
