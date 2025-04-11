
import React from 'react';
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../StatusBadge";
import { ShipmentStatus } from "@/types/shipment";
import { Separator } from "@/components/ui/separator";

interface StatusActionsProps {
  status: ShipmentStatus;
  onStatusChange: (status: ShipmentStatus) => void;
}

export function StatusActions({ status, onStatusChange }: StatusActionsProps) {
  return (
    <div className="md:col-span-2">
      <Separator />
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Status</h3>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center space-x-4 mt-2 flex-wrap gap-2">
        {status !== "in_transit" && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onStatusChange("in_transit")}
          >
            Marcar como Em Trânsito
          </Button>
        )}
        {status !== "retained" && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onStatusChange("retained")}
          >
            Marcar como Retido
          </Button>
        )}
        {status !== "delivered" && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onStatusChange("delivered")}
          >
            Marcar como Retirado
          </Button>
        )}
        {status !== "delivered_final" && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onStatusChange("delivered_final")}
          >
            Marcar como Entregue
          </Button>
        )}
      </div>
    </div>
  );
}
