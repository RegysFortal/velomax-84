
import { useState } from 'react';
import { useLogbook } from '@/contexts/LogbookContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { TireMaintenanceForm } from './TireMaintenanceForm';
import { toast } from "sonner";

export function TireMaintenanceList() {
  const { vehicles, tireMaintenance, deleteTireMaintenance } = useLogbook();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<any>(null);

  const getVehicleData = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.plate} - ${vehicle.model}` : 'Veículo não encontrado';
  };

  const getMaintenanceTypeLabel = (type: string) => {
    switch (type) {
      case 'replacement': return 'Troca de Pneu';
      case 'puncture': return 'Pneu Furado';
      case 'purchase': return 'Compra de Pneu';
      default: return type;
    }
  };

  const getTirePositionLabel = (position: string) => {
    switch (position) {
      case 'frontLeft': return 'Dianteiro Esquerdo';
      case 'frontRight': return 'Dianteiro Direito';
      case 'rearLeft': return 'Traseiro Esquerdo';
      case 'rearRight': return 'Traseiro Direito';
      case 'spare': return 'Estepe';
      case 'other': return 'Outro';
      default: return position || '-';
    }
  };

  const handleAdd = () => {
    setEditingMaintenance(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (maintenance: any) => {
    setEditingMaintenance(maintenance);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await deleteTireMaintenance(id);
        toast.success('Registro excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir registro:', error);
        toast.error('Erro ao excluir registro');
      }
    }
  };

  const handleComplete = () => {
    setIsDialogOpen(false);
    setEditingMaintenance(null);
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manutenção de Pneus</CardTitle>
          <CardDescription>
            Registros de trocas, furos e compras de pneus
          </CardDescription>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Registro
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Veículo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Posição</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tireMaintenance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              tireMaintenance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{getVehicleData(record.vehicleId)}</TableCell>
                  <TableCell>
                    {format(new Date(record.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>{getMaintenanceTypeLabel(record.maintenanceType)}</TableCell>
                  <TableCell>{getTirePositionLabel(record.tirePosition)}</TableCell>
                  <TableCell>{record.tireSize || '-'}</TableCell>
                  <TableCell>{record.brand || '-'}</TableCell>
                  <TableCell>{formatCurrency(record.cost)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(record)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingMaintenance ? 'Editar Registro de Manutenção' : 'Novo Registro de Manutenção'}
            </DialogTitle>
          </DialogHeader>
          <TireMaintenanceForm
            maintenance={editingMaintenance}
            onComplete={handleComplete}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
