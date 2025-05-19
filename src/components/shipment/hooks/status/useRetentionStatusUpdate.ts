
import { ShipmentStatus } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

interface RetentionUpdateOptions {
  shipmentId: string;
  actionNumber?: string;
  retentionReason?: string;
  retentionAmount?: string;
  paymentDate?: string;
  releaseDate?: string;
  fiscalNotes?: string;
}

/**
 * Hook for handling retention status updates
 */
export function useRetentionStatusUpdate() {
  const { updateShipment, updateStatus, updateFiscalAction } = useShipments();

  /**
   * Updates shipment with retention status and details
   */
  const updateRetentionStatus = async (shipmentId: string, options: RetentionUpdateOptions) => {
    try {
      console.log(`Setting retention status with details:`, options);
      
      // First update the status
      await updateStatus(shipmentId, "retained");
      
      // Update shipment with retention flag
      await updateShipment(shipmentId, {
        status: "retained",
        isRetained: true
      });
      
      // Calculate amount to pay
      const retentionAmountValue = parseFloat(options.retentionAmount || "0");
      
      // Update fiscal action with provided data
      await updateFiscalAction(shipmentId, {
        actionNumber: options.actionNumber?.trim() || undefined,
        reason: options.retentionReason?.trim() || "Retenção fiscal",
        amountToPay: retentionAmountValue,
        paymentDate: options.paymentDate || undefined,
        releaseDate: options.releaseDate || undefined,
        notes: options.fiscalNotes?.trim() || undefined
      });
      
      toast.success("Status alterado para Retida e informações de retenção atualizadas");
      return "retained" as ShipmentStatus;
    } catch (error) {
      console.error("Error updating retention status:", error);
      toast.error("Erro ao atualizar status de retenção");
      throw error;
    }
  };
  
  /**
   * Clears retention status when status changes from retained to something else
   */
  const clearRetentionStatus = async (shipmentId: string, previousStatus: ShipmentStatus) => {
    // Only clear if previous status was retained
    if (previousStatus === "retained") {
      try {
        await updateFiscalAction(shipmentId, null);
      } catch (error) {
        console.error("Error clearing fiscal action:", error);
      }
    }
  };

  return {
    updateRetentionStatus,
    clearRetentionStatus
  };
}
