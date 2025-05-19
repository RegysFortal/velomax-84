
import React from 'react';

interface CargoDetailsSectionProps {
  packages: number;
  weight: number;
  transportMode: "air" | "road";
  arrivalFlight?: string;
  arrivalDate?: string;
}

export function CargoDetailsSection({ 
  packages, 
  weight, 
  transportMode, 
  arrivalFlight, 
  arrivalDate 
}: CargoDetailsSectionProps) {
  return (
    <div className="md:col-span-1">
      <h3 className="text-lg font-medium">Detalhes da Carga</h3>
      
      <div className="space-y-2 mt-2">
        <div>
          <p className="text-sm text-muted-foreground">Volumes</p>
          <p className="font-medium">{packages}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Peso (kg)</p>
          <p className="font-medium">{weight}</p>
        </div>
        
        {transportMode === "air" && (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Voo</p>
              <p className="font-medium">{arrivalFlight || "-"}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Data de Chegada</p>
              <p className="font-medium">{arrivalDate || "-"}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
