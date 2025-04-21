
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { DatePicker } from '@/components/ui/date-picker';
import { X } from 'lucide-react';
import { Client } from '@/types';

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
              date={startDate ? new Date(startDate) : undefined}
              onSelect={(date) => setStartDate(date ? date.toISOString().split('T')[0] : null)}
              placeholder="Selecione a data inicial"
            />
          </div>
          <div>
            <Label htmlFor="end-date">Data Final</Label>
            <DatePicker
              date={endDate ? new Date(endDate) : undefined}
              onSelect={(date) => setEndDate(date ? date.toISOString().split('T')[0] : null)}
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
