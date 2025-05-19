import { Shipment, ShipmentStatus } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useShipmentStatus = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const updateStatus = async (shipmentId: string, status: ShipmentStatus): Promise<Shipment | undefined> => {
    try {
      console.log(`Updating shipment status to ${status} for ID: ${shipmentId}`);
      
      // Here we simply update the status but keep the isRetained flag separate
      // This allows editing even when the shipment is retained
      const { error } = await supabase
        .from('shipments')
        .update({ 
          status,
          is_retained: status === 'retained',
          updated_at: new Date().toISOString()
        })
        .eq('id', shipmentId);
        
      if (error) {
        console.error("Supabase status update error:", error);
        throw error;
      }
      
      const updatedShipments = shipments.map(s => {
        if (s.id === shipmentId) {
          return { 
            ...s, 
            status,
            isRetained: status === 'retained',
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      });
      
      setShipments(updatedShipments);
      return updatedShipments.find(s => s.id === shipmentId);
    } catch (error) {
      console.error("Error updating shipment status:", error);
      toast.error("Erro ao atualizar status do embarque");
      throw error;
    }
  };

  return { updateStatus };
};
