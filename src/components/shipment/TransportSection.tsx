
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TransportSectionProps {
  transportMode: "air" | "road";
  setTransportMode: (mode: "air" | "road") => void;
  carrierName: string;
  setCarrierName: (name: string) => void;
  trackingNumber: string;
  setTrackingNumber: (number: string) => void;
}

export function TransportSection({
  transportMode,
  setTransportMode,
  carrierName,
  setCarrierName,
  trackingNumber,
  setTrackingNumber
}: TransportSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="transportMode" className="text-sm font-medium">Modal de Transporte</label>
        <Select 
          value={transportMode} 
          onValueChange={(val: "air" | "road") => {
            setTransportMode(val);
            setCarrierName(""); // Reset carrier when mode changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o modal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="air">Aéreo</SelectItem>
            <SelectItem value="road">Rodoviário</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="carrierName" className="text-sm font-medium">Transportadora</label>
        {transportMode === "air" ? (
          <Select 
            value={carrierName} 
            onValueChange={(val) => setCarrierName(val)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a companhia aérea" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GOL">GOL</SelectItem>
              <SelectItem value="LATAM">LATAM</SelectItem>
              <SelectItem value="AZUL">AZUL</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input 
            id="carrierName"
            value={carrierName}
            onChange={(e) => setCarrierName(e.target.value)}
            placeholder="Nome da transportadora"
            required
          />
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="trackingNumber" className="text-sm font-medium">Número do Conhecimento</label>
        <Input 
          id="trackingNumber"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Ex: 123456789"
          required
        />
      </div>
    </>
  );
}
