
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from "@/contexts/DeliveriesContext";
import { toast } from "sonner";
import { Document } from "@/types/shipment";

interface DeliveryConfirmProps {
  shipmentId: string;
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
  selectedDocumentIds: string[];
  onStatusChange?: () => void;
  resetForm: () => void;
}

/**
 * Hook for handling delivery confirmation
 */
export function useDeliveryConfirm({
  shipmentId,
  receiverName,
  deliveryDate,
  deliveryTime,
  selectedDocumentIds,
  onStatusChange,
  resetForm
}: DeliveryConfirmProps) {
  const { updateShipment, getShipmentById, updateDocument, updateStatus } = useShipments();
  const { addDelivery } = useDeliveries();
  
  /**
   * Handles confirming delivery details
   */
  const handleDeliveryConfirm = async () => {
    if (!deliveryDate || !deliveryTime || !receiverName.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    try {
      // Get current shipment data
      const shipment = getShipmentById(shipmentId);
      
      if (!shipment) {
        toast.error("Embarque não encontrado");
        return;
      }
      
      // Check if we need to update documents
      if (shipment.documents && shipment.documents.length > 0) {
        const selectedDocuments: Document[] = [];
        const updatedDocuments = [...shipment.documents];
        
        // If no specific documents were selected (empty array), process all undelivered documents
        const docsToProcess = selectedDocumentIds.length > 0 
          ? selectedDocumentIds 
          : shipment.documents.filter(doc => !doc.isDelivered).map(doc => doc.id);
        
        console.log(`Processing ${docsToProcess.length} documents for delivery`);
        
        // Mark the selected documents as delivered and collect them
        for (let i = 0; i < updatedDocuments.length; i++) {
          if (docsToProcess.includes(updatedDocuments[i].id)) {
            updatedDocuments[i] = {
              ...updatedDocuments[i],
              isDelivered: true
            };
            selectedDocuments.push(updatedDocuments[i]);
            
            // Update document in the database - pass all three required arguments
            await updateDocument(shipmentId, updatedDocuments[i], updatedDocuments);
          }
        }
        
        // Create deliveries from selected documents
        console.log(`Creating ${selectedDocuments.length} deliveries from selected documents`);
        
        for (const document of selectedDocuments) {
          // Generate unique minute number for each document
          const minuteNumber = document.minuteNumber || 
                              `${shipment.trackingNumber}-${document.id.substring(0, 4)}`;
          
          try {
            const deliveryData = {
              minuteNumber,
              clientId: shipment.companyId,
              deliveryDate,
              deliveryTime,
              receiver: receiverName,
              // Use document weight and packages if available, otherwise use shipment values
              weight: document.weight !== undefined ? Number(document.weight) : shipment.weight,
              packages: document.packages !== undefined ? document.packages : shipment.packages,
              deliveryType: 'standard' as const,
              cargoType: 'standard' as const,
              totalFreight: 0,
              notes: `Entrega do documento ${document.name} do embarque ${shipment.trackingNumber}`
            };
            
            // Add invoice numbers to notes if they exist
            if (document.invoiceNumbers && document.invoiceNumbers.length > 0) {
              const invoiceList = document.invoiceNumbers.join(', ');
              deliveryData.notes = `${deliveryData.notes}\nNotas Fiscais: ${invoiceList}`;
            }
            
            await addDelivery(deliveryData);
            console.log(`Created delivery for document: ${document.name}`);
          } catch (error) {
            console.error(`Error creating delivery for document ${document.name}:`, error);
            toast.error(`Erro ao criar entrega para o documento ${document.name}`);
          }
        }
        
        toast.success(`${selectedDocuments.length} entregas criadas com sucesso`);
        
        // Check if all documents are now delivered
        const allDocumentsDelivered = updatedDocuments.every(doc => doc.isDelivered);
        
        // Update shipment status based on document delivery status
        const newStatus = allDocumentsDelivered ? "delivered_final" : "in_transit";
        
        // First update the status in the database
        await updateStatus(shipmentId, newStatus);
        
        // Then update the shipment
        await updateShipment(shipmentId, {
          status: newStatus,
          documents: updatedDocuments,
          // Only set these fields if all documents are delivered
          ...(allDocumentsDelivered && {
            deliveryDate,
            deliveryTime,
            receiverName,
          }),
          isRetained: false
        });
        
        if (allDocumentsDelivered) {
          toast.success("Todos os documentos foram entregues. Status do embarque atualizado para Entregue.");
        } else {
          toast.success("Documentos selecionados marcados como entregues. Embarque permanece em trânsito.");
        }
      } else {
        // If no documents, create a single delivery for the shipment and mark as delivered
        const minuteNumber = `${shipment.trackingNumber}-${new Date().getTime().toString().slice(-4)}`;
        
        await addDelivery({
          minuteNumber,
          clientId: shipment.companyId,
          deliveryDate,
          deliveryTime,
          receiver: receiverName,
          weight: shipment.weight,
          packages: shipment.packages,
          deliveryType: 'standard' as const,
          cargoType: 'standard' as const,
          totalFreight: 0,
          notes: `Entrega do embarque ${shipment.trackingNumber}`
        });
        
        // Update shipment status to delivered_final and status in the database
        await updateStatus(shipmentId, "delivered_final");
        
        await updateShipment(shipmentId, {
          status: "delivered_final",
          deliveryDate,
          deliveryTime,
          receiverName,
          isRetained: false
        });
        
        toast.success("Embarque marcado como entregue e entrega criada com sucesso");
      }
      
      resetForm();
      
      if (onStatusChange) onStatusChange();
      
      // Refresh the page to show the new delivery
      setTimeout(() => {
        window.dispatchEvent(new Event('deliveries-updated'));
      }, 1000);
      
    } catch (error) {
      console.error("Error confirming delivery:", error);
      toast.error("Erro ao confirmar entrega");
    }
  };
  
  return { handleDeliveryConfirm };
}
