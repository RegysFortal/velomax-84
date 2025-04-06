
import { useState } from 'react';
import { useLogbook } from '@/contexts/LogbookContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Trash2, Plus } from 'lucide-react';
import { GeneralMaintenanceForm } from './GeneralMaintenanceForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Vehicle, Maintenance } from '@/types';

export function GeneralMaintenanceList() {
  const { maintenanceRecords, deleteMaintenance, vehicles } = useLogbook();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);

  const handleEdit = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedMaintenance(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMaintenance(id);
  };

  const getVehiclePlate = (vehicleId: string): string => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.plate : 'N/A';
  };

  const formatMaintenanceType = (type: string): string => {
    const types: Record<string, string> = {
      oil_change: 'Troca de Óleo',
      brakes: 'Freios',
      tires: 'Pneus',
      engine: 'Motor',
      transmission: 'Transmissão',
      filters: 'Filtros',
      electrical: 'Elétrico',
      cooling: 'Arrefecimento',
      suspension: 'Suspensão',
      other: 'Outro'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manutenções Gerais</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Manutenção
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Histórico de Manutenções</CardTitle>
          <CardDescription>
            Gerencie todas as manutenções realizadas nos veículos da frota.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {maintenanceRecords && maintenanceRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Odômetro</TableHead>
                  <TableHead>Custo (R$)</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceRecords.map((maintenance) => (
                  <TableRow key={maintenance.id}>
                    <TableCell>{getVehiclePlate(maintenance.vehicleId)}</TableCell>
                    <TableCell>
                      {format(new Date(maintenance.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>{formatMaintenanceType(maintenance.maintenanceType)}</TableCell>
                    <TableCell>{maintenance.description}</TableCell>
                    <TableCell>{maintenance.odometer} km</TableCell>
                    <TableCell>{maintenance.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(maintenance)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(maintenance.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              Nenhuma manutenção registrada. Clique em "Nova Manutenção" para adicionar.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedMaintenance ? 'Editar Manutenção' : 'Nova Manutenção'}
            </DialogTitle>
          </DialogHeader>
          <GeneralMaintenanceForm 
            maintenance={selectedMaintenance} 
            onComplete={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
