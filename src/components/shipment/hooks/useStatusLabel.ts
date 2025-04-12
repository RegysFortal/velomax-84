
import { ShipmentStatus } from "@/types/shipment";

/**
 * Hook for getting status label display text
 */
export function useStatusLabel() {
  /**
   * Converts a shipment status value to a human-readable label
   */
  const getStatusLabel = (statusValue: ShipmentStatus): string => {
    switch (statusValue) {
      case "in_transit": return "Em Trânsito";
      case "retained": return "Retida";
      case "delivered": return "Retirada";
      case "delivered_final": return "Entregue";
      default: return statusValue;
    }
  };

  return { getStatusLabel };
}
