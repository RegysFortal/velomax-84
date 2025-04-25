
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { usePriceTables } from '@/contexts/priceTables';
import { PriceTable } from '@/types';

export function usePriceTableSubmit(
  formData: any, 
  selectedCities: string[],
  editingPriceTable: PriceTable | null,
  setEditingPriceTable: React.Dispatch<React.SetStateAction<PriceTable | null>>,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { addPriceTable, updatePriceTable } = usePriceTables();
  const { toast } = useToast();
  
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
        weightLimits: formData.weightLimits,
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
  
  return { handleSubmit };
}
