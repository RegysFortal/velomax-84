
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
  disabled?: boolean; // Added the disabled prop
}

export function TransportSection({
  transportMode,
  setTransportMode,
  carrierName,
  setCarrierName,
  trackingNumber,
  setTrackingNumber,
  disabled
}: TransportSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="transportMode" className="text-sm font-medium">Modo de Transporte</label>
        <Select 
          value={transportMode} 
          onValueChange={(value) => setTransportMode(value as "air" | "road")} 
          disabled={disabled}
        >
          <SelectTrigger id="transportMode">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="air">Aéreo</SelectItem>
            <SelectItem value="road">Rodoviário</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="carrierName" className="text-sm font-medium">Transportadora</label>
        <Input 
          id="carrierName" 
          value={carrierName} 
          onChange={(e) => setCarrierName(e.target.value)} 
          disabled={disabled}
        />
      </div>

      <div>
        <label htmlFor="trackingNumber" className="text-sm font-medium">Conhecimento</label>
        <Input 
          id="trackingNumber" 
          value={trackingNumber} 
          onChange={(e) => setTrackingNumber(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
