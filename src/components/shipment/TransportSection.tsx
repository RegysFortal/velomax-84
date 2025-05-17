
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TransportMode } from "@/types/shipment";

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
              <Label htmlFor="air">Aéreo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="road" id="road" />
              <Label htmlFor="road">Rodoviário</Label>
            </div>
          </RadioGroup>
        </FormField>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField id="carrierName" label="Transportadora">
          <Input
            id="carrierName"
            value={carrierName}
            onChange={(e) => setCarrierName(e.target.value)}
            placeholder="Nome da transportadora"
            disabled={disabled}
          />
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
