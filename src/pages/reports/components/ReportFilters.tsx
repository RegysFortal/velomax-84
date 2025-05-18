
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShipmentStatus } from '@/types';
import { DateRangeSelector } from './filters/DateRangeSelector';
import { StatusSelector } from './filters/StatusSelector';
import { TransportModeSelector } from './filters/TransportModeSelector';
import { CarrierSelector } from './filters/CarrierSelector';
import { useCarrierFiltering } from './filters/useCarrierFiltering';

interface ReportFiltersProps {
  startDate: string;
  endDate: string;
  filterStatus: ShipmentStatus | 'all';
  filterMode: 'air' | 'road' | 'all';
  filterCarrier: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStatusChange: (value: ShipmentStatus | 'all') => void;
  onModeChange: (value: 'air' | 'road' | 'all') => void;
  onCarrierChange: (value: string) => void;
  uniqueCarriers: string[];
}

export function ReportFilters({
  startDate,
  endDate,
  filterStatus,
  filterMode,
  filterCarrier,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onModeChange,
  onCarrierChange,
  uniqueCarriers
}: ReportFiltersProps) {
  const { filteredCarriers } = useCarrierFiltering(filterMode, filterCarrier, uniqueCarriers, onCarrierChange);
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Filtros de Relatório</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DateRangeSelector 
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusSelector 
              filterStatus={filterStatus} 
              onStatusChange={onStatusChange} 
            />
            <TransportModeSelector 
              filterMode={filterMode} 
              onModeChange={onModeChange} 
            />
          </div>
          
          <CarrierSelector 
            filterCarrier={filterCarrier}
            filteredCarriers={filteredCarriers}
            onCarrierChange={onCarrierChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
