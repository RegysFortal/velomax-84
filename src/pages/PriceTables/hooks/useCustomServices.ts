
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { CustomService } from '@/types';

export function useCustomServices(formData: any, setFormData: React.Dispatch<React.SetStateAction<any>>) {
  const [customServiceDialogOpen, setCustomServiceDialogOpen] = useState(false);
  const [currentCustomService, setCurrentCustomService] = useState<CustomService | null>(null);
  const [customServiceFormData, setCustomServiceFormData] = useState<Partial<CustomService>>({
    name: '',
    minWeight: 10,
    baseRate: 0,
    excessRate: 0,
    additionalInfo: '',
  });
  const { toast } = useToast();

  const handleCustomServiceChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setCustomServiceFormData(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'additionalInfo' 
        ? value 
        : parseFloat(value) || 0
    }));
  }, []);

  const openCustomServiceDialog = useCallback((service?: CustomService) => {
    if (service) {
      setCurrentCustomService(service);
      setCustomServiceFormData({
        name: service.name,
        minWeight: service.minWeight,
        baseRate: service.baseRate,
        excessRate: service.excessRate,
        additionalInfo: service.additionalInfo || '',
      });
    } else {
      setCurrentCustomService(null);
      setCustomServiceFormData({
        name: '',
        minWeight: 10,
        baseRate: 0,
        excessRate: 0,
        additionalInfo: '',
      });
    }
    setCustomServiceDialogOpen(true);
  }, []);

  const saveCustomService = useCallback(() => {
    const customServices = formData.minimumRate?.customServices || [];
    
    if (!customServiceFormData.name) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para o serviço customizado.",
        variant: "destructive"
      });
      return;
    }

    let updatedCustomServices;
    if (currentCustomService) {
      // Update existing service
      updatedCustomServices = customServices.map((service: CustomService) => 
        service.id === currentCustomService.id
          ? { 
              ...service, 
              name: customServiceFormData.name,
              minWeight: customServiceFormData.minWeight,
              baseRate: customServiceFormData.baseRate,
              excessRate: customServiceFormData.excessRate,
              additionalInfo: customServiceFormData.additionalInfo
            }
          : service
      );
      
      toast({
        title: "Serviço atualizado",
        description: `O serviço "${customServiceFormData.name}" foi atualizado com sucesso.`,
      });
    } else {
      // Add new service
      const newService = {
        id: uuidv4(),
        name: customServiceFormData.name,
        minWeight: customServiceFormData.minWeight || 10,
        baseRate: customServiceFormData.baseRate || 0,
        excessRate: customServiceFormData.excessRate || 0,
        additionalInfo: customServiceFormData.additionalInfo || ''
      };
      
      updatedCustomServices = [...customServices, newService];
      
      toast({
        title: "Serviço adicionado",
        description: `O serviço "${customServiceFormData.name}" foi adicionado com sucesso.`,
      });
    }
    
    setFormData(prev => ({
      ...prev,
      minimumRate: {
        ...prev.minimumRate,
        customServices: updatedCustomServices
      }
    }));
    
    setCustomServiceDialogOpen(false);
  }, [formData, currentCustomService, customServiceFormData, setFormData, toast]);

  const deleteCustomService = useCallback((serviceId: string) => {
    const customServices = formData.minimumRate?.customServices || [];
    const serviceToDelete = customServices.find((s: CustomService) => s.id === serviceId);
    
    if (!serviceToDelete) return;
    
    const updatedCustomServices = customServices.filter((s: CustomService) => s.id !== serviceId);
    
    setFormData(prev => ({
      ...prev,
      minimumRate: {
        ...prev.minimumRate,
        customServices: updatedCustomServices
      }
    }));
    
    toast({
      title: "Serviço removido",
      description: `O serviço "${serviceToDelete.name}" foi removido com sucesso.`,
    });
  }, [formData, setFormData, toast]);

  return {
    customServiceDialogOpen,
    setCustomServiceDialogOpen,
    currentCustomService,
    customServiceFormData,
    setCustomServiceFormData,
    handleCustomServiceChange,
    openCustomServiceDialog,
    saveCustomService,
    deleteCustomService
  };
}
