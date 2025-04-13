
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

interface ShipmentInfoSectionProps {
  transportMode: "air" | "road";
  arrivalFlight: string;
  setArrivalFlight: (flight: string) => void;
  arrivalDate: string;
  setArrivalDate: (date: string) => void;
  observations: string;
  setObservations: (observations: string) => void;
  disabled?: boolean; // Added the disabled prop
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
          date={arrivalDate ? new Date(arrivalDate) : undefined}
          onSelect={(date) => {
            if (date) {
              // Use ISO string and split to avoid timezone issues
              const formattedDate = date.toISOString().split('T')[0];
              setArrivalDate(formattedDate);
            } else {
              setArrivalDate('');
            }
          }}
          placeholder="Selecione a data de chegada"
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
