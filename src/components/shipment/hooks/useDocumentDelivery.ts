
import { useState } from 'react';
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { supabase } from '@/integrations/supabase/client';
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

  const { getShipmentById, refreshShipmentsData } = useShipments();
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

      // Update document in Supabase with delivery information
      const { error } = await supabase
        .from('shipment_documents')
        .update({
          is_delivered: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) {
        console.error("Error updating document:", error);
        toast.error("Erro ao marcar documento como entregue");
        return;
      }

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
        deliveryType: 'standard',
        cargoType: 'standard',
        totalFreight: 0,
        notes: notes || `Documento do embarque ${shipment.trackingNumber}`,
        arrivalKnowledgeNumber,
        invoiceNumbers: document.invoiceNumbers || []
      });

      toast.success("Documento marcado como entregue e adicionado à lista de entregas");
      setShowDeliveryDialog(false);
      resetDeliveryForm();

      // Refresh shipments data to update the UI
      refreshShipmentsData();

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
