
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { toast } from "sonner";
import { Shipment, ShipmentStatus } from "@/types/shipment";

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
  
  const getStatusLabel = (status: ShipmentStatus): string => {
    switch (status) {
      case "in_transit":
        return "Em Trânsito";
      case "retained":
        return "Retida";
      case "delivered":
        return "Retirada";
      case "partially_delivered":
        return "Entregue Parcial";
      case "delivered_final":
        return "Entregue";
      default:
        return status;
    }
  };

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
        const { selectedDocumentIds, receiverName, deliveryDate, deliveryTime } = details;
        
        // Update shipment with delivery details
        await updateShipment(shipment.id, {
          ...updateData,
          receiverName,
          deliveryDate,
          deliveryTime
        });
        
        // Update each selected document
        for (const docId of selectedDocumentIds) {
          // Fix: The updateDocument function needs to be called with a document object, not just properties
          const docIndex = shipment.documents.findIndex(doc => doc.id === docId);
          if (docIndex >= 0) {
            const updatedDocs = [...shipment.documents];
            updatedDocs[docIndex] = {
              ...updatedDocs[docIndex],
              isDelivered: true
            };
            await updateDocument(shipment.id, docId, updatedDocs);
          }
        }
        
        // Create a delivery entry for each delivered document
        for (const docId of selectedDocumentIds) {
          await addDelivery({
            clientId: shipment.companyId,
            deliveryDate,
            deliveryTime,
            receiver: receiverName,
            weight: 0,
            packages: 0,
            deliveryType: 'standard',
            cargoType: 'standard',
            totalFreight: 0,
            notes: `Documento do embarque ${shipment.trackingNumber}`
          });
        }
        
        setTimeout(() => {
          window.dispatchEvent(new Event('deliveries-updated'));
        }, 1000);
        
        toast.success("Status alterado e entregas criadas");
        setStatus(newStatus);
        setReceiverName(receiverName);
        setDeliveryDate(deliveryDate);
        setDeliveryTime(deliveryTime);
        return;
      }
      
      // Handle full shipment delivery
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
        
        const retentionAmountValue = parseFloat(details.retentionAmount || "0");
        await updateFiscalAction(shipment.id, {
          actionNumber: details.actionNumber?.trim() || undefined,
          reason: details.retentionReason.trim(),
          amountToPay: retentionAmountValue,
          paymentDate: details.paymentDate || undefined,
          releaseDate: details.releaseDate || undefined,
          notes: details.fiscalNotes?.trim() || undefined
        });
        
        toast.success("Status alterado para Retida e informações de retenção atualizadas");
        setStatus("retained");
        setRetentionReason(details.retentionReason);
        setRetentionAmount(details.retentionAmount);
        setPaymentDate(details.paymentDate);
        setReleaseDate(details.releaseDate);
        setActionNumber(details.actionNumber);
        setFiscalNotes(details.fiscalNotes);
        return;
      }
      
      // Update shipment with new status
      await updateShipment(shipment.id, updateData);
      
      setTimeout(() => {
        window.dispatchEvent(new Event('deliveries-updated'));
      }, 1000);
      
      // Show appropriate toast message
      if (newStatus === "delivered_final") {
        toast.success("Status alterado para Entregue e entregas criadas");
      } else if (newStatus === "partially_delivered") {
        toast.success("Status alterado para Entrega Parcial");
      } else {
        toast.success(`Status alterado para ${getStatusLabel(newStatus)}`);
      }
      
      // Clean up fiscal action if status is no longer retained
      if (shipment.status === "retained" && newStatus !== "retained") {
        await updateFiscalAction(shipment.id, null);
      }
      
      // Update local state
      setStatus(updateData.status || newStatus);
      if (details && (newStatus === "delivered_final" || newStatus === "partially_delivered")) {
        setReceiverName(details.receiverName);
        setDeliveryDate(details.deliveryDate);
        setDeliveryTime(details.deliveryTime);
      }
    } catch (error) {
      toast.error("Erro ao alterar status");
      console.error(error);
    }
  };

  return { handleStatusChange, getStatusLabel };
}
