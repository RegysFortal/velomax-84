import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { ScrollArea } from '@/components/ui/scroll-area';
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
    status: 'active' as 'active' | 'maintenance' | 'inactive',
    brand: '',
    type: 'car' as 'car' | 'motorcycle' | 'truck' | 'van',
    fuelType: 'flex' as 'gasoline' | 'diesel' | 'ethanol' | 'flex' | 'electric',
    renavam: '',
    chassis: '',
    capacity: 0,
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
        status: editingVehicle.status || 'active',
        brand: editingVehicle.brand,
        type: editingVehicle.type,
        fuelType: editingVehicle.fuelType,
        renavam: editingVehicle.renavam || '',
        chassis: editingVehicle.chassis || '',
        capacity: editingVehicle.capacity || 0,
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
        });
        toast({
          title: "Veículo atualizado",
          description: `O veículo ${formData.plate} foi atualizado com sucesso.`
        });
      } else {
        await addVehicle({
          ...formData,
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
      status: 'active',
      brand: '',
      type: 'car',
      fuelType: 'flex',
      renavam: '',
      chassis: '',
      capacity: 0,
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
                  <TableHead>Renavam</TableHead>
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
                    <TableCell>{vehicle.renavam || '-'}</TableCell>
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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingVehicle ? 'Editar Veículo' : 'Adicionar Veículo'}</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para {editingVehicle ? 'atualizar' : 'adicionar'} um veículo.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[70vh] pr-4">
              <form onSubmit={handleSubmit} className="grid gap-4 py-4 pr-2">
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
                    <Label htmlFor="renavam">RENAVAM</Label>
                    <Input
                      type="text"
                      id="renavam"
                      name="renavam"
                      value={formData.renavam}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="chassis">Chassi</Label>
                    <Input
                      type="text"
                      id="chassis"
                      name="chassis"
                      value={formData.chassis}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Fabricante</Label>
                    <Input
                      type="text"
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange('type', value as 'car' | 'motorcycle' | 'truck' | 'van')}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Carro</SelectItem>
                        <SelectItem value="motorcycle">Moto</SelectItem>
                        <SelectItem value="truck">Caminhão</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fuelType">Combustível</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) => handleSelectChange('fuelType', value as 'gasoline' | 'diesel' | 'ethanol' | 'flex' | 'electric')}
                    >
                      <SelectTrigger id="fuelType">
                        <SelectValue placeholder="Selecione o combustível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gasoline">Gasolina</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="ethanol">Etanol</SelectItem>
                        <SelectItem value="flex">Flex</SelectItem>
                        <SelectItem value="electric">Elétrico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value as 'active' | 'maintenance' | 'inactive')}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="maintenance">Em manutenção</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nextOilChangeKm">Próxima Troca de Óleo (km)</Label>
                    <Input
                      type="number"
                      id="nextOilChangeKm"
                      name="nextOilChangeKm"
                      value={formData.nextOilChangeKm}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacidade (kg)</Label>
                    <Input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
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
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Vehicles;
