
import { useState } from "react";
import { useShipments } from "@/contexts/shipments";
import { useRetentionSheetFormState } from "./useRetentionSheetFormState";
import { useRetentionSheetUpdate } from "./useRetentionSheetUpdate";
import { useRetentionDataLoader } from "./useRetentionDataLoader";

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
  
  // Get update functionality
  const { isSubmitting, handleRetentionUpdate } = useRetentionSheetUpdate(shipmentId, onSuccess);

  // Get needed functions from ShipmentsContext
  const { refreshShipmentsData } = useShipments();

  // Use our data loader hook
  useRetentionDataLoader(
    shipmentId, 
    formState.showRetentionSheet, 
    formState.updateFormFields,
    formState.resetFormFields
  );

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
