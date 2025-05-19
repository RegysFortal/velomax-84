
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

interface RetentionConfirmProps {
  shipmentId: string;
  retentionReason: string;
  retentionAmount: string;
  paymentDate: string;
  releaseDate: string;
  actionNumber: string;
  fiscalNotes: string;
  onStatusChange?: () => void;
  resetForm: () => void;
}

/**
 * Hook for handling retention confirmation
 */
export function useRetentionConfirm({
  shipmentId,
  retentionReason,
  retentionAmount,
  paymentDate,
  releaseDate,
  actionNumber,
  fiscalNotes,
  onStatusChange,
  resetForm
}: RetentionConfirmProps) {
  const { updateStatus, updateShipment, updateFiscalAction } = useShipments();

  /**
   * Confirms retention and creates a fiscal action
   */
  const handleRetentionConfirm = async () => {
    try {
      console.log("Setting status to retained and updating fiscal action");
      
      if (!retentionReason.trim()) {
        toast.error("O motivo da retenção é obrigatório");
        return;
      }
      
      // First update the status
      await updateStatus(shipmentId, "retained");
      
      // Then update the shipment details and mark as retained
      await updateShipment(shipmentId, { 
        status: "retained",
        isRetained: true 
      });
      
      // Then create/update the fiscal action
      const retentionAmountValue = parseFloat(retentionAmount || "0");
      
      // Create detailed fiscal action object with explicit fields
      const fiscalActionData = {
        actionNumber: actionNumber.trim() || undefined,
        reason: retentionReason.trim(),
        amountToPay: retentionAmountValue,
        paymentDate: paymentDate || undefined,
        releaseDate: releaseDate || undefined,
        notes: fiscalNotes.trim() || undefined,
      };
      
      console.log("Creating fiscal action with data:", fiscalActionData);
      
      const result = await updateFiscalAction(shipmentId, fiscalActionData);
      console.log("Fiscal action creation result:", result);
      
      toast.success("Status alterado para Retida e informações de retenção atualizadas");
      
      resetForm();
      
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error setting retention status:", error);
      toast.error("Erro ao definir status de retenção");
    }
  };

  return { handleRetentionConfirm };
}
