
import { Shipment } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useFiscalActionClear = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const clearFiscalAction = async (shipmentId: string): Promise<void> => {
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
      // Don't return anything (void return type)
    } catch (error) {
      console.error("Error clearing fiscal action:", error);
      toast.error("Erro ao remover ação fiscal");
      throw error;
    }
  };

  return { clearFiscalAction };
};
