
import { useToast } from "@/hooks/use-toast";
import { useShipments } from "@/contexts/shipments";

interface UseDeliveryConfirmProps {
  shipmentId: string;
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
  selectedDocumentIds: string[];
  handleStatusUpdate: (shipmentId: string, newStatus: string) => Promise<void>;
  onStatusChange?: () => void;
  resetForms: () => void;
}

export function useDeliveryConfirm({
  shipmentId,
  receiverName,
  deliveryDate,
  deliveryTime,
  selectedDocumentIds,
  handleStatusUpdate,
  onStatusChange,
  resetForms
}: UseDeliveryConfirmProps) {
  const { toast } = useToast();
  const { updateStatus, updateShipment, getShipmentById } = useShipments();
  
  const handleDeliveryConfirm = async () => {
    try {
      // Validate required fields
      if (!receiverName.trim()) {
        toast({
          title: "Erro",
          description: "Nome do recebedor é obrigatório",
          variant: "destructive"
        });
        return;
      }
      
      if (!deliveryDate.trim()) {
        toast({
          title: "Erro",
          description: "Data de entrega é obrigatória",
          variant: "destructive"
        });
        return;
      }
      
      if (!deliveryTime.trim()) {
        toast({
          title: "Erro",
          description: "Hora de entrega é obrigatória",
          variant: "destructive"
        });
        return;
      }
      
      const shipment = getShipmentById(shipmentId);
      
      if (!shipment) {
        toast({
          title: "Erro",
          description: "Embarque não encontrado",
          variant: "destructive"
        });
        return;
      }
      
      if (shipment.documents && shipment.documents.length > 0) {
        // If there are documents in the shipment, update their isDelivered status
        
        // Get the selected documents
        const selectedDocuments = selectedDocumentIds.map(id => 
          shipment.documents.find(doc => doc.id === id)
        ).filter(Boolean);
        
        // Ensure we have at least one document selected
        if (selectedDocuments.length === 0) {
          toast({
            title: "Erro",
            description: "Selecione pelo menos um documento para marcar como entregue",
            variant: "destructive"
          });
          return;
        }
        
        // Update each document's delivery status
        const updatedDocuments = shipment.documents.map(doc => {
          if (selectedDocumentIds.includes(doc.id)) {
            return { ...doc, isDelivered: true };
          }
          return doc;
        });
        
        // Check if all documents are delivered
        const allDocumentsDelivered = updatedDocuments.every(doc => doc.isDelivered);
        
        // Update shipment status based on document delivery status
        // Mudança principal: Se alguns documentos foram entregues, mas não todos, marcar como entrega parcial
        const newStatus = allDocumentsDelivered 
          ? "delivered_final" 
          : (selectedDocuments.length > 0 ? "partially_delivered" : "in_transit");
        
        // First update the status in the database
        await updateStatus(shipmentId, newStatus);
        
        // Then update the documents and other shipment details
        await updateShipment(shipmentId, {
          status: newStatus,
          documents: updatedDocuments,
          // Set delivery details for both final and partial deliveries
          ...(selectedDocuments.length > 0 && {
            deliveryDate,
            deliveryTime,
            receiverName,
            receiverId: undefined
          })
        });
        
        if (allDocumentsDelivered) {
          toast({
            title: "Sucesso",
            description: "Todos os documentos foram entregues. Status do embarque atualizado para Entregue."
          });
        } else if (selectedDocuments.length > 0) {
          toast({
            title: "Sucesso",
            description: "Documentos selecionados marcados como entregues. Status atualizado para Entrega Parcial."
          });
        } else {
          toast({
            title: "Sucesso",
            description: "Nenhum documento selecionado para entrega. Embarque permanece em trânsito."
          });
        }
      } else {
        // If no documents, create a single delivery for the shipment and mark as delivered
        await updateStatus(shipmentId, "delivered_final");
        
        await updateShipment(shipmentId, {
          status: "delivered_final",
          deliveryDate,
          deliveryTime,
          receiverName,
          receiverId: undefined
        });
        
        toast({
          title: "Sucesso",
          description: "Embarque marcado como entregue com sucesso!"
        });
      }
      
      // Reset form state
      resetForms();
      
      // Call the onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
      toast({
        title: "Erro",
        description: "Erro ao confirmar entrega. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  return { handleDeliveryConfirm };
}
