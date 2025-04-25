import { useState, useEffect } from 'react';
import { PriceTable } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Initial price tables data as fallback, updated to have all required fields
const INITIAL_PRICE_TABLES: PriceTable[] = [
  {
    id: 'table-a',
    name: 'Tabela A',
    description: 'Tabela padrão para clientes convencionais',
    // Include flat structure fields
    fortalezaNormalMinRate: 36.00,
    fortalezaNormalExcessRate: 0.55,
    fortalezaEmergencyMinRate: 72.00,
    fortalezaEmergencyExcessRate: 0.65,
    fortalezaSaturdayMinRate: 72.00,
    fortalezaSaturdayExcessRate: 0.65,
    fortalezaExclusiveMinRate: 176.00,
    fortalezaExclusiveExcessRate: 0.65,
    fortalezaScheduledMinRate: 154.00,
    fortalezaScheduledExcessRate: 0.65,
    metropolitanMinRate: 165.00,
    metropolitanExcessRate: 0.65,
    fortalezaHolidayMinRate: 308.00,
    fortalezaHolidayExcessRate: 0.65,
    biologicalNormalMinRate: 72.00,
    biologicalNormalExcessRate: 0.72,
    biologicalInfectiousMinRate: 99.00,
    biologicalInfectiousExcessRate: 0.72,
    trackedVehicleMinRate: 440.00,
    trackedVehicleExcessRate: 0.65,
    reshipmentMinRate: 170.00,
    reshipmentExcessRate: 0.70,
    reshipmentInvoicePercentage: 0.01,
    interiorExclusiveMinRate: 200.00,
    interiorExclusiveExcessRate: 0.65,
    interiorExclusiveKmRate: 2.40,
    multiplier: 1.0,
    // Nested structure
    minimumRate: {
      standardDelivery: 36.00,
      saturdayCollection: 72.00,
      emergencyCollection: 72.00,
      exclusiveVehicle: 176.00,
      scheduledDifficultAccess: 154.00,
      normalBiological: 72.00,
      infectiousBiological: 99.00,
      sundayHoliday: 308.00,
      metropolitanRegion: 165.00,
      trackedVehicle: 440.00,
      reshipment: 170.00,
      doorToDoorInterior: 200.00,
      customServices: [],
    },
    excessWeight: {
      minPerKg: 0.55,
      maxPerKg: 0.65,
      biologicalPerKg: 0.72,
      reshipmentPerKg: 0.70,
    },
    doorToDoor: {
      ratePerKm: 2.40,
      maxWeight: 100,
    },
    waitingHour: {
      standard: 44.00,
      exclusive: 55.00,
      fiorino: 44.00,
      medium: 55.00,
      large: 66.00,
    },
    insurance: {
      rate: 0.01,
      standard: 0.01,
    },
    allowCustomPricing: true,
    defaultDiscount: 0.00,
    metropolitanCities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'table-b',
    name: 'Tabela B',
    description: 'Tabela para clientes preferenciais',
    minimumRate: {
      standardDelivery: 40.00,
      saturdayCollection: 80.00,
      emergencyCollection: 80.00,
      exclusiveVehicle: 190.00,
      scheduledDifficultAccess: 165.00,
      normalBiological: 80.00,
      infectiousBiological: 110.00,
      sundayHoliday: 330.00,
      metropolitanRegion: 180.00,
      trackedVehicle: 460.00,
      reshipment: 180.00,
      doorToDoorInterior: 220.00,
      customServices: [],
    },
    excessWeight: {
      minPerKg: 0.60,
      maxPerKg: 0.70,
      biologicalPerKg: 0.75,
      reshipmentPerKg: 0.75,
    },
    doorToDoor: {
      ratePerKm: 2.60,
      maxWeight: 100,
    },
    waitingHour: {
      standard: 48.00,
      exclusive: 60.00,
      fiorino: 48.00,
      medium: 60.00,
      large: 72.00,
    },
    insurance: {
      rate: 0.01,
      standard: 0.01,
      perishable: 0.015,
    },
    allowCustomPricing: true,
    defaultDiscount: 0.00,
    metropolitanCities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'table-c',
    name: 'Tabela C',
    description: 'Tabela para clientes corporativos',
    minimumRate: {
      standardDelivery: 45.00,
      saturdayCollection: 90.00,
      emergencyCollection: 90.00,
      exclusiveVehicle: 210.00,
      scheduledDifficultAccess: 180.00,
      normalBiological: 195.00,
      infectiousBiological: 200.00,
      sundayHoliday: 360.00,
      metropolitanRegion: 165.00,
      trackedVehicle: 440.00,
      reshipment: 170.00,
      doorToDoorInterior: 240.00,
      customServices: [],
    },
    excessWeight: {
      minPerKg: 0.65,
      maxPerKg: 0.85,
      biologicalPerKg: 0.72,
      reshipmentPerKg: 0.70,
    },
    doorToDoor: {
      ratePerKm: 2.80,
      maxWeight: 100,
    },
    waitingHour: {
      standard: 44.00,
      exclusive: 55.00,
      fiorino: 44.00,
      medium: 55.00,
      large: 66.00,
    },
    insurance: {
      rate: 0.01,
      standard: 0.01,
      perishable: 0.015,
    },
    allowCustomPricing: true,
    defaultDiscount: 0.00,
    metropolitanCities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'table-d',
    name: 'Tabela D',
    description: 'Tabela para clientes especiais',
    minimumRate: {
      standardDelivery: 50.00,
      saturdayCollection: 100.00,
      emergencyCollection: 100.00,
      exclusiveVehicle: 230.00,
      scheduledDifficultAccess: 195.00,
      normalBiological: 210.00,
      infectiousBiological: 215.00,
      sundayHoliday: 390.00,
      metropolitanRegion: 165.00,
      trackedVehicle: 440.00,
      reshipment: 170.00,
      doorToDoorInterior: 260.00,
      customServices: [],
    },
    excessWeight: {
      minPerKg: 0.70,
      maxPerKg: 0.90,
      biologicalPerKg: 0.72,
      reshipmentPerKg: 0.70,
    },
    doorToDoor: {
      ratePerKm: 3.00,
      maxWeight: 100,
    },
    waitingHour: {
      standard: 44.00,
      exclusive: 55.00,
      fiorino: 44.00,
      medium: 55.00,
      large: 66.00,
    },
    insurance: {
      rate: 0.01,
      standard: 0.01,
      perishable: 0.015,
    },
    allowCustomPricing: true,
    defaultDiscount: 0.00,
    metropolitanCities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useFetchPriceTables = (userId?: string) => {
  const [priceTables, setPriceTables] = useState<PriceTable[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPriceTables = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('price_tables')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        const mappedPriceTables = data.map((table: any): PriceTable => {
          // Parse JSON fields or use empty objects
          const parsedMinimumRate = typeof table.minimum_rate === 'string'
            ? JSON.parse(table.minimum_rate)
            : table.minimum_rate || {};
            
          if (!parsedMinimumRate.customServices) {
            parsedMinimumRate.customServices = [];
          }
            
          const parsedExcessWeight = typeof table.excess_weight === 'string'
            ? JSON.parse(table.excess_weight)
            : table.excess_weight || {};
            
          const parsedDoorToDoor = typeof table.door_to_door === 'string'
            ? JSON.parse(table.door_to_door)
            : table.door_to_door || {};
            
          const parsedWaitingHour = typeof table.waiting_hour === 'string'
            ? JSON.parse(table.waiting_hour)
            : table.waiting_hour || {};
            
          const parsedInsurance = typeof table.insurance === 'string'
            ? JSON.parse(table.insurance)
            : table.insurance || {};
            
          if (!parsedWaitingHour.standard) parsedWaitingHour.standard = parsedWaitingHour.fiorino || 44.00;
          if (!parsedWaitingHour.exclusive) parsedWaitingHour.exclusive = parsedWaitingHour.medium || 55.00;
          
          if (!parsedInsurance.rate) parsedInsurance.rate = parsedInsurance.standard || 0.01;
          if (!parsedInsurance.standard) parsedInsurance.standard = 0.01;
          
          const metropolitanCities = table.metropolitan_cities 
            ? (typeof table.metropolitan_cities === 'string' 
                ? JSON.parse(table.metropolitan_cities) 
                : table.metropolitan_cities) 
            : [];

          // Create a table with both formats - flat and nested
          const priceTable: PriceTable = {
            id: table.id,
            name: table.name,
            description: table.description || '',
            multiplier: table.multiplier || 1,
            
            // Flat format fields
            fortalezaNormalMinRate: parsedMinimumRate.standardDelivery || 0,
            fortalezaNormalExcessRate: parsedExcessWeight.minPerKg || 0,
            fortalezaEmergencyMinRate: parsedMinimumRate.emergencyCollection || 0,
            fortalezaEmergencyExcessRate: parsedExcessWeight.maxPerKg || 0,
            fortalezaSaturdayMinRate: parsedMinimumRate.saturdayCollection || 0,
            fortalezaSaturdayExcessRate: parsedExcessWeight.maxPerKg || 0,
            fortalezaExclusiveMinRate: parsedMinimumRate.exclusiveVehicle || 0,
            fortalezaExclusiveExcessRate: parsedExcessWeight.maxPerKg || 0,
            fortalezaScheduledMinRate: parsedMinimumRate.scheduledDifficultAccess || 0,
            fortalezaScheduledExcessRate: parsedExcessWeight.maxPerKg || 0,
            metropolitanMinRate: parsedMinimumRate.metropolitanRegion || 0,
            metropolitanExcessRate: parsedExcessWeight.minPerKg || 0,
            fortalezaHolidayMinRate: parsedMinimumRate.sundayHoliday || 0,
            fortalezaHolidayExcessRate: parsedExcessWeight.maxPerKg || 0,
            biologicalNormalMinRate: parsedMinimumRate.normalBiological || 0,
            biologicalNormalExcessRate: parsedExcessWeight.biologicalPerKg || 0,
            biologicalInfectiousMinRate: parsedMinimumRate.infectiousBiological || 0,
            biologicalInfectiousExcessRate: parsedExcessWeight.biologicalPerKg || 0,
            trackedVehicleMinRate: parsedMinimumRate.trackedVehicle || 0,
            trackedVehicleExcessRate: parsedExcessWeight.maxPerKg || 0,
            reshipmentMinRate: parsedMinimumRate.reshipment || 0,
            reshipmentExcessRate: parsedExcessWeight.reshipmentPerKg || 0,
            reshipmentInvoicePercentage: table.reshipment_invoice_percentage || 0.01,
            interiorExclusiveMinRate: parsedMinimumRate.doorToDoorInterior || 0,
            interiorExclusiveExcessRate: parsedExcessWeight.maxPerKg || 0,
            interiorExclusiveKmRate: parsedDoorToDoor.ratePerKm || 0,
            
            // Nested format
            minimumRate: parsedMinimumRate,
            excessWeight: parsedExcessWeight,
            doorToDoor: parsedDoorToDoor,
            waitingHour: parsedWaitingHour,
            insurance: parsedInsurance,
            allowCustomPricing: table.allow_custom_pricing || false,
            defaultDiscount: table.default_discount || 0,
            metropolitanCities: metropolitanCities,
            createdAt: table.created_at || new Date().toISOString(),
            updatedAt: table.updated_at || new Date().toISOString(),
          };
          
          return priceTable;
        });
        
        setPriceTables(mappedPriceTables);
      } catch (error) {
        console.error('Error fetching price tables:', error);
        toast({
          title: "Erro ao carregar tabelas de preços",
          description: "Usando dados locais como fallback.",
          variant: "destructive"
        });
        
        const storedTables = localStorage.getItem('velomax_price_tables');
        if (storedTables) {
          try {
            const parsedTables = JSON.parse(storedTables);
            const validatedTables = parsedTables.map((table: any): PriceTable => {
              // Apply the same mapping for stored tables
              const updatedTable = { 
                ...table,
                // Ensure required fields exist
                fortalezaNormalMinRate: table.fortalezaNormalMinRate || (table.minimumRate?.standardDelivery || 0),
                fortalezaNormalExcessRate: table.fortalezaNormalExcessRate || (table.excessWeight?.minPerKg || 0),
                fortalezaEmergencyMinRate: table.fortalezaEmergencyMinRate || (table.minimumRate?.emergencyCollection || 0),
                fortalezaEmergencyExcessRate: table.fortalezaEmergencyExcessRate || (table.excessWeight?.maxPerKg || 0),
                // ... other fields
                multiplier: table.multiplier || 1,
              };
              
              if (!updatedTable.waitingHour) {
                updatedTable.waitingHour = {
                  standard: 44.00,
                  exclusive: 55.00,
                  fiorino: 44.00,
                  medium: 55.00,
                  large: 66.00,
                };
              }
              
              if (!updatedTable.minimumRate) {
                updatedTable.minimumRate = {
                  standardDelivery: updatedTable.fortalezaNormalMinRate,
                  emergencyCollection: updatedTable.fortalezaEmergencyMinRate,
                  saturdayCollection: updatedTable.fortalezaSaturdayMinRate,
                  exclusiveVehicle: updatedTable.fortalezaExclusiveMinRate,
                  scheduledDifficultAccess: updatedTable.fortalezaScheduledMinRate,
                  metropolitanRegion: updatedTable.metropolitanMinRate,
                  sundayHoliday: updatedTable.fortalezaHolidayMinRate,
                  normalBiological: updatedTable.biologicalNormalMinRate,
                  infectiousBiological: updatedTable.biologicalInfectiousMinRate,
                  trackedVehicle: updatedTable.trackedVehicleMinRate,
                  doorToDoorInterior: updatedTable.interiorExclusiveMinRate || 200.00,
                  reshipment: updatedTable.reshipmentMinRate,
                  customServices: [],
                };
              }
              
              if (!updatedTable.minimumRate.doorToDoorInterior) {
                updatedTable.minimumRate.doorToDoorInterior = 200.00;
              }
              
              if (!updatedTable.minimumRate.customServices) {
                updatedTable.minimumRate.customServices = [];
              }
              
              if (!updatedTable.excessWeight) {
                updatedTable.excessWeight = {
                  minPerKg: updatedTable.fortalezaNormalExcessRate,
                  maxPerKg: updatedTable.fortalezaEmergencyExcessRate,
                  biologicalPerKg: updatedTable.biologicalNormalExcessRate || 0.72,
                  reshipmentPerKg: updatedTable.reshipmentExcessRate || 0.70,
                };
              }
              
              if (!updatedTable.excessWeight.biologicalPerKg) {
                updatedTable.excessWeight.biologicalPerKg = 0.72;
              }
              
              if (!updatedTable.excessWeight.reshipmentPerKg) {
                updatedTable.excessWeight.reshipmentPerKg = 0.70;
              }
              
              if (!updatedTable.metropolitanCities) {
                updatedTable.metropolitanCities = [];
              }
              
              if (!updatedTable.insurance) {
                updatedTable.insurance = {
                  rate: 0.01,
                  standard: 0.01,
                };
              }
              
              if (!updatedTable.insurance.standard) {
                updatedTable.insurance.standard = 0.01;
              }
              
              return updatedTable;
            });
            setPriceTables(validatedTables);
          } catch (error) {
            console.error('Failed to parse stored price tables', error);
            setPriceTables(INITIAL_PRICE_TABLES);
          }
        } else {
          setPriceTables(INITIAL_PRICE_TABLES);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchPriceTables();
    }
  }, [toast, userId]);
  
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_price_tables', JSON.stringify(priceTables));
    }
  }, [priceTables, loading]);
  
  return { priceTables, setPriceTables, loading };
};
