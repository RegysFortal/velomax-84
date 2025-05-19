
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
      // Validate fiscal action data
      if (!shipmentId) {
        console.error("Missing shipment ID for fiscal action update");
        toast.error("ID do embarque não fornecido");
        return null;
      }
      
      if (!fiscalActionData) {
        console.error("Missing fiscal action data");
        toast.error("Dados da ação fiscal não fornecidos");
        return null;
      }
      
      // If we're getting an empty object, ensure we create proper defaults
      if (fiscalActionData && typeof fiscalActionData === 'object' && Object.keys(fiscalActionData).length === 0) {
        console.log("Empty fiscal action data object provided, using defaults");
        fiscalActionData = {
          reason: "Retenção fiscal",
          amountToPay: 0,
        };
      }

      // Ensure we have at least a reason
      if (!fiscalActionData.reason) {
        console.log("No reason provided, setting default");
        fiscalActionData.reason = "Retenção fiscal";
      }

      // Call the actual implementation
      const result = await updateAction(shipmentId, fiscalActionData);
      if (result) {
        console.log("Fiscal action updated successfully:", result);
        
        // Ensure data is saved to local storage for additional persistence
        const updatedShipments = shipments.map(s => {
          if (s.id === shipmentId) {
            return { ...s, fiscalAction: result };
          }
          return s;
        });
        localStorage.setItem('velomax_shipments', JSON.stringify(updatedShipments));
        setShipments(updatedShipments);
      } else {
        console.warn("No result returned from fiscal action update");
      }
      
      return result;
    } catch (error) {
      console.error("Error in updateFiscalAction:", error);
      toast.error("Erro ao atualizar ação fiscal");
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
      
      if (!shipmentId) {
        console.error("Missing shipment ID for fiscal action details update");
        toast.error("ID do embarque não fornecido");
        return null;
      }
      
      // Get current shipment to find fiscal action
      const shipment = shipments.find(s => s.id === shipmentId);
      if (!shipment) {
        console.error("Shipment not found for fiscal action update");
        toast.error("Embarque não encontrado para atualização");
        return;
      }
      
      if (!shipment.fiscalAction) {
        console.error("Unable to update details: fiscal action not found");
        toast.error("Ação fiscal não encontrada");
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
      console.log("Fiscal action details updated successfully:", updatedFiscalAction);
      
      return updatedFiscalAction;
    } catch (error) {
      console.error("Error in updateFiscalActionDetails:", error);
      toast.error("Erro ao atualizar detalhes da ação fiscal");
      throw error;
    }
  };
  
  // Clear fiscal action - returns void as specified in the interface
  const clearFiscalAction = async (shipmentId: string): Promise<void> => {
    try {
      console.log("Clearing fiscal action for shipment:", shipmentId);
      await clearAction(shipmentId);
      console.log("Fiscal action cleared successfully");
    } catch (error) {
      console.error("Error clearing fiscal action:", error);
      toast.error("Erro ao remover ação fiscal");
      throw error;
    }
  };

  return {
    updateFiscalAction,
    clearFiscalAction,
    updateFiscalActionDetails
  };
};
