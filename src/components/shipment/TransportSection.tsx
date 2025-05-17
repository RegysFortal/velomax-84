
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
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
  carrierName,
  setCarrierName,
  trackingNumber,
  setTrackingNumber,
  disabled
}: TransportSectionProps) {
  // Air carriers
  const airCarriers = ["Azul", "Gol", "Latam"];
  // Road carriers
  const roadCarriers = ["Concept", "Global", "Jeam", "Outro"];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FormField id="transportMode" label="Tipo de Transporte">
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
        </FormField>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField id="carrierName" label="Transportadora">
          <RadioGroup
            value={carrierName}
            onValueChange={setCarrierName}
            disabled={disabled}
            className="grid grid-cols-2 gap-2 pt-1"
          >
            {transportMode === "air" ? (
              // Display air carriers
              airCarriers.map(carrier => (
                <div key={carrier} className="flex items-center space-x-2">
                  <RadioGroupItem value={carrier} id={`carrier-${carrier}`} />
                  <Label htmlFor={`carrier-${carrier}`}>{carrier}</Label>
                </div>
              ))
            ) : (
              // Display road carriers
              roadCarriers.map(carrier => (
                <div key={carrier} className="flex items-center space-x-2">
                  <RadioGroupItem value={carrier} id={`carrier-${carrier}`} />
                  <Label htmlFor={`carrier-${carrier}`}>{carrier}</Label>
                </div>
              ))
            )}
          </RadioGroup>
        </FormField>
        
        <FormField id="trackingNumber" label="Conhecimento">
          <Input
            id="trackingNumber"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Número do conhecimento"
            disabled={disabled}
          />
        </FormField>
      </div>
    </div>
  );
}
