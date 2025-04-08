
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShipmentStatus } from "@/types/shipment";

interface StatusSectionProps {
  status: ShipmentStatus;
  setStatus: (status: ShipmentStatus) => void;
}

export function StatusSection({
  status,
  setStatus
}: StatusSectionProps) {
  return (
    <div className="space-y-2 md:col-span-2 pt-4 border-t border-gray-200">
      <label htmlFor="status" className="text-sm font-medium">Status</label>
      <Select value={status} onValueChange={(val: ShipmentStatus) => setStatus(val)}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="in_transit">Em Trânsito</SelectItem>
          <SelectItem value="retained">Retida</SelectItem>
          <SelectItem value="delivered">Retirada</SelectItem>
          <SelectItem value="delivered_final">Entregue</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
