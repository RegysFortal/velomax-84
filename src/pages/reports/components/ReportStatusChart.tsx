
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Shipment } from '@/types';
import { useStatusLabel } from '@/components/shipment/hooks/useStatusLabel';

interface ReportStatusChartProps {
  filteredShipments: Shipment[];
}

export function ReportStatusChart({ filteredShipments }: ReportStatusChartProps) {
  const { getStatusLabel } = useStatusLabel();
  
  const statusCounts = {
    in_transit: filteredShipments.filter(s => s.status === 'in_transit').length,
    retained: filteredShipments.filter(s => s.status === 'retained').length,
    delivered: filteredShipments.filter(s => s.status === 'delivered').length,
    partially_delivered: filteredShipments.filter(s => s.status === 'partially_delivered').length,
    delivered_final: filteredShipments.filter(s => s.status === 'delivered_final').length,
  };

  // Get status labels using the useStatusLabel hook
  const chartData = [
    { name: getStatusLabel('in_transit'), value: statusCounts.in_transit },
    { name: getStatusLabel('retained'), value: statusCounts.retained },
    { name: getStatusLabel('delivered'), value: statusCounts.delivered },
    { name: getStatusLabel('partially_delivered'), value: statusCounts.partially_delivered },
    { name: getStatusLabel('delivered_final'), value: statusCounts.delivered_final },
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
