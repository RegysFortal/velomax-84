
import React from 'react';

interface GeneralInfoSectionProps {
  companyName: string;
  transportMode: "air" | "road";
  carrierName: string;
  trackingNumber: string;
}

export function GeneralInfoSection({ 
  companyName, 
  transportMode, 
  carrierName, 
  trackingNumber 
}: GeneralInfoSectionProps) {
  return (
    <div className="md:col-span-1">
      <h3 className="text-lg font-medium">Informações Gerais</h3>
      
      <div className="space-y-2 mt-2">
        <div>
          <p className="text-sm text-muted-foreground">Cliente</p>
          <p className="font-medium">{companyName}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Modo de Transporte</p>
          <p className="font-medium">{transportMode === "air" ? "Aéreo" : "Rodoviário"}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Transportadora</p>
          <p className="font-medium">{carrierName}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Nº de Rastreio</p>
          <p className="font-medium">{trackingNumber}</p>
        </div>
      </div>
    </div>
  );
}
