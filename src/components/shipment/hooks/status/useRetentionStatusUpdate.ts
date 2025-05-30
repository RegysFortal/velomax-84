
import { ShipmentStatus } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

export interface RetentionUpdateOptions {
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
      
      // Calculate amount to pay - ensure we have a valid number
      let retentionAmountValue = 0;
      if (options.retentionAmount) {
        retentionAmountValue = parseFloat(options.retentionAmount);
        if (isNaN(retentionAmountValue)) {
          retentionAmountValue = 0;
        }
      }
      
      // Update fiscal action with provided data
      await updateFiscalAction(shipmentId, {
        actionNumber: options.actionNumber?.trim(),
        reason: options.retentionReason?.trim() || "Retenção fiscal",
        amountToPay: retentionAmountValue,
        paymentDate: options.paymentDate || null,
        releaseDate: options.releaseDate || null,
        notes: options.fiscalNotes?.trim()
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
   * Updates existing retention information without changing status
   */
  const updateRetentionInfo = async (shipmentId: string, options: RetentionUpdateOptions) => {
    try {
      console.log(`Updating retention details only:`, options);
      
      // Calculate amount to pay - ensure we have a valid number
      let retentionAmountValue = 0;
      if (options.retentionAmount) {
        retentionAmountValue = parseFloat(options.retentionAmount);
        if (isNaN(retentionAmountValue)) {
          retentionAmountValue = 0;
        }
      }
      
      // Update fiscal action with provided data
      await updateFiscalAction(shipmentId, {
        actionNumber: options.actionNumber?.trim(),
        reason: options.retentionReason?.trim() || "Retenção fiscal",
        amountToPay: retentionAmountValue,
        paymentDate: options.paymentDate || null,
        releaseDate: options.releaseDate || null,
        notes: options.fiscalNotes?.trim()
      });
      
      toast.success("Informações de retenção atualizadas com sucesso");
    } catch (error) {
      console.error("Error updating retention information:", error);
      toast.error("Erro ao atualizar informações de retenção");
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
    updateRetentionInfo,
    clearRetentionStatus
  };
}
