
import { Shipment } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useShipmentUpdate = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const updateShipment = async (id: string, shipmentData: Partial<Shipment>) => {
    try {
      console.log("Updating shipment:", id, shipmentData);
      
      const supabaseShipment: any = {
        updated_at: new Date().toISOString()
      };
      
      if (shipmentData.companyId !== undefined) supabaseShipment.company_id = shipmentData.companyId;
      if (shipmentData.companyName !== undefined) supabaseShipment.company_name = shipmentData.companyName;
      if (shipmentData.transportMode !== undefined) supabaseShipment.transport_mode = shipmentData.transportMode;
      if (shipmentData.carrierName !== undefined) supabaseShipment.carrier_name = shipmentData.carrierName;
      if (shipmentData.trackingNumber !== undefined) supabaseShipment.tracking_number = shipmentData.trackingNumber;
      if (shipmentData.packages !== undefined) supabaseShipment.packages = shipmentData.packages;
      if (shipmentData.weight !== undefined) supabaseShipment.weight = shipmentData.weight;
      if (shipmentData.arrivalFlight !== undefined) supabaseShipment.arrival_flight = shipmentData.arrivalFlight;
      if (shipmentData.arrivalDate !== undefined) supabaseShipment.arrival_date = shipmentData.arrivalDate;
      if (shipmentData.observations !== undefined) supabaseShipment.observations = shipmentData.observations;
      if (shipmentData.status !== undefined) supabaseShipment.status = shipmentData.status;
      if (shipmentData.isRetained !== undefined) supabaseShipment.is_retained = shipmentData.isRetained;
      if (shipmentData.deliveryDate !== undefined) supabaseShipment.delivery_date = shipmentData.deliveryDate;
      if (shipmentData.deliveryTime !== undefined) supabaseShipment.delivery_time = shipmentData.deliveryTime;
      if (shipmentData.receiverName !== undefined) supabaseShipment.receiver_name = shipmentData.receiverName;
      if (shipmentData.receiverId !== undefined) supabaseShipment.receiver_id = shipmentData.receiverId;
      
      const { error } = await supabase
        .from('shipments')
        .update(supabaseShipment)
        .eq('id', id);
        
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      const updatedShipments = shipments.map(s => {
        if (s.id === id) {
          return { ...s, ...shipmentData, updatedAt: supabaseShipment.updated_at };
        }
        return s;
      });
      
      setShipments(updatedShipments);
      return updatedShipments.find(s => s.id === id);
    } catch (error) {
      console.error("Error updating shipment:", error);
      toast.error("Erro ao atualizar embarque");
      throw error;
    }
  };

  return { updateShipment };
};
