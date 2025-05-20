
import { useState } from 'react';
import { toast } from "sonner";
import { ShipmentStatus } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { useRetentionStatusUpdate } from "./status/useRetentionStatusUpdate";

interface UseStatusChangeProps {
  onStatusChange?: (newStatus: ShipmentStatus) => void;
}

/**
 * Hook for handling shipment status changes with proper business logic
 */
export function useStatusChange({ onStatusChange }: UseStatusChangeProps) {
  const { updateStatus, updateShipment, getShipmentById } = useShipments();
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateRetentionStatus, updateRetentionInfo, clearRetentionStatus } = useRetentionStatusUpdate();

  /**
   * Update shipment status with proper validations
   */
  const handleStatusUpdate = async (
    shipmentId: string, 
    newStatus: ShipmentStatus, 
    details?: any
  ) => {
    if (!shipmentId) {
      toast.error("ID do embarque não fornecido");
      return;
    }
    
    try {
      setIsUpdating(true);
      console.log(`Updating status to ${newStatus}`, { details });
      
      const shipment = getShipmentById(shipmentId);
      if (!shipment) {
        toast.error("Embarque não encontrado");
        return;
      }
      
      const previousStatus = shipment.status;
      
      // Special handling for different status types
      if (newStatus === "retained") {
        // Handle retention status update
        if (details) {
          await updateRetentionStatus(shipmentId, {
            shipmentId,
            retentionReason: details.retentionReason,
            retentionAmount: details.retentionAmount,
            paymentDate: details.paymentDate,
            releaseDate: details.releaseDate,
            actionNumber: details.actionNumber,
            fiscalNotes: details.fiscalNotes
          });
        } else {
          await updateStatus(shipmentId, newStatus);
          await updateShipment(shipmentId, { isRetained: true });
        }
      }
      else if (newStatus === "delivered_final" || newStatus === "partially_delivered") {
        // Handle delivery status update
        if (details) {
          await updateShipment(shipmentId, {
            status: newStatus,
            isRetained: false,
            deliveryDate: details.deliveryDate || undefined,
            deliveryTime: details.deliveryTime || undefined,
            receiverName: details.receiverName || undefined
          });
        } else {
          await updateStatus(shipmentId, newStatus);
        }
        
        // Clear fiscal action if changing from retained
        await clearRetentionStatus(shipmentId, previousStatus);
      }
      else if (newStatus === "at_carrier") {
        // Make sure we correctly handle "at_carrier" status
        await updateStatus(shipmentId, "at_carrier");
        
        // If moving from retained status, we need to clear the retention flag
        if (previousStatus === "retained") {
          await updateShipment(shipmentId, { isRetained: false });
          await clearRetentionStatus(shipmentId, previousStatus);
        }
      } 
      else {
        // Default status update
        await updateStatus(shipmentId, newStatus);
        
        // If moving from retained status, we need to clear the retention flag
        if (previousStatus === "retained") {
          await updateShipment(shipmentId, { isRetained: false });
          await clearRetentionStatus(shipmentId, previousStatus);
        }
      }
      
      // Call onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
      
      const statusLabels: Record<ShipmentStatus, string> = {
        in_transit: "Em Trânsito",
        at_carrier: "Na Transportadora",
        retained: "Retida",
        delivered: "Retirada",
        delivered_final: "Entregue",
        partially_delivered: "Entregue Parcial"
      };
      
      toast.success(`Status alterado para ${statusLabels[newStatus]}`);
      return newStatus;
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar status");
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleStatusUpdate,
    isUpdating
  };
}
