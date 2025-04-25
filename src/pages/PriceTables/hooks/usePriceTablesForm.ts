import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { usePriceTables } from '@/contexts/priceTables';
import { useCities } from '@/contexts/CitiesContext';
import { PriceTable, CustomService } from '@/types';

export const createEmptyPriceTable = () => ({
  name: '',
  description: '',
  multiplier: 1,
  
  fortalezaNormalMinRate: 0,
  fortalezaNormalExcessRate: 0,
  fortalezaEmergencyMinRate: 0,
  fortalezaEmergencyExcessRate: 0,
  fortalezaSaturdayMinRate: 0,
  fortalezaSaturdayExcessRate: 0,
  fortalezaExclusiveMinRate: 0,
  fortalezaExclusiveExcessRate: 0,
  fortalezaScheduledMinRate: 0,
  fortalezaScheduledExcessRate: 0,
  metropolitanMinRate: 0,
  metropolitanExcessRate: 0,
  fortalezaHolidayMinRate: 0,
  fortalezaHolidayExcessRate: 0,
  biologicalNormalMinRate: 0,
  biologicalNormalExcessRate: 0,
  biologicalInfectiousMinRate: 0, 
  biologicalInfectiousExcessRate: 0,
  trackedVehicleMinRate: 0,
  trackedVehicleExcessRate: 0,
  reshipmentMinRate: 0,
  reshipmentExcessRate: 0,
  reshipmentInvoicePercentage: 0,
  interiorExclusiveMinRate: 0,
  interiorExclusiveExcessRate: 0,
  interiorExclusiveKmRate: 0,
  
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

export function usePriceTablesForm() {
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
      const customServices = editingPriceTable.minimumRate?.customServices || [];
      const defaultDiscountValue = typeof editingPriceTable.defaultDiscount === 'number' 
        ? editingPriceTable.defaultDiscount
        : 0;

      setFormData({
        ...createEmptyPriceTable(),
        ...editingPriceTable,
        description: editingPriceTable.description || '',
        metropolitanCityIds,
        metropolitanCities: metropolitanCityIds,
        customServices,
        minimumRate: {
          ...createEmptyPriceTable().minimumRate,
          ...(editingPriceTable.minimumRate || {}),
          customServices,
        },
        doorToDoor: {
          ...createEmptyPriceTable().doorToDoor,
          ...(editingPriceTable.doorToDoor || {}),
        },
        waitingHour: {
          ...createEmptyPriceTable().waitingHour,
          ...(editingPriceTable.waitingHour || {}),
        },
        insurance: {
          ...createEmptyPriceTable().insurance,
          ...(editingPriceTable.insurance || {}),
        },
        allowCustomPricing: editingPriceTable.allowCustomPricing ?? false,
        defaultDiscount: defaultDiscountValue,
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

  const handleToggleMetropolitanCity = useCallback((cityId: string) => {
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
  }, []);

  const handleCreateNewCity = useCallback((cityName: string) => {
    if (!cityName.trim()) {
      toast({
        title: "Nome inválido",
        description: "Por favor, informe um nome de cidade válido.",
        variant: "destructive"
      });
      return;
    }

    const tempId = `temp-${cityName.trim()}`;

    if (selectedCities.some(id => id === tempId || (id.startsWith('temp-') && id.replace('temp-', '') === cityName.trim()))) {
      toast({
        title: "Cidade já adicionada",
        description: `A cidade ${cityName} já está na lista.`,
        variant: "destructive"
      });
      return;
    }
    handleToggleMetropolitanCity(tempId);
    toast({
      title: "Cidade adicionada",
      description: `A cidade ${cityName} foi adicionada à região metropolitana.`,
    });
  }, [selectedCities, handleToggleMetropolitanCity, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const priceTableData = {
        ...formData,
        metropolitanCities: selectedCities,
        minimumRate: {
          ...formData.minimumRate,
          customServices: formData.customServices,
          standardDelivery: formData.fortalezaNormalMinRate,
          emergencyCollection: formData.fortalezaEmergencyMinRate,
          saturdayCollection: formData.fortalezaSaturdayMinRate,
          exclusiveVehicle: formData.fortalezaExclusiveMinRate,
          scheduledDifficultAccess: formData.fortalezaScheduledMinRate,
          metropolitanRegion: formData.metropolitanMinRate,
          sundayHoliday: formData.fortalezaHolidayMinRate,
          normalBiological: formData.biologicalNormalMinRate,
          infectiousBiological: formData.biologicalInfectiousMinRate,
          trackedVehicle: formData.trackedVehicleMinRate,
          doorToDoorInterior: formData.interiorExclusiveMinRate,
          reshipment: formData.reshipmentMinRate,
        },
        excessWeight: {
          ...formData.excessWeight,
          minPerKg: formData.fortalezaNormalExcessRate,
          maxPerKg: formData.fortalezaEmergencyExcessRate,
          biologicalPerKg: formData.biologicalNormalExcessRate,
          reshipmentPerKg: formData.reshipmentExcessRate,
        },
        allowCustomPricing: formData.allowCustomPricing ?? false,
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

  return {
    priceTables,
    cities,
    isDialogOpen,
    setIsDialogOpen,
    editingPriceTable,
    setEditingPriceTable,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    selectedCities,
    setSelectedCities,
    handleToggleMetropolitanCity,
    handleCreateNewCity,
    customServiceDialogOpen,
    setCustomServiceDialogOpen,
    openCustomServiceDialog,
    currentCustomService,
    customServiceFormData,
    setCustomServiceFormData,
    handleCustomServiceChange,
    saveCustomService,
    deleteCustomService,
  };
}
