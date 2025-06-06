
import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatToReadableDate } from '@/utils/dateUtils';
import { useShipments } from '@/contexts/shipments';
import { ShipmentStatus } from '@/types/shipment';

export interface DelayedShipment {
  id: string;
  trackingNumber: string;
  arrivalDate: string;
  companyName: string;
  daysPastDue: number;
}

export const DelayedShipmentsAlert = () => {
  const [dismissed, setDismissed] = useState(false);
  const [delayedShipments, setDelayedShipments] = useState<DelayedShipment[]>([]);
  const { shipments } = useShipments();

  // Verificar se há embarques atrasados (3 dias após a data de chegada)
  useEffect(() => {
    const now = new Date();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    
    const delayed = shipments
      .filter(shipment => {
        // Verificar apenas embarques em trânsito ou retidos
        if (shipment.status !== 'in_transit' && shipment.status !== 'retained') {
          return false;
        }
        
        // Se não tiver data de chegada, não é considerado atrasado
        if (!shipment.arrivalDate) {
          return false;
        }
        
        const arrivalDate = new Date(shipment.arrivalDate);
        const timeDifference = now.getTime() - arrivalDate.getTime();
        
        // Verificar se está atrasado em pelo menos 3 dias
        return timeDifference >= threeDaysInMs;
      })
      .map(shipment => {
        const arrivalDate = new Date(shipment.arrivalDate || '');
        const daysPastDue = Math.floor((now.getTime() - arrivalDate.getTime()) / (24 * 60 * 60 * 1000));
        
        return {
          id: shipment.id,
          trackingNumber: shipment.trackingNumber,
          arrivalDate: shipment.arrivalDate || '',
          companyName: shipment.companyName || 'Cliente não especificado',
          daysPastDue
        };
      });
      
    setDelayedShipments(delayed);
  }, [shipments]);
  
  // Se não houver embarques atrasados ou o alerta foi dispensado, não exiba nada
  if (delayedShipments.length === 0 || dismissed) {
    return null;
  }
  
  return (
    <div className="animate-vibrate mb-6">
      <Alert variant="destructive" className="bg-red-50 border-red-300 dark:bg-red-900/30 dark:border-red-800">
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        <AlertTitle className="text-red-700 dark:text-red-300 font-semibold text-left">
          Embarques Atrasados! ({delayedShipments.length})
        </AlertTitle>
        <AlertDescription className="text-red-600 dark:text-red-200">
          <div className="mt-2 max-h-32 overflow-y-auto text-left">
            {delayedShipments.map((shipment) => (
              <div key={shipment.id} className="mb-1">
                <span className="font-medium">{shipment.companyName}</span> - 
                Rastreio: {shipment.trackingNumber},
                {' '}Atrasado há {shipment.daysPastDue} dias
                (Chegada: {formatToReadableDate(shipment.arrivalDate)})
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
              onClick={() => setDismissed(true)}
            >
              Fechar
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
