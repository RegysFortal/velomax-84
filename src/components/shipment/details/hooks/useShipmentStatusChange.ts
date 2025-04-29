
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
        
        // Verificar se é necessário atualizar para "partially_delivered" baseado no estado dos documentos
        if (shipment.documents && shipment.documents.length > 1) {
          // Quantos documentos serão marcados como entregues
          const totalDocuments = shipment.documents.length;
          const updatedDocuments = [...shipment.documents];
          
          // Marcar os documentos selecionados como entregues
          selectedDocumentIds.forEach(docId => {
            const docIndex = updatedDocuments.findIndex(doc => doc.id === docId);
            if (docIndex >= 0) {
              updatedDocuments[docIndex] = {
                ...updatedDocuments[docIndex],
                isDelivered: true
              };
            }
          });
          
          // Contar quantos documentos estarão como entregues após atualização
          const deliveredCount = updatedDocuments.filter(doc => doc.isDelivered).length;
          
          // Se alguns (mas não todos) documentos estiverem entregues, definir como entrega parcial
          if (deliveredCount > 0 && deliveredCount < totalDocuments) {
            updateData.status = "partially_delivered";
            newStatus = "partially_delivered";
            console.log(`Automatically setting status to partially_delivered. Delivered: ${deliveredCount}/${totalDocuments}`);
          }
          // Se todos os documentos estiverem entregues, definir como entregue final
          else if (deliveredCount === totalDocuments) {
            updateData.status = "delivered_final";
            newStatus = "delivered_final";
            console.log(`Automatically setting status to delivered_final. All documents delivered: ${deliveredCount}/${totalDocuments}`);
          }
          
          // Atualizar shipment com detalhes de entrega
          await updateShipment(shipment.id, {
            ...updateData,
            receiverName,
            deliveryDate,
            deliveryTime,
            documents: updatedDocuments
          });
        } else {
          // Caso tenha apenas um documento, seguir com a lógica anterior
          await updateShipment(shipment.id, {
            ...updateData,
            receiverName,
            deliveryDate,
            deliveryTime
          });
          
          // Update each selected document
          for (const docId of selectedDocumentIds) {
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
        
        toast.success(`Status alterado para ${getStatusLabel(newStatus)} e entregas criadas`);
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
      
      // Verificação para entregas parciais automáticas quando não está mudando para retenção ou entrega
      if (newStatus !== "retained" && !["delivered_final", "partially_delivered"].includes(newStatus)) {
        // Se tiver mais de um documento, verifique se alguns foram entregues
        if (shipment.documents && shipment.documents.length > 1) {
          const totalDocuments = shipment.documents.length;
          const deliveredDocuments = shipment.documents.filter(doc => doc.isDelivered).length;
          
          // Se alguns (mas não todos) documentos estiverem entregues, atualizar para entrega parcial
          if (deliveredDocuments > 0 && deliveredDocuments < totalDocuments) {
            updateData.status = "partially_delivered";
            newStatus = "partially_delivered";
            console.log(`Maintaining partially_delivered status. Delivered: ${deliveredDocuments}/${totalDocuments}`);
            toast.info("Embarque possui documentos entregues. Status mantido como Entrega Parcial");
          }
        }
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
