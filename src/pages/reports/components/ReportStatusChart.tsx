import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Shipment } from "@/types";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface ReportStatusChartProps {
  filteredShipments: Shipment[];
}

export function ReportStatusChart({ filteredShipments }: ReportStatusChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  useEffect(() => {
    // Count shipments by status
    const inTransit = filteredShipments.filter(s => s.status === 'in_transit').length;
    const retained = filteredShipments.filter(s => s.status === 'retained').length;
    const delivered = filteredShipments.filter(s => s.status === 'delivered').length;
    const partialDelivered = filteredShipments.filter(s => s.status === 'partially_delivered').length;
    const finalDelivered = filteredShipments.filter(s => s.status === 'delivered_final').length;
    
    // Create chart data
    const data: ChartData[] = [
      { name: 'Em Trânsito', value: inTransit, color: 'hsl(216, 100%, 50%)' },
      { name: 'Retida', value: retained, color: 'hsl(360, 100%, 50%)' },
      { name: 'Retirado', value: delivered, color: 'hsl(30, 100%, 50%)' },
      { name: 'Entregue Parcial', value: partialDelivered, color: 'hsl(50, 100%, 50%)' },
      { name: 'Entregue', value: finalDelivered, color: 'hsl(123, 100%, 40%)' }
    ];
    
    setChartData(data);
  }, [filteredShipments]);
  
  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow text-sm">
          <p className="font-bold">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status dos Embarques</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]} 
                fill="var(--primary)" 
                fillOpacity={0.9} 
                isAnimationActive={true} 
                animationDuration={1000}
                barSize={30}
              >
                {chartData.map((entry, index) => (
                  <rect 
                    key={`bar-${index}`} 
                    fill={entry.color}
                    // The rect attributes will be automatically applied by recharts
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
