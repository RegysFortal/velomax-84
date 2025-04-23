
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Shipment } from '@/types';

interface ReportStatusChartProps {
  filteredShipments: Shipment[];
}

export function ReportStatusChart({ filteredShipments }: ReportStatusChartProps) {
  const statusCounts = {
    in_transit: filteredShipments.filter(s => s.status === 'in_transit').length,
    retained: filteredShipments.filter(s => s.status === 'retained').length,
    delivered: filteredShipments.filter(s => s.status === 'delivered').length,
    partially_delivered: filteredShipments.filter(s => s.status === 'partially_delivered').length,
    delivered_final: filteredShipments.filter(s => s.status === 'delivered_final').length,
  };

  const chartData = [
    { name: 'Em Trânsito', value: statusCounts.in_transit },
    { name: 'Retida', value: statusCounts.retained },
    { name: 'Retirada', value: statusCounts.delivered },
    { name: 'Entregue Parcial', value: statusCounts.partially_delivered },
    { name: 'Entregue', value: statusCounts.delivered_final },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Status dos Embarques</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" name="Quantidade" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
