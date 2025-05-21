
import { ShipmentStatus } from "@/types/shipment";
import { useShipmentStatusLabel } from './useShipmentStatusLabel';

/**
 * Hook that provides functions for displaying shipment status information
 * @deprecated Use useShipmentStatusLabel instead for more focused functionality
 */
export function useStatusDisplay() {
  // Get the status label functionality from the new hook
  const { getShipmentStatusLabel } = useShipmentStatusLabel();
  
  /**
   * Returns a display-friendly name for a shipment status
   * @deprecated Use useShipmentStatusLabel's getStatusLabel instead
   */
  const getStatusLabel = (status: ShipmentStatus): string => {
    return getShipmentStatusLabel(status);
  };

  return {
    getStatusLabel
  };
}

// Re-export the new hooks for easier imports
export * from './useShipmentStatusLabel';
