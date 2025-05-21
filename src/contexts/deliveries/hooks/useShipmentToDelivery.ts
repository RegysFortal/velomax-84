
import { toast } from 'sonner';
import { DeliveryType, CargoType, DeliveryFormData } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export function useShipmentToDelivery(
  calculateFreight: (
    clientId: string,
    weight: number,
    deliveryType: DeliveryType,
    cargoType: CargoType,
    cargoValue?: number,
    distance?: number,
    cityId?: string
  ) => number,
  addDelivery: (delivery: DeliveryFormData) => Promise<any>
) {
  const createDeliveriesFromShipment = async (shipment: any, deliveryDetails: any) => {
    try {
      if (!shipment || !deliveryDetails || !deliveryDetails.selectedDocumentIds || deliveryDetails.selectedDocumentIds.length === 0) {
        return;
      }
      
      const selectedDocs = shipment.documents.filter((doc: any) => 
        deliveryDetails.selectedDocumentIds.includes(doc.id)
      );
      
      if (selectedDocs.length === 0) {
        return;
      }
      
      for (const doc of selectedDocs) {
        const deliveryWeight = doc.weight || shipment.weight || 0;
        const baseFreight = calculateFreight(
          shipment.companyId,
          deliveryWeight,
          'standard' as DeliveryType,
          'standard' as CargoType
        );
        
        const newDelivery: DeliveryFormData = {
          clientId: shipment.companyId,
          minuteNumber: doc.minuteNumber || "",
          packages: doc.packages || 1,
          weight: deliveryWeight,
          cargoType: 'standard' as CargoType,
          deliveryType: 'standard' as DeliveryType,
          receiver: deliveryDetails.receiverName,
          deliveryDate: deliveryDetails.deliveryDate,
          deliveryTime: deliveryDetails.deliveryTime,
          totalFreight: baseFreight,
        };
        
        await addDelivery(newDelivery);
      }
      
      if (shipment.id && deliveryDetails.selectedDocumentIds.length > 0) {
        try {
          const { error } = await supabase
            .from('shipment_documents')
            .update({ is_delivered: true })
            .in('id', deliveryDetails.selectedDocumentIds);
            
          if (error) console.error("Error updating shipment documents:", error);
        } catch (err) {
          console.error("Error updating shipment documents:", err);
        }
      }
      
      toast.success("Entregas criadas com sucesso");
      window.dispatchEvent(new CustomEvent('shipments-updated'));
    } catch (error) {
      console.error("Error creating deliveries from shipment:", error);
      toast.error("Erro ao criar entregas a partir do embarque");
    }
  };

  return { createDeliveriesFromShipment };
}
