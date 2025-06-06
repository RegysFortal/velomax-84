
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ShipmentStatus } from "@/types";
import { useCarrierFiltering } from "./filters/useCarrierFiltering";

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
  // Use carrier filtering hook
  const { filteredCarriers } = useCarrierFiltering(
    filterMode, 
    filterCarrier, 
    uniqueCarriers, 
    onCarrierChange
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data Inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Data Final</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={filterStatus} onValueChange={(value) => onStatusChange(value as ShipmentStatus | 'all')}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="in_transit">Em Trânsito</SelectItem>
              <SelectItem value="at_carrier">Na Transportadora</SelectItem>
              <SelectItem value="retained">Retida</SelectItem>
              <SelectItem value="delivered">Retirada</SelectItem>
              <SelectItem value="partially_delivered">Entregue Parcial</SelectItem>
              <SelectItem value="delivered_final">Entregue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mode">Modo</Label>
          <Select value={filterMode} onValueChange={(value) => onModeChange(value as 'air' | 'road' | 'all')}>
            <SelectTrigger id="mode">
              <SelectValue placeholder="Todos os modos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="air">Aéreo</SelectItem>
              <SelectItem value="road">Rodoviário</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="carrier">Transportadora</Label>
          <Select value={filterCarrier} onValueChange={onCarrierChange}>
            <SelectTrigger id="carrier">
              <SelectValue placeholder="Todas as transportadoras" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {filteredCarriers.map((carrier) => (
                <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
