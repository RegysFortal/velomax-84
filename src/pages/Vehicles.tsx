
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogbook } from '@/contexts/LogbookContext';
import { Vehicle } from '@/types';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, Search, Truck } from 'lucide-react';

const formSchema = z.object({
  plate: z.string().min(7, "A placa deve ter no mínimo 7 caracteres"),
  model: z.string().min(2, "O modelo deve ter no mínimo 2 caracteres"),
  year: z.string().min(4, "O ano deve ter 4 dígitos"),
  make: z.string().min(2, "A marca deve ter no mínimo 2 caracteres"),
  currentOdometer: z.coerce.number().nonnegative(),
  lastOilChange: z.coerce.number().nonnegative(),
  nextOilChangeKm: z.coerce.number().nonnegative(),
});

type FormValues = z.infer<typeof formSchema>;

const Vehicles = () => {
  const { vehicles, addVehicle, updateVehicle } = useLogbook();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate: '',
      model: '',
      year: '',
      make: '',
      currentOdometer: 0,
      lastOilChange: 0,
      nextOilChangeKm: 0,
    },
  });

  // Filtrar veículos com base no termo de pesquisa
  const filteredVehicles = vehicles.filter(
    vehicle =>
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    form.reset({
      plate: vehicle.plate,
      model: vehicle.model,
      year: vehicle.year,
      make: vehicle.make,
      currentOdometer: vehicle.currentOdometer,
      lastOilChange: vehicle.lastOilChange,
      nextOilChangeKm: vehicle.nextOilChangeKm,
    });
    setIsAddDialogOpen(true);
  };

  const onCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingVehicle(null);
    form.reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, data);
        toast({
          title: "Veículo atualizado",
          description: `As informações de ${data.plate} foram atualizadas.`,
        });
      } else {
        // Ensure all required properties are explicitly passed
        await addVehicle({
          plate: data.plate,
          model: data.model,
          year: data.year,
          make: data.make,
          currentOdometer: data.currentOdometer,
          lastOilChange: data.lastOilChange,
          nextOilChangeKm: data.nextOilChangeKm
        });
        toast({
          title: "Veículo adicionado",
          description: `${data.plate} foi adicionado com sucesso.`,
        });
      }
      onCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar veículo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o veículo.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Veículos</h1>
            <p className="text-muted-foreground">
              Gerenciamento de veículos da frota.
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo veículo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingVehicle ? "Editar veículo" : "Adicionar novo veículo"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do veículo e clique em salvar.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="plate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Placa</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC-1234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo</FormLabel>
                          <FormControl>
                            <Input placeholder="Fiorino" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca</FormLabel>
                          <FormControl>
                            <Input placeholder="Fiat" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ano</FormLabel>
                          <FormControl>
                            <Input placeholder="2020" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentOdometer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Odômetro atual (km)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastOilChange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Km da última troca de óleo</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nextOilChangeKm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Km para próxima troca de óleo</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={onCloseDialog}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingVehicle ? "Atualizar" : "Salvar"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Pesquisar por placa, modelo ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Truck className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {searchTerm ? "Nenhum veículo encontrado." : "Nenhum veículo cadastrado."}
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar novo veículo
            </Button>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Odômetro</TableHead>
                  <TableHead>Última troca de óleo</TableHead>
                  <TableHead>Próxima troca em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.plate}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.make}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.currentOdometer} km</TableCell>
                    <TableCell>{vehicle.lastOilChange} km</TableCell>
                    <TableCell>
                      <span className={vehicle.nextOilChangeKm - vehicle.currentOdometer < 1000 ? "text-red-500 font-medium" : ""}>
                        {vehicle.nextOilChangeKm - vehicle.currentOdometer} km
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(vehicle)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Vehicles;
