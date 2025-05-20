
import React from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "./StatusBadge";

interface StatusSectionProps {
  status: ShipmentStatus;
  setStatus: (status: ShipmentStatus) => void;
  shipmentId: string;
  disabled?: boolean;
}

export function StatusSection({
  status,
  setStatus,
  shipmentId,
  disabled
}: StatusSectionProps) {
  return (
    <div className="space-y-4 md:col-span-2">
      <div className="flex items-center justify-between">
        <label htmlFor="status" className="text-sm font-medium">Status</label>
        <StatusBadge status={status} />
      </div>
      
      <Select 
        value={status} 
        onValueChange={(value) => setStatus(value as ShipmentStatus)}
        disabled={disabled}
      >
        <SelectTrigger id="status">
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="in_transit">Em Trânsito</SelectItem>
          <SelectItem value="at_carrier">Na Transportadora</SelectItem>
          <SelectItem value="retained">Retido</SelectItem>
          <SelectItem value="delivered">Retirado</SelectItem>
          <SelectItem value="partially_delivered">Entregue Parcial</SelectItem>
          <SelectItem value="delivered_final">Entregue</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
