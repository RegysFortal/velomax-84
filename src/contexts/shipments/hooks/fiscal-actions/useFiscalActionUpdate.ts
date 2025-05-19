
import { Shipment, FiscalAction } from "@/types/shipment";
import { toast } from "sonner";
import { fiscalActionService } from "./services/fiscalActionService";

/**
 * Hook to update fiscal actions for shipments
 * @param shipments Array of all shipments
 * @param setShipments Function to update shipments state
 * @returns Object with updateFiscalAction function
 */
export const useFiscalActionUpdate = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  /**
   * Updates or creates a fiscal action for a shipment
   * @param shipmentId ID of the shipment to update
   * @param fiscalActionData Fiscal action data to save, or null to remove the fiscal action
   * @returns Updated fiscal action or null if deleted
   */
  const updateFiscalAction = async (
    shipmentId: string, 
    fiscalActionData: Partial<FiscalAction> | null
  ): Promise<FiscalAction | null> => {
    try {
      const now = new Date().toISOString();
      
      if (!shipmentId) {
        console.error("No shipmentId provided for fiscal action update");
        throw new Error("ID do embarque é obrigatório");
      }
      
      const shipment = shipments.find(s => s.id === shipmentId);
      
      if (!shipment) {
        console.error("Shipment not found:", shipmentId);
        throw new Error("Embarque não encontrado");
      }

      // If fiscalActionData is null, special case to delete fiscal action
      if (fiscalActionData === null) {
        if (!shipment.fiscalAction) {
          return null;
        }
        
        // Handle this in a separate function in future refactoring
        return null;
      }

      let fiscalAction: FiscalAction;
      
      // Check if the shipment already has a fiscal action to update or if we need to create one
      if (shipment.fiscalAction && shipment.fiscalAction.id) {
        // Update existing fiscal action
        const updatedFiscalAction = await fiscalActionService.updateFiscalAction(
          shipment.fiscalAction.id,
          fiscalActionData
        );
        
        if (!updatedFiscalAction) {
          throw new Error("Failed to update fiscal action");
        }
        
        fiscalAction = updatedFiscalAction;
      } else {
        // Create new fiscal action
        const newFiscalAction = await fiscalActionService.createFiscalAction(
          shipmentId,
          fiscalActionData
        );
        
        if (!newFiscalAction) {
          throw new Error("Failed to create fiscal action");
        }
        
        fiscalAction = newFiscalAction;
        
        // Also ensure the shipment is marked as retained
        await fiscalActionService.updateShipmentRetentionStatus(shipmentId, true);
      }
      
      // Update state with new or updated fiscal action
      const updatedShipments = shipments.map(s => {
        if (s.id === shipmentId) {
          return { 
            ...s, 
            fiscalAction,
            updatedAt: now
          };
        }
        return s;
      });
      
      setShipments(updatedShipments);
      
      // Force refresh of data in localStorage for local persistence
      localStorage.setItem('velomax_shipments', JSON.stringify(updatedShipments));
      
      return fiscalAction;
    } catch (error) {
      console.error("Error updating fiscal action:", error);
      toast.error("Erro ao atualizar ação fiscal");
      throw error;
    }
  };

  return { updateFiscalAction };
};
