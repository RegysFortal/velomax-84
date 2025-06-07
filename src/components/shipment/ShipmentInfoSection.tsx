
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { toISODateString, fromISODateString } from "@/utils/dateUtils";

interface ShipmentInfoSectionProps {
  transportMode: "air" | "road";
  arrivalFlight: string;
  setArrivalFlight: (flight: string) => void;
  arrivalDate: string;
  setArrivalDate: (date: string) => void;
  observations: string;
  setObservations: (observations: string) => void;
  disabled?: boolean;
}

export function ShipmentInfoSection({
  transportMode,
  arrivalFlight,
  setArrivalFlight,
  arrivalDate,
  setArrivalDate,
  observations,
  setObservations,
  disabled
}: ShipmentInfoSectionProps) {
  return (
    <div className="space-y-4">
      {transportMode === "air" && (
        <div>
          <label htmlFor="arrivalFlight" className="text-sm font-medium">Voo de Chegada</label>
          <Input 
            id="arrivalFlight" 
            value={arrivalFlight} 
            onChange={(e) => setArrivalFlight(e.target.value)}
            disabled={disabled}
          />
        </div>
      )}
      
      <div>
        <label htmlFor="arrivalDate" className="text-sm font-medium">Data de Chegada</label>
        <DatePicker
          date={arrivalDate ? fromISODateString(arrivalDate) : undefined}
          onSelect={(date) => {
            if (date) {
              // Create UTC date at noon to avoid timezone issues
              const year = date.getFullYear();
              const month = date.getMonth();
              const day = date.getDate();
              
              const fixedDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
              const formattedDate = toISODateString(fixedDate);
              
              console.log("ShipmentInfoSection - Setting arrival date to:", formattedDate);
              console.log("ShipmentInfoSection - UTC date:", fixedDate.toISOString());
              setArrivalDate(formattedDate);
            } else {
              setArrivalDate('');
            }
          }}
          placeholder="Selecione a data de chegada"
          disabled={disabled}
        />
      </div>
      
      <div>
        <label htmlFor="observations" className="text-sm font-medium">Observações</label>
        <Textarea 
          id="observations" 
          value={observations} 
          onChange={(e) => setObservations(e.target.value)}
          rows={3}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
