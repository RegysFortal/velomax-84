
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TransportMode } from "@/types/shipment";
import { Plane, Truck } from "lucide-react";

interface TransportSectionProps {
  transportMode: TransportMode;
  setTransportMode: (mode: TransportMode) => void;
  carrierName: string;
  setCarrierName: (name: string) => void;
  trackingNumber: string;
  setTrackingNumber: (number: string) => void;
  disabled?: boolean;
}

export function TransportSection({
  transportMode,
  setTransportMode,
  disabled
}: TransportSectionProps) {
  return (
    <div className="space-y-4">
      <RadioGroup 
        value={transportMode} 
        onValueChange={(value) => setTransportMode(value as TransportMode)} 
        disabled={disabled} 
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="air" id="air" />
          <Label htmlFor="air" className="flex items-center gap-1">
            <Plane className="h-4 w-4" /> Aéreo
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="road" id="road" />
          <Label htmlFor="road" className="flex items-center gap-1">
            <Truck className="h-4 w-4" /> Rodoviário
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
