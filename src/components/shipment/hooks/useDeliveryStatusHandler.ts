
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useShipments } from '@/contexts/shipments';
import { supabase } from '@/integrations/supabase/client';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { DeliveryDetailsType } from './useStatusAction';
import { ShipmentStatus } from '@/types/shipment';

interface UseDeliveryStatusHandlerProps {
  shipmentId: string;
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
  selectedDocumentIds: string[];
  handleStatusUpdate: (shipmentId: string, status: ShipmentStatus, details?: any) => void;
  onStatusChange?: () => void;
  resetForms: () => void;
}

export function useDeliveryStatusHandler({
  shipmentId,
  receiverName,
  deliveryDate,
  deliveryTime,
  selectedDocumentIds,
  handleStatusUpdate,
  onStatusChange,
  resetForms
}: UseDeliveryStatusHandlerProps) {
  const { getShipmentById } = useShipments();
  const { createDeliveriesFromShipment } = useDeliveries();
  const shipment = getShipmentById(shipmentId);
  
  // Handler for delivery confirmation
  const handleDeliveryConfirm = useCallback(() => {
    try {
      // Validate form
      if (!receiverName.trim() || !deliveryDate || !deliveryTime) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      
      if (!shipment) {
        toast.error("Embarque não encontrado");
        return;
      }
      
      // Process the delivery
      const deliveryDetails: DeliveryDetailsType = {
        receiverName,
        deliveryDate,
        deliveryTime,
        selectedDocumentIds
      };
      
      // Check if all documents were selected or just a subset
      const totalDocuments = shipment.documents?.length || 0;
      const selectedCount = selectedDocumentIds.length;
      const remainingCount = totalDocuments - selectedCount;
      const allDocumentsSelected = totalDocuments > 0 && selectedCount === totalDocuments;
      
      // Determine the appropriate status based on selected documents
      const newStatus = allDocumentsSelected 
        ? "delivered_final" 
        : (selectedCount > 0 ? "partially_delivered" : "in_transit");
      
      console.log(`Setting status to ${newStatus} (all docs selected: ${allDocumentsSelected}, remaining: ${remainingCount})`);
      console.log(`Documents: Total=${totalDocuments}, Selected=${selectedCount}, Remaining=${remainingCount}`);
      
      // Update shipment status with delivery details
      handleStatusUpdate(shipmentId, newStatus as ShipmentStatus, deliveryDetails);
      
      // Create deliveries from shipment documents
      if (shipment && selectedDocumentIds.length > 0) {
        createDeliveriesFromShipment(shipment, deliveryDetails);
      }
      
      // Call the onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
      
      // Status message based on delivery status
      if (allDocumentsSelected) {
        toast.success("Todos os documentos foram entregues. Embarque marcado como Entregue.");
      } else if (selectedCount > 0) {
        toast.success(`Documentos selecionados marcados como entregues. Embarque atualizado para Entrega Parcial.`);
      } else {
        toast.info("Nenhum documento selecionado para entrega. Embarque permanece em trânsito.");
      }
      
      // Reset forms and close dialogs
      resetForms();
    } catch (error) {
      toast.error("Erro ao finalizar entrega");
      console.error(error);
    }
  }, [receiverName, deliveryDate, deliveryTime, selectedDocumentIds, handleStatusUpdate, createDeliveriesFromShipment, shipment, onStatusChange, resetForms]);
  
  return {
    handleDeliveryConfirm
  };
}
