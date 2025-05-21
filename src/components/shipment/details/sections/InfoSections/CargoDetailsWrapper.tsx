
import React from 'react';
import { CargoDetailsSection } from "../CargoDetailsSection";

interface CargoDetailsWrapperProps {
  packages: number;
  weight: number;
  transportMode: "air" | "road";
  arrivalFlight?: string;
  arrivalDate?: string;
}

export function CargoDetailsWrapper({
  packages,
  weight,
  transportMode,
  arrivalFlight,
  arrivalDate
}: CargoDetailsWrapperProps) {
  return (
    <CargoDetailsSection
      packages={packages}
      weight={weight}
      transportMode={transportMode}
      arrivalFlight={arrivalFlight}
      arrivalDate={arrivalDate}
    />
  );
}
