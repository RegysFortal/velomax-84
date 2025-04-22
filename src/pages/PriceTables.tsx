
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { usePriceTables } from '@/contexts/priceTables';
import { useCities } from '@/contexts/CitiesContext';
import { PriceTable, CustomService } from '@/types';
import { PriceTableList } from '@/components/price-tables/PriceTableList';
import { PriceTableDialog } from '@/components/price-tables/PriceTableDialog';
import { CustomServiceDialog } from '@/components/price-tables/CustomServiceDialog';

const createEmptyPriceTable = () => ({
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
});

const PriceTables = () => {
  const { priceTables, addPriceTable, updatePriceTable, deletePriceTable } = usePriceTables();
  const { cities } = useCities();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customServiceDialogOpen, setCustomServiceDialogOpen] = useState(false);
  const [editingPriceTable, setEditingPriceTable] = useState<PriceTable | null>(null);
  const [formData, setFormData] = useState(createEmptyPriceTable());
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
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
      const metropolitanCityIds = editingPriceTable.metropolitanCities || [];
      const customServices = editingPriceTable.minimumRate.customServices || [];
      
      setFormData({
        ...editingPriceTable,
        description: editingPriceTable.description || '',
        metropolitanCityIds,
        metropolitanCities: metropolitanCityIds,
        customServices,
        minimumRate: {
          ...editingPriceTable.minimumRate,
          customServices,
        },
        doorToDoor: {
          ...editingPriceTable.doorToDoor,
          maxWeight: editingPriceTable.doorToDoor.maxWeight || 0,
        },
        waitingHour: {
          ...editingPriceTable.waitingHour,
          fiorino: editingPriceTable.waitingHour.fiorino || 0,
          medium: editingPriceTable.waitingHour.medium || 0,
          large: editingPriceTable.waitingHour.large || 0,
        },
        insurance: {
          ...editingPriceTable.insurance,
          standard: editingPriceTable.insurance.standard || 0.01,
        },
        allowCustomPricing: editingPriceTable.allowCustomPricing ?? false, // Ensure this is always defined
      });
      setSelectedCities(metropolitanCityIds);
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
      const minimumRateKey = name.split('.')[1] as keyof typeof formData.minimumRate;
      setFormData(prev => ({
        ...prev,
        minimumRate: {
          ...prev.minimumRate,
          [minimumRateKey]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else if (name.startsWith('excessWeight.')) {
      const excessWeightKey = name.split('.')[1] as keyof typeof formData.excessWeight;
      setFormData(prev => ({
        ...prev,
        excessWeight: {
          ...prev.excessWeight,
          [excessWeightKey]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else if (name.startsWith('doorToDoor.')) {
      const doorToDoorKey = name.split('.')[1] as keyof typeof formData.doorToDoor;
      setFormData(prev => ({
        ...prev,
        doorToDoor: {
          ...prev.doorToDoor,
          [doorToDoorKey]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else if (name.startsWith('waitingHour.')) {
      const waitingHourKey = name.split('.')[1] as keyof typeof formData.waitingHour;
      setFormData(prev => ({
        ...prev,
        waitingHour: {
          ...prev.waitingHour,
          [waitingHourKey]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else if (name.startsWith('insurance.')) {
      const insuranceKey = name.split('.')[1] as keyof typeof formData.insurance;
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
      
      setFormData(prevFormData => ({
        ...prevFormData,
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
    handleToggleMetropolitanCity(tempId);
    
    toast({
      title: "Cidade adicionada",
      description: `A cidade ${cityName} foi adicionada à região metropolitana.`,
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
        allowCustomPricing: formData.allowCustomPricing ?? false, // Ensure this is always defined
      };
      
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

        <PriceTableList 
          priceTables={priceTables}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <PriceTableDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          editingPriceTable={editingPriceTable}
          selectedCities={selectedCities}
          cities={cities}
          onCityToggle={handleToggleMetropolitanCity}
          onCreateNewCity={handleCreateNewCity}
          onCheckboxChange={(checked) => {
            setFormData(prev => ({
              ...prev,
              allowCustomPricing: checked,
            }));
          }}
        />

        <CustomServiceDialog
          open={customServiceDialogOpen}
          onOpenChange={setCustomServiceDialogOpen}
          currentService={currentCustomService}
          formData={customServiceFormData}
          onChange={handleCustomServiceChange}
          onSave={saveCustomService}
        />
      </div>
    </AppLayout>
  );
};

export default PriceTables;
