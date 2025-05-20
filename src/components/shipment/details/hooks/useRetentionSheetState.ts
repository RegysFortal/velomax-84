
import { useState, useEffect, useCallback } from "react";
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

  // Function to load fresh data from the database directly
  const loadLatestFiscalActionData = useCallback(async () => {
    if (!shipmentId) return;
    
    try {
      console.log("Loading latest fiscal action data for shipment:", shipmentId);
      const { data, error } = await supabase
        .from('fiscal_actions')
        .select('*')
        .eq('shipment_id', shipmentId)
        .maybeSingle();
        
      if (error) {
        console.error("Error loading fiscal action data:", error);
        return null;
      }
      
      if (data) {
        console.log("Loaded fresh fiscal action data from database:", data);
        
        // Format amount with comma as decimal separator for display
        let formattedAmount = '';
        if (data.amount_to_pay) {
          // Convert to string with 2 decimal places and replace period with comma
          formattedAmount = data.amount_to_pay.toString().replace('.', ',');
          
          // Ensure we have 2 decimal places
          if (!formattedAmount.includes(',')) {
            formattedAmount += ',00';
          } else {
            const parts = formattedAmount.split(',');
            if (parts[1].length === 1) {
              formattedAmount += '0';
            }
          }
        }
        
        return {
          actionNumber: data.action_number || '',
          reason: data.reason || '',
          amountToPay: formattedAmount || '',
          paymentDate: data.payment_date || '',
          releaseDate: data.release_date || '',
          notes: data.notes || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error in loadLatestFiscalActionData:", error);
      return null;
    }
  }, [shipmentId]);

  // Update states when sheet is opened to get fresh data
  useEffect(() => {
    const refreshRetentionData = async () => {
      if (showRetentionSheet) {
        console.log("RetentionSheetState - sheet opened, refreshing data for shipment:", shipmentId);
        
        try {
          // Force a data refresh first
          refreshShipmentsData();
          
          // Wait a bit to ensure the refresh has time to complete
          setTimeout(async () => {
            // Try multiple approaches to get the latest data
            
            // 1. First try to get directly from the database for the most accurate data
            const latestData = await loadLatestFiscalActionData();
            if (latestData) {
              setActionNumber(latestData.actionNumber);
              setRetentionReason(latestData.reason);
              setRetentionAmount(latestData.amountToPay);
              setPaymentDate(latestData.paymentDate);
              setReleaseDate(latestData.releaseDate);
              setFiscalNotes(latestData.notes);
              console.log("Updated form with fresh data from database");
              return;
            }
            
            // 2. Try to get from the context
            const shipment = getShipmentById(shipmentId);
            
            if (shipment?.fiscalAction) {
              console.log("Retrieved fiscal action from context:", shipment.fiscalAction);
              setActionNumber(shipment.fiscalAction.actionNumber || '');
              setRetentionReason(shipment.fiscalAction.reason || '');
              
              // Format amount with comma as decimal separator for display
              let formattedAmount = '';
              if (shipment.fiscalAction.amountToPay) {
                formattedAmount = shipment.fiscalAction.amountToPay.toString().replace('.', ',');
                
                // Ensure we have 2 decimal places
                if (!formattedAmount.includes(',')) {
                  formattedAmount += ',00';
                } else {
                  const parts = formattedAmount.split(',');
                  if (parts[1].length === 1) {
                    formattedAmount += '0';
                  }
                }
              }
              
              setRetentionAmount(formattedAmount);
              setPaymentDate(shipment.fiscalAction.paymentDate || '');
              setReleaseDate(shipment.fiscalAction.releaseDate || '');
              setFiscalNotes(shipment.fiscalAction.notes || '');
              console.log("Updated form with data from context");
              return;
            }
            
            // 3. Fallback to using the fiscal action service
            console.log("No fiscal action in context, fetching from service");
            const fiscalAction = await fiscalActionService.getFiscalActionByShipmentId(shipmentId);
            
            if (fiscalAction) {
              console.log("Retrieved fiscal action from service:", fiscalAction);
              setActionNumber(fiscalAction.actionNumber || '');
              setRetentionReason(fiscalAction.reason || '');
              
              // Format amount with comma as decimal separator
              let formattedAmount = '';
              if (fiscalAction.amountToPay) {
                formattedAmount = fiscalAction.amountToPay.toString().replace('.', ',');
                
                // Ensure we have 2 decimal places
                if (!formattedAmount.includes(',')) {
                  formattedAmount += ',00';
                } else {
                  const parts = formattedAmount.split(',');
                  if (parts[1].length === 1) {
                    formattedAmount += '0';
                  }
                }
              }
              
              setRetentionAmount(formattedAmount);
              setPaymentDate(fiscalAction.paymentDate || '');
              setReleaseDate(fiscalAction.releaseDate || '');
              setFiscalNotes(fiscalAction.notes || '');
              return;
            }
            
            // 4. Final fallback to initial values
            console.log("Using initial values as fallback");
            setActionNumber(initialActionNumber || '');
            setRetentionReason(initialRetentionReason || '');
            setRetentionAmount(initialRetentionAmount || '');
            setPaymentDate(initialPaymentDate || '');
            setReleaseDate(initialReleaseDate || '');
            setFiscalNotes(initialFiscalNotes || '');
          }, 300);
        } catch (error) {
          console.error("Error refreshing retention data:", error);
          
          // Fallback to initial values if there's an error
          setActionNumber(initialActionNumber || '');
          setRetentionReason(initialRetentionReason || '');
          setRetentionAmount(initialRetentionAmount || '');
          setPaymentDate(initialPaymentDate || '');
          setReleaseDate(initialReleaseDate || '');
          setFiscalNotes(initialFiscalNotes || '');
        }
      }
    };
    
    refreshRetentionData();
  }, [
    showRetentionSheet,
    shipmentId,
    loadLatestFiscalActionData,
    refreshShipmentsData,
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
    }, 300);
  };

  // Format number to ensure correct format
  const formatNumber = (value: string): number => {
    if (!value || value.trim() === '') return 0;
    
    // Replace comma with dot for proper decimal parsing
    const normalizedValue = value.replace(',', '.');
    const numValue = parseFloat(normalizedValue);
    
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
      await refreshShipmentsData();

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
