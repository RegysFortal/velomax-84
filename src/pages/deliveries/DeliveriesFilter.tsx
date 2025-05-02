
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { DatePicker } from '@/components/ui/date-picker';
import { X } from 'lucide-react';
import { Client } from '@/types';
import { format } from 'date-fns';

interface DeliveriesFilterProps {
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  startDate: string | null;
  setStartDate: (date: string | null) => void;
  endDate: string | null;
  setEndDate: (date: string | null) => void;
  clearFilters: () => void;
  filteredDeliveriesCount: number;
  clients: Client[];
}

export const DeliveriesFilter: React.FC<DeliveriesFilterProps> = ({
  selectedClientId,
  setSelectedClientId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  clearFilters,
  filteredDeliveriesCount,
  clients
}) => {
  const [startDateObj, setStartDateObj] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined
  );
  
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(
    endDate ? new Date(endDate) : undefined
  );
  
  // Update local date objects when props change
  useEffect(() => {
    if (startDate) {
      const date = new Date(`${startDate}T12:00:00`);
      setStartDateObj(date);
    } else {
      setStartDateObj(undefined);
    }
    
    if (endDate) {
      const date = new Date(`${endDate}T12:00:00`);
      setEndDateObj(date);
    } else {
      setEndDateObj(undefined);
    }
  }, [startDate, endDate]);
  
  // Handle date selection
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDateObj(date);
    if (date) {
      // Ensure noon to avoid timezone issues
      date.setHours(12, 0, 0, 0);
      setStartDate(format(date, 'yyyy-MM-dd'));
    } else {
      setStartDate(null);
    }
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDateObj(date);
    if (date) {
      // Ensure noon to avoid timezone issues
      date.setHours(12, 0, 0, 0);
      setEndDate(format(date, 'yyyy-MM-dd'));
    } else {
      setEndDate(null);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="client-filter">Cliente</Label>
            <ClientSearchSelect
              value={selectedClientId}
              onValueChange={setSelectedClientId}
              placeholder="Selecione um cliente"
              clients={clients}
            />
          </div>
          <div>
            <Label htmlFor="start-date">Data Inicial</Label>
            <DatePicker
              date={startDateObj}
              onSelect={handleStartDateChange}
              placeholder="Selecione a data inicial"
            />
          </div>
          <div>
            <Label htmlFor="end-date">Data Final</Label>
            <DatePicker
              date={endDateObj}
              onSelect={handleEndDateChange}
              placeholder="Selecione a data final"
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            {filteredDeliveriesCount} entregas encontradas
          </div>
          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
