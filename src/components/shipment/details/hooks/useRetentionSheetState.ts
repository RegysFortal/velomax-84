
import { useState, useEffect } from "react";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

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
    setActionNumber(initialActionNumber || '');
    setRetentionReason(initialRetentionReason || '');
    setRetentionAmount(initialRetentionAmount || '');
    setPaymentDate(initialPaymentDate || '');
    setReleaseDate(initialReleaseDate || '');
    setFiscalNotes(initialFiscalNotes || '');
  }, [
    initialActionNumber,
    initialRetentionReason,
    initialRetentionAmount,
    initialPaymentDate,
    initialReleaseDate,
    initialFiscalNotes
  ]);

  // Get updateFiscalAction from ShipmentsContext
  const { updateFiscalAction } = useShipments();

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
  const handleRetentionUpdate = async (
    newActionNumber: string,
    newRetentionReason: string,
    newRetentionAmount: string,
    newPaymentDate: string,
    newReleaseDate: string,
    newFiscalNotes: string
  ) => {
    if (!shipmentId) return;
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Updating retention details with values:", {
        shipmentId,
        newActionNumber,
        newRetentionReason,
        newRetentionAmount,
        newPaymentDate,
        newReleaseDate,
        newFiscalNotes
      });
      
      // Validate required fields
      if (!newRetentionReason) {
        toast.error("O motivo da retenção é obrigatório");
        setIsSubmitting(false);
        return;
      }
      
      // Parse retention amount to ensure valid number
      const amountValue = formatNumber(newRetentionAmount);
      
      // Create fiscal action data object
      const fiscalActionData = {
        actionNumber: newActionNumber.trim(),
        reason: newRetentionReason.trim(),
        amountToPay: amountValue,
        paymentDate: newPaymentDate || null,
        releaseDate: newReleaseDate || null,
        notes: newFiscalNotes?.trim() || null
      };
      
      console.log("Sending data to updateFiscalAction:", fiscalActionData);
      
      // Use updateFiscalAction directly from context
      const result = await updateFiscalAction(shipmentId, fiscalActionData);
      console.log("Update result:", result);
      
      setShowRetentionSheet(false);
      toast.success("Informações de retenção atualizadas com sucesso");

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
