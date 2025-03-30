
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
import { usePriceTables } from '@/contexts/PriceTablesContext';
import { PriceTable } from '@/types';
import { Edit, Plus, Trash } from 'lucide-react';

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
  
  // Minimum rates
  const [standardDelivery, setStandardDelivery] = useState(initialData?.minimumRate.standardDelivery || 36);
  const [saturdayCollection, setSaturdayCollection] = useState(initialData?.minimumRate.saturdayCollection || 72);
  const [emergencyCollection, setEmergencyCollection] = useState(initialData?.minimumRate.emergencyCollection || 72);
  const [exclusiveVehicle, setExclusiveVehicle] = useState(initialData?.minimumRate.exclusiveVehicle || 176);
  const [scheduledDifficultAccess, setScheduledDifficultAccess] = useState(initialData?.minimumRate.scheduledDifficultAccess || 154);
  const [normalBiological, setNormalBiological] = useState(initialData?.minimumRate.normalBiological || 165);
  const [infectiousBiological, setInfectiousBiological] = useState(initialData?.minimumRate.infectiousBiological || 170);
  const [sundayHoliday, setSundayHoliday] = useState(initialData?.minimumRate.sundayHoliday || 308);
  
  // Excess weight rates
  const [minPerKg, setMinPerKg] = useState(initialData?.excessWeight.minPerKg || 0.55);
  const [maxPerKg, setMaxPerKg] = useState(initialData?.excessWeight.maxPerKg || 0.72);
  
  // Door to door rates
  const [ratePerKm, setRatePerKm] = useState(initialData?.doorToDoor.ratePerKm || 2.4);
  const [maxWeight, setMaxWeight] = useState(initialData?.doorToDoor.maxWeight || 100);
  
  // Insurance rates
  const [standardInsurance, setStandardInsurance] = useState(initialData?.insurance.standard || 0.01);
  const [perishableInsurance, setPerishableInsurance] = useState(initialData?.insurance.perishable || 0.015);
  
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
      },
      excessWeight: {
        minPerKg,
        maxPerKg,
      },
      doorToDoor: {
        ratePerKm,
        maxWeight,
      },
      insurance: {
        standard: standardInsurance,
        perishable: perishableInsurance,
      },
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
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Excedente acima de 10 Kg</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="minPerKg">Taxa mínima por Kg</Label>
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
            <Label htmlFor="maxPerKg">Taxa máxima por Kg</Label>
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
      
      <div>
        <h3 className="text-lg font-semibold">Coletas ou entregas porta a porta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="ratePerKm">Taxa por Km rodado</Label>
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
                
                <div className="space-y-4">
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
                      <div className="text-sm">Bio. Normal:</div>
                      <div className="text-sm font-medium">{formatCurrency(table.minimumRate.normalBiological)}</div>
                      <div className="text-sm">Bio. Infeccioso:</div>
                      <div className="text-sm font-medium">{formatCurrency(table.minimumRate.infectiousBiological)}</div>
                      <div className="text-sm">Dom/Feriados:</div>
                      <div className="text-sm font-medium">{formatCurrency(table.minimumRate.sundayHoliday)}</div>
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
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Porta a Porta</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="text-sm">Por Km rodado:</div>
                      <div className="text-sm font-medium">{formatCurrency(table.doorToDoor.ratePerKm)}</div>
                      <div className="text-sm">Peso máximo:</div>
                      <div className="text-sm font-medium">{table.doorToDoor.maxWeight} Kg</div>
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
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Edit Dialog */}
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
        
        {/* Delete Dialog */}
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
