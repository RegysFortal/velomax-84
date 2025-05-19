
import { useState, useEffect } from "react";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for managing retention sheet state and operations
 */
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
  // Retention sheet visibility state
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  
  // Local states to track field values
  const [actionNumber, setActionNumber] = useState(initialActionNumber || '');
  const [retentionReason, setRetentionReason] = useState(initialRetentionReason || '');
  const [retentionAmount, setRetentionAmount] = useState(initialRetentionAmount || '');
  const [paymentDate, setPaymentDate] = useState(initialPaymentDate || '');
  const [releaseDate, setReleaseDate] = useState(initialReleaseDate || '');
  const [fiscalNotes, setFiscalNotes] = useState(initialFiscalNotes || '');
  
  // Submission state tracking
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update states when initial values change
  useEffect(() => {
    if (showRetentionSheet) {
      // Only update when the sheet is opened, to get fresh data
      setActionNumber(initialActionNumber || '');
      setRetentionReason(initialRetentionReason || '');
      setRetentionAmount(initialRetentionAmount || '');
      setPaymentDate(initialPaymentDate || '');
      setReleaseDate(initialReleaseDate || '');
      setFiscalNotes(initialFiscalNotes || '');
      
      console.log("Loading initial retention values:", {
        initialActionNumber,
        initialRetentionReason,
        initialRetentionAmount,
        initialPaymentDate,
        initialReleaseDate,
        initialFiscalNotes
      });
    }
  }, [
    showRetentionSheet,
    initialActionNumber,
    initialRetentionReason,
    initialRetentionAmount,
    initialPaymentDate,
    initialReleaseDate,
    initialFiscalNotes
  ]);

  // Get updateFiscalAction from ShipmentsContext
  const { updateFiscalAction, refreshShipmentsData } = useShipments();

  // Handler for edit button click
  const handleEditClick = () => {
    console.log("Opening retention sheet for editing");
    setShowRetentionSheet(true);
  };

  // Format number to ensure correct format
  const formatNumber = (value: string): number => {
    // Remove non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Convert to number
    const numValue = parseFloat(cleanValue);
    
    // Return 0 if NaN
    return isNaN(numValue) ? 0 : numValue;
  };

  // Handler for retention form submission
  const handleRetentionUpdate = async () => {
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
      
      // Parse retention amount to ensure valid number
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
      } catch (shipmentError) {
        console.warn("Could not update shipment retention status:", shipmentError);
      }
      
      // Use updateFiscalAction directly from context
      const result = await updateFiscalAction(shipmentId, fiscalActionData);
      console.log("Update result:", result);
      
      // Update form state with the latest values
      setActionNumber(actionNumber);
      setRetentionReason(retentionReason);
      setRetentionAmount(retentionAmount);
      setPaymentDate(paymentDate);
      setReleaseDate(releaseDate);
      setFiscalNotes(fiscalNotes);
      
      setShowRetentionSheet(false);
      toast.success("Informações de retenção atualizadas com sucesso");

      // Force refresh data from the server
      refreshShipmentsData();

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating retention details:", error);
      toast.error("Erro ao atualizar informações de retenção");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showRetentionSheet,
    setShowRetentionSheet,
    actionNumber,
    setActionNumber,
    retentionReason,
    setRetentionReason,
    retentionAmount,
    setRetentionAmount,
    paymentDate,
    setPaymentDate,
    releaseDate,
    setReleaseDate,
    fiscalNotes,
    setFiscalNotes,
    handleEditClick,
    handleRetentionUpdate,
    isSubmitting
  };
};
