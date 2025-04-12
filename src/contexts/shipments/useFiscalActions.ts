
import { Shipment, FiscalAction } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useFiscalActions = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const updateFiscalAction = async (shipmentId: string, fiscalActionData: Partial<FiscalAction>) => {
    try {
      const now = new Date().toISOString();
      const shipment = shipments.find(s => s.id === shipmentId);
      
      if (!shipment) {
        throw new Error("Shipment not found");
      }
      
      let fiscalAction: FiscalAction;
      
      // Check if the shipment already has a fiscal action
      if (shipment.fiscalAction) {
        // Update existing fiscal action
        const supabaseFiscalAction: any = {
          updated_at: now
        };
        
        // Map fields from our model to Supabase column names
        if (fiscalActionData.actionNumber !== undefined) supabaseFiscalAction.action_number = fiscalActionData.actionNumber;
        if (fiscalActionData.reason !== undefined) supabaseFiscalAction.reason = fiscalActionData.reason;
        if (fiscalActionData.amountToPay !== undefined) supabaseFiscalAction.amount_to_pay = fiscalActionData.amountToPay;
        if (fiscalActionData.paymentDate !== undefined) supabaseFiscalAction.payment_date = fiscalActionData.paymentDate;
        if (fiscalActionData.releaseDate !== undefined) supabaseFiscalAction.release_date = fiscalActionData.releaseDate;
        if (fiscalActionData.notes !== undefined) supabaseFiscalAction.notes = fiscalActionData.notes;
        
        // Update fiscal action in Supabase
        const { error } = await supabase
          .from('fiscal_actions')
          .update(supabaseFiscalAction)
          .eq('id', shipment.fiscalAction.id);
          
        if (error) {
          throw error;
        }
        
        // Update state with the updated fiscal action
        fiscalAction = {
          ...shipment.fiscalAction,
          ...fiscalActionData,
          updatedAt: now
        };
      } else {
        // Create new fiscal action
        const supabaseFiscalAction = {
          shipment_id: shipmentId,
          action_number: fiscalActionData.actionNumber,
          reason: fiscalActionData.reason || 'Não especificado',
          amount_to_pay: fiscalActionData.amountToPay || 0,
          payment_date: fiscalActionData.paymentDate,
          release_date: fiscalActionData.releaseDate,
          notes: fiscalActionData.notes,
          created_at: now,
          updated_at: now
        };
        
        // Insert fiscal action into Supabase
        const { data: newFiscalAction, error } = await supabase
          .from('fiscal_actions')
          .insert(supabaseFiscalAction)
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        // Map the Supabase data to our FiscalAction type
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
      
      // Update the state with the new or updated fiscal action
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
      return fiscalAction;
    } catch (error) {
      console.error("Error updating fiscal action:", error);
      toast.error("Erro ao atualizar ação fiscal");
      throw error;
    }
  };
  
  const clearFiscalAction = async (shipmentId: string) => {
    try {
      const shipment = shipments.find(s => s.id === shipmentId);
      
      if (!shipment || !shipment.fiscalAction) {
        return;
      }
      
      // Delete fiscal action from Supabase
      const { error } = await supabase
        .from('fiscal_actions')
        .delete()
        .eq('id', shipment.fiscalAction.id);
        
      if (error) {
        throw error;
      }
      
      // Update state to remove the fiscal action
      const now = new Date().toISOString();
      const updatedShipments = shipments.map(s => {
        if (s.id === shipmentId) {
          return { 
            ...s, 
            fiscalAction: undefined,
            updatedAt: now
          };
        }
        return s;
      });
      
      setShipments(updatedShipments);
    } catch (error) {
      console.error("Error clearing fiscal action:", error);
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
        throw new Error("Shipment or fiscal action not found");
      }
      
      // Update fiscal action details
      return await updateFiscalAction(shipmentId, {
        actionNumber,
        releaseDate,
        notes
      });
    } catch (error) {
      console.error("Error updating fiscal action details:", error);
      toast.error("Erro ao atualizar detalhes da ação fiscal");
      throw error;
    }
  };
  
  return {
    updateFiscalAction,
    clearFiscalAction,
    updateFiscalActionDetails
  };
};
