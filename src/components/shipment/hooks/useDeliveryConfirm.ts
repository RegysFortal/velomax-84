
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from "@/contexts/DeliveriesContext";
import { toast } from "sonner";

interface DeliveryConfirmProps {
  shipmentId: string;
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
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
  onStatusChange,
  resetForm
}: DeliveryConfirmProps) {
  const { updateShipment, getShipmentById } = useShipments();
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
      
      // Update shipment status to delivered_final
      await updateShipment(shipmentId, {
        status: "delivered_final",
        deliveryDate,
        deliveryTime,
        receiverName,
        isRetained: false
      });
      
      // Create deliveries from documents
      if (shipment.documents && shipment.documents.length > 0) {
        console.log(`Creating ${shipment.documents.length} deliveries from documents`);
        
        for (const document of shipment.documents) {
          // Generate unique minute number for each document
          const minuteNumber = document.minuteNumber || 
                              `${shipment.trackingNumber}-${document.id.substring(0, 4)}`;
          
          try {
            await addDelivery({
              minuteNumber,
              clientId: shipment.companyId,
              deliveryDate,
              deliveryTime,
              receiver: receiverName,
              // Use document weight and packages if available, otherwise use shipment values
              weight: document.weight !== undefined ? Number(document.weight) : shipment.weight,
              packages: document.packages !== undefined ? document.packages : shipment.packages,
              deliveryType: 'standard',
              cargoType: 'standard',
              totalFreight: 0,
              notes: `Entrega do documento ${document.name} do embarque ${shipment.trackingNumber}`,
              invoiceNumbers: document.invoiceNumbers
            });
            
            console.log(`Created delivery for document: ${document.name}`);
          } catch (error) {
            console.error(`Error creating delivery for document ${document.name}:`, error);
            toast.error(`Erro ao criar entrega para o documento ${document.name}`);
          }
        }
        
        toast.success(`${shipment.documents.length} entregas criadas com sucesso`);
      } else {
        // If no documents, create a single delivery for the shipment
        const minuteNumber = `${shipment.trackingNumber}-${new Date().getTime().toString().slice(-4)}`;
        
        await addDelivery({
          minuteNumber,
          clientId: shipment.companyId,
          deliveryDate,
          deliveryTime,
          receiver: receiverName,
          weight: shipment.weight,
          packages: shipment.packages,
          deliveryType: 'standard',
          cargoType: 'standard',
          totalFreight: 0,
          notes: `Entrega do embarque ${shipment.trackingNumber}`
        });
      }
      
      resetForm();
      
      if (onStatusChange) onStatusChange();
      
      toast.success("Status alterado para Entregue e entregas criadas");
    } catch (error) {
      console.error("Error confirming delivery:", error);
      toast.error("Erro ao confirmar entrega");
    }
  };
  
  return { handleDeliveryConfirm };
}
