
import React from 'react';
import { ShipmentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: ShipmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "in_transit":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Em Trânsito</Badge>;
    case "at_carrier":
      return <Badge className="bg-purple-500 hover:bg-purple-600">Na Transportadora</Badge>;
    case "retained":
      return <Badge className="bg-red-500 hover:bg-red-600">Retida</Badge>;
    case "delivered":
      return <Badge className="bg-amber-500 hover:bg-amber-600">Retirada</Badge>;
    case "partially_delivered":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Entregue Parcial</Badge>;
    case "delivered_final":
      return <Badge className="bg-green-500 hover:bg-green-600">Entregue</Badge>;
    default:
      return <Badge>Desconhecido</Badge>;
  }
}
