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
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { usePriceTables } from '@/contexts/priceTables';
import { useCities } from '@/contexts/CitiesContext';
import { Plus, Edit, Trash2, X, Minus } from 'lucide-react';
import { PriceTable, CustomService, City } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { SearchableSelect } from '@/components/ui/searchable-select';

interface PriceTableFormData extends Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'> {
  metropolitanCityIds?: string[];
  customServices?: CustomService[];
}

const createEmptyPriceTable = (): PriceTableFormData => {
  return {
    name: '',
    description: '',
    minimumRate: {
      standardDelivery: 0,
      emergencyCollection: 0,
      saturdayCollection: 0,
      exclusiveVehicle: 0,
      scheduledDifficultAccess: 0,
      metropolitanRegion: 0,
      sundayHoliday: 0,
      normalBiological: 0,
      infectiousBiological: 0,
      trackedVehicle: 0,
      doorToDoorInterior: 0,
      reshipment: 0,
      customServices: [],
    },
    excessWeight: {
      minPerKg: 0,
      maxPerKg: 0,
      biologicalPerKg: 0,
      reshipmentPerKg: 0,
    },
    doorToDoor: {
      ratePerKm: 0,
      maxWeight: 0,
    },
    waitingHour: {
      standard: 0,
      exclusive: 0,
      fiorino: 0,
      medium: 0,
      large: 0,
    },
    insurance: {
      rate: 0.01,
      standard: 0.01,
    },
    allowCustomPricing: false,
    defaultDiscount: 0,
    metropolitanCities: [],
    metropolitanCityIds: [],
    customServices: [],
  };
};

const PriceTables = () => {
  const { priceTables, addPriceTable, updatePriceTable, deletePriceTable } = usePriceTables();
  const { cities } = useCities();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPriceTable, setEditingPriceTable] = useState<PriceTable | null>(null);
  const [formData, setFormData] = useState<PriceTableFormData>(createEmptyPriceTable());
  const { toast } = useToast();
  const [customServiceDialogOpen, setCustomServiceDialogOpen] = useState(false);
  const [currentCustomService, setCurrentCustomService] = useState<CustomService | null>(null);
  const [customServiceFormData, setCustomServiceFormData] = useState({
    id: '',
    name: '',
    minWeight: 10,
    baseRate: 0,
    excessRate: 0,
    additionalInfo: '',
  });
  const [searchCity, setSearchCity] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [newCityName, setNewCityName] = useState('');

  useEffect(() => {
    if (editingPriceTable) {
      const metropolitanCityIds = editingPriceTable.metropolitanCities || [];
      
      setFormData({
        name: editingPriceTable.name,
        description: editingPriceTable.description || '',
        minimumRate: {
          standardDelivery: editingPriceTable.minimumRate.standardDelivery,
          emergencyCollection: editingPriceTable.minimumRate.emergencyCollection,
          saturdayCollection: editingPriceTable.minimumRate.saturdayCollection,
          exclusiveVehicle: editingPriceTable.minimumRate.exclusiveVehicle,
          scheduledDifficultAccess: editingPriceTable.minimumRate.scheduledDifficultAccess,
          metropolitanRegion: editingPriceTable.minimumRate.metropolitanRegion,
          sundayHoliday: editingPriceTable.minimumRate.sundayHoliday,
          normalBiological: editingPriceTable.minimumRate.normalBiological,
          infectiousBiological: editingPriceTable.minimumRate.infectiousBiological,
          trackedVehicle: editingPriceTable.minimumRate.trackedVehicle,
          doorToDoorInterior: editingPriceTable.minimumRate.doorToDoorInterior,
          reshipment: editingPriceTable.minimumRate.reshipment,
          customServices: editingPriceTable.minimumRate.customServices || [],
        },
        excessWeight: {
          minPerKg: editingPriceTable.excessWeight.minPerKg,
          maxPerKg: editingPriceTable.excessWeight.maxPerKg,
          biologicalPerKg: editingPriceTable.excessWeight.biologicalPerKg,
          reshipmentPerKg: editingPriceTable.excessWeight.reshipmentPerKg,
        },
        doorToDoor: {
          ratePerKm: editingPriceTable.doorToDoor.ratePerKm,
          maxWeight: editingPriceTable.doorToDoor.maxWeight || 0,
        },
        waitingHour: {
          standard: editingPriceTable.waitingHour.standard || 0,
          exclusive: editingPriceTable.waitingHour.exclusive || 0,
          fiorino: editingPriceTable.waitingHour.fiorino || 0,
          medium: editingPriceTable.waitingHour.medium || 0,
          large: editingPriceTable.waitingHour.large || 0,
        },
        insurance: {
          rate: editingPriceTable.insurance.rate || 0.01,
          standard: editingPriceTable.insurance.standard || 0.01,
        },
        allowCustomPricing: editingPriceTable.allowCustomPricing || false,
        defaultDiscount: editingPriceTable.defaultDiscount || 0,
        metropolitanCities: metropolitanCityIds,
        metropolitanCityIds: metropolitanCityIds,
        customServices: editingPriceTable.minimumRate.customServices || [],
      });
      
      setSelectedCities(metropolitanCityIds);
      console.log("Editing price table with metropolitan cities:", metropolitanCityIds);
    } else {
      setFormData(createEmptyPriceTable());
      setSelectedCities([]);
    }
  }, [editingPriceTable]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const inputElem = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? inputElem.checked : undefined;
    
    if (name.startsWith('minimumRate.')) {
      const minimumRateKey = name.split('.')[1] as keyof PriceTableFormData['minimumRate'];
      setFormData(prev => ({
        ...prev,
        minimumRate: {
          ...prev.minimumRate,
          [minimumRateKey]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else if (name.startsWith('excessWeight.')) {
      const excessWeightKey = name.split('.')[1] as keyof PriceTableFormData['excessWeight'];
      setFormData(prev => ({
        ...prev,
        excessWeight: {
          ...prev.excessWeight,
          [excessWeightKey]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else if (name.startsWith('doorToDoor.')) {
      const doorToDoorKey = name.split('.')[1] as keyof PriceTableFormData['doorToDoor'];
      setFormData(prev => ({
        ...prev,
        doorToDoor: {
          ...prev.doorToDoor,
          [doorToDoorKey]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else if (name.startsWith('waitingHour.')) {
      const waitingHourKey = name.split('.')[1] as keyof PriceTableFormData['waitingHour'];
      setFormData(prev => ({
        ...prev,
        waitingHour: {
          ...prev.waitingHour,
          [waitingHourKey]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else if (name.startsWith('insurance.')) {
      const insuranceKey = name.split('.')[1] as keyof PriceTableFormData['insurance'];
      setFormData(prev => ({
        ...prev,
        insurance: {
          ...prev.insurance,
          [insuranceKey]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else if (name === 'allowCustomPricing') {
      setFormData(prev => ({
        ...prev,
        allowCustomPricing: checked,
      }));
    } else if (name === 'defaultDiscount') {
      setFormData(prev => ({
        ...prev,
        defaultDiscount: type === 'number' ? parseFloat(value) : parseFloat(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCustomServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setCustomServiceFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleToggleMetropolitanCity = (cityId: string) => {
    setSelectedCities(prev => {
      const isAlreadySelected = prev.includes(cityId);
      const newSelectedCities = isAlreadySelected
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId];
      
      setFormData(currentFormData => ({
        ...currentFormData,
        metropolitanCityIds: newSelectedCities,
        metropolitanCities: newSelectedCities
      }));
      
      return newSelectedCities;
    });
  };

  const handleCreateNewCity = (cityName: string) => {
    if (!cityName.trim()) {
      toast({
        title: "Nome inválido",
        description: "Por favor, informe um nome de cidade válido.",
        variant: "destructive"
      });
      return;
    }
    
    const tempId = `temp-${cityName.trim()}`;
    
    setSelectedCities(prev => {
      if (prev.some(id => id === tempId)) {
        toast({
          title: "Cidade já adicionada",
          description: `A cidade ${cityName} já está na lista da região metropolitana.`,
        });
        return prev;
      }
      
      const newSelectedCities = [...prev, tempId];
      
      setFormData(currentFormData => ({
        ...currentFormData,
        metropolitanCityIds: newSelectedCities,
        metropolitanCities: newSelectedCities
      }));
      
      toast({
        title: "Cidade adicionada",
        description: `A cidade ${cityName} foi adicionada à região metropolitana.`,
      });
      
      return newSelectedCities;
    });
  };

  const handleEdit = (priceTable: PriceTable) => {
    setEditingPriceTable(priceTable);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePriceTable(id);
      toast({
        title: "Tabela de preços removida",
        description: "A tabela de preços foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao remover tabela de preços:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover a tabela de preços.",
        variant: "destructive",
      });
    }
  };

  const openCustomServiceDialog = (service?: CustomService) => {
    if (service) {
      setCurrentCustomService(service);
      setCustomServiceFormData({
        id: service.id,
        name: service.name,
        minWeight: service.minWeight,
        baseRate: service.baseRate,
        excessRate: service.excessRate,
        additionalInfo: service.additionalInfo || '',
      });
    } else {
      setCurrentCustomService(null);
      setCustomServiceFormData({
        id: Date.now().toString(),
        name: '',
        minWeight: 10,
        baseRate: 0,
        excessRate: 0,
        additionalInfo: '',
      });
    }
    setCustomServiceDialogOpen(true);
  };

  const saveCustomService = () => {
    if (!customServiceFormData.name) {
      toast({
        title: "Erro",
        description: "O nome do serviço é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    const newService: CustomService = {
      id: customServiceFormData.id || Date.now().toString(),
      name: customServiceFormData.name,
      minWeight: customServiceFormData.minWeight,
      baseRate: customServiceFormData.baseRate,
      excessRate: customServiceFormData.excessRate,
      additionalInfo: customServiceFormData.additionalInfo,
    };

    setFormData(prev => {
      const updatedServices = currentCustomService 
        ? (prev.customServices || []).map(s => s.id === newService.id ? newService : s)
        : [...(prev.customServices || []), newService];

      return {
        ...prev,
        customServices: updatedServices,
        minimumRate: {
          ...prev.minimumRate,
          customServices: updatedServices
        }
      };
    });

    setCustomServiceDialogOpen(false);
    toast({
      title: currentCustomService ? "Serviço atualizado" : "Serviço adicionado",
      description: `O serviço foi ${currentCustomService ? "atualizado" : "adicionado"} com sucesso.`,
    });
  };

  const deleteCustomService = (id: string) => {
    setFormData(prev => {
      const updatedServices = (prev.customServices || []).filter(s => s.id !== id);
      
      return {
        ...prev,
        customServices: updatedServices,
        minimumRate: {
          ...prev.minimumRate,
          customServices: updatedServices
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const priceTableData = {
        ...formData,
        metropolitanCities: selectedCities,
        minimumRate: {
          ...formData.minimumRate,
          customServices: formData.customServices,
        },
        waitingHour: {
          standard: formData.waitingHour.standard || 0,
          exclusive: formData.waitingHour.exclusive || 0,
          fiorino: formData.waitingHour.fiorino || 0,
          medium: formData.waitingHour.medium || 0,
          large: formData.waitingHour.large || 0,
        },
        insurance: {
          rate: formData.insurance.standard || 0.01,
          standard: formData.insurance.standard || 0.01,
        }
      };
      
      console.log("Submitting price table with metropolitan cities:", priceTableData.metropolitanCities);
      
      delete (priceTableData as any).metropolitanCityIds;
      delete (priceTableData as any).customServices;
      
      if (editingPriceTable) {
        await updatePriceTable(editingPriceTable.id, priceTableData);
        toast({
          title: "Tabela de preços atualizada",
          description: `A tabela de preços ${formData.name} foi atualizada com sucesso.`,
        });
      } else {
        await addPriceTable(priceTableData);
        toast({
          title: "Tabela de preços adicionada",
          description: `A tabela de preços ${formData.name} foi adicionada com sucesso.`,
        });
      }
      setEditingPriceTable(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar tabela de preços:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a tabela de preços.",
        variant: "destructive",
      });
    }
  };

  const filteredCities = cities.filter(
    city => city.name.toLowerCase().includes(searchCity.toLowerCase())
  );

  const renderMetropolitanCitiesSection = () => (
    <div className="border p-4 rounded-md">
      <h3 className="font-medium mb-4 text-lg">Região Metropolitana</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Selecione as cidades que fazem parte da Região Metropolitana. 
        Você pode adicionar cidades da lista ou incluir novas cidades.
      </p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4">
            <h4 className="text-sm font-medium mb-2">Adicionar Cidade</h4>
            <div className="space-y-4">
              <SearchableSelect
                options={cities
                  .filter(city => !selectedCities.includes(city.id))
                  .map(city => ({
                    value: city.id,
                    label: city.name,
                    description: `${city.state} - ${city.distance} km`
                  }))}
                value=""
                placeholder="Selecionar ou adicionar cidade..."
                onValueChange={(value) => {
                  const city = cities.find(c => c.id === value);
                  if (city) {
                    handleToggleMetropolitanCity(city.id);
                  }
                }}
                emptyMessage="Nenhuma cidade encontrada"
                showCreateOption={true}
                createOptionLabel="Adicionar cidade"
                onCreateNew={handleCreateNewCity}
              />
              
              <div className="mt-2 text-sm text-muted-foreground">
                Exemplos: Caucaia, Maracanaú, Pacajus, etc.
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h4 className="text-sm font-medium mb-2">Cidades Selecionadas</h4>
            {selectedCities.length > 0 ? (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {selectedCities.map(cityId => {
                    const city = cities.find(c => c.id === cityId);
                    const cityName = city 
                      ? city.name 
                      : cityId.startsWith('temp-') 
                        ? cityId.replace('temp-', '')
                        : 'Cidade desconhecida';
                    
                    return (
                      <div key={cityId} className="flex items-center justify-between bg-muted/30 p-2 rounded">
                        <span className="text-sm">{cityName}</span>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleMetropolitanCity(cityId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                Nenhuma cidade selecionada
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tabelas de Preços</h1>
            <p className="text-muted-foreground">
              Gerencie as tabelas de preços para diferentes tipos de serviço.
            </p>
          </div>
          <Button onClick={() => { setIsDialogOpen(true); setEditingPriceTable(null); }}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Tabela
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">
              Lista de Tabelas de Preços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Serviços Personalizados</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceTables.map((priceTable) => (
                  <TableRow key={priceTable.id}>
                    <TableCell className="font-medium">{priceTable.name}</TableCell>
                    <TableCell>{priceTable.description}</TableCell>
                    <TableCell>
                      {priceTable.minimumRate.customServices?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {priceTable.minimumRate.customServices.map((service) => (
                            <Badge key={service.id} variant="outline">{service.name}</Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Nenhum</span>
                      )}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(priceTable)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(priceTable.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <ScrollArea className="h-[80vh]">
              <div className="p-4">
                <DialogHeader>
                  <DialogTitle>{editingPriceTable ? 'Editar Tabela de Preços' : 'Nova Tabela de Preços'}</DialogTitle>
                  <DialogDescription>
                    Configure os valores padrão para esta tabela de preços.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div>
                      <Label htmlFor="name">Nome da Tabela</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-8">
                      <div className="border p-4 rounded-md">
                        <h3 className="font-medium mb-4 text-lg">Tarifas Mínimas</h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-5 gap-2 items-center border-b pb-2">
                              <div className="col-span-2 font-medium">Tipo de Serviço</div>
                              <div className="font-medium">Peso Mínimo</div>
                              <div className="font-medium">Taxa Base (R$)</div>
                              <div className="font-medium">Excedente (R$/kg)</div>
                            </div>
                            
                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2">Entrega Normal em Fortaleza</div>
                              <div>10 kg</div>
                              <Input 
                                id="standardDelivery" 
                                name="minimumRate.standardDelivery" 
                                type="number"
                                step="0.01"
                                value={formData.minimumRate.standardDelivery} 
                                onChange={handleChange}
                              />
                              <Input 
                                id="minPerKg" 
                                name="excessWeight.minPerKg" 
                                type="number"
                                step="0.01"
                                value={formData.excessWeight.minPerKg}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2">Coleta Emergencial em Fortaleza</div>
                              <div>10 kg</div>
                              <Input 
                                id="emergencyCollection" 
                                name="minimumRate.emergencyCollection" 
                                type="number"
                                step="0.01"
                                value={formData.minimumRate.emergencyCollection} 
                                onChange={handleChange}
                              />
                              <Input 
                                id="maxPerKg" 
                                name="excessWeight.maxPerKg" 
                                type="number"
                                step="0.01"
                                value={formData.excessWeight.maxPerKg}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2">Coleta em Fortaleza aos Sábados</div>
                              <div>10 kg</div>
                              <Input 
                                id="saturdayCollection" 
                                name="minimumRate.saturdayCollection" 
                                type="number"
                                step="0.01"
                                value={formData.minimumRate.saturdayCollection} 
                                onChange={handleChange}
                              />
                              <Input 
                                id="maxPerKgSat" 
                                name="excessWeight.maxPerKg" 
                                type="number"
                                step="0.01"
                                value={formData.excessWeight.maxPerKg}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2">Veículo Exclusivo em Fortaleza</div>
                              <div>10 kg</div>
                              <Input 
                                id="exclusiveVehicle" 
                                name="minimumRate.exclusiveVehicle" 
                                type="number"
                                step="0.01"
                                value={formData.minimumRate.exclusiveVehicle} 
                                onChange={handleChange}
                              />
                              <Input 
                                id="maxPerKgExc" 
                                name="excessWeight.maxPerKg" 
                                type="number"
                                step="0.01"
                                value={formData.excessWeight.maxPerKg}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2">Difícil Acesso em Fortaleza</div>
                              <div>10 kg</div>
                              <Input 
                                id="scheduledDifficultAccess" 
                                name="minimumRate.scheduledDifficultAccess" 
                                type="number"
                                step="0.01"
                                value={formData.minimumRate.scheduledDifficultAccess} 
                                onChange={handleChange}
                              />
                              <Input 
                                id="maxPerKgDif" 
                                name="excessWeight.maxPerKg" 
                                type="number"
                                step="0.01"
                                value={formData.excessWeight.maxPerKg}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2">Região Metropolitana</div>
                              <div>10 kg</div>
                              <Input 
                                id="metropolitanRegion" 
                                name="minimumRate.metropolitanRegion" 
                                type="number"
                                step="0.01"
                                value={formData.minimumRate.metropolitanRegion} 
                                onChange={handleChange}
                              />
                               <Input 
                                id="maxPerKgMetro" 
                                name="excessWeight.maxPerKg" 
                                type="number"
                                step="0.01"
                                value={formData.excessWeight.maxPerKg}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2">Domingos/Feriados em Fortaleza</div>
                              <div>10 kg</div>
                              <Input 
                                id="sundayHoliday" 
                                name="minimumRate.sundayHoliday" 
                                type="number"
                                step="0.01"
                                value={formData.minimumRate.sundayHoliday} 
                                onChange={handleChange}
                              />
                              <Input 
                                id="maxPerKgDom" 
                                name="excessWeight.maxPerKg" 
                                type="number"
                                step="0.01"
                                value={formData.excessWeight.maxPerKg}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-5 gap-2 items-center border-b pb-2">
                              <div className="col-span-2 font-medium">Tipo de Serviço</div>
                              <div className="font-medium">Peso Mínimo</div>
                              <div className="font-medium">Taxa Base (R$)</div>
                              <div className="font-medium">Excedente (R$/kg)</div>
                            </div>
                          
                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2">Biológico Normal em Fortaleza</div>
                              <div>10 kg</div>
                              <Input 
                                id="normalBiological" 
                                name="minimumRate.normalBiological" 
                                type="number"
                                step="0.01"
                                value={formData.minimumRate.normalBiological} 
                                onChange={handleChange}
                              />
                              <Input 
                                id="biologicalPerKg" 
                                name="excessWeight.biologicalPerKg" 
                                type="number"
                                step="0.01"
                                value={formData.excessWeight.biologicalPerKg}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2">Biológico Infeccioso em Fortaleza</div>
                              <div>10 kg</div>
                              <Input 
                                id="infectiousBiological" 
                                name="minimumRate.infectiousBiological" 
                                type="number"
                                step="0.01"
                                value={formData.minimumRate.infectiousBiological} 
                                onChange={handleChange}
                              />
                              <Input 
                                id="biologicalPerKgInf" 
                                name="excessWeight.biologicalPerKg" 
                                type="number"
                                step="0.01"
                                value={formData.excessWeight.biologicalPerKg}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2">Veículo Rastreado em Fortaleza</div>
                              <div>100 kg</div>
                              <Input 
                                id="trackedVehicle" 
                                name="minimumRate.trackedVehicle" 
                                type="number"
                                step="0.01"
                                value={formData.minimumRate.trackedVehicle} 
                                onChange={handleChange}
                              />
                              <Input 
                                id="trackedVehicleKg" 
                                name="excessWeight.minPerKg" 
                                type="number"
                                step="0.01"
                                value={formData.excessWeight.minPerKg}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2">Exclusivo Interior</div>
                              <div>100 kg</div>
                              <Input 
                                id="doorToDoorInterior" 
                                name="minimumRate.doorToDoorInterior" 
                                type="number"
                                step="0.01"
                                value={formData.minimumRate.doorToDoorInterior} 
                                onChange={handleChange}
                              />
                              <Input 
                                id="doorToDoorInteriorKg" 
                                name="excessWeight.minPerKg" 
                                type="number"
                                step="0.01"
                                value={formData.excessWeight.minPerKg}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2">Redespacho</div>
                              <div>10 kg</div>
                              <Input 
                                id="reshipment" 
                                name="minimumRate.reshipment" 
                                type="number"
                                step="0.01"
                                value={formData.minimumRate.reshipment} 
                                onChange={handleChange}
                              />
                              <Input 
                                id="reshipmentKg" 
                                name="excessWeight.reshipmentPerKg" 
                                type="number"
                                step="0.01"
                                value={formData.excessWeight.reshipmentPerKg}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-md">
                        <h3 className="font-medium mb-4 text-lg">Porta a Porta Interior</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="ratePerKm">Taxa por Km (Porta a Porta Interior)</Label>
                            <Input
                              id="ratePerKm"
                              name="doorToDoor.ratePerKm"
                              type="number"
                              step="0.01"
                              value={formData.doorToDoor.ratePerKm}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maxWeight">Peso Máximo (Porta a Porta Interior)</Label>
                            <Input
                              id="maxWeight"
                              name="doorToDoor.maxWeight"
                              type="number"
                              step="0.01"
                              value={formData.doorToDoor.maxWeight}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-4 rounded-md">
                        <h3 className="font-medium mb-4 text-lg">Hora Parada</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fiorino">Veículo Pequeno (R$/hora)</Label>
                            <Input
                              id="fiorino"
                              name="waitingHour.fiorino"
                              type="number"
                              step="0.01"
                              value={formData.waitingHour.fiorino}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="medium">Veículo Médio (R$/hora)</Label>
                            <Input
                              id="medium"
                              name="waitingHour.medium"
                              type="number"
                              step="0.01"
                              value={formData.waitingHour.medium}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="large">Veículo Grande (R$/hora)</Label>
                            <Input
                              id="large"
                              name="waitingHour.large"
                              type="number"
                              step="0.01"
                              value={formData.waitingHour.large}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-4 rounded-md">
                        <h3 className="font-medium mb-4 text-lg">Seguro (% sobre valor da mercadoria)</h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="standard">Taxa de Seguro (%)</Label>
                            <Input
                              id="standard"
                              name="insurance.standard"
                              type="number"
                              step="0.001"
                              value={formData.insurance.standard}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-4 rounded-md">
                        <h3 className="font-medium mb-4 text-lg">Configurações Adicionais</h3>
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="allowCustomPricing"
                              name="allowCustomPricing"
                              checked={formData.allowCustomPricing}
                              onCheckedChange={(checked) => {
                                setFormData(prev => ({
                                  ...prev,
                                  allowCustomPricing: !!checked
                                }));
                              }}
                            />
                            <Label htmlFor="allowCustomPricing">Permitir preços customizados</Label>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="defaultDiscount">Desconto padrão (%)</Label>
                            <Input
                              id="defaultDiscount"
                              name="defaultDiscount"
                              type="number"
                              step="0.01"
                              value={formData.defaultDiscount}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-4 rounded-md">
                        {renderMetropolitanCitiesSection()}
                      </div>
                    </div>
                  </ScrollArea>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingPriceTable ? 'Atualizar' : 'Criar'} Tabela
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Dialog open={customServiceDialogOpen} onOpenChange={setCustomServiceDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {currentCustomService ? 'Editar Serviço Personalizado' : 'Adicionar Serviço Personalizado'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Serviço</Label>
                <Input
                  id="name"
                  name="name"
                  value={customServiceFormData.name}
                  onChange={handleCustomServiceChange}
                  placeholder="Ex: Transporte de Frágeis"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minWeight">Peso Mínimo (kg)</Label>
                  <Input
                    id="minWeight"
                    name="minWeight"
                    type="number"
                    step="0.1"
                    value={customServiceFormData.minWeight}
                    onChange={handleCustomServiceChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseRate">Taxa Base (R$)</Label>
                  <Input
                    id="baseRate"
                    name="baseRate"
                    type="number"
                    step="0.01"
                    value={customServiceFormData.baseRate}
                    onChange={handleCustomServiceChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excessRate">Taxa Excedente (R$/kg)</Label>
                <Input
                  id="excessRate"
                  name="excessRate"
                  type="number"
                  step="0.01"
                  value={customServiceFormData.excessRate}
                  onChange={handleCustomServiceChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Informações Adicionais</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={customServiceFormData.additionalInfo}
                  onChange={handleCustomServiceChange}
                  placeholder="Informações adicionais sobre este serviço..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCustomServiceDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={saveCustomService}>
                {currentCustomService ? 'Atualizar' : 'Adicionar'} Serviço
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default PriceTables;
