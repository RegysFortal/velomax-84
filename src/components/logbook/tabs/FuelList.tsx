
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FuelRecord, Vehicle } from '@/types';

interface FuelListProps {
  fuelRecords: FuelRecord[];
  vehicles: Vehicle[];
  selectedDate: Date;
  onNewFuel?: () => void;
}

export const FuelList: React.FC<FuelListProps> = ({ 
  fuelRecords, 
  vehicles, 
  selectedDate,
  onNewFuel 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          Abastecimentos de {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </CardTitle>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </CardHeader>
      <CardContent>
        {fuelRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Clock className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhum abastecimento encontrado para esta data.</p>
            <Button variant="outline" className="mt-4" onClick={onNewFuel}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar abastecimento
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Veículo</TableHead>
                <TableHead>Combustível</TableHead>
                <TableHead>Litros</TableHead>
                <TableHead>Valor/L</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Odômetro</TableHead>
                <TableHead>Posto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fuelRecords.map((record) => {
                const vehicle = vehicles.find(v => v.id === record.vehicleId);
                
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{vehicle?.plate} - {vehicle?.model}</TableCell>
                    <TableCell>{record.fuelType}</TableCell>
                    <TableCell>{record.liters} L</TableCell>
                    <TableCell>R$ {record.pricePerLiter.toFixed(2)}</TableCell>
                    <TableCell>R$ {record.totalCost.toFixed(2)}</TableCell>
                    <TableCell>{record.odometer} km</TableCell>
                    <TableCell>{record.station || "---"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
