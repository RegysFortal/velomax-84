
import { useState } from 'react';
import { useShipments } from "@/contexts/shipments";
import { ShipmentStatus } from "@/types/shipment";
import { toast } from "sonner";

interface StatusChangeProps {
  shipmentId: string;
  status: ShipmentStatus;
  onStatusChange?: () => void;
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
  setShowDeliveryDialog,
  setShowRetentionSheet
}: StatusChangeProps) {
  const { updateStatus, updateShipment, updateFiscalAction } = useShipments();

  /**
   * Handles changing the shipment status
   */
  const handleStatusChange = async (newStatus: ShipmentStatus) => {
    if (newStatus === status) return;
    
    try {
      console.log(`Attempting to change status to: ${newStatus}`);
      
      if (newStatus === "delivered_final") {
        setShowDeliveryDialog(true);
        return;
      } else if (newStatus === "retained") {
        setShowRetentionSheet(true);
        return;
      }
      
      // For other statuses (in_transit and delivered), update directly
      const updatedShipment = await updateStatus(shipmentId, newStatus);
      
      if (updatedShipment) {
        await updateShipment(shipmentId, { 
          status: newStatus,
          isRetained: newStatus === "retained"
        });
        
        // Handle retention status
        if (status === "retained" || newStatus === "retained" || 
            (updatedShipment && updatedShipment.status === "retained")) {
          // A shipment is considered retained if it previously was retained or is now being set to retained
          const isRetained = status === "retained" || newStatus === "retained" || 
                             (updatedShipment && updatedShipment.status === "retained");
          
          if (isRetained) {
            await updateFiscalAction(shipmentId, null);
          }
        }
        
        // Get status label from the useStatusLabel hook
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
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao alterar status");
    }
  };

  return { handleStatusChange };
}
