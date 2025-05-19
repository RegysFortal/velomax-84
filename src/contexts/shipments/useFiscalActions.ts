
import { Shipment, FiscalAction } from "@/types/shipment";
import { useFiscalActionUpdate } from "./hooks/fiscal-actions/useFiscalActionUpdate";
import { useFiscalActionClear } from "./hooks/fiscal-actions/useFiscalActionClear";
import { toast } from "sonner";

/**
 * Custom hook to manage fiscal actions for shipments
 * 
 * @param shipments Array of all shipments
 * @param setShipments Function to update shipments state
 * @returns Object with fiscal action functions
 */
export const useFiscalActions = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const { updateFiscalAction: updateAction } = useFiscalActionUpdate(shipments, setShipments);
  const { clearFiscalAction: clearAction } = useFiscalActionClear(shipments, setShipments);

  // Wrapper for updateFiscalAction to maintain a consistent interface
  const updateFiscalAction = async (shipmentId: string, fiscalActionData: any) => {
    console.log("Calling updateFiscalAction with data:", { shipmentId, fiscalActionData });
    
    try {
      return await updateAction(shipmentId, fiscalActionData);
    } catch (error) {
      console.error("Error in updateFiscalAction:", error);
      toast.error("Error updating fiscal action");
      throw error;
    }
  };

  // Update fiscal action details without creating a new one
  const updateFiscalActionDetails = async (
    shipmentId: string, 
    actionNumber?: string,
    releaseDate?: string,
    notes?: string
  ) => {
    try {
      console.log("Updating fiscal action details:", {
        shipmentId,
        actionNumber,
        releaseDate,
        notes
      });
      
      // Get current shipment to find fiscal action
      const shipment = shipments.find(s => s.id === shipmentId);
      if (!shipment || !shipment.fiscalAction) {
        console.error("Unable to update details: fiscal action not found");
        return;
      }
      
      // Check for changes to avoid unnecessary API calls
      const currentAction = shipment.fiscalAction;
      const hasChanges = 
        (actionNumber !== undefined && actionNumber !== currentAction.actionNumber) ||
        (releaseDate !== undefined && releaseDate !== currentAction.releaseDate) ||
        (notes !== undefined && notes !== currentAction.notes);
        
      if (!hasChanges) {
        console.log("No changes detected in fiscal action details");
        return currentAction;
      }
      
      // Prepare data for update
      const updateData: Partial<FiscalAction> = {
        ...currentAction // Start with current data to keep all fields
      };
      
      // Only override fields that were provided
      if (actionNumber !== undefined) updateData.actionNumber = actionNumber;
      if (releaseDate !== undefined) updateData.releaseDate = releaseDate;
      if (notes !== undefined) updateData.notes = notes;
      
      console.log("Complete data for update:", updateData);
      
      // Use updateFiscalAction to ensure persistence
      const updatedFiscalAction = await updateAction(shipmentId, updateData);
      console.log("Fiscal action updated successfully:", updatedFiscalAction);
      
      return updatedFiscalAction;
    } catch (error) {
      console.error("Error in updateFiscalActionDetails:", error);
      toast.error("Error updating fiscal action details");
      throw error;
    }
  };
  
  // Clear fiscal action - returns void as specified in the interface
  const clearFiscalAction = async (shipmentId: string): Promise<void> => {
    try {
      await clearAction(shipmentId);
    } catch (error) {
      console.error("Error clearing fiscal action:", error);
      toast.error("Error removing fiscal action");
      throw error;
    }
  };

  return {
    updateFiscalAction,
    clearFiscalAction,
    updateFiscalActionDetails
  };
};
