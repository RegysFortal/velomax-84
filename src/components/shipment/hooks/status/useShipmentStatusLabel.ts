
import { ShipmentStatus } from "@/types/shipment";

/**
 * Hook that provides functions for getting human-readable status labels
 */
export function useShipmentStatusLabel() {
  /**
   * Returns a display-friendly name for a shipment status
   */
  const getShipmentStatusLabel = (status: ShipmentStatus): string => {
    switch (status) {
      case 'in_transit':
        return "Em Trânsito";
      case 'retained':
        return "Retida";
      case 'delivered':
        return "Retirada";
      case 'partially_delivered':
        return "Entregue Parcial";
      case 'delivered_final':
        return "Entregue";
      case 'at_carrier':
        return "Na Transportadora";
      default:
        return status;
    }
  };

  return {
    getShipmentStatusLabel
  };
}
