
import React, { useState, useEffect } from 'react';
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
  disabled?: boolean;
}

// Define carrier options by type
const AIR_CARRIERS = ["Latam", "Gol", "Azul", "outro"];
const ROAD_CARRIERS = ["Concept", "Jem", "Global", "outro"];

export function TransportSection({
  transportMode,
  setTransportMode,
  carrierName,
  setCarrierName,
  trackingNumber,
  setTrackingNumber,
  disabled
}: TransportSectionProps) {
  const [selectedCarrier, setSelectedCarrier] = useState<string>(
    carrierName && 
    ((transportMode === "air" && AIR_CARRIERS.includes(carrierName)) || 
     (transportMode === "road" && ROAD_CARRIERS.includes(carrierName))) 
      ? carrierName 
      : "outro"
  );
  
  const [customCarrierName, setCustomCarrierName] = useState<string>(
    selectedCarrier === "outro" ? carrierName : ""
  );

  // Update state when transport mode changes
  useEffect(() => {
    // Reset the selected carrier when transport mode changes
    const currentCarriers = transportMode === "air" ? AIR_CARRIERS : ROAD_CARRIERS;
    if (carrierName && currentCarriers.includes(carrierName)) {
      setSelectedCarrier(carrierName);
      setCustomCarrierName("");
    } else if (carrierName) {
      setSelectedCarrier("outro");
      setCustomCarrierName(carrierName);
    } else {
      setSelectedCarrier(currentCarriers[0]);
      setCarrierName(currentCarriers[0]);
    }
  }, [transportMode, carrierName, setCarrierName]);

  // Update carrier name when selection changes
  const handleCarrierChange = (value: string) => {
    setSelectedCarrier(value);
    
    if (value !== "outro") {
      setCarrierName(value);
      setCustomCarrierName("");
    } else {
      setCustomCarrierName(customCarrierName || "");
    }
  };

  // Update carrier name when user types a custom carrier name
  const handleCustomCarrierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomCarrierName(value);
    setCarrierName(value);
  };

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
        <div className="space-y-2">
          <Select 
            value={selectedCarrier} 
            onValueChange={handleCarrierChange}
            disabled={disabled}
          >
            <SelectTrigger id="carrierSelect">
              <SelectValue placeholder="Selecione a transportadora" />
            </SelectTrigger>
            <SelectContent>
              {(transportMode === "air" ? AIR_CARRIERS : ROAD_CARRIERS).map(carrier => (
                <SelectItem key={carrier} value={carrier}>
                  {carrier === "outro" ? "Outro" : carrier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedCarrier === "outro" && (
            <Input
              id="customCarrierName"
              value={customCarrierName}
              onChange={handleCustomCarrierChange}
              placeholder="Digite o nome da transportadora"
              disabled={disabled}
            />
          )}
        </div>
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
