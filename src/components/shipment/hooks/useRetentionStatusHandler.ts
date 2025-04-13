
import { ShipmentStatus } from "@/types/shipment";
import { toast } from "sonner";

interface UseRetentionStatusHandlerProps {
  shipmentId: string;
  retentionReason: string;
  retentionAmount: string;
  paymentDate: string;
  releaseDate: string;
  actionNumber: string;
  fiscalNotes: string;
  handleStatusUpdate: (shipmentId: string, status: ShipmentStatus, details?: any) => void;
  onStatusChange?: () => void;
  resetForms: () => void;
}

export function useRetentionStatusHandler({
  shipmentId,
  retentionReason,
  retentionAmount,
  paymentDate,
  releaseDate,
  actionNumber,
  fiscalNotes,
  handleStatusUpdate,
  onStatusChange,
  resetForms
}: UseRetentionStatusHandlerProps) {
  
  // Handler for retention confirmation
  const handleRetentionConfirm = () => {
    try {
      // Validate form
      if (!retentionReason.trim()) {
        toast.error("Informe o motivo da retenção");
        return;
      }
      
      const amountValue = parseFloat(retentionAmount || "0");
      
      if (isNaN(amountValue) || amountValue < 0) {
        toast.error("Valor da retenção deve ser um número válido");
        return;
      }
      
      // Process the retention
      const retentionDetails = {
        actionNumber,
        retentionReason,
        retentionAmount,
        paymentDate,
        releaseDate,
        fiscalNotes
      };
      
      // Update shipment status with retention details
      handleStatusUpdate(shipmentId, "retained", retentionDetails);
      
      // Call the onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
      
      // Reset forms and close dialogs
      resetForms();
    } catch (error) {
      toast.error("Erro ao reter embarque");
      console.error(error);
    }
  };
  
  return {
    handleRetentionConfirm
  };
}
