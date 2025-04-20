import { useState, useEffect } from 'react';
import { PriceTable } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Initial price tables data as fallback
const INITIAL_PRICE_TABLES: PriceTable[] = [
  {
    id: 'table-a',
    name: 'Tabela A',
    description: 'Tabela padrão para clientes convencionais',
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
    multiplier: 1.0,
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
          const parsedMinimumRate = typeof table.minimum_rate === 'string'
            ? JSON.parse(table.minimum_rate)
            : table.minimum_rate || {};
            
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
          
          return {
            id: table.id,
            name: table.name,
            description: table.description || '',
            minimumRate: parsedMinimumRate,
            excessWeight: parsedExcessWeight,
            doorToDoor: parsedDoorToDoor,
            waitingHour: parsedWaitingHour,
            insurance: parsedInsurance,
            allowCustomPricing: table.allow_custom_pricing,
            defaultDiscount: table.default_discount || 0,
            createdAt: table.created_at || new Date().toISOString(),
            updatedAt: table.updated_at || new Date().toISOString(),
          };
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
            const validatedTables = parsedTables.map((table: PriceTable) => {
              const updatedTable = { ...table };
              
              if (!updatedTable.waitingHour) {
                updatedTable.waitingHour = {
                  standard: 44.00,
                  exclusive: 55.00,
                  fiorino: 44.00,
                  medium: 55.00,
                  large: 66.00,
                };
              }
              
              if (!updatedTable.minimumRate.doorToDoorInterior) {
                updatedTable.minimumRate.doorToDoorInterior = 200.00;
              }
              
              if (!updatedTable.excessWeight.biologicalPerKg) {
                updatedTable.excessWeight.biologicalPerKg = 0.72;
              }
              
              if (!updatedTable.excessWeight.reshipmentPerKg) {
                updatedTable.excessWeight.reshipmentPerKg = 0.70;
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
