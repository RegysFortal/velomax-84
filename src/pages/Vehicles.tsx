import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLogbook } from '@/contexts/LogbookContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Vehicle } from '@/types';

const Vehicles = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useLogbook();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    plate: '',
    model: '',
    year: '',
    make: '',
    currentOdometer: 0,
    lastOilChange: 0,
    nextOilChangeKm: 5000,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        plate: editingVehicle.plate,
        model: editingVehicle.model,
        year: editingVehicle.year,
        make: editingVehicle.make,
        currentOdometer: editingVehicle.currentOdometer,
        lastOilChange: editingVehicle.lastOilChange,
        nextOilChangeKm: editingVehicle.nextOilChangeKm,
      });
    } else {
      resetForm();
    }
  }, [editingVehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, {
          ...formData,
          status: formData.status || 'active',
        });
        toast({
          title: "Veículo atualizado",
          description: `O veículo ${formData.plate} foi atualizado com sucesso.`
        });
      } else {
        // Add minimal required fields for a new vehicle
        await addVehicle({
          ...formData,
          status: 'active',
          brand: formData.make, // Set brand to same as make
          type: 'car', // Default type
          fuelType: 'flex', // Default fuel type
        });
        toast({
          title: "Veículo adicionado",
          description: `O veículo ${formData.plate} foi adicionado com sucesso.`
        });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar veículo:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o veículo.",
        variant: "destructive"
      });
    }
  };

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

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVehicle(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      plate: '',
      model: '',
      year: '',
      make: '',
      currentOdometer: 0,
      lastOilChange: 0,
      nextOilChangeKm: 5000,
    });
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
          <Button onClick={() => { setDialogOpen(true); setEditingVehicle(null); }}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Veículo
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">
              Lista de Veículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Odômetro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.plate}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.make}</TableCell>
                    <TableCell>{vehicle.currentOdometer} km</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(vehicle)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(vehicle.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingVehicle ? 'Editar Veículo' : 'Adicionar Veículo'}</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para {editingVehicle ? 'atualizar' : 'adicionar'} um veículo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plate">Placa</Label>
                  <Input
                    type="text"
                    id="plate"
                    name="plate"
                    value={formData.plate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Ano</Label>
                  <Input
                    type="text"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="make">Marca</Label>
                  <Input
                    type="text"
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentOdometer">Odômetro Atual</Label>
                  <Input
                    type="number"
                    id="currentOdometer"
                    name="currentOdometer"
                    value={formData.currentOdometer}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastOilChange">Última Troca de Óleo (km)</Label>
                  <Input
                    type="number"
                    id="lastOilChange"
                    name="lastOilChange"
                    value={formData.lastOilChange}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingVehicle ? 'Salvar' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Vehicles;
