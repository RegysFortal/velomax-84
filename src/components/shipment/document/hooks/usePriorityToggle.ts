
import { toast } from "sonner";
import { Document } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";

export function usePriorityToggle(
  shipmentId: string,
  document: Document,
  onStatusChange?: () => void
) {
  const { getShipmentById, updateDocument } = useShipments();
  
  // Toggle priority flag
  const handleTogglePriority = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const shipment = getShipmentById(shipmentId);
      
      if (!shipment || !shipment.documents) {
        toast.error("Não foi possível encontrar os documentos do embarque");
        return;
      }
      
      // Update documents with priority flag toggled
      const updatedDocuments = shipment.documents.map(doc => {
        if (doc.id === document.id) {
          return {
            ...doc,
            isPriority: !doc.isPriority
          };
        }
        return doc;
      });
      
      // Update the document
      await updateDocument(shipmentId, document.id, updatedDocuments);
      
      // Show notification
      if (!document.isPriority) {
        toast.success("Documento marcado como prioritário");
      } else {
        toast.success("Prioridade removida do documento");
      }
      
      // Callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error toggling priority:", error);
      toast.error("Erro ao alterar a prioridade do documento");
    }
  };

  return { handleTogglePriority };
}
