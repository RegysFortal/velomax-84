
import { Shipment } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useDeleteDocument = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const deleteDocument = async (shipmentId: string, documentId: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('shipment_documents')
        .delete()
        .eq('id', documentId);
        
      if (error) {
        throw error;
      }
      
      // Update state
      const now = new Date().toISOString();
      const updatedShipments = shipments.map(s => {
        if (s.id === shipmentId) {
          return { 
            ...s, 
            documents: (s.documents || []).filter(d => d.id !== documentId),
            updatedAt: now
          };
        }
        return s;
      });
      
      setShipments(updatedShipments);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Erro ao excluir documento");
      throw error;
    }
  };

  return { deleteDocument };
};
