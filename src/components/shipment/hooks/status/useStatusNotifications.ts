
import { toast } from "sonner";
import { ShipmentStatus } from "@/types/shipment";

export function useStatusNotifications() {
  const getStatusLabel = (status: ShipmentStatus): string => {
    switch (status) {
      case "in_transit":
        return "Em Trânsito";
      case "retained":
        return "Retida";
      case "delivered":
        return "Retirada";
      case "partially_delivered":
        return "Entregue Parcial";
      case "delivered_final":
        return "Entregue";
      case "at_carrier":
        return "Na Transportadora";
      default:
        return status;
    }
  };
  
  const showStatusChangeNotification = (status: ShipmentStatus) => {
    if (status === "delivered_final") {
      toast.success("Status alterado para Entregue e entregas criadas");
    } else if (status === "partially_delivered") {
      toast.success("Status alterado para Entrega Parcial");
    } else if (status === "retained") {
      toast.success("Status alterado para Retida e informações de retenção atualizadas");
    } else {
      toast.success(`Status alterado para ${getStatusLabel(status)}`);
    }
  };
  
  const showErrorNotification = (error: any) => {
    toast.error("Erro ao alterar status");
    console.error(error);
  };
  
  return {
    getStatusLabel,
    showStatusChangeNotification,
    showErrorNotification
  };
}
