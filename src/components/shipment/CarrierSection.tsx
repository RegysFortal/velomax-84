
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField } from "@/components/ui/form-field";

interface CarrierSectionProps {
  transportMode: "air" | "road";
  carrierName: string;
  setCarrierName: (name: string) => void;
  disabled?: boolean;
}

const airCarriers = ["Azul Cargo", "Gollog", "Latam Cargo"];
const roadCarriers = ["Concept", "Global", "JEM", "Outra"];

export function CarrierSection({
  transportMode,
  carrierName,
  setCarrierName,
  disabled
}: CarrierSectionProps) {
  const carriers = transportMode === "air" ? airCarriers : roadCarriers;
  const label = transportMode === "air" ? "Companhia Aérea" : "Transportadora";

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <RadioGroup
        value={carrierName}
        onValueChange={setCarrierName}
        disabled={disabled}
        className="grid grid-cols-1 gap-2"
      >
        {carriers.map(carrier => (
          <div key={carrier} className="flex items-center space-x-2">
            <RadioGroupItem value={carrier} id={`carrier-${carrier}`} />
            <Label htmlFor={`carrier-${carrier}`} className="text-sm cursor-pointer">
              {carrier}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
