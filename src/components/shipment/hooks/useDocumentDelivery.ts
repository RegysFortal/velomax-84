
import { useState } from 'react';
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { toast } from "sonner";
import { Document } from "@/types/shipment";

interface UseDocumentDeliveryProps {
  shipmentId: string;
  documentId: string;
  onStatusChange?: () => void;
}

export function useDocumentDelivery({ 
  shipmentId, 
  documentId, 
  onStatusChange 
}: UseDocumentDeliveryProps) {
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [arrivalKnowledgeNumber, setArrivalKnowledgeNumber] = useState("");
  const [notes, setNotes] = useState("");

  const { getShipmentById, updateDocument } = useShipments();
  const { addDelivery } = useDeliveries();

  const resetDeliveryForm = () => {
    setReceiverName("");
    setReceiverId("");
    setDeliveryDate("");
    setDeliveryTime("");
    setArrivalKnowledgeNumber("");
    setNotes("");
  };

  const handleDeliveryConfirm = async () => {
    try {
      const shipment = getShipmentById(shipmentId);
      if (!shipment || !shipment.documents) {
        toast.error("Não foi possível encontrar os documentos do embarque");
        return;
      }

      const document = shipment.documents.find(doc => doc.id === documentId);
      if (!document) {
        toast.error("Documento não encontrado");
        return;
      }

      // Update document status to delivered
      const updatedDocuments = shipment.documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            isDelivered: true,
            deliveryInfo: {
              deliveryDate,
              deliveryTime,
              receiverName,
              receiverId,
              notes
            }
          };
        }
        return doc;
      });

      await updateDocument(shipmentId, documentId, updatedDocuments);

      // Create delivery entry
      await addDelivery({
        minuteNumber: document.minuteNumber || `${shipment.trackingNumber}-${document.id.slice(0, 8)}`,
        clientId: shipment.companyId,
        deliveryDate,
        deliveryTime,
        receiver: receiverName,
        receiverId,
        weight: document.weight || 0,
        packages: document.packages || 0,
        deliveryType: 'standard', // Will need to be completed later
        cargoType: 'standard',
        totalFreight: 0, // Will need to be completed later
        notes: notes || `Documento do embarque ${shipment.trackingNumber}`,
        arrivalKnowledgeNumber,
        invoiceNumbers: document.invoiceNumbers || []
      });

      toast.success("Documento marcado como entregue e adicionado à lista de entregas");
      setShowDeliveryDialog(false);
      resetDeliveryForm();

      if (onStatusChange) {
        onStatusChange();
      }

      // Trigger refresh of deliveries list
      setTimeout(() => {
        window.dispatchEvent(new Event('deliveries-updated'));
      }, 500);

    } catch (error) {
      console.error("Error confirming delivery:", error);
      toast.error("Erro ao confirmar entrega");
    }
  };

  return {
    showDeliveryDialog,
    setShowDeliveryDialog,
    receiverName,
    setReceiverName,
    receiverId,
    setReceiverId,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    arrivalKnowledgeNumber,
    setArrivalKnowledgeNumber,
    notes,
    setNotes,
    handleDeliveryConfirm,
    resetDeliveryForm
  };
}
