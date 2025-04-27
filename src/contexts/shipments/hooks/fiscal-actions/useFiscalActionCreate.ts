
import { FiscalAction } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useFiscalActionCreate = (
  setShipments: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const createFiscalAction = async (shipmentId: string, fiscalActionData: Partial<FiscalAction>) => {
    try {
      const now = new Date().toISOString();
      
      // Prepare data for Supabase insert
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
      const fiscalAction: FiscalAction = {
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

      return fiscalAction;
    } catch (error) {
      console.error("Error creating fiscal action:", error);
      toast.error("Erro ao criar ação fiscal");
      throw error;
    }
  };

  return { createFiscalAction };
};
