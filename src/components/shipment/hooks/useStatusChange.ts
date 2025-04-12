
import { useState } from 'react';
import { useShipments } from "@/contexts/shipments";
import { ShipmentStatus } from "@/types/shipment";
import { toast } from "sonner";

interface StatusChangeProps {
  shipmentId: string;
  status: ShipmentStatus;
  onStatusChange?: () => void;
  setShowDocumentSelection: (show: boolean) => void;
  setShowDeliveryDialog: (show: boolean) => void;
  setShowRetentionSheet: (show: boolean) => void;
}

/**
 * Hook for handling status changes
 */
export function useStatusChange({ 
  shipmentId, 
  status, 
  onStatusChange,
  setShowDocumentSelection,
  setShowDeliveryDialog,
  setShowRetentionSheet
}: StatusChangeProps) {
  const { updateStatus, updateShipment, updateFiscalAction, getShipmentById } = useShipments();

  /**
   * Handles changing the shipment status
   */
  const handleStatusChange = async (newStatus: ShipmentStatus) => {
    if (newStatus === status) return;
    
    try {
      console.log(`Attempting to change status to: ${newStatus}`);
      
      // Get current shipment to check document state
      const shipment = getShipmentById(shipmentId);
      if (!shipment) {
        throw new Error("Shipment not found");
      }
      
      if (newStatus === "delivered_final") {
        // Check if the shipment has any documents
        if (shipment.documents && shipment.documents.length > 0) {
          // Check if there are any undelivered documents
          const undeliveredDocs = shipment.documents.filter(doc => !doc.isDelivered);
          
          if (undeliveredDocs.length > 0) {
            // If there are undelivered documents, show document selection first
            setShowDocumentSelection(true);
            return;
          }
        }
        
        // If no documents or all already delivered, proceed directly to delivery dialog
        setShowDeliveryDialog(true);
        return;
      } else if (newStatus === "retained") {
        setShowRetentionSheet(true);
        return;
      }
      
      // For other statuses (in_transit and delivered), update directly
      // First update the status in the database
      await updateStatus(shipmentId, newStatus);
      
      const updatedShipment = await updateShipment(shipmentId, { 
        status: newStatus,
        isRetained: newStatus === "retained"
      });
      
      // Handle retention status - we need to check the previous status value
      // Use explicit comparison to avoid TypeScript narrowing issues
      if (status === "retained" && newStatus !== "retained") {
        // If we're changing from "retained" to something else, clear fiscal action
        await updateFiscalAction(shipmentId, null);
      }
      
      // Get status label
      const getStatusLabel = (status: ShipmentStatus): string => {
        switch (status) {
          case "in_transit": return "Em Trânsito";
          case "retained": return "Retida";
          case "delivered": return "Retirada";
          case "delivered_final": return "Entregue";
          default: return status;
        }
      };
      
      toast.success(`Status alterado para ${getStatusLabel(newStatus)}`);
      
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao alterar status");
    }
  };

  return { handleStatusChange };
}
