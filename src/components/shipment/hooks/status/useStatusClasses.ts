
import { ShipmentStatus } from "@/types/shipment";

/**
 * Hook that provides CSS classes for styling shipment statuses
 */
export function useStatusClasses() {
  /**
   * Returns CSS classes for styling a badge based on shipment status
   */
  const getStatusBadgeClasses = (status: ShipmentStatus): string => {
    switch (status) {
      case "in_transit":
        return "bg-blue-500 hover:bg-blue-600";
      case "at_carrier":
        return "bg-purple-500 hover:bg-purple-600";
      case "retained":
        return "bg-red-500 hover:bg-red-600";
      case "delivered":
        return "bg-amber-500 hover:bg-amber-600";
      case "partially_delivered":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "delivered_final":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "";
    }
  };

  /**
   * Returns text color class based on shipment status
   */
  const getStatusTextColor = (status: ShipmentStatus): string => {
    switch (status) {
      case "retained":
        return "text-red-600";
      case "delivered_final":
        return "text-green-600";
      case "partially_delivered":
        return "text-yellow-600";
      case "in_transit":
        return "text-blue-600";
      case "at_carrier":
        return "text-purple-600";
      case "delivered":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  return {
    getStatusBadgeClasses,
    getStatusTextColor
  };
}
