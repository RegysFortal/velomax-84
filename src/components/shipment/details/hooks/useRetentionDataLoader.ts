
import { useEffect } from "react";
import { useShipments } from "@/contexts/shipments";
import { fiscalActionService } from "@/contexts/shipments/hooks/fiscal-actions/services/fiscalActionService";
import { useFiscalActionLoader } from "./useFiscalActionLoader";

/**
 * Hook to handle loading retention data from various sources
 */
export const useRetentionDataLoader = (
  shipmentId: string,
  showRetentionSheet: boolean,
  updateFormFields: (
    actionNumber: string,
    reason: string, 
    amount: string,
    paymentDate: string, 
    releaseDate: string,
    notes: string
  ) => void,
  resetFormFields: () => void
) => {
  // Get fiscal action loading functionality
  const { loadLatestFiscalActionData } = useFiscalActionLoader();
  
  // Get needed functions from ShipmentsContext
  const { refreshShipmentsData, getShipmentById } = useShipments();

  // Load data when sheet is opened
  useEffect(() => {
    const refreshRetentionData = async () => {
      if (showRetentionSheet) {
        console.log("RetentionDataLoader - sheet opened, refreshing data for shipment:", shipmentId);
        
        try {
          // Force a data refresh first
          refreshShipmentsData();
          
          // Wait a bit to ensure the refresh has time to complete
          setTimeout(async () => {
            // Try multiple approaches to get the latest data
            
            // 1. First try to get directly from the database for the most accurate data
            const latestData = await loadLatestFiscalActionData(shipmentId);
            if (latestData) {
              updateFormFields(
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
              
              updateFormFields(
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
              
              updateFormFields(
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
            resetFormFields();
          }, 300);
        } catch (error) {
          console.error("Error refreshing retention data:", error);
          
          // Fallback to initial values if there's an error
          resetFormFields();
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
    updateFormFields,
    resetFormFields
  ]);

  return {
    refreshShipmentsData
  };
};
