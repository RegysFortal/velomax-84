
import { ShipmentStatus } from "@/types/shipment";

/**
 * Hook that provides functions for displaying shipment status information
 */
export function useStatusDisplay() {
  /**
   * Returns a display-friendly name for a shipment status
   */
  const getStatusLabel = (status: ShipmentStatus): string => {
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
      default:
        return status;
    }
  };

  return {
    getStatusLabel
  };
}
