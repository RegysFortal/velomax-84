
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { usePriceTables } from '@/contexts/PriceTablesContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { PriceTable } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const PriceTableForm = ({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: PriceTable;
  onSubmit: (data: Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'>>({
    name: initialData?.name || '',
    minimumRate: {
      standardDelivery: initialData?.minimumRate.standardDelivery || 36,
      saturdayCollection: initialData?.minimumRate.saturdayCollection || 72,
      emergencyCollection: initialData?.minimumRate.emergencyCollection || 72,
      exclusiveVehicle: initialData?.minimumRate.exclusiveVehicle || 176,
      scheduledDifficultAccess: initialData?.minimumRate.scheduledDifficultAccess || 154,
      normalBiological: initialData?.minimumRate.normalBiological || 165,
      infectiousBiological: initialData?.minimumRate.infectiousBiological || 170,
      sundayHoliday: initialData?.minimumRate.sundayHoliday || 308,
    },
    excessWeight: {
      minPerKg: initialData?.excessWeight.minPerKg || 0.55,
      maxPerKg: initialData?.excessWeight.maxPerKg || 0.72,
    },
    doorToDoor: {
      ratePerKm: initialData?.doorToDoor.ratePerKm || 2.4,
      maxWeight: initialData?.doorToDoor.maxWeight || 100,
    },
    insurance: {
      standard: initialData?.insurance.standard || 0.01,
      perishable: initialData?.insurance.perishable || 0.015,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: string,
    field?: string
  ) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    
    if (section && field) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: isNaN(numericValue) ? 0 : numericValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome da Tabela</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <Tabs defaultValue="minimum-rate" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="minimum-rate">Taxa Mínima</TabsTrigger>
            <TabsTrigger value="excess-weight">Excedente</TabsTrigger>
            <TabsTrigger value="door-to-door">Porta a Porta</TabsTrigger>
            <TabsTrigger value="insurance">Seguro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="minimum-rate" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="standardDelivery">Entregas na região metropolitana</Label>
              <Input
                id="standardDelivery"
                name="standardDelivery"
                type="number"
                step="0.01"
                value={formData.minimumRate.standardDelivery}
                onChange={(e) => handleChange(e, 'minimumRate', 'standardDelivery')}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="saturdayCollection">Coletas aos sábados até 12h</Label>
              <Input
                id="saturdayCollection"
                name="saturdayCollection"
                type="number"
                step="0.01"
                value={formData.minimumRate.saturdayCollection}
                onChange={(e) => handleChange(e, 'minimumRate', 'saturdayCollection')}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="emergencyCollection">Coletas emergenciais</Label>
              <Input
                id="emergencyCollection"
                name="emergencyCollection"
                type="number"
                step="0.01"
                value={formData.minimumRate.emergencyCollection}
                onChange={(e) => handleChange(e, 'minimumRate', 'emergencyCollection')}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="exclusiveVehicle">Veículo exclusivo em dias úteis</Label>
              <Input
                id="exclusiveVehicle"
                name="exclusiveVehicle"
                type="number"
                step="0.01"
                value={formData.minimumRate.exclusiveVehicle}
                onChange={(e) => handleChange(e, 'minimumRate', 'exclusiveVehicle')}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="scheduledDifficultAccess">Entregas com agendamento e locais de difícil acesso</Label>
              <Input
                id="scheduledDifficultAccess"
                name="scheduledDifficultAccess"
                type="number"
                step="0.01"
                value={formData.minimumRate.scheduledDifficultAccess}
                onChange={(e) => handleChange(e, 'minimumRate', 'scheduledDifficultAccess')}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="normalBiological">Material biológico normal</Label>
              <Input
                id="normalBiological"
                name="normalBiological"
                type="number"
                step="0.01"
                value={formData.minimumRate.normalBiological}
                onChange={(e) => handleChange(e, 'minimumRate', 'normalBiological')}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="infectiousBiological">Material biológico infeccioso</Label>
              <Input
                id="infectiousBiological"
                name="infectiousBiological"
                type="number"
                step="0.01"
                value={formData.minimumRate.infectiousBiological}
                onChange={(e) => handleChange(e, 'minimumRate', 'infectiousBiological')}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="sundayHoliday">Entregas aos domingos e feriados</Label>
              <Input
                id="sundayHoliday"
                name="sundayHoliday"
                type="number"
                step="0.01"
                value={formData.minimumRate.sundayHoliday}
                onChange={(e) => handleChange(e, 'minimumRate', 'sundayHoliday')}
                required
                className="mt-1"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="excess-weight" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="minPerKg">Valor mínimo por Kg</Label>
              <Input
                id="minPerKg"
                name="minPerKg"
                type="number"
                step="0.01"
                value={formData.excessWeight.minPerKg}
                onChange={(e) => handleChange(e, 'excessWeight', 'minPerKg')}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="maxPerKg">Valor máximo por Kg</Label>
              <Input
                id="maxPerKg"
                name="maxPerKg"
                type="number"
                step="0.01"
                value={formData.excessWeight.maxPerKg}
                onChange={(e) => handleChange(e, 'excessWeight', 'maxPerKg')}
                required
                className="mt-1"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="door-to-door" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="ratePerKm">Valor por Km</Label>
              <Input
                id="ratePerKm"
                name="ratePerKm"
                type="number"
                step="0.01"
                value={formData.doorToDoor.ratePerKm}
                onChange={(e) => handleChange(e, 'doorToDoor', 'ratePerKm')}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="maxWeight">Peso máximo (Kg)</Label>
              <Input
                id="maxWeight"
                name="maxWeight"
                type="number"
                step="1"
                value={formData.doorToDoor.maxWeight}
                onChange={(e) => handleChange(e, 'doorToDoor', 'maxWeight')}
                required
                className="mt-1"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="insurance" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="standard">Taxa padrão (% do valor da carga)</Label>
              <Input
                id="standard"
                name="standard"
                type="number"
                step="0.001"
                value={formData.insurance.standard}
                onChange={(e) => handleChange(e, 'insurance', 'standard')}
                required
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ex: 0.01 para 1%
              </p>
            </div>
            
            <div>
              <Label htmlFor="perishable">Taxa para perecíveis/medicamentos/frágeis (% do valor da carga)</Label>
              <Input
                id="perishable"
                name="perishable"
                type="number"
                step="0.001"
                value={formData.insurance.perishable}
                onChange={(e) => handleChange(e, 'insurance', 'perishable')}
                required
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ex: 0.015 para 1.5%
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Atualizar Tabela' : 'Criar Tabela'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const PriceTableCard = ({ priceTable, canEdit }: { priceTable: PriceTable, canEdit: boolean }) => {
  const { updatePriceTable, deletePriceTable } = usePriceTables();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdate = (data: Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'>) => {
    updatePriceTable(priceTable.id, data);
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    deletePriceTable(priceTable.id);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{priceTable.name}</CardTitle>
            <CardDescription>
              Criada em {new Date(priceTable.createdAt).toLocaleDateString('pt-BR')}
            </CardDescription>
          </div>
          {canEdit && (
            <div className="flex space-x-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Editar Tabela de Preços</DialogTitle>
                    <DialogDescription>
                      Atualize os valores da tabela de preços. Clique em salvar quando terminar.
                    </DialogDescription>
                  </DialogHeader>
                  <PriceTableForm
                    initialData={priceTable}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir tabela de preços</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. A tabela será permanentemente removida.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div>
          <h3 className="font-medium text-sm mb-2">Taxa mínima (até 10 Kg)</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Região metropolitana</span>
              <span>{formatCurrency(priceTable.minimumRate.standardDelivery)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Coletas aos sábados</span>
              <span>{formatCurrency(priceTable.minimumRate.saturdayCollection)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Coletas emergenciais</span>
              <span>{formatCurrency(priceTable.minimumRate.emergencyCollection)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Veículo exclusivo</span>
              <span>{formatCurrency(priceTable.minimumRate.exclusiveVehicle)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-sm mb-2">Outros valores</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Excedente (por Kg)</span>
              <span>{formatCurrency(priceTable.excessWeight.minPerKg)} - {formatCurrency(priceTable.excessWeight.maxPerKg)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Porta a porta (por Km)</span>
              <span>{formatCurrency(priceTable.doorToDoor.ratePerKm)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Seguro padrão</span>
              <span>{formatPercent(priceTable.insurance.standard)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Seguro perecíveis</span>
              <span>{formatPercent(priceTable.insurance.perishable)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PriceTables = () => {
  const { priceTables, loading, addPriceTable } = usePriceTables();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  const handleCreate = (data: Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'>) => {
    addPriceTable(data);
    setIsCreateDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tabelas de Preço</h1>
            <p className="text-muted-foreground">
              Gerenciamento das tabelas de preço para cálculo de fretes.
            </p>
          </div>
          {canEdit && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Tabela
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Nova Tabela de Preços</DialogTitle>
                  <DialogDescription>
                    Defina os valores para a nova tabela de preços. Clique em criar quando terminar.
                  </DialogDescription>
                </DialogHeader>
                <PriceTableForm
                  onSubmit={handleCreate}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {priceTables.map((priceTable) => (
              <PriceTableCard 
                key={priceTable.id} 
                priceTable={priceTable} 
                canEdit={canEdit} 
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PriceTables;
