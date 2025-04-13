
import { useState } from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

interface UseStatusChangeProps {
  onStatusChange?: (status: ShipmentStatus) => void;
}

export function useStatusChange(props?: UseStatusChangeProps) {
  const { updateStatus } = useShipments();
  const [isProcessing, setIsProcessing] = useState(false);
  
  /**
   * Handles the status update for a shipment
   */
  const handleStatusUpdate = async (
    shipmentId: string, 
    newStatus: ShipmentStatus, 
    details?: any
  ) => {
    try {
      setIsProcessing(true);
      
      // Convert status strings for comparison to avoid TypeScript errors
      const newStatusStr = newStatus as string;
      
      // Prepare updated shipment data
      let shipmentData: Record<string, any> = {
        status: newStatus,
      };
      
      // If moving to delivered_final, add delivery details
      if (newStatusStr === "delivered_final" && details) {
        shipmentData = {
          ...shipmentData,
          receiverName: details.receiverName,
          deliveryDate: details.deliveryDate,
          deliveryTime: details.deliveryTime,
        };
      }
      
      // If moving to retained, update fiscal action data
      if (newStatusStr === "retained") {
        shipmentData.isRetained = true;
        
        // If retention details provided, add them
        if (details) {
          const fiscalAction = {
            actionNumber: details.actionNumber || '',
            reason: details.retentionReason,
            amountToPay: parseFloat(details.retentionAmount) || 0,
            paymentDate: details.paymentDate || null,
            releaseDate: details.releaseDate || null,
            notes: details.fiscalNotes || '',
          };
          
          shipmentData.fiscalAction = fiscalAction;
        }
      }
      
      // Update the shipment with new status
      await updateStatus(shipmentId, newStatus);
      
      // If there are additional details, update the shipment with those too
      if (Object.keys(shipmentData).length > 1) {
        await updateStatus(shipmentId, newStatus);
      }
      
      // Show success message
      toast.success(`Status atualizado com sucesso para ${getStatusDisplayName(newStatus)}`);
      
      // Call the onStatusChange callback if provided
      if (props?.onStatusChange) {
        props.onStatusChange(newStatus);
      }
    } catch (error) {
      console.error('Error updating shipment status:', error);
      toast.error('Erro ao atualizar status do embarque');
    } finally {
      setIsProcessing(false);
    }
  };
  
  /**
   * Returns a display-friendly name for a shipment status
   */
  const getStatusDisplayName = (status: ShipmentStatus): string => {
    switch (status) {
      case 'in_transit':
        return 'Em Trânsito';
      case 'retained':
        return 'Retida';
      case 'delivered':
        return 'Retirada';
      case 'partially_delivered':
        return 'Entregue Parcial';
      case 'delivered_final':
        return 'Entregue';
      default:
        return status;
    }
  };

  return {
    handleStatusUpdate,
    isProcessing
  };
}
