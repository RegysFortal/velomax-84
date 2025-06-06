import React from 'react';
import { Input } from "@/components/ui/input";
interface CarrierSectionProps {
  transportMode: "air" | "road";
  carrierName: string;
  setCarrierName: (name: string) => void;
  disabled?: boolean;
}
const airCarriers = ["TAM Cargo", "LATAM Cargo", "Azul Cargo", "GOL Log", "American Airlines Cargo", "Air France Cargo", "Lufthansa Cargo"];
const roadCarriers = ["Transportadora Braspress", "Jamef Encomendas Urgentes", "Total Express", "Rodonaves", "Patrus Transportes", "TNT Mercurio", "Jadlog"];
export function CarrierSection({
  transportMode,
  carrierName,
  setCarrierName,
  disabled
}: CarrierSectionProps) {
  const carriers = transportMode === "air" ? airCarriers : roadCarriers;
  const label = transportMode === "air" ? "Companhia Aérea" : "Transportadora";
  return;
}