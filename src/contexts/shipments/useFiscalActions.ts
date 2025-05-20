import { Shipment, FiscalAction } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export function useFiscalActions(
  shipments: Shipment[], 
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>,
  refreshShipmentsData: () => void
) {
  /**
   * Updates or creates a fiscal action for a shipment
   */
  const updateFiscalAction = async (shipmentId: string, fiscalActionData: Partial<FiscalAction>) => {
    try {
      console.log("Updating fiscal action for shipment:", shipmentId, fiscalActionData);
      
      // Check if shipment exists
      const shipment = shipments.find(s => s.id === shipmentId);
      if (!shipment) {
        console.error("Shipment not found");
        throw new Error("Shipment not found");
      }
      
      // Prepare Supabase data
      const supabaseFiscalAction: any = {
        updated_at: new Date().toISOString()
      };
      
      if (fiscalActionData.reason !== undefined) supabaseFiscalAction.reason = fiscalActionData.reason;
      
      // Handle amount with comma as decimal separator
      if (fiscalActionData.amountToPay !== undefined) {
        // If it's a string that might contain a comma, convert it
        if (typeof fiscalActionData.amountToPay === 'string') {
          // Replace comma with period for proper decimal parsing
          const normalizedAmount = (fiscalActionData.amountToPay as string).replace(',', '.');
          // Parse as float with 2 decimal places precision
          supabaseFiscalAction.amount_to_pay = parseFloat(parseFloat(normalizedAmount).toFixed(2));
          console.log("Normalized amount:", normalizedAmount, "->", supabaseFiscalAction.amount_to_pay);
        } else {
          // Already a number, but ensure we keep 2 decimal places
          supabaseFiscalAction.amount_to_pay = parseFloat(fiscalActionData.amountToPay.toFixed(2));
        }
      }
      
      if (fiscalActionData.paymentDate !== undefined) supabaseFiscalAction.payment_date = fiscalActionData.paymentDate;
      if (fiscalActionData.releaseDate !== undefined) supabaseFiscalAction.release_date = fiscalActionData.releaseDate;
      if (fiscalActionData.notes !== undefined) supabaseFiscalAction.notes = fiscalActionData.notes;
      if (fiscalActionData.actionNumber !== undefined) supabaseFiscalAction.action_number = fiscalActionData.actionNumber;
      
      console.log("Supabase fiscal action object:", supabaseFiscalAction);
      
      let fiscalAction;
      
      // If shipment has fiscal action, update it
      if (shipment.fiscalAction) {
        const { data, error } = await supabase
          .from('fiscal_actions')
          .update(supabaseFiscalAction)
          .eq('shipment_id', shipmentId)
          .select('*')
          .single();
        
        if (error) {
          console.error("Error updating fiscal action:", error);
          throw error;
        }
        
        console.log("Fiscal action updated:", data);
        fiscalAction = data;
      } 
      // Otherwise create new fiscal action
      else {
        // For new fiscal actions, ensure we handle the amount properly
        let amountValue = 0;
        if (fiscalActionData.amountToPay !== undefined) {
          if (typeof fiscalActionData.amountToPay === 'string') {
            // Replace comma with period and parse as float
            amountValue = parseFloat((fiscalActionData.amountToPay as string).replace(',', '.'));
            // Ensure it's a valid number
            if (isNaN(amountValue)) amountValue = 0;
            // Keep 2 decimal places
            amountValue = parseFloat(amountValue.toFixed(2));
          } else {
            amountValue = parseFloat(fiscalActionData.amountToPay.toFixed(2));
          }
        }

        const { data, error } = await supabase
          .from('fiscal_actions')
          .insert({
            shipment_id: shipmentId,
            reason: fiscalActionData.reason || "Retenção",
            amount_to_pay: amountValue,
            payment_date: fiscalActionData.paymentDate,
            release_date: fiscalActionData.releaseDate,
            action_number: fiscalActionData.actionNumber,
            notes: fiscalActionData.notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('*')
          .single();
        
        if (error) {
          console.error("Error creating fiscal action:", error);
          throw error;
        }
        
        console.log("Fiscal action created:", data);
        fiscalAction = data;
      }
      
      // Map Supabase response to our type
      const mappedFiscalAction: FiscalAction = {
        id: fiscalAction.id,
        actionNumber: fiscalAction.action_number,
        reason: fiscalAction.reason,
        amountToPay: fiscalAction.amount_to_pay,
        paymentDate: fiscalAction.payment_date,
        releaseDate: fiscalAction.release_date,
        notes: fiscalAction.notes,
        createdAt: fiscalAction.created_at,
        updatedAt: fiscalAction.updated_at
      };
      
      // Update local state with the updated fiscal action
      const updatedShipments = shipments.map(s => {
        if (s.id === shipmentId) {
          return { ...s, fiscalAction: mappedFiscalAction };
        }
        return s;
      });
      
      setShipments(updatedShipments);
      
      // Refresh data to ensure consistency
      setTimeout(() => {
        refreshShipmentsData();
      }, 500);
      
      return mappedFiscalAction;
    } catch (error) {
      console.error("Error in updateFiscalAction:", error);
      toast.error("Erro ao atualizar ação fiscal");
      throw error;
    }
  };

  // Keep existing methods (clearFiscalAction and updateFiscalActionDetails)
  const clearFiscalAction = async (shipmentId: string) => {
    try {
      const { error } = await supabase
        .from('fiscal_actions')
        .delete()
        .eq('shipment_id', shipmentId);
      
      if (error) {
        console.error("Error clearing fiscal action:", error);
        throw error;
      }
      
      const updatedShipments = shipments.map(s => {
        if (s.id === shipmentId) {
          return { ...s, fiscalAction: undefined };
        }
        return s;
      });
      
      setShipments(updatedShipments);
      refreshShipmentsData();
    } catch (error) {
      console.error("Error in clearFiscalAction:", error);
      toast.error("Erro ao remover ação fiscal");
      throw error;
    }
  };

  const updateFiscalActionDetails = async (
    shipmentId: string, 
    actionNumber?: string, 
    releaseDate?: string, 
    notes?: string
  ) => {
    try {
      const shipment = shipments.find(s => s.id === shipmentId);
      if (!shipment || !shipment.fiscalAction) {
        console.error("Shipment or fiscal action not found");
        throw new Error("Shipment or fiscal action not found");
      }
      
      return await updateFiscalAction(shipmentId, {
        actionNumber,
        releaseDate,
        notes
      });
    } catch (error) {
      console.error("Error in updateFiscalActionDetails:", error);
      toast.error("Erro ao atualizar detalhes da ação fiscal");
      throw error;
    }
  };
  
  return {
    updateFiscalAction,
    clearFiscalAction,
    updateFiscalActionDetails
  };
}
