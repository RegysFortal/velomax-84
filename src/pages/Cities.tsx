import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCities } from '@/contexts/CitiesContext';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from "sonner";

export default function Cities() {
  const { cities, addCity, updateCity, deleteCity } = useCities();
  const [newCity, setNewCity] = useState({ name: '', distance: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleAddCity = () => {
    const formattedCityData = {
      name: newCity.name,
      state: 'CE', // Adding default state, you may want to make this dynamic
      distance: parseFloat(newCity.distance),
    };

    addCity(formattedCityData);
    setNewCity({ name: '', distance: '' });
    setShowAddForm(false);
  };

  const handleEditCity = (city) => {
    setSelectedCity({ ...city });
    setShowEditForm(true);
  };

  const handleUpdateCity = () => {
    if (!selectedCity) return;
    updateCity(selectedCity.id, {
      name: selectedCity.name,
      distance: parseFloat(selectedCity.distance),
    });
    setShowEditForm(false);
    setSelectedCity(null);
  };

  const handleDeleteCity = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta cidade?')) {
      deleteCity(id);
      toast.success("Cidade excluída com sucesso");
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Cidades</h1>
          <Button onClick={() => setShowAddForm(true)}>Adicionar Cidade</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Cidades</CardTitle>
            <CardDescription>
              Gerencie as cidades disponíveis para entregas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Distância (km)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell>{city.name}</TableCell>
                    <TableCell>{city.distance} km</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCity(city)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCity(city.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add City Dialog */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Cidade</DialogTitle>
              <DialogDescription>
                Adicione uma nova cidade para calcular as taxas de entrega.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Nome
                </label>
                <Input
                  id="name"
                  value={newCity.name}
                  onChange={(e) =>
                    setNewCity({ ...newCity, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="distance" className="text-right">
                  Distância (km)
                </label>
                <Input
                  id="distance"
                  value={newCity.distance}
                  onChange={(e) =>
                    setNewCity({ ...newCity, distance: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCity}>Adicionar</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit City Dialog */}
        <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Cidade</DialogTitle>
              <DialogDescription>
                Edite os detalhes da cidade selecionada.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="editName" className="text-right">
                  Nome
                </label>
                <Input
                  id="editName"
                  value={selectedCity?.name || ''}
                  onChange={(e) =>
                    setSelectedCity({ ...selectedCity, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="editDistance" className="text-right">
                  Distância (km)
                </label>
                <Input
                  id="editDistance"
                  value={selectedCity?.distance || ''}
                  onChange={(e) =>
                    setSelectedCity({
                      ...selectedCity,
                      distance: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setShowEditForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateCity}>Atualizar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
