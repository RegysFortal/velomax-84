
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Wrench } from 'lucide-react';
import { Vehicle } from '@/types';

interface AlertsCardProps {
  vehicles: Vehicle[];
}

export const AlertsCard: React.FC<AlertsCardProps> = ({ vehicles }) => {
  // Calcular alertas de manutenção
  const getMaintenanceAlerts = () => {
    const alerts = [];
    
    vehicles.forEach(vehicle => {
      if (vehicle.nextOilChangeKm && vehicle.currentOdometer) {
        const remainingKm = vehicle.nextOilChangeKm - vehicle.currentOdometer;
        
        // Alerta crítico - menos de 500km para troca
        if (remainingKm <= 500 && remainingKm > 0) {
          alerts.push({
            id: `oil-critical-${vehicle.id}`,
            type: 'critical',
            title: 'Troca de óleo urgente',
            message: `${vehicle.plate} - ${vehicle.model} precisa trocar o óleo em ${remainingKm} km`,
            vehicle: vehicle
          });
        }
        // Alerta de atenção - menos de 1000km para troca
        else if (remainingKm <= 1000 && remainingKm > 500) {
          alerts.push({
            id: `oil-warning-${vehicle.id}`,
            type: 'warning',
            title: 'Troca de óleo em breve',
            message: `${vehicle.plate} - ${vehicle.model} precisa trocar o óleo em ${remainingKm} km`,
            vehicle: vehicle
          });
        }
        // Alerta vencido - odômetro atual já passou da próxima troca
        else if (remainingKm <= 0) {
          alerts.push({
            id: `oil-overdue-${vehicle.id}`,
            type: 'overdue',
            title: 'Troca de óleo vencida',
            message: `${vehicle.plate} - ${vehicle.model} está ${Math.abs(remainingKm)} km atrasado na troca de óleo`,
            vehicle: vehicle
          });
        }
      }
    });
    
    return alerts;
  };

  const alerts = getMaintenanceAlerts();

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'overdue':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'critical':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'overdue':
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Wrench className="h-4 w-4 text-amber-500" />;
      default:
        return <Wrench className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-medium">Alertas</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Manutenções importantes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <div key={alert.id} className={`p-3 border rounded-md ${getAlertStyles(alert.type)}`}>
                <div className="flex items-start gap-2">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm mt-1">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start gap-2">
                <Wrench className="h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">Sem alertas pendentes</p>
                  <p className="text-sm text-green-700 mt-1">
                    Todos os veículos estão em dia com a manutenção
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
