
import { ShipmentStatus } from "@/types/shipment";

export function useStatusManagement() {
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
      default:
        return status;
    }
  };

  return { getStatusLabel };
}
