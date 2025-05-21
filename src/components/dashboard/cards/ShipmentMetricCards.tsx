
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, Truck, PackageX, Timer } from 'lucide-react';

interface ShipmentMetricCardsProps {
  totalShipments: number;
  inTransitShipments: number;
  retainedShipments: number;
  delayedShipments: number;
}

export function ShipmentMetricCards({
  totalShipments,
  inTransitShipments,
  retainedShipments,
  delayedShipments
}: ShipmentMetricCardsProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Embarques
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalShipments}</div>
          <p className="text-xs text-muted-foreground">
            No período selecionado
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Embarques em Trânsito
          </CardTitle>
          <Truck className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inTransitShipments}</div>
          <p className="text-xs text-muted-foreground">
            {inTransitShipments > 0 
              ? `${((inTransitShipments / totalShipments) * 100).toFixed(1)}% do total`
              : 'Nenhum embarque em trânsito'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Embarques Retidos
          </CardTitle>
          <PackageX className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{retainedShipments}</div>
          <p className="text-xs text-muted-foreground">
            {retainedShipments > 0 
              ? `${((retainedShipments / totalShipments) * 100).toFixed(1)}% do total`
              : 'Nenhum embarque retido'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Embarques Atrasados
          </CardTitle>
          <Timer className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{delayedShipments}</div>
          <p className="text-xs text-muted-foreground">
            {delayedShipments > 0 
              ? `${((delayedShipments / totalShipments) * 100).toFixed(1)}% do total`
              : 'Nenhum embarque atrasado'}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
