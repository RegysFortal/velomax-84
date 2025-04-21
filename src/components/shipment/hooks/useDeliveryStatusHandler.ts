import { useCallback } from 'react';
import { toast } from 'sonner';
import { useShipments } from '@/contexts/shipments';
import { supabase } from '@/integrations/supabase/client';
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { DeliveryDetailsType } from './useStatusAction';

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
      
      // Process the delivery
      const deliveryDetails: DeliveryDetailsType = {
        receiverName,
        deliveryDate,
        deliveryTime,
        selectedDocumentIds
      };
      
      // Check if all documents were selected or just a subset
      const allDocumentsSelected = shipment && shipment.documents && 
        shipment.documents.length > 0 && 
        selectedDocumentIds.length === shipment.documents.length;
      
      // Determine the appropriate status based on selected documents
      const newStatus = allDocumentsSelected ? "delivered_final" : "partially_delivered";
      console.log(`Setting status to ${newStatus} (all docs selected: ${allDocumentsSelected})`);
      
      // Update shipment status with delivery details
      handleStatusUpdate(shipmentId, newStatus, deliveryDetails);
      
      // Create deliveries from shipment documents
      if (shipment && selectedDocumentIds.length > 0) {
        createDeliveriesFromShipment(shipment, deliveryDetails);
      }
      
      // Call the onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange();
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
