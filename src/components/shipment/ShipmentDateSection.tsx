
import React from 'react';
import { DatePicker } from "@/components/ui/date-picker";
import { toISODateString, fromISODateString } from "@/utils/dateUtils";

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
        date={shipmentDate ? fromISODateString(shipmentDate) : undefined}
        onSelect={(date) => {
          if (date) {
            // Use UTC with noon time to avoid timezone issues
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            
            const fixedDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
            const formattedDate = toISODateString(fixedDate);

            console.log('ShipmentDateSection - Data selecionada:', date.toDateString());
            console.log('ShipmentDateSection - Data final (UTC 12h):', fixedDate.toISOString());
            console.log('ShipmentDateSection - Convertida para ISO:', formattedDate);
            
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
