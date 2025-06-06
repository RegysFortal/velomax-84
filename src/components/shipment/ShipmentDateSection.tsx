
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
            // Create safe date at noon to avoid timezone issues
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const safeDate = new Date(year, month, day, 12, 0, 0); // hora 12h
            
            const formattedDate = toISODateString(safeDate);
            console.log('ShipmentDateSection - Data selecionada:', safeDate, 'Convertida para ISO:', formattedDate);
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
