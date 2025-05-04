
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Maintenance, Vehicle } from '@/types';

interface MaintenanceListProps {
  maintenanceRecords: Maintenance[];
  vehicles: Vehicle[];
  selectedDate: Date;
  onNewMaintenance?: () => void;
}

export const MaintenanceList: React.FC<MaintenanceListProps> = ({ 
  maintenanceRecords, 
  vehicles, 
  selectedDate,
  onNewMaintenance
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          Manutenções de {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </CardTitle>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </CardHeader>
      <CardContent>
        {maintenanceRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Wrench className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhuma manutenção encontrada para esta data.</p>
            <Button variant="outline" className="mt-4" onClick={onNewMaintenance}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar manutenção
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Veículo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Odômetro</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>Fornecedor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceRecords.map((record) => {
                const vehicle = vehicles.find(v => v.id === record.vehicleId);
                
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{vehicle?.plate} - {vehicle?.model}</TableCell>
                    <TableCell>{record.maintenanceType}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>{record.odometer} km</TableCell>
                    <TableCell>R$ {record.cost.toFixed(2)}</TableCell>
                    <TableCell>{record.provider || "---"}</TableCell>
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
