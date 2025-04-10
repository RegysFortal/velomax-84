
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, Truck, CheckCircle2, AlertTriangle } from 'lucide-react';

interface MetricCardsProps {
  totalDeliveries: number;
  totalShipments: number;
  deliveredShipments: number;
  retainedShipments: number;
}

export const MetricCards = ({ 
  totalDeliveries, 
  totalShipments, 
  deliveredShipments, 
  retainedShipments 
}: MetricCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Entregas
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
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
            Total de Embarques
          </CardTitle>
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
          <CardTitle className="text-sm font-medium">
            Cargas Entregues
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{deliveredShipments}</div>
          <p className="text-xs text-muted-foreground">
            De {totalShipments} embarques
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Cargas Retidas
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{retainedShipments}</div>
          <p className="text-xs text-muted-foreground">
            De {totalShipments} embarques
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
