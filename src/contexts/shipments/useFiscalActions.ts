
import { Shipment, FiscalAction } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useFiscalActions = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const updateFiscalAction = async (shipmentId: string, fiscalActionData: any) => {
    console.log("Updating fiscal action for shipment:", shipmentId, fiscalActionData);
    
    try {
      const timestamp = new Date().toISOString();
      
      if (fiscalActionData === null) {
        // Clear fiscal action if null is passed
        const { error } = await supabase
          .from('fiscal_actions')
          .delete()
          .eq('shipment_id', shipmentId);
        
        if (error) {
          console.error("Error clearing fiscal action:", error);
          throw error;
        }
        
        // Update local state
        setShipments(prev => prev.map(s => {
          if (s.id === shipmentId) {
            // Remove fiscal action from shipment
            const { fiscalAction, ...rest } = s;
            return { ...rest, updatedAt: timestamp };
          }
          return s;
        }));
        
        console.log("Fiscal action cleared for shipment:", shipmentId);
        
        return null;
      }
      
      // Check if a fiscal action already exists for this shipment
      const { data: existingActions } = await supabase
        .from('fiscal_actions')
        .select('id')
        .eq('shipment_id', shipmentId);
      
      let result;
      
      if (existingActions && existingActions.length > 0) {
        // Update existing fiscal action
        const actionId = existingActions[0].id;
        
        // Prepare data for update
        const updateData = {
          reason: fiscalActionData.reason || '',
          amount_to_pay: fiscalActionData.amountToPay || 0,
          payment_date: fiscalActionData.paymentDate || null,
          release_date: fiscalActionData.releaseDate || null,
          notes: fiscalActionData.notes || null,
          action_number: fiscalActionData.actionNumber || null,
          updated_at: timestamp
        };
        
        console.log("Updating existing fiscal action:", actionId, updateData);
        
        const { data, error } = await supabase
          .from('fiscal_actions')
          .update(updateData)
          .eq('id', actionId)
          .select('*')
          .single();
          
        if (error) {
          console.error("Supabase fiscal action update error:", error);
          throw error;
        }
        
        result = data;
      } else {
        // Create new fiscal action
        const newFiscalAction = {
          shipment_id: shipmentId,
          reason: fiscalActionData.reason || '',
          amount_to_pay: fiscalActionData.amountToPay || 0,
          payment_date: fiscalActionData.paymentDate || null,
          release_date: fiscalActionData.releaseDate || null,
          notes: fiscalActionData.notes || null,
          action_number: fiscalActionData.actionNumber || null,
          created_at: timestamp,
          updated_at: timestamp
        };
        
        console.log("Creating new fiscal action:", newFiscalAction);
        
        const { data, error } = await supabase
          .from('fiscal_actions')
          .insert(newFiscalAction)
          .select('*')
          .single();
          
        if (error) {
          console.error("Supabase fiscal action insert error:", error);
          throw error;
        }
        
        result = data;
      }
      
      // Map the database response to our FiscalAction type
      const fiscalAction: FiscalAction = {
        id: result.id,
        reason: result.reason,
        amountToPay: result.amount_to_pay,
        paymentDate: result.payment_date,
        releaseDate: result.release_date,
        notes: result.notes,
        actionNumber: result.action_number,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
      
      // Update local state
      setShipments(prev => prev.map(s => {
        if (s.id === shipmentId) {
          return { ...s, fiscalAction, updatedAt: timestamp };
        }
        return s;
      }));
      
      console.log("Fiscal action updated successfully:", fiscalAction);
      
      return fiscalAction;
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
      // Get current shipment to find fiscal action ID
      const shipment = shipments.find(s => s.id === shipmentId);
      if (!shipment || !shipment.fiscalAction) {
        console.error("Cannot update fiscal action details: action not found");
        return;
      }
      
      const timestamp = new Date().toISOString();
      
      const updateData = {
        action_number: actionNumber,
        release_date: releaseDate,
        notes: notes,
        updated_at: timestamp
      };
      
      // Update the fiscal action
      const { data, error } = await supabase
        .from('fiscal_actions')
        .update(updateData)
        .eq('id', shipment.fiscalAction.id)
        .select('*')
        .single();
        
      if (error) {
        console.error("Error updating fiscal action details:", error);
        throw error;
      }
      
      // Map the database response
      const updatedFiscalAction: FiscalAction = {
        ...shipment.fiscalAction,
        actionNumber: data.action_number,
        releaseDate: data.release_date,
        notes: data.notes,
        updatedAt: data.updated_at
      };
      
      // Update local state
      setShipments(prev => prev.map(s => {
        if (s.id === shipmentId) {
          return { ...s, fiscalAction: updatedFiscalAction };
        }
        return s;
      }));
      
      return updatedFiscalAction;
    } catch (error) {
      console.error("Error in updateFiscalActionDetails:", error);
      toast.error("Erro ao atualizar detalhes da ação fiscal");
      throw error;
    }
  };
  
  // Clear fiscal action
  const clearFiscalAction = async (shipmentId: string) => {
    return await updateFiscalAction(shipmentId, null);
  };

  return {
    updateFiscalAction,
    clearFiscalAction,
    updateFiscalActionDetails
  };
};
