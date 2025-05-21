
import React from 'react';
import { ShipmentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useShipmentStatusLabel } from './hooks/status';
import { useStatusClasses } from './hooks/status/useStatusClasses';

interface StatusBadgeProps {
  status: ShipmentStatus;
  showLabel?: boolean;
  className?: string;
}

export function StatusBadge({ status, showLabel = true, className }: StatusBadgeProps) {
  const { getShipmentStatusLabel } = useShipmentStatusLabel();
  const { getStatusBadgeClasses } = useStatusClasses();

  return (
    <Badge className={`${getStatusBadgeClasses(status)} ${className || ''}`}>
      {showLabel ? getShipmentStatusLabel(status) : null}
    </Badge>
  );
}
