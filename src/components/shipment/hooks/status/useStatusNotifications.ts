
import { toast } from "sonner";
import { ShipmentStatus } from "@/types/shipment";
import { useShipmentStatusLabel } from './useShipmentStatusLabel';

export function useStatusNotifications() {
  const { getShipmentStatusLabel } = useShipmentStatusLabel();
  
  const showStatusChangeNotification = (status: ShipmentStatus) => {
    if (status === "delivered_final") {
      toast.success("Status alterado para Entregue e entregas criadas");
    } else if (status === "partially_delivered") {
      toast.success("Status alterado para Entrega Parcial");
    } else if (status === "retained") {
      toast.success("Status alterado para Retida e informações de retenção atualizadas");
    } else {
      toast.success(`Status alterado para ${getShipmentStatusLabel(status)}`);
    }
  };
  
  const showErrorNotification = (error: any) => {
    toast.error("Erro ao alterar status");
    console.error(error);
  };
  
  return {
    getStatusLabel: getShipmentStatusLabel,
    showStatusChangeNotification,
    showErrorNotification
  };
}
