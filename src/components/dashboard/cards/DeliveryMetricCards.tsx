
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, Check } from 'lucide-react';

interface DeliveryMetricCardsProps {
  totalDeliveries: number;
  activeDeliveries: number;
}

export function DeliveryMetricCards({
  totalDeliveries,
  activeDeliveries
}: DeliveryMetricCardsProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Entregas
          </CardTitle>
          <Package className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDeliveries}</div>
          <p className="text-xs text-muted-foreground">
            No período selecionado
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Entregas Ativas
          </CardTitle>
          <Check className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeDeliveries}</div>
          <p className="text-xs text-muted-foreground">
            Entregas agendadas
          </p>
        </CardContent>
      </Card>
    </>
  );
}
