
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, AlertTriangle, Check, Package, RefreshCw, RotateCcw, TruckIcon } from 'lucide-react';
import { useShipmentSummary } from './hooks/useShipmentSummary';

interface SummaryCardsProps {
  inTransitShipments: number;
  retainedShipments: number;
  deliveredShipments: number;
  partiallyDeliveredShipments: number;
  finalDeliveredShipments: number;
  totalWeight: number;
  totalDeliveries: number;
  startDate: string;
  endDate: string;
  onRefresh: () => void;
}

export function SummaryCards({
  totalWeight,
  totalDeliveries,
  startDate,
  endDate,
  onRefresh
}: SummaryCardsProps) {
  // Use our custom hook to get real-time summary data
  const summary = useShipmentSummary(startDate, endDate);

  // Trigger a refresh when the component mounts
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('shipments-updated'));
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Em Trânsito
          </CardTitle>
          <Truck className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.inTransitShipments}</div>
          <p className="text-xs text-muted-foreground">
            {summary.inTransitShipments > 0 
              ? `${((summary.inTransitShipments / summary.totalShipments) * 100).toFixed(1)}% do total`
              : 'Nenhum embarque em trânsito'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Na Transportadora
          </CardTitle>
          <TruckIcon className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.atCarrierShipments || 0}</div>
          <p className="text-xs text-muted-foreground">
            {(summary.atCarrierShipments || 0) > 0 
              ? `${(((summary.atCarrierShipments || 0) / summary.totalShipments) * 100).toFixed(1)}% do total`
              : 'Nenhum embarque na transportadora'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Retidas
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.retainedShipments}</div>
          <p className="text-xs text-muted-foreground">
            {summary.retainedShipments > 0 
              ? `${((summary.retainedShipments / summary.totalShipments) * 100).toFixed(1)}% do total`
              : 'Nenhum embarque retido'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Entrega Parcial
          </CardTitle>
          <RotateCcw className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.partiallyDeliveredShipments}</div>
          <p className="text-xs text-muted-foreground">
            {summary.partiallyDeliveredShipments > 0 
              ? `${((summary.partiallyDeliveredShipments / summary.totalShipments) * 100).toFixed(1)}% do total`
              : 'Nenhum embarque com entrega parcial'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Entregas
          </CardTitle>
          <Check className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.finalDeliveredShipments}</div>
          <p className="text-xs text-muted-foreground">
            {summary.finalDeliveredShipments > 0 
              ? `${((summary.finalDeliveredShipments / summary.totalShipments) * 100).toFixed(1)}% do total`
              : 'Nenhum embarque entregue'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Embarques
          </CardTitle>
          <Package className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalShipments}</div>
          <p className="text-xs text-muted-foreground">
            {summary.loading ? 'Carregando...' : 'No período selecionado'}
          </p>
        </CardContent>
      </Card>
      
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
            Peso Movimentado
          </CardTitle>
          <Package className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWeight.toLocaleString('pt-BR')} Kg</div>
          <p className="text-xs text-muted-foreground">
            No período selecionado
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Atualizar
          </CardTitle>
          <RefreshCw 
            onClick={() => {
              onRefresh();
              window.dispatchEvent(new CustomEvent('shipments-updated'));
            }} 
            className="h-4 w-4 text-blue-500 cursor-pointer hover:text-blue-700"
          />
        </CardHeader>
        <CardContent>
          <button 
            onClick={() => {
              onRefresh();
              window.dispatchEvent(new CustomEvent('shipments-updated'));
            }}
            className="w-full py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm text-blue-600 transition-colors"
          >
            Atualizar dados
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
