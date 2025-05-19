
import { useState } from "react";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

export const useRetentionSheetState = (
  shipmentId: string,
  initialActionNumber: string,
  initialRetentionReason: string,
  initialRetentionAmount: string,
  initialPaymentDate: string,
  initialReleaseDate: string,
  initialFiscalNotes: string,
  onSuccess?: () => void
) => {
  // State for retention sheet visibility
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);

  // Get updateFiscalAction from ShipmentsContext
  const { updateFiscalAction } = useShipments();

  // Handler for edit button click
  const handleEditClick = () => {
    console.log("Opening retention sheet for editing");
    setShowRetentionSheet(true);
  };

  // Handler for retention form submission
  const handleRetentionUpdate = async (
    actionNumber: string,
    retentionReason: string,
    retentionAmount: string,
    paymentDate: string,
    releaseDate: string,
    fiscalNotes: string
  ) => {
    if (!shipmentId) return;
    
    try {
      console.log("Updating retention details with values:", {
        shipmentId,
        actionNumber,
        retentionReason,
        retentionAmount,
        paymentDate,
        releaseDate,
        fiscalNotes
      });
      
      // Create fiscal action data object
      const fiscalActionData = {
        actionNumber,
        reason: retentionReason,
        amountToPay: parseFloat(retentionAmount) || 0,
        paymentDate,
        releaseDate,
        notes: fiscalNotes
      };
      
      // Use the updateFiscalAction directly from context
      await updateFiscalAction(shipmentId, fiscalActionData);
      
      setShowRetentionSheet(false);
      toast.success("Informações de retenção atualizadas com sucesso");

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating retention details:", error);
      toast.error("Erro ao atualizar informações de retenção");
    }
  };

  return {
    showRetentionSheet,
    setShowRetentionSheet,
    handleEditClick,
    handleRetentionUpdate
  };
};
