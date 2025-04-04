import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { useLogbook } from '@/contexts/LogbookContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Car, Wrench, CarFront, History, Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { format } from 'date-fns';
import { Maintenance as MaintenanceType } from '@/types';

const MaintenanceRegistrationForm = ({ 
  onComplete, 
  vehicles, 
  maintenance = null 
}: { 
  onComplete: () => void, 
  vehicles: any[], 
  maintenance?: MaintenanceType | null 
}) => {
  const { addMaintenance, updateMaintenance } = useLogbook();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    vehicleId: maintenance?.vehicleId || '',
    date: maintenance?.date || format(new Date(), 'yyyy-MM-dd'),
    type: maintenance?.type || '',
    description: maintenance?.description || '',
    cost: maintenance?.cost.toString() || '',
    odometerKm: maintenance?.odometerKm.toString() || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const maintenanceData = {
        vehicleId: formData.vehicleId,
        date: formData.date,
        type: formData.type,
        description: formData.description,
        cost: parseFloat(formData.cost),
        odometerKm: parseInt(formData.odometerKm),
      };
      
      if (maintenance) {
        await updateMaintenance(maintenance.id, maintenanceData);
        toast({
          title: "Manutenção atualizada",
          description: "O registro de manutenção foi atualizado com sucesso."
        });
      } else {
        await addMaintenance(maintenanceData);
        toast({
          title: "Manutenção registrada",
          description: "O registro de manutenção foi adicionado com sucesso."
        });
      }
      
      onComplete();
    } catch (error) {
      console.error('Erro ao salvar manutenção:', error);
      toast({
        title: "Erro",
        description: "Houve um erro ao salvar o registro de manutenção.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleId">Veículo</Label>
          <Select
            value={formData.vehicleId}
            onValueChange={(value) => handleSelectChange('vehicleId', value)}
            required
          >
            <SelectTrigger id="vehicleId">
              <SelectValue placeholder="Selecione um veículo" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.plate} - {vehicle.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Manutenção</Label>
          <Input
            id="type"
            name="type"
            placeholder="Ex: Troca de óleo, Revisão, Reparo, etc."
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="odometerKm">Odômetro (km)</Label>
          <Input
            id="odometerKm"
            name="odometerKm"
            type="number"
            value={formData.odometerKm}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Descreva o serviço realizado..."
          value={formData.description}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost">Custo (R$)</Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          step="0.01"
          value={formData.cost}
          onChange={handleChange}
          required
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancelar
        </Button>
        <Button type="submit">
          {maintenance ? 'Atualizar' : 'Registrar'} Manutenção
        </Button>
      </DialogFooter>
    </form>
  );
};

const Maintenance = () => {
  const { vehicles, maintenances } = useLogbook();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredMaintenances = maintenances.filter(maintenance => {
    const vehicle = vehicles.find(v => v.id === maintenance.vehicleId);
    const vehiclePlate = vehicle ? vehicle.plate.toLowerCase() : '';
    const searchLower = searchTerm.toLowerCase();
    
    return (
      maintenance.type.toLowerCase().includes(searchLower) ||
      maintenance.description.toLowerCase().includes(searchLower) ||
      vehiclePlate.includes(searchLower)
    );
  });

  const handleAddNew = () => {
    setSelectedMaintenance(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (maintenance: MaintenanceType) => {
    setSelectedMaintenance(maintenance);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedMaintenance(null);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manutenções</h1>
            <p className="text-muted-foreground">
              Gerencie manutenções, trocas de óleo e pneus da frota.
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Manutenção
          </Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="oil">Trocas de Óleo</TabsTrigger>
            <TabsTrigger value="tires">Pneus</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{vehicle.plate}</CardTitle>
                    <CardDescription>{vehicle.model} ({vehicle.year})</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Odômetro:</dt>
                        <dd className="font-medium">{vehicle.currentOdometer} km</dd>
                      </div>
                      
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Última troca de óleo:</dt>
                        <dd className="font-medium">{vehicle.lastOilChange} km</dd>
                      </div>
                      
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Próxima troca em:</dt>
                        <dd className={`font-medium ${vehicle.nextOilChangeKm - vehicle.currentOdometer < 1000 ? "text-destructive" : ""}`}>
                          {vehicle.nextOilChangeKm - vehicle.currentOdometer} km
                        </dd>
                      </div>
                    </dl>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full flex items-center gap-1"
                        onClick={() => {
                          setSelectedMaintenance(null);
                          setIsDialogOpen(true);
                          setSelectedMaintenance({ 
                            id: '', 
                            vehicleId: vehicle.id,
                            date: format(new Date(), 'yyyy-MM-dd'),
                            type: '',
                            description: '',
                            cost: 0,
                            odometerKm: vehicle.currentOdometer,
                            createdAt: '',
                            updatedAt: ''
                          });
                        }}
                      >
                        <Wrench className="h-4 w-4" />
                        <span>Manutenção</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full flex items-center gap-1"
                        onClick={() => {
                          setSelectedMaintenance(null);
                          setIsDialogOpen(true);
                          setSelectedMaintenance({ 
                            id: '', 
                            vehicleId: vehicle.id,
                            date: format(new Date(), 'yyyy-MM-dd'),
                            type: 'Troca de Pneu',
                            description: '',
                            cost: 0,
                            odometerKm: vehicle.currentOdometer,
                            createdAt: '',
                            updatedAt: ''
                          });
                        }}
                      >
                        <Car className="h-4 w-4" />
                        <span>Pneu</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Manutenções Recentes</h2>
                <Input
                  placeholder="Pesquisar manutenções..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              
              {maintenances.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <Wrench className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">Nenhuma manutenção registrada.</p>
                    <Button variant="outline" className="mt-4" onClick={handleAddNew}>
                      Registrar manutenção
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Veículo</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Odômetro</TableHead>
                          <TableHead>Custo</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMaintenances.map((maintenance) => {
                          const vehicle = vehicles.find(v => v.id === maintenance.vehicleId);
                          return (
                            <TableRow key={maintenance.id}>
                              <TableCell>{vehicle ? vehicle.plate : 'N/A'}</TableCell>
                              <TableCell>{maintenance.date}</TableCell>
                              <TableCell>{maintenance.type}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{maintenance.description}</TableCell>
                              <TableCell>{maintenance.odometerKm} km</TableCell>
                              <TableCell>R$ {maintenance.cost.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(maintenance)}>
                                  Editar
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="oil" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Trocas de Óleo</CardTitle>
                <CardDescription>
                  Controle de trocas de óleo por veículo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Próximas trocas</h3>
                    <Button variant="outline" onClick={handleAddNew}>
                      <Plus className="mr-2 h-4 w-4" />
                      Registrar troca
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Odômetro Atual</TableHead>
                        <TableHead>Última Troca</TableHead>
                        <TableHead>Próxima Troca</TableHead>
                        <TableHead>Restante</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicles.map((vehicle) => {
                        const remaining = vehicle.nextOilChangeKm - vehicle.currentOdometer;
                        return (
                          <TableRow key={vehicle.id}>
                            <TableCell className="font-medium">{vehicle.plate} - {vehicle.model}</TableCell>
                            <TableCell>{vehicle.currentOdometer} km</TableCell>
                            <TableCell>{vehicle.lastOilChange} km</TableCell>
                            <TableCell>{vehicle.nextOilChangeKm} km</TableCell>
                            <TableCell>
                              <span className={remaining < 1000 ? "text-destructive font-medium" : ""}>
                                {remaining} km
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedMaintenance({
                                    id: '',
                                    vehicleId: vehicle.id,
                                    date: format(new Date(), 'yyyy-MM-dd'),
                                    type: 'Troca de Óleo',
                                    description: 'Troca de óleo periódica.',
                                    cost: 0,
                                    odometerKm: vehicle.currentOdometer,
                                    createdAt: '',
                                    updatedAt: ''
                                  });
                                  setIsDialogOpen(true);
                                }}
                              >
                                Registrar Troca
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tires" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Controle de Pneus</CardTitle>
                <CardDescription>
                  Gerencie as trocas e rodízio de pneus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Car className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">A funcionalidade de controle de pneus será implementada em breve.</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    toast({
                      title: "Em desenvolvimento",
                      description: "Esta funcionalidade será implementada em breve.",
                    });
                  }}>
                    Registrar troca de pneu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Histórico de Manutenções</CardTitle>
                    <CardDescription>
                      Histórico completo de manutenções por veículo
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Pesquisar manutenções..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-60"
                    />
                    <Button variant="outline" onClick={handleAddNew}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Manutenção
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredMaintenances.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <History className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      {searchTerm ? "Nenhuma manutenção encontrada para esta pesquisa." : "Nenhuma manutenção registrada ainda."}
                    </p>
                    {!searchTerm && (
                      <Button variant="outline" className="mt-4" onClick={handleAddNew}>
                        Registrar primeira manutenção
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Odômetro</TableHead>
                        <TableHead>Custo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaintenances.map((maintenance) => {
                        const vehicle = vehicles.find(v => v.id === maintenance.vehicleId);
                        return (
                          <TableRow key={maintenance.id}>
                            <TableCell>{vehicle ? vehicle.plate : 'N/A'}</TableCell>
                            <TableCell>{maintenance.date}</TableCell>
                            <TableCell>{maintenance.type}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{maintenance.description}</TableCell>
                            <TableCell>{maintenance.odometerKm} km</TableCell>
                            <TableCell>R$ {maintenance.cost.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(maintenance)}>
                                Editar
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedMaintenance && selectedMaintenance.id 
                ? "Editar Manutenção" 
                : "Registrar Nova Manutenção"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da manutenção realizada.
            </DialogDescription>
          </DialogHeader>
          <MaintenanceRegistrationForm 
            onComplete={handleDialogClose}
            vehicles={vehicles}
            maintenance={selectedMaintenance}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Maintenance;
