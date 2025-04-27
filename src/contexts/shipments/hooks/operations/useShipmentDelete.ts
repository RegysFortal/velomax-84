
import { Shipment } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useShipmentDelete = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const deleteShipment = async (id: string) => {
    try {
      console.log("Starting delete process for shipment:", id);
      
      const { error: documentsError } = await supabase
        .from('shipment_documents')
        .delete()
        .eq('shipment_id', id);
        
      if (documentsError) {
        console.error("Error deleting related documents:", documentsError);
        throw documentsError;
      }
      
      const { error: fiscalError } = await supabase
        .from('fiscal_actions')
        .delete()
        .eq('shipment_id', id);
        
      if (fiscalError) {
        console.error("Error deleting related fiscal actions:", fiscalError);
        throw fiscalError;
      }
      
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting shipment from database:", error);
        throw error;
      }
      
      setShipments(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting shipment:", error);
      toast.error("Erro ao excluir embarque");
      throw error;
    }
  };

  return { deleteShipment };
};
