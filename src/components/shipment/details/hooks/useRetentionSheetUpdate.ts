
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useShipments } from "@/contexts/shipments";

/**
 * Hook to handle retention sheet updates
 */
export const useRetentionSheetUpdate = (shipmentId: string, onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateFiscalAction, refreshShipmentsData } = useShipments();

  /**
   * Format number to ensure correct format for database
   */
  const formatNumber = (value: string): number => {
    if (!value || value.trim() === '') return 0;
    
    // Replace comma with dot for proper decimal parsing
    const normalizedValue = value.replace(',', '.');
    const numValue = parseFloat(normalizedValue);
    
    // Return 0 if NaN
    return isNaN(numValue) ? 0 : numValue;
  };

  /**
   * Handle retention form submission
   */
  const handleRetentionUpdate = async (
    actionNumber: string,
    retentionReason: string,
    retentionAmount: string,
    paymentDate: string,
    releaseDate: string,
    fiscalNotes: string
  ) => {
    if (!shipmentId) {
      console.error("No shipmentId provided for retention update");
      toast.error("ID do embarque não fornecido");
      return;
    }
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
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
      
      // Validate required fields
      if (!retentionReason) {
        toast.error("O motivo da retenção é obrigatório");
        setIsSubmitting(false);
        return;
      }
      
      // Parse retention amount to ensure valid number with proper decimal handling
      const amountValue = formatNumber(retentionAmount);
      
      // Create fiscal action data object with all fields explicitly defined
      const fiscalActionData = {
        actionNumber: actionNumber ? actionNumber.trim() : undefined,
        reason: retentionReason.trim(),
        amountToPay: amountValue,
        paymentDate: paymentDate || undefined,
        releaseDate: releaseDate || undefined,
        notes: fiscalNotes?.trim() || undefined
      };
      
      console.log("Sending data to updateFiscalAction:", fiscalActionData);
      
      // Directly update shipment to ensure retention flag is set
      try {
        await supabase
          .from('shipments')
          .update({ 
            is_retained: true,
            status: "retained",
            updated_at: new Date().toISOString()
          })
          .eq('id', shipmentId);
          
        console.log("Successfully updated shipment retention status");
      } catch (shipmentError) {
        console.warn("Could not update shipment retention status directly:", shipmentError);
      }
      
      // Use updateFiscalAction directly from context
      const result = await updateFiscalAction(shipmentId, fiscalActionData);
      console.log("Update result:", result);
      
      toast.success("Informações de retenção atualizadas com sucesso");

      // Force refresh data from the server
      await refreshShipmentsData();

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      console.error("Error updating retention details:", error);
      toast.error("Erro ao atualizar informações de retenção");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleRetentionUpdate
  };
};
