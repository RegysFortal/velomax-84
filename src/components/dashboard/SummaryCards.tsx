
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shipment/StatusBadge';
import { Truck, Package, Clock } from 'lucide-react';
import { differenceInDays } from 'date-fns';

interface SummaryCardsProps {
  inTransitShipments: number;
  retainedShipments: number;
  deliveredShipments: number;
  finalDeliveredShipments: number; // For the "delivered_final" status
  totalWeight: number;
  totalDeliveries: number;
  startDate: string;
  endDate: string;
}

export const SummaryCards = ({
  inTransitShipments,
  retainedShipments,
  deliveredShipments,
  finalDeliveredShipments,
  totalWeight,
  totalDeliveries,
  startDate,
  endDate
}: SummaryCardsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Status de Embarques</CardTitle>
          <CardDescription>
            Resumo dos embarques por status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <StatusBadge status="in_transit" />
                <span className="ml-2">Em Trânsito</span>
              </div>
              <span className="font-medium">{inTransitShipments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <StatusBadge status="retained" />
                <span className="ml-2">Retidas</span>
              </div>
              <span className="font-medium">{retainedShipments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <StatusBadge status="delivered" />
                <span className="ml-2">Retiradas</span>
              </div>
              <span className="font-medium">{deliveredShipments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <StatusBadge status="delivered_final" />
                <span className="ml-2">Entregues</span>
              </div>
              <span className="font-medium">{finalDeliveredShipments}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4" 
            onClick={() => navigate('/shipments')}
          >
            <Truck className="mr-2 h-4 w-4" />
            Ver Todos Embarques
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Peso Transportado</CardTitle>
          <CardDescription>
            Total em kg no período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-3xl font-bold">
              {totalWeight.toFixed(2)} kg
            </div>
            <div className="text-sm text-muted-foreground mt-1">em {totalDeliveries} entregas</div>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/deliveries')}
          >
            <Package className="mr-2 h-4 w-4" />
            Ver Entregas
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Média de Entregas</CardTitle>
          <CardDescription>
            Média diária de entregas no período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-3xl font-bold">
              {(totalDeliveries / Math.max(differenceInDays(new Date(endDate), new Date(startDate)) + 1, 1)).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">entregas por dia</div>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/shipment-reports')}
          >
            <Clock className="mr-2 h-4 w-4" />
            Relatórios de Embarques
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
