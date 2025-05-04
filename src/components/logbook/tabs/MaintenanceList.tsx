
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wrench } from 'lucide-react';
import { Vehicle, Maintenance } from '@/types';
import { format } from 'date-fns';

interface MaintenanceListProps {
  maintenanceRecords: Maintenance[];
  vehicles: Vehicle[];
  selectedDate: Date;
  onNewMaintenance: () => void;
}

export const MaintenanceList: FC<MaintenanceListProps> = ({ 
  maintenanceRecords, 
  vehicles, 
  selectedDate,
  onNewMaintenance 
}) => {
  // Helper function to get vehicle data by ID
  const getVehicleById = (id: string) => {
    return vehicles.find(v => v.id === id) || null;
  };
  
  return (
    <div>
      {maintenanceRecords.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-center text-muted-foreground">
              Nenhuma manutenção registrada para {format(selectedDate, 'dd/MM/yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-4">
              Não há registros de manutenções para esta data. Clique no botão abaixo para adicionar uma nova manutenção.
            </p>
            <Button onClick={onNewMaintenance} className="flex gap-2 items-center mt-2">
              <PlusCircle size={16} />
              <span>Nova Manutenção</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              Manutenções de {format(selectedDate, 'dd/MM/yyyy')}
            </h3>
            <Button onClick={onNewMaintenance} className="flex gap-2 items-center">
              <PlusCircle size={16} />
              <span>Nova Manutenção</span>
            </Button>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Hodômetro</TableHead>
                  <TableHead>Custo</TableHead>
                  <TableHead>Fornecedor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceRecords.map((record) => {
                  const vehicle = getVehicleById(record.vehicleId);
                  
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        {vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.plate})` : 'Desconhecido'}
                      </TableCell>
                      <TableCell>
                        {record.maintenanceType === 'preventive' ? 'Preventiva' : 
                         record.maintenanceType === 'corrective' ? 'Corretiva' : 
                         record.maintenanceType === 'roadside' ? 'De Estrada' : 'Outro'}
                      </TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>{record.odometer} km</TableCell>
                      <TableCell>R$ {record.cost.toFixed(2)}</TableCell>
                      <TableCell>{record.provider || '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};
