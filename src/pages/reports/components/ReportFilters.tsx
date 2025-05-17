
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { ShipmentStatus } from '@/types';
import { DatePicker } from '@/components/ui/date-picker';
import { toLocalDate, toISODateString } from '@/utils/dateUtils';

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
  // Convertemos strings de data para objetos Date para o DatePicker
  // Important: Usando toLocalDate para criar datas ao meio-dia para evitar problemas de fuso horário
  const [startDateObj, setStartDateObj] = useState<Date | undefined>(
    startDate ? toLocalDate(new Date(`${startDate}T12:00:00`)) : undefined
  );
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(
    endDate ? toLocalDate(new Date(`${endDate}T12:00:00`)) : undefined
  );
  
  // Atualizamos os objetos de data locais quando as props mudam
  useEffect(() => {
    if (startDate) {
      setStartDateObj(toLocalDate(new Date(`${startDate}T12:00:00`)));
    } else {
      setStartDateObj(undefined);
    }
    
    if (endDate) {
      setEndDateObj(toLocalDate(new Date(`${endDate}T12:00:00`)));
    } else {
      setEndDateObj(undefined);
    }
  }, [startDate, endDate]);
  
  // Tratamos a seleção de data do DatePicker
  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDateObj(date);
    if (date) {
      console.log('Selecionou data inicial:', date, 'Convertendo para ISO:', toISODateString(date));
      onStartDateChange(toISODateString(date));
    }
  };
  
  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDateObj(date);
    if (date) {
      console.log('Selecionou data final:', date, 'Convertendo para ISO:', toISODateString(date));
      onEndDateChange(toISODateString(date));
    }
  };
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Filtros de Relatório</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Inicial</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <DatePicker
                  date={startDateObj}
                  onSelect={handleStartDateSelect}
                  placeholder="Selecione a data inicial"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Final</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <DatePicker
                  date={endDateObj}
                  onSelect={handleEndDateSelect}
                  placeholder="Selecione a data final"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={filterStatus} 
                onValueChange={(val) => onStatusChange(val as ShipmentStatus | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="in_transit">Em Trânsito</SelectItem>
                  <SelectItem value="retained">Retida</SelectItem>
                  <SelectItem value="delivered">Retirada</SelectItem>
                  <SelectItem value="partially_delivered">Entregue Parcial</SelectItem>
                  <SelectItem value="delivered_final">Entregue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Modo de Transporte</label>
              <Select 
                value={filterMode} 
                onValueChange={(val) => onModeChange(val as 'air' | 'road' | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modo" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="air">Aéreo</SelectItem>
                  <SelectItem value="road">Rodoviário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Transportadora</label>
            <Select 
              value={filterCarrier} 
              onValueChange={onCarrierChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a transportadora" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">Todas</SelectItem>
                {uniqueCarriers.map((carrier) => (
                  <SelectItem 
                    key={carrier as React.Key} 
                    value={carrier as string}
                  >
                    {carrier as React.ReactNode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
