
import React from 'react';
import { Separator } from "@/components/ui/separator";

interface DeliveryInfoSectionProps {
  receiverName?: string;
  deliveryDate?: string;
  deliveryTime?: string;
}

export function DeliveryInfoSection({ receiverName, deliveryDate, deliveryTime }: DeliveryInfoSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Informações da Entrega</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Recebedor</p>
          <p className="font-medium">{receiverName}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Data</p>
          <p className="font-medium">{deliveryDate}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Hora</p>
          <p className="font-medium">{deliveryTime}</p>
        </div>
      </div>
      
      <Separator />
    </div>
  );
}
