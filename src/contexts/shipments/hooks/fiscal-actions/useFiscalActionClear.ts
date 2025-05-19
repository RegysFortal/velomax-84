
import { Shipment } from "@/types/shipment";
import { toast } from "sonner";
import { fiscalActionDeleteService } from "./services/fiscalActionDeleteService";

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
      
      // Delete fiscal action using the service
      await fiscalActionDeleteService.deleteFiscalAction(shipment.fiscalAction.id);
      
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
