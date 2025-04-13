
import React from 'react';
import { DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ShipmentStatus } from "@/types/shipment";
import { CheckCircle2, AlertTriangle, Truck, RotateCcw, PackageX } from "lucide-react";

interface StatusMenuItemsProps {
  currentStatus: ShipmentStatus;
  onStatusChange: (status: ShipmentStatus) => void;
}

export function StatusMenuItems({ currentStatus, onStatusChange }: StatusMenuItemsProps) {
  return (
    <DropdownMenuGroup>
      {/* Em Trânsito */}
      {(currentStatus === "retained" || currentStatus === "partially_delivered") && (
        <DropdownMenuItem onClick={() => onStatusChange("in_transit")}>
          <Truck className="w-4 h-4 mr-2" />
          <span>Em Trânsito</span>
        </DropdownMenuItem>
      )}
      
      {/* Retida */}
      {currentStatus !== "retained" && (
        <DropdownMenuItem onClick={() => onStatusChange("retained")}>
          <AlertTriangle className="w-4 h-4 mr-2" />
          <span>Retida</span>
        </DropdownMenuItem>
      )}
      
      {/* Retirada (Documento não entregue ao destinatário) */}
      {(currentStatus === "in_transit" || currentStatus === "retained" || currentStatus === "partially_delivered") && (
        <DropdownMenuItem onClick={() => onStatusChange("delivered")}>
          <PackageX className="w-4 h-4 mr-2" />
          <span>Retirada</span>
        </DropdownMenuItem>
      )}
      
      {/* Entregue (Documento entregue ao destinatário) */}
      {(currentStatus === "in_transit" || currentStatus === "delivered" || currentStatus === "retained" || currentStatus === "partially_delivered") && (
        <DropdownMenuItem onClick={() => onStatusChange("delivered_final")}>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          <span>Entregue</span>
        </DropdownMenuItem>
      )}
      
      {/* Additional options for specific states */}
      {currentStatus === "delivered_final" && (
        <DropdownMenuItem onClick={() => onStatusChange("in_transit")}>
          <RotateCcw className="w-4 h-4 mr-2" />
          <span>Desfazer Entrega</span>
        </DropdownMenuItem>
      )}
    </DropdownMenuGroup>
  );
}
