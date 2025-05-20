
import { Shipment, ShipmentStatus, DocumentStatus } from "@/types/shipment";
import { toast } from "sonner";

/**
 * Hook para lidar com atualizações de status relacionadas a documentos
 */
export function useDocumentStatusUpdate() {
  /**
   * Verifica se o status do embarque deve ser parcialmente entregue com base no estado de entrega do documento
   * @returns status apropriado baseado no estado de entrega do documento
   */
  const determineStatusFromDocuments = (
    shipment: Shipment,
    requestedStatus: ShipmentStatus
  ): ShipmentStatus => {
    // Pular verificação se mudando para retido ou status relacionado a entrega
    if (
      requestedStatus === "retained" || 
      requestedStatus === "delivered_final" || 
      requestedStatus === "partially_delivered"
    ) {
      return requestedStatus;
    }
    
    // Se o embarque tiver múltiplos documentos, verificar o estado de entrega deles
    if (shipment.documents && shipment.documents.length > 0) {
      const totalDocuments = shipment.documents.length;
      const deliveredDocuments = shipment.documents.filter(doc => doc.isDelivered).length;
      const retainedDocuments = shipment.documents.filter(doc => doc.isRetained).length;
      
      // Se algum documento estiver retido, manter status de retenção
      if (retainedDocuments > 0) {
        console.log(`Embarque tem ${retainedDocuments} documentos retidos. Mantendo status como retido.`);
        return "retained";
      }
      
      // Se alguns (mas não todos) documentos estão entregues, definir como parcialmente entregue
      if (deliveredDocuments > 0 && deliveredDocuments < totalDocuments) {
        console.log(`Mantendo status partially_delivered. Entregues: ${deliveredDocuments}/${totalDocuments}`);
        toast.info("Embarque possui documentos entregues. Status mantido como Entrega Parcial");
        return "partially_delivered";
      }
      
      // Se todos os documentos estão entregues, definir como entregue final
      if (deliveredDocuments === totalDocuments && totalDocuments > 0) {
        return "delivered_final";
      }
    }
    
    return requestedStatus;
  };
  
  /**
   * Determina se um embarque deve ter status de retenção com base nos seus documentos
   * @returns true se algum documento estiver retido
   */
  const hasRetainedDocuments = (shipment: Shipment): boolean => {
    if (!shipment.documents || shipment.documents.length === 0) {
      return false;
    }
    
    return shipment.documents.some(doc => doc.isRetained);
  };
  
  return {
    determineStatusFromDocuments,
    hasRetainedDocuments
  };
}
