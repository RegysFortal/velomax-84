
import { Shipment, ShipmentStatus, TransportMode } from "@/types/shipment";
import { ShipmentCreateData } from "../../types";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useShipmentAdd = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const addShipment = async (shipmentData: ShipmentCreateData) => {
    try {
      const transportMode = shipmentData.transportMode as TransportMode;
      const status = shipmentData.status as ShipmentStatus;
      
      const supabaseShipment = {
        company_id: shipmentData.companyId,
        company_name: shipmentData.companyName,
        transport_mode: transportMode,
        carrier_name: shipmentData.carrierName,
        tracking_number: shipmentData.trackingNumber,
        packages: shipmentData.packages,
        weight: shipmentData.weight,
        arrival_flight: shipmentData.arrivalFlight,
        arrival_date: shipmentData.arrivalDate,
        observations: shipmentData.observations,
        status: status,
        is_retained: shipmentData.status === 'retained'
      };
      
      const { data: newShipment, error } = await supabase
        .from('shipments')
        .insert(supabaseShipment)
        .select()
        .single();
        
      if (error) {
        throw error;
      }

      let fiscalAction = undefined;
      if (shipmentData.status === 'retained' && shipmentData.fiscalActionData) {
        const { data: newFiscalAction, error: fiscalError } = await supabase
          .from('fiscal_actions')
          .insert({
            shipment_id: newShipment.id,
            action_number: shipmentData.fiscalActionData.actionNumber,
            reason: shipmentData.fiscalActionData.reason,
            amount_to_pay: shipmentData.fiscalActionData.amountToPay,
            payment_date: shipmentData.fiscalActionData.paymentDate,
            release_date: shipmentData.fiscalActionData.releaseDate,
            notes: shipmentData.fiscalActionData.notes
          })
          .select()
          .single();
          
        if (fiscalError) {
          console.error("Error creating fiscal action:", fiscalError);
        } else {
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
      }
      
      const newShipmentMapped: Shipment = {
        id: newShipment.id,
        companyId: newShipment.company_id,
        companyName: newShipment.company_name,
        transportMode: newShipment.transport_mode as TransportMode,
        carrierName: newShipment.carrier_name,
        trackingNumber: newShipment.tracking_number,
        packages: newShipment.packages,
        weight: newShipment.weight,
        arrivalFlight: newShipment.arrival_flight,
        arrivalDate: newShipment.arrival_date,
        observations: newShipment.observations,
        status: newShipment.status as ShipmentStatus,
        isRetained: newShipment.is_retained,
        documents: [],
        fiscalAction,
        createdAt: newShipment.created_at,
        updatedAt: newShipment.updated_at
      };
      
      setShipments(prev => [newShipmentMapped, ...prev]);
      return newShipmentMapped;
    } catch (error) {
      console.error("Error adding shipment:", error);
      toast.error("Erro ao criar embarque");
      throw error;
    }
  };

  return { addShipment };
};
