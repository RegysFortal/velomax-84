
import { Shipment, FiscalAction } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

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
  const updateFiscalAction = async (shipmentId: string, fiscalActionData: Partial<FiscalAction> | null): Promise<FiscalAction | null> => {
    try {
      const now = new Date().toISOString();
      const shipment = shipments.find(s => s.id === shipmentId);
      
      if (!shipment) {
        console.error("Shipment not found:", shipmentId);
        throw new Error("Embarque não encontrado");
      }

      // If fiscalActionData is null, delete the fiscal action
      if (fiscalActionData === null) {
        if (shipment.fiscalAction) {
          console.log("Removing fiscal action with ID:", shipment.fiscalAction.id);
          
          const { error } = await supabase
            .from('fiscal_actions')
            .delete()
            .eq('id', shipment.fiscalAction.id);
            
          if (error) {
            console.error("Error deleting fiscal action:", error);
            throw error;
          }
          
          // Update the local state to remove the fiscal action
          const updatedShipments = shipments.map(s => {
            if (s.id === shipmentId) {
              const { fiscalAction, ...restShipment } = s;
              return { 
                ...restShipment, 
                updatedAt: now
              };
            }
            return s;
          });
          
          setShipments(updatedShipments);
          return null;
        }
        return null;
      }

      let fiscalAction: FiscalAction;
      
      // Check if the shipment already has a fiscal action to update or if we need to create one
      if (shipment.fiscalAction && shipment.fiscalAction.id) {
        // Update existing fiscal action
        const supabaseFiscalAction: Record<string, any> = {
          updated_at: now
        };
        
        // Map only the fields that were provided
        if (fiscalActionData.actionNumber !== undefined) supabaseFiscalAction.action_number = fiscalActionData.actionNumber;
        if (fiscalActionData.reason !== undefined) supabaseFiscalAction.reason = fiscalActionData.reason;
        if (fiscalActionData.amountToPay !== undefined) supabaseFiscalAction.amount_to_pay = fiscalActionData.amountToPay;
        if (fiscalActionData.paymentDate !== undefined) supabaseFiscalAction.payment_date = fiscalActionData.paymentDate;
        if (fiscalActionData.releaseDate !== undefined) supabaseFiscalAction.release_date = fiscalActionData.releaseDate;
        if (fiscalActionData.notes !== undefined) supabaseFiscalAction.notes = fiscalActionData.notes;
        
        console.log("Updating fiscal action with ID:", shipment.fiscalAction.id);
        console.log("Update data:", supabaseFiscalAction);
        
        // Track request timing for debugging
        const requestStart = Date.now();
        
        const { error, data } = await supabase
          .from('fiscal_actions')
          .update(supabaseFiscalAction)
          .eq('id', shipment.fiscalAction.id)
          .select('*');
          
        console.log(`Request time: ${Date.now() - requestStart}ms`);  
        
        if (error) {
          console.error("Error updating fiscal action:", error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.error("No data returned after update");
          throw new Error("Failed to update fiscal action: no data returned");
        }
        
        console.log("Supabase response after update:", data);
        
        const updatedData = data[0];
        
        // Combine existing data with updates
        fiscalAction = {
          id: updatedData.id,
          actionNumber: updatedData.action_number,
          reason: updatedData.reason,
          amountToPay: updatedData.amount_to_pay,
          paymentDate: updatedData.payment_date,
          releaseDate: updatedData.release_date,
          notes: updatedData.notes,
          createdAt: updatedData.created_at,
          updatedAt: updatedData.updated_at
        };
      } else {
        // Create new fiscal action
        console.log("Creating new fiscal action for shipment:", shipmentId);
        
        // Ensure all required fields are present
        const supabaseFiscalAction = {
          shipment_id: shipmentId,
          action_number: fiscalActionData.actionNumber || null,
          reason: fiscalActionData.reason || 'Não especificado',
          amount_to_pay: fiscalActionData.amountToPay !== undefined ? fiscalActionData.amountToPay : 0,
          payment_date: fiscalActionData.paymentDate || null,
          release_date: fiscalActionData.releaseDate || null,
          notes: fiscalActionData.notes || null,
          created_at: now,
          updated_at: now
        };
        
        console.log("Data for fiscal action creation:", supabaseFiscalAction);
        
        // Insert fiscal action in Supabase
        const { data: newFiscalAction, error } = await supabase
          .from('fiscal_actions')
          .insert(supabaseFiscalAction)
          .select('*')
          .single();
          
        if (error) {
          console.error("Error creating fiscal action:", error);
          throw error;
        }
        
        if (!newFiscalAction) {
          console.error("No data returned after creation");
          throw new Error("Failed to create fiscal action: no data returned");
        }
        
        console.log("New fiscal action created:", newFiscalAction);
        
        // Map Supabase response to our FiscalAction type
        fiscalAction = {
          id: newFiscalAction.id,
          actionNumber: newFiscalAction.action_number,
          reason: newFiscalAction.reason,
          amountToPay: newFiscalAction.amount_to_pay,
          paymentDate: newFiscalAction.payment_date,
          releaseDate: newFiscalAction.release_date,
          notes: newFiscalAction.notes,
          createdAt: newFiscalAction.created_at,
          updatedAt: newFiscalAction.updated_at
        };
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
