
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck } from 'lucide-react';
import { Vehicle } from '@/types';

interface VehicleStatusCardProps {
  vehicles: Vehicle[];
}

export const VehicleStatusCard: React.FC<VehicleStatusCardProps> = ({ vehicles }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-medium">Veículos</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Status dos veículos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vehicles.map(vehicle => (
            <div key={vehicle.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{vehicle.plate}</p>
                <p className="text-sm text-muted-foreground">{vehicle.model} {vehicle.year}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{vehicle.currentOdometer} km</p>
                {vehicle.nextOilChangeKm - vehicle.currentOdometer < 1000 ? (
                  <p className="text-sm text-destructive">Troca de óleo em {vehicle.nextOilChangeKm - vehicle.currentOdometer} km</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Óleo: {vehicle.nextOilChangeKm - vehicle.currentOdometer} km</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
