
import React from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { StatusBadge } from "../StatusBadge";
import { Separator } from "@/components/ui/separator";

interface StatusHeaderProps {
  status: ShipmentStatus;
}

export function StatusHeader({ status }: StatusHeaderProps) {
  return (
    <>
      <Separator />
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Status</h3>
        <StatusBadge status={status} />
      </div>
    </>
  );
}
