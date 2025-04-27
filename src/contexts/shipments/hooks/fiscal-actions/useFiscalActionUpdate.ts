
import { Shipment, FiscalAction } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useFiscalActionUpdate = (
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
      
      if (shipment.fiscalAction) {
        const supabaseFiscalAction: any = {
          updated_at: now
        };
        
        if (fiscalActionData.actionNumber !== undefined) supabaseFiscalAction.action_number = fiscalActionData.actionNumber;
        if (fiscalActionData.reason !== undefined) supabaseFiscalAction.reason = fiscalActionData.reason;
        if (fiscalActionData.amountToPay !== undefined) supabaseFiscalAction.amount_to_pay = fiscalActionData.amountToPay;
        if (fiscalActionData.paymentDate !== undefined) supabaseFiscalAction.payment_date = fiscalActionData.paymentDate;
        if (fiscalActionData.releaseDate !== undefined) supabaseFiscalAction.release_date = fiscalActionData.releaseDate;
        if (fiscalActionData.notes !== undefined) supabaseFiscalAction.notes = fiscalActionData.notes;
        
        const { error } = await supabase
          .from('fiscal_actions')
          .update(supabaseFiscalAction)
          .eq('id', shipment.fiscalAction.id);
          
        if (error) {
          throw error;
        }
        
        fiscalAction = {
          ...shipment.fiscalAction,
          ...fiscalActionData,
          updatedAt: now
        };
      } else {
        const { createFiscalAction } = await import('./useFiscalActionCreate');
        fiscalAction = await createFiscalAction(setShipments)(shipmentId, fiscalActionData);
      }
      
      // Update state with the new or updated fiscal action
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

  return { updateFiscalAction };
};
