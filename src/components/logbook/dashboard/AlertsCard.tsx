
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel } from 'lucide-react';
import { Vehicle } from '@/types';

interface AlertsCardProps {
  vehicles: Vehicle[];
}

export const AlertsCard: React.FC<AlertsCardProps> = ({ vehicles }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-medium">Alertas</CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Manutenções importantes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {vehicles.map(vehicle => {
            if (vehicle.nextOilChangeKm - vehicle.currentOdometer < 500) {
              return (
                <div key={`oil-${vehicle.id}`} className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="font-medium text-amber-800">Troca de óleo necessária</p>
                  <p className="text-sm text-amber-700">
                    {vehicle.plate} - {vehicle.model} precisa trocar o óleo em {vehicle.nextOilChangeKm - vehicle.currentOdometer} km
                  </p>
                </div>
              );
            }
            return null;
          }).filter(Boolean)}
          
          {vehicles.length > 0 && vehicles.every(v => v.nextOilChangeKm - v.currentOdometer >= 500) && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="font-medium text-green-800">Sem alertas pendentes</p>
              <p className="text-sm text-green-700">
                Todos os veículos estão em dia com a manutenção
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
