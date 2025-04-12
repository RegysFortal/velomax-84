
import { ShipmentStatus } from "@/types/shipment";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  Truck,
  Box,
  PackageCheck
} from "lucide-react";

interface StatusBadgeProps {
  status: ShipmentStatus;
  showLabel?: boolean;
  className?: string;
}

export function StatusBadge({ 
  status, 
  showLabel = true,
  className
}: StatusBadgeProps) {
  const config = {
    in_transit: {
      icon: Truck,
      label: "Em Trânsito",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    retained: {
      icon: AlertTriangle,
      label: "Retida",
      className: "bg-red-100 text-red-800 border-red-200",
    },
    delivered: {
      icon: Box,
      label: "Retirada",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    delivered_final: {
      icon: CheckCircle2,
      label: "Entregue",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    partially_delivered: {
      icon: PackageCheck,
      label: "Entregue Parcial",
      className: "bg-orange-100 text-orange-800 border-orange-200",
    }
  };
  
  // If status is not in the config, default to in_transit
  const statusConfig = config[status] || config.in_transit;
  const { icon: Icon, label, className: badgeClass } = statusConfig;
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold",
        badgeClass,
        className
      )}
    >
      <Icon className="h-3 w-3 mr-1" />
      {showLabel && <span>{label}</span>}
    </span>
  );
}
