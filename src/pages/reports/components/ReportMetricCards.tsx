
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, BarChart, AlertTriangle } from 'lucide-react';
import { Shipment } from '@/types';

interface ReportMetricCardsProps {
  filteredShipments: Shipment[];
}

export function ReportMetricCards({ filteredShipments }: ReportMetricCardsProps) {
  const totalShipments = filteredShipments.length;
  const totalPackages = filteredShipments.reduce((sum, s) => sum + s.packages, 0);
  const totalWeight = filteredShipments.reduce((sum, s) => sum + s.weight, 0);
  const retainedCount = filteredShipments.filter(s => s.status === 'retained').length;
  const retainedPercentage = totalShipments ? (retainedCount / totalShipments * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Embarques</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
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
          <CardTitle className="text-sm font-medium">Volumes</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPackages}</div>
          <p className="text-xs text-muted-foreground">
            Total de volumes
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Peso Total</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWeight.toFixed(2)} kg</div>
          <p className="text-xs text-muted-foreground">
            Peso total transportado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cargas Retidas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{retainedCount} ({retainedPercentage}%)</div>
          <p className="text-xs text-muted-foreground">
            Do total de embarques
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
