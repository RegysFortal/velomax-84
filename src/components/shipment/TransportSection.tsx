
import React, { useState, useEffect, useMemo } from 'react';
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

// Define carrier options by type - moved outside component to prevent recreation
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
  // Use lazy initial state to prevent recalculation on every render
  const [selectedCarrier, setSelectedCarrier] = useState<string>(() => {
    if (carrierName && 
      ((transportMode === "air" && AIR_CARRIERS.includes(carrierName)) || 
      (transportMode === "road" && ROAD_CARRIERS.includes(carrierName)))) {
      return carrierName;
    }
    return "outro";
  });
  
  const [customCarrierName, setCustomCarrierName] = useState<string>(() => 
    selectedCarrier === "outro" ? carrierName : ""
  );

  // Memoize current carriers to prevent recreation on every render
  const currentCarriers = useMemo(() => 
    transportMode === "air" ? AIR_CARRIERS : ROAD_CARRIERS, 
    [transportMode]
  );

  // Update state when transport mode changes - using useEffect with proper dependencies
  useEffect(() => {
    if (!carrierName) {
      // If no carrier name, select the first one from the list
      setSelectedCarrier(currentCarriers[0]);
      setCarrierName(currentCarriers[0]);
      setCustomCarrierName("");
      return;
    }
    
    if (currentCarriers.includes(carrierName)) {
      setSelectedCarrier(carrierName);
      setCustomCarrierName("");
    } else {
      setSelectedCarrier("outro");
      setCustomCarrierName(carrierName);
    }
  }, [transportMode, carrierName, setCarrierName, currentCarriers]);

  // Update carrier name when selection changes - with debounce
  const handleCarrierChange = (value: string) => {
    setSelectedCarrier(value);
    
    if (value !== "outro") {
      setCarrierName(value);
      setCustomCarrierName("");
    } else if (customCarrierName) {
      // Only update if we have a custom carrier name
      setCarrierName(customCarrierName);
    }
  };

  // Update carrier name when user types a custom carrier name
  const handleCustomCarrierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomCarrierName(value);
    // Use requestAnimationFrame to prevent UI freeze during typing
    requestAnimationFrame(() => {
      setCarrierName(value);
    });
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
              {currentCarriers.map(carrier => (
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
