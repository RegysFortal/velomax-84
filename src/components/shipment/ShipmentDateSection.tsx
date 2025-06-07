
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
            // Use Brazilian timezone consistently
            const dataLocal = new Date(date.toLocaleString("pt-BR", { timeZone: "America/Fortaleza" }));
            const formattedDate = toISODateString(dataLocal);
            
            console.log('ShipmentDateSection - Data selecionada pelo usuário:', date.toDateString());
            console.log('ShipmentDateSection - Data convertida para timezone brasileiro:', dataLocal.toDateString());
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
