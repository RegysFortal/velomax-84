
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ShipmentInfoSectionProps {
  transportMode: "air" | "road";
  arrivalFlight: string;
  setArrivalFlight: (flight: string) => void;
  arrivalDate: string;
  setArrivalDate: (date: string) => void;
  observations: string;
  setObservations: (observations: string) => void;
}

export function ShipmentInfoSection({
  transportMode,
  arrivalFlight,
  setArrivalFlight,
  arrivalDate,
  setArrivalDate,
  observations,
  setObservations
}: ShipmentInfoSectionProps) {
  return (
    <>
      {transportMode === "air" && (
        <div className="space-y-2">
          <label htmlFor="arrivalFlight" className="text-sm font-medium">Voo de Chegada</label>
          <Input 
            id="arrivalFlight"
            value={arrivalFlight}
            onChange={(e) => setArrivalFlight(e.target.value)}
            placeholder="Ex: LA3456"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="arrivalDate" className="text-sm font-medium">Data de Chegada</label>
        <Input 
          id="arrivalDate"
          type="date"
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <label htmlFor="observations" className="text-sm font-medium">Observações</label>
        <Textarea 
          id="observations"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Observações sobre a carga (perecível, biológico, entrega dedicada, etc.)"
        />
      </div>
    </>
  );
}
