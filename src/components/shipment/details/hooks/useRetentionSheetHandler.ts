
import { toast } from "sonner";
import { useShipments } from "@/contexts/shipments";

interface UseRetentionSheetHandlerProps {
  shipmentId: string;
  retentionReason: string;
  retentionAmount: string;
  paymentDate: string;
  releaseDate: string;
  actionNumber: string;
  fiscalNotes: string;
  setShowRetentionSheet: (show: boolean) => void;
  onStatusChange: (status: any) => void;
}

export function useRetentionSheetHandler({
  shipmentId,
  retentionReason,
  retentionAmount,
  paymentDate,
  releaseDate,
  actionNumber,
  fiscalNotes,
  setShowRetentionSheet,
  onStatusChange
}: UseRetentionSheetHandlerProps) {
  const { updateFiscalAction } = useShipments();

  // Handler specifically for retention details updates
  const handleRetentionUpdate = async () => {
    if (!shipmentId) return;
    
    try {
      console.log("Updating retention details with new values:", {
        shipmentId,
        actionNumber,
        retentionReason,
        retentionAmount,
        paymentDate,
        releaseDate,
        fiscalNotes
      });
      
      // Validate required fields
      if (!retentionReason.trim()) {
        toast.error("O motivo da retenção é obrigatório");
        return;
      }
      
      // Create the fiscal action data object with all fields explicitly defined
      const fiscalActionData = {
        actionNumber: actionNumber ? actionNumber.trim() : undefined,
        reason: retentionReason.trim(),
        amountToPay: parseFloat(retentionAmount) || 0,
        paymentDate: paymentDate || undefined,
        releaseDate: releaseDate || undefined,
        notes: fiscalNotes ? fiscalNotes.trim() : undefined
      };
      
      console.log("Updating fiscal action with data:", fiscalActionData);
      
      // Use the updateFiscalAction function from the ShipmentsContext
      const result = await updateFiscalAction(shipmentId, fiscalActionData);
      console.log("Fiscal action update result:", result);
      
      // Close the retention sheet
      setShowRetentionSheet(false);
      
      // Show success message
      toast.success("Informações de retenção atualizadas com sucesso");
      
      // Trigger a status change to refresh the UI if needed
      if (onStatusChange) {
        onStatusChange('retained');
      }
    } catch (error) {
      console.error("Error updating retention details:", error);
      toast.error("Erro ao atualizar informações de retenção");
    }
  };

  return {
    handleRetentionUpdate
  };
}
