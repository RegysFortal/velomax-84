
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
import { usePriceTables } from '@/contexts/priceTables';
import { useCities } from '@/contexts/CitiesContext';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { PriceTable, CustomService, City } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface PriceTableFormData extends Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'> {
  metropolitanCityIds?: string[];
  customServices?: CustomService[];
}

// Helper function for creating an empty price table
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
      perishable: 0.015,
    },
    allowCustomPricing: false,
    defaultDiscount: 0,
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

  useEffect(() => {
    if (editingPriceTable) {
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
          perishable: editingPriceTable.insurance.perishable || 0.015,
        },
        allowCustomPricing: editingPriceTable.allowCustomPricing || false,
        defaultDiscount: editingPriceTable.defaultDiscount || 0,
        metropolitanCityIds: editingPriceTable.metropolitanCities || [],
        customServices: editingPriceTable.minimumRate.customServices || [],
      });
    } else {
      setFormData(createEmptyPriceTable());
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
    setFormData(prev => {
      const currentIds = prev.metropolitanCityIds || [];
      
      if (currentIds.includes(cityId)) {
        return {
          ...prev,
          metropolitanCityIds: currentIds.filter(id => id !== cityId)
        };
      } else {
        return {
          ...prev,
          metropolitanCityIds: [...currentIds, cityId]
        };
      }
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

      // Também atualize em minimumRate.customServices
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
      // Prepare data for submission
      const priceTableData = {
        ...formData,
        metropolitanCities: formData.metropolitanCityIds,
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
          perishable: formData.insurance.perishable || 0.015,
        }
      };
      
      // Remove temporary fields
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
                        <span className="text-muted-foreground text-sm">Nenhum</span>
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

        {/* Diálogo principal da tabela de preços */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <Tabs defaultValue="tarifas">
                    <TabsList className="grid grid-cols-5">
                      <TabsTrigger value="tarifas">Tarifas Mínimas</TabsTrigger>
                      <TabsTrigger value="peso">Excesso de Peso</TabsTrigger>
                      <TabsTrigger value="adicionais">Valores Adicionais</TabsTrigger>
                      <TabsTrigger value="cidades">Região Metropolitana</TabsTrigger>
                      <TabsTrigger value="servicos">Serviços Personalizados</TabsTrigger>
                    </TabsList>
                    
                    {/* Aba de Tarifas Mínimas */}
                    <TabsContent value="tarifas" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="standardDelivery">Entrega Normal em Fortaleza (até 10kg)</Label>
                          <Input 
                            id="standardDelivery" 
                            name="minimumRate.standardDelivery" 
                            type="number"
                            step="0.01"
                            value={formData.minimumRate.standardDelivery} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyCollection">Coleta Emergencial em Fortaleza (até 10kg)</Label>
                          <Input 
                            id="emergencyCollection" 
                            name="minimumRate.emergencyCollection" 
                            type="number"
                            step="0.01"
                            value={formData.minimumRate.emergencyCollection} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="saturdayCollection">Coleta em Fortaleza aos Sábados (até 10kg)</Label>
                          <Input 
                            id="saturdayCollection" 
                            name="minimumRate.saturdayCollection" 
                            type="number"
                            step="0.01"
                            value={formData.minimumRate.saturdayCollection} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="exclusiveVehicle">Veículo Exclusivo em Fortaleza (até 10kg)</Label>
                          <Input 
                            id="exclusiveVehicle" 
                            name="minimumRate.exclusiveVehicle" 
                            type="number"
                            step="0.01"
                            value={formData.minimumRate.exclusiveVehicle} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="scheduledDifficultAccess">Difícil Acesso em Fortaleza (até 10kg)</Label>
                          <Input 
                            id="scheduledDifficultAccess" 
                            name="minimumRate.scheduledDifficultAccess" 
                            type="number"
                            step="0.01"
                            value={formData.minimumRate.scheduledDifficultAccess} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="metropolitanRegion">Região Metropolitana (até 10kg)</Label>
                          <Input 
                            id="metropolitanRegion" 
                            name="minimumRate.metropolitanRegion" 
                            type="number"
                            step="0.01"
                            value={formData.minimumRate.metropolitanRegion} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sundayHoliday">Domingos/Feriados em Fortaleza (até 10kg)</Label>
                          <Input 
                            id="sundayHoliday" 
                            name="minimumRate.sundayHoliday" 
                            type="number"
                            step="0.01"
                            value={formData.minimumRate.sundayHoliday} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="normalBiological">Biológico Normal em Fortaleza (até 10kg)</Label>
                          <Input 
                            id="normalBiological" 
                            name="minimumRate.normalBiological" 
                            type="number"
                            step="0.01"
                            value={formData.minimumRate.normalBiological} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="infectiousBiological">Biológico Infeccioso em Fortaleza (até 10kg)</Label>
                          <Input 
                            id="infectiousBiological" 
                            name="minimumRate.infectiousBiological" 
                            type="number"
                            step="0.01"
                            value={formData.minimumRate.infectiousBiological} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="trackedVehicle">Veículo Rastreado em Fortaleza (até 100kg)</Label>
                          <Input 
                            id="trackedVehicle" 
                            name="minimumRate.trackedVehicle" 
                            type="number"
                            step="0.01"
                            value={formData.minimumRate.trackedVehicle} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="doorToDoorInterior">Exclusivo Interior (até 100kg)</Label>
                          <Input 
                            id="doorToDoorInterior" 
                            name="minimumRate.doorToDoorInterior" 
                            type="number"
                            step="0.01"
                            value={formData.minimumRate.doorToDoorInterior} 
                            onChange={handleChange}
                          />
                          <p className="text-xs text-muted-foreground">Cobrado por km rodado</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reshipment">Redespacho (até 10kg + 1% do valor da NF)</Label>
                          <Input 
                            id="reshipment" 
                            name="minimumRate.reshipment" 
                            type="number"
                            step="0.01"
                            value={formData.minimumRate.reshipment} 
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Aba de Excesso de Peso */}
                    <TabsContent value="peso" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="minPerKg">Valor por Kg Excedente (Normal)</Label>
                          <Input
                            id="minPerKg"
                            name="excessWeight.minPerKg"
                            type="number"
                            step="0.01"
                            value={formData.excessWeight.minPerKg}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxPerKg">Valor por Kg Excedente (Emergencial/Exclusivo)</Label>
                          <Input
                            id="maxPerKg"
                            name="excessWeight.maxPerKg"
                            type="number"
                            step="0.01"
                            value={formData.excessWeight.maxPerKg}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="biologicalPerKg">Valor por Kg Excedente (Material Biológico)</Label>
                          <Input
                            id="biologicalPerKg"
                            name="excessWeight.biologicalPerKg"
                            type="number"
                            step="0.01"
                            value={formData.excessWeight.biologicalPerKg}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reshipmentPerKg">Valor por Kg Excedente (Redespacho)</Label>
                          <Input
                            id="reshipmentPerKg"
                            name="excessWeight.reshipmentPerKg"
                            type="number"
                            step="0.01"
                            value={formData.excessWeight.reshipmentPerKg}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    {/* Aba de Valores Adicionais */}
                    <TabsContent value="adicionais" className="space-y-4 mt-4">
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
                      
                      <div className="border p-4 rounded-md">
                        <h3 className="font-medium mb-2">Hora Parada</h3>
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
                        <h3 className="font-medium mb-2">Seguro (% sobre valor da mercadoria)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="standard">Mercadoria Padrão (%)</Label>
                            <Input
                              id="standard"
                              name="insurance.standard"
                              type="number"
                              step="0.001"
                              value={formData.insurance.standard}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="perishable">Mercadoria Perecível (%)</Label>
                            <Input
                              id="perishable"
                              name="insurance.perishable"
                              type="number"
                              step="0.001"
                              value={formData.insurance.perishable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

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
                    </TabsContent>
                    
                    {/* Aba de Cidades da Região Metropolitana */}
                    <TabsContent value="cidades" className="space-y-4 mt-4">
                      <div className="mb-2">
                        <h3 className="font-medium">Selecione as cidades que fazem parte da Região Metropolitana</h3>
                        <p className="text-sm text-muted-foreground">
                          As cidades selecionadas estarão sujeitas à tarifa de Região Metropolitana.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border p-4 rounded-md">
                        {cities.map((city) => (
                          <div key={city.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`city-${city.id}`}
                              checked={(formData.metropolitanCityIds || []).includes(city.id)}
                              onCheckedChange={() => handleToggleMetropolitanCity(city.id)}
                            />
                            <Label htmlFor={`city-${city.id}`} className="text-sm">
                              {city.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    {/* Aba de Serviços Personalizados */}
                    <TabsContent value="servicos" className="space-y-4 mt-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Serviços Personalizados</h3>
                        <Button 
                          type="button" 
                          onClick={() => openCustomServiceDialog()}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Adicionar Serviço
                        </Button>
                      </div>
                      
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome do Serviço</TableHead>
                              <TableHead>Peso Mínimo</TableHead>
                              <TableHead>Taxa Base</TableHead>
                              <TableHead>Taxa Excedente</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(formData.customServices || []).length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                  Nenhum serviço personalizado cadastrado
                                </TableCell>
                              </TableRow>
                            ) : (
                              formData.customServices?.map((service) => (
                                <TableRow key={service.id}>
                                  <TableCell>{service.name}</TableCell>
                                  <TableCell>{service.minWeight} kg</TableCell>
                                  <TableCell>R$ {service.baseRate.toFixed(2)}</TableCell>
                                  <TableCell>R$ {service.excessRate.toFixed(2)}/kg</TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button type="button" variant="ghost" size="icon" onClick={() => openCustomServiceDialog(service)}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button type="button" variant="ghost" size="icon" onClick={() => deleteCustomService(service.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <DialogFooter className="mt-8">
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

        {/* Diálogo para adicionar/editar serviços personalizados */}
        <Dialog open={customServiceDialogOpen} onOpenChange={setCustomServiceDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{currentCustomService ? 'Editar Serviço' : 'Novo Serviço Personalizado'}</DialogTitle>
              <DialogDescription>
                Defina os detalhes do serviço personalizado.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Serviço</Label>
                <Input
                  id="name"
                  name="name"
                  value={customServiceFormData.name}
                  onChange={handleCustomServiceChange}
                  placeholder="Ex: Entrega Rápida Zona Norte"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minWeight">Peso Mínimo (kg)</Label>
                  <Input
                    id="minWeight"
                    name="minWeight"
                    type="number"
                    step="0.01"
                    value={customServiceFormData.minWeight}
                    onChange={handleCustomServiceChange}
                    placeholder="10"
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
                    placeholder="50.00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excessRate">Taxa por KG Excedente (R$)</Label>
                <Input
                  id="excessRate"
                  name="excessRate"
                  type="number"
                  step="0.01"
                  value={customServiceFormData.excessRate}
                  onChange={handleCustomServiceChange}
                  placeholder="3.50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Informações Adicionais</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={customServiceFormData.additionalInfo}
                  onChange={handleCustomServiceChange}
                  placeholder="Observações e informações adicionais sobre este serviço"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCustomServiceDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveCustomService}>
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
