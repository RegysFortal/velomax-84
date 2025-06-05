
import React from 'react';
import { DatePicker } from "@/components/ui/date-picker";
import { toISODateString } from "@/utils/dateUtils";

interface ShipmentDateSectionProps {
  shipmentDate: string;
  setShipmentDate: (date: string) => void;
  disabled?: boolean;
}

export function ShipmentDateSection({
  shipmentDate,
  setShipmentDate,
  disabled
}: ShipmentDateSectionProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="shipmentDate" className="text-sm font-medium">Data do Embarque</label>
      <DatePicker
        date={shipmentDate ? new Date(`${shipmentDate}T12:00:00`) : undefined}
        onSelect={(date) => {
          if (date) {
            const formattedDate = toISODateString(date);
            setShipmentDate(formattedDate);
          } else {
            setShipmentDate('');
          }
        }}
        placeholder="Selecione a data do embarque"
        disabled={disabled}
      />
    </div>
  );
}
