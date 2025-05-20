
import { useState, useEffect } from "react";
import { useShipments } from "@/contexts/shipments";
import { fiscalActionService } from "@/contexts/shipments/hooks/fiscal-actions/services/fiscalActionService";
import { useRetentionSheetFormState } from "./useRetentionSheetFormState";
import { useFiscalActionLoader } from "./useFiscalActionLoader";
import { useRetentionSheetUpdate } from "./useRetentionSheetUpdate";

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
  // Get form state management
  const formState = useRetentionSheetFormState(
    initialActionNumber,
    initialRetentionReason,
    initialRetentionAmount,
    initialPaymentDate,
    initialReleaseDate,
    initialFiscalNotes
  );
  
  // Get fiscal action loading functionality
  const { loadLatestFiscalActionData } = useFiscalActionLoader();
  
  // Get update functionality
  const { isSubmitting, handleRetentionUpdate } = useRetentionSheetUpdate(shipmentId, onSuccess);

  // Get needed functions from ShipmentsContext
  const { refreshShipmentsData, getShipmentById } = useShipments();

  // Update states when sheet is opened to get fresh data
  useEffect(() => {
    const refreshRetentionData = async () => {
      if (formState.showRetentionSheet) {
        console.log("RetentionSheetState - sheet opened, refreshing data for shipment:", shipmentId);
        
        try {
          // Force a data refresh first
          refreshShipmentsData();
          
          // Wait a bit to ensure the refresh has time to complete
          setTimeout(async () => {
            // Try multiple approaches to get the latest data
            
            // 1. First try to get directly from the database for the most accurate data
            const latestData = await loadLatestFiscalActionData(shipmentId);
            if (latestData) {
              formState.updateFormFields(
                latestData.actionNumber,
                latestData.reason,
                latestData.amountToPay,
                latestData.paymentDate,
                latestData.releaseDate,
                latestData.notes
              );
              console.log("Updated form with fresh data from database");
              return;
            }
            
            // 2. Try to get from the context
            const shipment = getShipmentById(shipmentId);
            
            if (shipment?.fiscalAction) {
              console.log("Retrieved fiscal action from context:", shipment.fiscalAction);
              
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
              
              formState.updateFormFields(
                shipment.fiscalAction.actionNumber || '',
                shipment.fiscalAction.reason || '',
                formattedAmount,
                shipment.fiscalAction.paymentDate || '',
                shipment.fiscalAction.releaseDate || '',
                shipment.fiscalAction.notes || ''
              );
              console.log("Updated form with data from context");
              return;
            }
            
            // 3. Fallback to using the fiscal action service
            console.log("No fiscal action in context, fetching from service");
            const fiscalAction = await fiscalActionService.getFiscalActionByShipmentId(shipmentId);
            
            if (fiscalAction) {
              console.log("Retrieved fiscal action from service:", fiscalAction);
              
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
              
              formState.updateFormFields(
                fiscalAction.actionNumber || '',
                fiscalAction.reason || '',
                formattedAmount,
                fiscalAction.paymentDate || '',
                fiscalAction.releaseDate || '',
                fiscalAction.notes || ''
              );
              return;
            }
            
            // 4. Final fallback to initial values
            console.log("Using initial values as fallback");
            formState.resetFormFields();
          }, 300);
        } catch (error) {
          console.error("Error refreshing retention data:", error);
          
          // Fallback to initial values if there's an error
          formState.resetFormFields();
        }
      }
    };
    
    refreshRetentionData();
  }, [
    formState.showRetentionSheet,
    shipmentId,
    loadLatestFiscalActionData,
    refreshShipmentsData,
    getShipmentById,
    initialActionNumber,
    initialRetentionReason,
    initialRetentionAmount,
    initialPaymentDate,
    initialReleaseDate,
    initialFiscalNotes,
    formState
  ]);

  // Handler for edit button click
  const handleEditClick = () => {
    // Force data refresh before opening sheet
    refreshShipmentsData();
    
    // Short delay to allow refresh to complete
    setTimeout(() => {
      console.log("Opening retention sheet for editing");
      formState.setShowRetentionSheet(true);
    }, 300);
  };

  // Handler for retention form submission
  const handleSubmit = async () => {
    const result = await handleRetentionUpdate(
      formState.actionNumber,
      formState.retentionReason,
      formState.retentionAmount,
      formState.paymentDate,
      formState.releaseDate,
      formState.fiscalNotes
    );
    
    if (result) {
      formState.setShowRetentionSheet(false);
    }
  };

  return {
    // Re-export all form state
    ...formState,
    
    // Add custom handlers
    handleEditClick,
    handleRetentionUpdate: handleSubmit,
    isSubmitting
  };
};
