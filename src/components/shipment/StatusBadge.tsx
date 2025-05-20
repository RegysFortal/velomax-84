
import React from 'react';
import { ShipmentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: ShipmentStatus;
  showLabel?: boolean;
  className?: string;
}

export function StatusBadge({ status, showLabel = true, className }: StatusBadgeProps) {
  const getStatusLabel = () => {
    switch (status) {
      case "in_transit":
        return "Em Trânsito";
      case "at_carrier":
        return "Na Transportadora";
      case "retained":
        return "Retida";
      case "delivered":
        return "Retirada";
      case "partially_delivered":
        return "Entregue Parcial";
      case "delivered_final":
        return "Entregue";
      default:
        return "Desconhecido";
    }
  };

  const getBadgeClasses = () => {
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

  return (
    <Badge className={`${getBadgeClasses()} ${className || ''}`}>
      {showLabel ? getStatusLabel() : null}
    </Badge>
  );
}
