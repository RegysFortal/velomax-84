
import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLogbook } from '@/contexts/LogbookContext';
import { Plus } from 'lucide-react';
import { Vehicle } from '@/types';
import { 
  VehicleDialog, 
  VehicleListCard 
} from '@/components/vehicle';

const Vehicles = () => {
  const { vehicles, deleteVehicle } = useLogbook();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteVehicle(id);
      toast({
        title: "Veículo removido",
        description: "O veículo foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao remover veículo:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o veículo.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    setDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Veículos</h1>
            <p className="text-muted-foreground">
              Gerencie a frota de veículos da sua empresa.
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Veículo
          </Button>
        </div>

        <VehicleListCard 
          vehicles={vehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <VehicleDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingVehicle={editingVehicle}
        />
      </div>
    </AppLayout>
  );
};

export default Vehicles;
