
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
import { usePriceTables } from '@/contexts/PriceTablesContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PriceTable } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PriceTableFormData {
  name: string;
  description: string;
  minimumRate: {
    standardDelivery: number;
    emergencyCollection: number;
    saturdayCollection: number;
    exclusiveVehicle: number;
    scheduledDifficultAccess: number;
    metropolitanRegion: number;
    sundayHoliday: number;
    normalBiological: number;
    infectiousBiological: number;
    trackedVehicle: number;
    doorToDoorInterior: number;
    reshipment: number;
  };
  excessWeight: {
    minPerKg: number;
    maxPerKg: number;
    biologicalPerKg: number;
    reshipmentPerKg: number;
  };
  doorToDoor: {
    ratePerKm: number;
    maxWeight: number;
  };
  waitingHour: {
    fiorino: number;
    medium: number;
    large: number;
  };
  insurance: {
    standard: number;
    perishable: number;
  };
  allowCustomPricing: boolean;
  defaultDiscount: number;
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
      fiorino: 0,
      medium: 0,
      large: 0,
    },
    insurance: {
      standard: 0,
      perishable: 0,
    },
    allowCustomPricing: false,
    defaultDiscount: 0,
  };
};

const PriceTables = () => {
  const { priceTables, addPriceTable, updatePriceTable, deletePriceTable } = usePriceTables();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPriceTable, setEditingPriceTable] = useState<PriceTable | null>(null);
  const [formData, setFormData] = useState<PriceTableFormData>(createEmptyPriceTable());
  const { toast } = useToast();

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
        waitingHour: editingPriceTable.waitingHour ? {
          fiorino: editingPriceTable.waitingHour.fiorino,
          medium: editingPriceTable.waitingHour.medium,
          large: editingPriceTable.waitingHour.large,
        } : { fiorino: 0, medium: 0, large: 0 },
        insurance: editingPriceTable.insurance ? {
          standard: editingPriceTable.insurance.standard,
          perishable: editingPriceTable.insurance.perishable,
        } : { standard: 0, perishable: 0 },
        allowCustomPricing: editingPriceTable.allowCustomPricing || false,
        defaultDiscount: editingPriceTable.defaultDiscount || 0,
      });
    } else {
      setFormData(createEmptyPriceTable());
    }
  }, [editingPriceTable]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPriceTable) {
        await updatePriceTable(editingPriceTable.id, formData);
        toast({
          title: "Tabela de preços atualizada",
          description: `A tabela de preços ${formData.name} foi atualizada com sucesso.`,
        });
      } else {
        await addPriceTable(formData);
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
  
  const getPriceTableById = (id: string) => {
    const table = priceTables.find(table => table.id === id);
    
    if (table) {
      return {
        ...table,
        minimumRate: {
          standardDelivery: table.minimumRate.standardDelivery,
          emergencyCollection: table.minimumRate.emergencyCollection,
          saturdayCollection: table.minimumRate.saturdayCollection,
          exclusiveVehicle: table.minimumRate.exclusiveVehicle,
          scheduledDifficultAccess: table.minimumRate.scheduledDifficultAccess,
          metropolitanRegion: table.minimumRate.metropolitanRegion,
          sundayHoliday: table.minimumRate.sundayHoliday,
          normalBiological: table.minimumRate.normalBiological,
          infectiousBiological: table.minimumRate.infectiousBiological,
          trackedVehicle: table.minimumRate.trackedVehicle,
          doorToDoorInterior: table.minimumRate.doorToDoorInterior,
          reshipment: table.minimumRate.reshipment,
        },
        excessWeight: {
          minPerKg: table.excessWeight.minPerKg,
          maxPerKg: table.excessWeight.maxPerKg,
          biologicalPerKg: table.excessWeight.biologicalPerKg,
          reshipmentPerKg: table.excessWeight.reshipmentPerKg,
        },
        doorToDoor: {
          ratePerKm: table.doorToDoor.ratePerKm,
          maxWeight: table.doorToDoor.maxWeight,
        },
        waitingHour: table.waitingHour ? {
          fiorino: table.waitingHour.fiorino,
          medium: table.waitingHour.medium,
          large: table.waitingHour.large,
        } : undefined,
        insurance: table.insurance ? {
          standard: table.insurance.standard,
          perishable: table.insurance.perishable,
        } : undefined,
        allowCustomPricing: table.allowCustomPricing,
        defaultDiscount: table.defaultDiscount,
      };
    }
    
    return null;
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tabelas de Preços</h1>
            <p className="text-muted-foreground">
              Gerencie as tabelas de preços da sua empresa.
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
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceTables.map((priceTable) => (
                  <TableRow key={priceTable.id}>
                    <TableCell className="font-medium">{priceTable.name}</TableCell>
                    <TableCell>{priceTable.description}</TableCell>
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
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPriceTable ? 'Editar Tabela de Preços' : 'Nova Tabela de Preços'}</DialogTitle>
              <DialogDescription>
                Configure os valores padrão para esta tabela de preços.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
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
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Tabs defaultValue="tarifas">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="tarifas">Tarifas Mínimas</TabsTrigger>
                  <TabsTrigger value="peso">Excesso de Peso</TabsTrigger>
                  <TabsTrigger value="adicionais">Valores Adicionais</TabsTrigger>
                </TabsList>
                <TabsContent value="tarifas" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="standardDelivery">Entrega Normal</Label>
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
                      <Label htmlFor="emergencyCollection">Coleta Emergencial</Label>
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
                      <Label htmlFor="saturdayCollection">Coleta Sábados</Label>
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
                      <Label htmlFor="exclusiveVehicle">Veículo Exclusivo</Label>
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
                      <Label htmlFor="scheduledDifficultAccess">Difícil Acesso</Label>
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
                      <Label htmlFor="metropolitanRegion">Região Metropolitana</Label>
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
                      <Label htmlFor="sundayHoliday">Domingos/Feriados</Label>
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
                      <Label htmlFor="normalBiological">Biológico Normal</Label>
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
                      <Label htmlFor="infectiousBiological">Biológico Infeccioso</Label>
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
                      <Label htmlFor="trackedVehicle">Veículo Rastreado</Label>
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
                      <Label htmlFor="doorToDoorInterior">Porta a Porta</Label>
                      <Input 
                        id="doorToDoorInterior" 
                        name="minimumRate.doorToDoorInterior" 
                        type="number"
                        step="0.01"
                        value={formData.minimumRate.doorToDoorInterior} 
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reshipment">Redespacho</Label>
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
                
                <TabsContent value="peso" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minPerKg">Mínimo por Kg</Label>
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
                      <Label htmlFor="maxPerKg">Máximo por Kg</Label>
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
                      <Label htmlFor="biologicalPerKg">Biológico por Kg</Label>
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
                      <Label htmlFor="reshipmentPerKg">Redespacho por Kg</Label>
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

                <TabsContent value="adicionais" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ratePerKm">Taxa por Km (Porta a Porta)</Label>
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
                      <Label htmlFor="maxWeight">Peso Máximo (Porta a Porta)</Label>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fiorino">Espera/Hora (Fiorino)</Label>
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
                      <Label htmlFor="medium">Espera/Hora (Médio)</Label>
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
                      <Label htmlFor="large">Espera/Hora (Grande)</Label>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="standard">Seguro (%) Padrão</Label>
                      <Input
                        id="standard"
                        name="insurance.standard"
                        type="number"
                        step="0.01"
                        value={formData.insurance.standard}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perishable">Seguro (%) Perecível</Label>
                      <Input
                        id="perishable"
                        name="insurance.perishable"
                        type="number"
                        step="0.01"
                        value={formData.insurance.perishable}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      id="allowCustomPricing"
                      name="allowCustomPricing"
                      checked={formData.allowCustomPricing}
                      onChange={handleChange}
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
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPriceTable ? 'Atualizar' : 'Criar'} Tabela
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default PriceTables;
