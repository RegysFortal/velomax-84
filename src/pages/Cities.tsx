import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { City } from '@/types';
import { useCities } from '@/contexts/CitiesContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome da cidade deve ter pelo menos 2 caracteres.",
  }),
  state: z.string().length(2, {
    message: "O estado deve ter 2 caracteres.",
  }),
  distance: z.coerce.number().min(0, {
    message: "A distância deve ser um número positivo.",
  }),
});

export default function Cities() {
  const { cities, addCity, updateCity, deleteCity, getCity, loading } = useCities();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | undefined>(undefined);
  
  const { reset, ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      state: "",
      distance: 0,
    },
  });
  
  const handleAddCity = (data: { name: string; state: string; distance: number }) => {
    addCity({
      name: data.name,
      state: data.state,
      distance: data.distance
    });
    setIsAddDialogOpen(false);
    reset();
  };
  
  const handleEditClick = (city: City) => {
    setSelectedCity(city);
    form.setValue("name", city.name);
    form.setValue("state", city.state);
    form.setValue("distance", city.distance);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateCity = (data: { name: string; state: string; distance: number }) => {
    if (selectedCity) {
      updateCity(selectedCity.id, {
        name: data.name,
        state: data.state,
        distance: data.distance
      });
      setIsEditDialogOpen(false);
      reset();
    }
  };
  
  const handleDeleteClick = (city: City) => {
    if (window.confirm(`Tem certeza que deseja excluir a cidade "${city.name}"?`)) {
      deleteCity(city.id);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cidades</h1>
            <p className="text-muted-foreground">
              Gerencie as cidades disponíveis para entregas.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar cidade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar cidade</DialogTitle>
                <DialogDescription>
                  Adicione uma nova cidade à lista.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddCity)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="UF" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="distance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distância (km)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Distância da cidade"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Adicionar</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Cidades</CardTitle>
            <CardDescription>
              Total de {cities.length} cidades cadastradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-350px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Distância</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell className="font-medium">{city.name}</TableCell>
                      <TableCell>{city.state}</TableCell>
                      <TableCell>{city.distance} km</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(city)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(city)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar cidade</DialogTitle>
              <DialogDescription>
                Edite os dados da cidade.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateCity)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="UF" maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distância (km)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Distância da cidade"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Atualizar</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
