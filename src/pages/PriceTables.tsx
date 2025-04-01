
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePriceTables } from '@/contexts/PriceTablesContext';
import { PriceTable } from '@/types';
import { Edit, Plus, Trash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Form component for creating or updating price tables
const PriceTableForm = ({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: PriceTable;
  onSubmit: (data: Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [currentTab, setCurrentTab] = useState('basic');
  
  // Minimum rates - Basic
  const [standardDelivery, setStandardDelivery] = useState(initialData?.minimumRate.standardDelivery || 36);
  const [saturdayCollection, setSaturdayCollection] = useState(initialData?.minimumRate.saturdayCollection || 72);
  const [emergencyCollection, setEmergencyCollection] = useState(initialData?.minimumRate.emergencyCollection || 72);
  const [exclusiveVehicle, setExclusiveVehicle] = useState(initialData?.minimumRate.exclusiveVehicle || 176);
  const [scheduledDifficultAccess, setScheduledDifficultAccess] = useState(initialData?.minimumRate.scheduledDifficultAccess || 154);
  
  // Minimum rates - Biological and Special
  const [normalBiological, setNormalBiological] = useState(initialData?.minimumRate.normalBiological || 72);
  const [infectiousBiological, setInfectiousBiological] = useState(initialData?.minimumRate.infectiousBiological || 99);
  const [sundayHoliday, setSundayHoliday] = useState(initialData?.minimumRate.sundayHoliday || 308);
  const [metropolitanRegion, setMetropolitanRegion] = useState(initialData?.minimumRate.metropolitanRegion || 165);
  const [nightExclusiveVehicle, setNightExclusiveVehicle] = useState(initialData?.minimumRate.nightExclusiveVehicle || 0);
  const [trackedVehicle, setTrackedVehicle] = useState(initialData?.minimumRate.trackedVehicle || 440);
  const [reshipment, setReshipment] = useState(initialData?.minimumRate.reshipment || 170);
  const [doorToDoorInterior, setDoorToDoorInterior] = useState(initialData?.minimumRate.doorToDoorInterior || 200);
  
  // Excess weight rates
  const [minPerKg, setMinPerKg] = useState(initialData?.excessWeight.minPerKg || 0.55);
  const [maxPerKg, setMaxPerKg] = useState(initialData?.excessWeight.maxPerKg || 0.65);
  const [biologicalPerKg, setBiologicalPerKg] = useState(initialData?.excessWeight.biologicalPerKg || 0.72);
  const [reshipmentPerKg, setReshipmentPerKg] = useState(initialData?.excessWeight.reshipmentPerKg || 0.70);
  
  // Door to door rates
  const [ratePerKm, setRatePerKm] = useState(initialData?.doorToDoor.ratePerKm || 2.4);
  const [maxWeight, setMaxWeight] = useState(initialData?.doorToDoor.maxWeight || 100);
  
  // Waiting hour rates
  const [fiorinoWaitingHour, setFiorinoWaitingHour] = useState(initialData?.waitingHour?.fiorino || 44);
  const [mediumWaitingHour, setMediumWaitingHour] = useState(initialData?.waitingHour?.medium || 55);
  const [largeWaitingHour, setLargeWaitingHour] = useState(initialData?.waitingHour?.large || 66);
  
  // Insurance rates
  const [standardInsurance, setStandardInsurance] = useState(initialData?.insurance.standard || 0.01);
  const [perishableInsurance, setPerishableInsurance] = useState(initialData?.insurance.perishable || 0.015);
  
  // Custom pricing options
  const [allowCustomPricing, setAllowCustomPricing] = useState(initialData?.allowCustomPricing || false);
  const [defaultDiscount, setDefaultDiscount] = useState(initialData?.defaultDiscount || 0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      minimumRate: {
        standardDelivery,
        saturdayCollection,
        emergencyCollection,
        exclusiveVehicle,
        scheduledDifficultAccess,
        normalBiological,
        infectiousBiological,
        sundayHoliday,
        metropolitanRegion,
        nightExclusiveVehicle,
        trackedVehicle,
        reshipment,
        doorToDoorInterior,
      },
      excessWeight: {
        minPerKg,
        maxPerKg,
        biologicalPerKg,
        reshipmentPerKg,
      },
      doorToDoor: {
        ratePerKm,
        maxWeight,
      },
      waitingHour: {
        fiorino: fiorinoWaitingHour,
        medium: mediumWaitingHour,
        large: largeWaitingHour,
      },
      insurance: {
        standard: standardInsurance,
        perishable: perishableInsurance,
      },
      allowCustomPricing,
      defaultDiscount,
    };
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Nome da Tabela</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      
      <Tabs defaultValue="basic" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="special">Especial</TabsTrigger>
          <TabsTrigger value="additional">Adicionais</TabsTrigger>
          <TabsTrigger value="pricing">Preços/Descontos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Taxa mínima até 10 Kg</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="standardDelivery">Entregas região metropolitana</Label>
                <Input
                  id="standardDelivery"
                  type="number"
                  step="0.01"
                  value={standardDelivery}
                  onChange={(e) => setStandardDelivery(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="saturdayCollection">Coletas aos sábados</Label>
                <Input
                  id="saturdayCollection"
                  type="number"
                  step="0.01"
                  value={saturdayCollection}
                  onChange={(e) => setSaturdayCollection(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emergencyCollection">Coletas emergenciais</Label>
                <Input
                  id="emergencyCollection"
                  type="number"
                  step="0.01"
                  value={emergencyCollection}
                  onChange={(e) => setEmergencyCollection(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="exclusiveVehicle">Veículo exclusivo</Label>
                <Input
                  id="exclusiveVehicle"
                  type="number"
                  step="0.01"
                  value={exclusiveVehicle}
                  onChange={(e) => setExclusiveVehicle(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="scheduledDifficultAccess">Agendado/Difícil acesso</Label>
                <Input
                  id="scheduledDifficultAccess"
                  type="number"
                  step="0.01"
                  value={scheduledDifficultAccess}
                  onChange={(e) => setScheduledDifficultAccess(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Excedente acima de 10 Kg</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="minPerKg">Taxa mínima por Kg (padrão)</Label>
                <Input
                  id="minPerKg"
                  type="number"
                  step="0.01"
                  value={minPerKg}
                  onChange={(e) => setMinPerKg(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxPerKg">Taxa máxima por Kg (especial)</Label>
                <Input
                  id="maxPerKg"
                  type="number"
                  step="0.01"
                  value={maxPerKg}
                  onChange={(e) => setMaxPerKg(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="special" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Outros tipos de entrega</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="normalBiological">Material biológico normal</Label>
                <Input
                  id="normalBiological"
                  type="number"
                  step="0.01"
                  value={normalBiological}
                  onChange={(e) => setNormalBiological(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="infectiousBiological">Material biológico infeccioso</Label>
                <Input
                  id="infectiousBiological"
                  type="number"
                  step="0.01"
                  value={infectiousBiological}
                  onChange={(e) => setInfectiousBiological(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="biologicalPerKg">Excedente biológico por Kg</Label>
                <Input
                  id="biologicalPerKg"
                  type="number"
                  step="0.01"
                  value={biologicalPerKg}
                  onChange={(e) => setBiologicalPerKg(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sundayHoliday">Domingos e feriados</Label>
                <Input
                  id="sundayHoliday"
                  type="number"
                  step="0.01"
                  value={sundayHoliday}
                  onChange={(e) => setSundayHoliday(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="metropolitanRegion">Região Metropolitana</Label>
                <Input
                  id="metropolitanRegion"
                  type="number"
                  step="0.01"
                  value={metropolitanRegion}
                  onChange={(e) => setMetropolitanRegion(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="nightExclusiveVehicle">Exclusivo noturno/feriados (a combinar)</Label>
                <Input
                  id="nightExclusiveVehicle"
                  type="number"
                  step="0.01"
                  value={nightExclusiveVehicle}
                  onChange={(e) => setNightExclusiveVehicle(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
                <span className="text-sm text-muted-foreground mt-1 block">
                  Use 0 para "valor a combinar"
                </span>
              </div>
              <div>
                <Label htmlFor="doorToDoorInterior">Porta a Porta interior</Label>
                <Input
                  id="doorToDoorInterior"
                  type="number"
                  step="0.01"
                  value={doorToDoorInterior}
                  onChange={(e) => setDoorToDoorInterior(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Veículos especiais e redespacho</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="trackedVehicle">Veículo rastreado até 100 Kg</Label>
                <Input
                  id="trackedVehicle"
                  type="number"
                  step="0.01"
                  value={trackedVehicle}
                  onChange={(e) => setTrackedVehicle(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reshipment">Redespacho até 10 Kg</Label>
                <Input
                  id="reshipment"
                  type="number"
                  step="0.01"
                  value={reshipment}
                  onChange={(e) => setReshipment(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reshipmentPerKg">Excedente redespacho por Kg</Label>
                <Input
                  id="reshipmentPerKg"
                  type="number"
                  step="0.01"
                  value={reshipmentPerKg}
                  onChange={(e) => setReshipmentPerKg(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="additional" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Hora Parada</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Todos as entregas tem tolerância de 1 hora. Após a 1ª hora será cobrado hora parada.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <Label htmlFor="fiorinoWaitingHour">Fiorino</Label>
                <Input
                  id="fiorinoWaitingHour"
                  type="number"
                  step="0.01"
                  value={fiorinoWaitingHour}
                  onChange={(e) => setFiorinoWaitingHour(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="mediumWaitingHour">3/4</Label>
                <Input
                  id="mediumWaitingHour"
                  type="number"
                  step="0.01"
                  value={mediumWaitingHour}
                  onChange={(e) => setMediumWaitingHour(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="largeWaitingHour">Toco</Label>
                <Input
                  id="largeWaitingHour"
                  type="number"
                  step="0.01"
                  value={largeWaitingHour}
                  onChange={(e) => setLargeWaitingHour(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Coletas ou entregas porta a porta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="ratePerKm">Taxa por Km rodado (Fiorino)</Label>
                <Input
                  id="ratePerKm"
                  type="number"
                  step="0.01"
                  value={ratePerKm}
                  onChange={(e) => setRatePerKm(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxWeight">Peso máximo (Kg)</Label>
                <Input
                  id="maxWeight"
                  type="number"
                  step="1"
                  value={maxWeight}
                  onChange={(e) => setMaxWeight(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Seguro obrigatório</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="standardInsurance">Padrão (% sobre valor da carga)</Label>
                <Input
                  id="standardInsurance"
                  type="number"
                  step="0.001"
                  value={standardInsurance}
                  onChange={(e) => setStandardInsurance(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
                <span className="text-sm text-muted-foreground mt-1 block">Ex: 0.01 para 1%</span>
              </div>
              <div>
                <Label htmlFor="perishableInsurance">Perecível/Medicamentos/Frágeis</Label>
                <Input
                  id="perishableInsurance"
                  type="number"
                  step="0.001"
                  value={perishableInsurance}
                  onChange={(e) => setPerishableInsurance(parseFloat(e.target.value) || 0)}
                  required
                  className="mt-1"
                />
                <span className="text-sm text-muted-foreground mt-1 block">Ex: 0.015 para 1.5%</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Opções de preço personalizado</h3>
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowCustomPricing" className="mb-1 block">
                    Permitir preço personalizado
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Permite definir preços especiais para entregas
                  </p>
                </div>
                <Switch
                  id="allowCustomPricing"
                  checked={allowCustomPricing}
                  onCheckedChange={setAllowCustomPricing}
                />
              </div>
              
              <div>
                <Label htmlFor="defaultDiscount">Desconto padrão (%)</Label>
                <Input
                  id="defaultDiscount"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={defaultDiscount}
                  onChange={(e) => setDefaultDiscount(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
                <span className="text-sm text-muted-foreground mt-1 block">
                  Ex: 5 para 5% de desconto
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Atualizar' : 'Criar'} Tabela
        </Button>
      </DialogFooter>
    </form>
  );
};

const PriceTablesPage = () => {
  const { priceTables, addPriceTable, updatePriceTable, deletePriceTable, loading } = usePriceTables();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTable, setCurrentTable] = useState<PriceTable | null>(null);
  
  const handleCreate = (data: Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'>) => {
    addPriceTable(data);
    setIsCreateDialogOpen(false);
  };
  
  const handleEdit = (table: PriceTable) => {
    setCurrentTable(table);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdate = (data: Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (currentTable) {
      updatePriceTable(currentTable.id, data);
      setIsEditDialogOpen(false);
    }
  };
  
  const handleDelete = (table: PriceTable) => {
    setCurrentTable(table);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (currentTable) {
      deletePriceTable(currentTable.id);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const safeRender = (render: () => React.ReactNode, fallback: React.ReactNode = "-") => {
    try {
      return render();
    } catch (error) {
      console.error("Error rendering value:", error);
      return fallback;
    }
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tabelas de Preço</h1>
            <p className="text-muted-foreground">
              Gerenciamento das tabelas de preço para cálculo de frete.
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Tabela
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Tabela de Preço</DialogTitle>
                <DialogDescription>
                  Defina os valores para a nova tabela de preço.
                </DialogDescription>
              </DialogHeader>
              <PriceTableForm
                onSubmit={handleCreate}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {priceTables.map((table) => (
              <div key={table.id} className="border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{table.name}</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(table)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(table)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Tabs defaultValue="basic">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="special">Especial</TabsTrigger>
                    <TabsTrigger value="additional">Adicionais</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="mt-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Taxa mínima até 10 Kg</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="text-sm">Metropolitana:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.minimumRate.standardDelivery)}</div>
                        <div className="text-sm">Sábados:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.minimumRate.saturdayCollection)}</div>
                        <div className="text-sm">Emergencial:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.minimumRate.emergencyCollection)}</div>
                        <div className="text-sm">Exclusivo:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.minimumRate.exclusiveVehicle)}</div>
                        <div className="text-sm">Agendado:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.minimumRate.scheduledDifficultAccess)}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Excedente acima de 10 Kg</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="text-sm">Taxa mínima:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.excessWeight.minPerKg)} por Kg</div>
                        <div className="text-sm">Taxa máxima:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.excessWeight.maxPerKg)} por Kg</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Seguro</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="text-sm">Padrão:</div>
                        <div className="text-sm font-medium">{formatPercentage(table.insurance.standard)}</div>
                        <div className="text-sm">Perecível/Medicamentos:</div>
                        <div className="text-sm font-medium">{formatPercentage(table.insurance.perishable)}</div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="special" className="mt-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Tipos especiais</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="text-sm">Bio. Normal:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.minimumRate.normalBiological)}</div>
                        <div className="text-sm">Bio. Infeccioso:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.minimumRate.infectiousBiological)}</div>
                        <div className="text-sm">Dom/Feriados:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.minimumRate.sundayHoliday)}</div>
                        <div className="text-sm">Região Metropolitana:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.minimumRate.metropolitanRegion)}</div>
                        <div className="text-sm">Porta a Porta interior:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.minimumRate.doorToDoorInterior)}</div>
                        <div className="text-sm">Excedente biológico:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.excessWeight.biologicalPerKg)} por Kg</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Veículos especiais/Redespacho</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="text-sm">Rastreado (100 Kg):</div>
                        <div className="text-sm font-medium">{formatCurrency(table.minimumRate.trackedVehicle)}</div>
                        <div className="text-sm">Redespacho (10 Kg):</div>
                        <div className="text-sm font-medium">{formatCurrency(table.minimumRate.reshipment)}</div>
                        <div className="text-sm">Excedente redespacho:</div>
                        <div className="text-sm font-medium">{formatCurrency(table.excessWeight.reshipmentPerKg)} por Kg</div>
                        <div className="text-sm">Noturno (a combinar):</div>
                        <div className="text-sm font-medium">
                          {table.minimumRate.nightExclusiveVehicle > 0 
                            ? formatCurrency(table.minimumRate.nightExclusiveVehicle) 
                            : "A combinar"}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="additional" className="mt-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Hora Parada</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="text-sm">Fiorino:</div>
                        <div className="text-sm font-medium">
                          {safeRender(() => formatCurrency(table.waitingHour?.fiorino || 44))}
                        </div>
                        <div className="text-sm">3/4:</div>
                        <div className="text-sm font-medium">
                          {safeRender(() => formatCurrency(table.waitingHour?.medium || 55))}
                        </div>
                        <div className="text-sm">Toco:</div>
                        <div className="text-sm font-medium">
                          {safeRender(() => formatCurrency(table.waitingHour?.large || 66))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Porta a Porta</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="text-sm">Por Km rodado:</div>
                        <div className="text-sm font-medium">
                          {safeRender(() => formatCurrency(table.doorToDoor?.ratePerKm || 2.4))}
                        </div>
                        <div className="text-sm">Peso máximo:</div>
                        <div className="text-sm font-medium">
                          {safeRender(() => `${table.doorToDoor?.maxWeight || 100} Kg`)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Preço personalizado</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="text-sm">Preço personalizado:</div>
                        <div className="text-sm font-medium">
                          {safeRender(() => table.allowCustomPricing ? "Permitido" : "Não permitido")}
                        </div>
                        <div className="text-sm">Desconto padrão:</div>
                        <div className="text-sm font-medium">
                          {safeRender(() => `${table.defaultDiscount || 0}%`)}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>
        )}
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Editar Tabela de Preço</DialogTitle>
              <DialogDescription>
                Atualize os valores da tabela de preço.
              </DialogDescription>
            </DialogHeader>
            {currentTable && (
              <PriceTableForm
                initialData={currentTable}
                onSubmit={handleUpdate}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
        
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir a tabela "{currentTable?.name}"? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default PriceTablesPage;
