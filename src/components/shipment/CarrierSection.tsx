
import React from 'react';
import { Input } from "@/components/ui/input";

interface CarrierSectionProps {
  transportMode: "air" | "road";
  carrierName: string;
  setCarrierName: (name: string) => void;
  disabled?: boolean;
}

const airCarriers = [
  "TAM Cargo",
  "LATAM Cargo",
  "Azul Cargo",
  "GOL Log",
  "American Airlines Cargo",
  "Air France Cargo",
  "Lufthansa Cargo"
];

const roadCarriers = [
  "Transportadora Braspress",
  "Jamef Encomendas Urgentes",
  "Total Express",
  "Rodonaves",
  "Patrus Transportes",
  "TNT Mercurio",
  "Jadlog"
];

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
      <label htmlFor="carrier" className="text-sm font-medium">{label}</label>
      <Input
        id="carrier"
        list="carriers"
        value={carrierName}
        onChange={(e) => setCarrierName(e.target.value)}
        placeholder={`Digite o nome da ${transportMode === "air" ? "companhia aérea" : "transportadora"}`}
        disabled={disabled}
      />
      <datalist id="carriers">
        {carriers.map((carrier) => (
          <option key={carrier} value={carrier} />
        ))}
      </datalist>
    </div>
  );
}
