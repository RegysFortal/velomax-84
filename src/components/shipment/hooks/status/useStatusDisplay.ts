
import { ShipmentStatus } from "@/types/shipment";

/**
 * Hook that provides functions for displaying shipment status information
 * @deprecated Use useShipmentStatusLabel instead for more focused functionality
 */
export function useStatusDisplay() {
  /**
   * Returns a display-friendly name for a shipment status
   * @deprecated Use useShipmentStatusLabel's getStatusLabel instead
   */
  const getStatusLabel = (status: ShipmentStatus): string => {
    // Import and use the new hook for this functionality
    const { getShipmentStatusLabel } = useShipmentStatusLabel();
    return getShipmentStatusLabel(status);
  };

  return {
    getStatusLabel
  };
}

// Re-export the new hooks for easier imports
export * from './useShipmentStatusLabel';

