
import { useState, useEffect } from 'react';
import { PriceTable, CustomService } from '@/types';
import { useToast } from '@/components/ui/use-toast';

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
  weightLimits: {
    standardDelivery: 10,
    emergencyCollection: 10,
    saturdayCollection: 10,
    exclusiveVehicle: 10,
    scheduledDifficultAccess: 10,
    metropolitanRegion: 10,
    sundayHoliday: 10,
    normalBiological: 10,
    infectiousBiological: 10,
    trackedVehicle: 100,
    doorToDoorInterior: 10,
    reshipment: 10,
  },
  allowCustomPricing: false,
  defaultDiscount: 0,
  metropolitanCities: [],
  metropolitanCityIds: [],
  customServices: [],
});

export function usePriceTableFormState(editingPriceTable: PriceTable | null) {
  const [formData, setFormData] = useState(createEmptyPriceTable());
  
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
        weightLimits: {
          ...createEmptyPriceTable().weightLimits,
          ...(editingPriceTable.weightLimits || {}),
        },
        allowCustomPricing: editingPriceTable.allowCustomPricing ?? false,
        defaultDiscount: defaultDiscountValue,
      });
    } else {
      setFormData(createEmptyPriceTable());
    }
  }, [editingPriceTable]);

  return { formData, setFormData };
}
