
import { useState, useEffect } from "react";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { fiscalActionService } from "@/contexts/shipments/hooks/fiscal-actions/services/fiscalActionService";

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

  // Get needed functions from ShipmentsContext
  const { updateFiscalAction, refreshShipmentsData, getShipmentById } = useShipments();

  // Update states when sheet is opened to get fresh data
  useEffect(() => {
    const refreshRetentionData = async () => {
      if (showRetentionSheet) {
        console.log("RetentionSheetState - sheet opened, refreshing data for shipment:", shipmentId);
        
        try {
          // First try to get the latest data from context
          const shipment = getShipmentById(shipmentId);
          
          if (shipment?.fiscalAction) {
            console.log("Retrieved fiscal action from context:", shipment.fiscalAction);
            setActionNumber(shipment.fiscalAction.actionNumber || '');
            setRetentionReason(shipment.fiscalAction.reason || '');
            setRetentionAmount(shipment.fiscalAction.amountToPay?.toString() || '');
            setPaymentDate(shipment.fiscalAction.paymentDate || '');
            setReleaseDate(shipment.fiscalAction.releaseDate || '');
            setFiscalNotes(shipment.fiscalAction.notes || '');
          } else {
            // If not available in context, try to fetch directly from database
            console.log("No fiscal action in context, fetching from database");
            const fiscalAction = await fiscalActionService.getFiscalActionByShipmentId(shipmentId);
            
            if (fiscalAction) {
              console.log("Retrieved fiscal action from database:", fiscalAction);
              setActionNumber(fiscalAction.actionNumber || '');
              setRetentionReason(fiscalAction.reason || '');
              setRetentionAmount(fiscalAction.amountToPay?.toString() || '');
              setPaymentDate(fiscalAction.paymentDate || '');
              setReleaseDate(fiscalAction.releaseDate || '');
              setFiscalNotes(fiscalAction.notes || '');
            } else {
              // Fall back to initial values
              console.log("Using initial values:", {
                initialActionNumber,
                initialRetentionReason, 
                initialRetentionAmount,
                initialPaymentDate,
                initialReleaseDate,
                initialFiscalNotes
              });
              
              setActionNumber(initialActionNumber || '');
              setRetentionReason(initialRetentionReason || '');
              setRetentionAmount(initialRetentionAmount || '');
              setPaymentDate(initialPaymentDate || '');
              setReleaseDate(initialReleaseDate || '');
              setFiscalNotes(initialFiscalNotes || '');
            }
          }
        } catch (error) {
          console.error("Error refreshing retention data:", error);
        }
      }
    };
    
    refreshRetentionData();
  }, [
    showRetentionSheet,
    shipmentId,
    getShipmentById,
    initialActionNumber,
    initialRetentionReason,
    initialRetentionAmount,
    initialPaymentDate,
    initialReleaseDate,
    initialFiscalNotes
  ]);

  // Handler for edit button click
  const handleEditClick = () => {
    // Force data refresh before opening sheet
    refreshShipmentsData();
    
    // Short delay to allow refresh to complete
    setTimeout(() => {
      console.log("Opening retention sheet for editing");
      setShowRetentionSheet(true);
    }, 100);
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
          
        console.log("Successfully updated shipment retention status");
      } catch (shipmentError) {
        console.warn("Could not update shipment retention status directly:", shipmentError);
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
