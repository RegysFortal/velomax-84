
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PriceTable } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

type PriceTablesContextType = {
  priceTables: PriceTable[];
  addPriceTable: (priceTable: Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePriceTable: (id: string, priceTable: Partial<PriceTable>) => Promise<void>;
  deletePriceTable: (id: string) => Promise<void>;
  getPriceTable: (id: string) => PriceTable | undefined;
  calculateInsurance: (priceTableId: string, invoiceValue: number, isReshipment: boolean, cargoType: 'standard' | 'perishable') => number;
  loading: boolean;
};

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
      perishable: 0.015,
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

const PriceTablesContext = createContext<PriceTablesContextType | undefined>(undefined);

export const PriceTablesProvider = ({ children }: { children: ReactNode }) => {
  const [priceTables, setPriceTables] = useState<PriceTable[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
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
          const waitingHour = table.waiting_hour || {};
          if (!waitingHour.standard) waitingHour.standard = waitingHour.fiorino || 44.00;
          if (!waitingHour.exclusive) waitingHour.exclusive = waitingHour.medium || 55.00;
          
          const insurance = table.insurance || {};
          if (!insurance.rate) insurance.rate = insurance.standard || 0.01;
          
          return {
            id: table.id,
            name: table.name,
            description: table.description || '',
            minimumRate: table.minimum_rate as PriceTable['minimumRate'],
            excessWeight: table.excess_weight as PriceTable['excessWeight'],
            doorToDoor: table.door_to_door as PriceTable['doorToDoor'],
            waitingHour: waitingHour as PriceTable['waitingHour'],
            insurance: insurance as PriceTable['insurance'],
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
    
    if (user) {
      fetchPriceTables();
    }
  }, [toast, user]);
  
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_price_tables', JSON.stringify(priceTables));
    }
  }, [priceTables, loading]);
  
  const addPriceTable = async (
    priceTable: Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const timestamp = new Date().toISOString();
      
      const supabasePriceTable = {
        name: priceTable.name,
        description: priceTable.description,
        minimum_rate: priceTable.minimumRate,
        excess_weight: priceTable.excessWeight,
        door_to_door: priceTable.doorToDoor,
        waiting_hour: priceTable.waitingHour,
        insurance: priceTable.insurance,
        allow_custom_pricing: priceTable.allowCustomPricing,
        default_discount: priceTable.defaultDiscount || 0,
        user_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('price_tables')
        .insert(supabasePriceTable)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newPriceTable: PriceTable = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        minimumRate: data.minimum_rate as PriceTable['minimumRate'],
        excessWeight: data.excess_weight as PriceTable['excessWeight'],
        doorToDoor: data.door_to_door as PriceTable['doorToDoor'],
        waitingHour: data.waiting_hour as PriceTable['waitingHour'],
        insurance: data.insurance as PriceTable['insurance'],
        allowCustomPricing: data.allow_custom_pricing,
        defaultDiscount: data.default_discount || 0,
        createdAt: data.created_at || timestamp,
        updatedAt: data.updated_at || timestamp,
      };
      
      setPriceTables((prev) => [...prev, newPriceTable]);
      
      toast({
        title: "Tabela de preços criada",
        description: `A tabela "${priceTable.name}" foi criada com sucesso.`,
      });
    } catch (error) {
      console.error("Error adding price table:", error);
      toast({
        title: "Erro ao criar tabela de preços",
        description: "Ocorreu um erro ao criar a tabela de preços. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const updatePriceTable = async (id: string, priceTable: Partial<PriceTable>) => {
    try {
      const timestamp = new Date().toISOString();
      
      const supabasePriceTable: any = {
        updated_at: timestamp
      };
      
      if (priceTable.name !== undefined) supabasePriceTable.name = priceTable.name;
      if (priceTable.description !== undefined) supabasePriceTable.description = priceTable.description;
      if (priceTable.minimumRate !== undefined) supabasePriceTable.minimum_rate = priceTable.minimumRate;
      if (priceTable.excessWeight !== undefined) supabasePriceTable.excess_weight = priceTable.excessWeight;
      if (priceTable.doorToDoor !== undefined) supabasePriceTable.door_to_door = priceTable.doorToDoor;
      if (priceTable.waitingHour !== undefined) supabasePriceTable.waiting_hour = priceTable.waitingHour;
      if (priceTable.insurance !== undefined) supabasePriceTable.insurance = priceTable.insurance;
      if (priceTable.allowCustomPricing !== undefined) supabasePriceTable.allow_custom_pricing = priceTable.allowCustomPricing;
      if (priceTable.defaultDiscount !== undefined) supabasePriceTable.default_discount = priceTable.defaultDiscount;

      const { error } = await supabase
        .from('price_tables')
        .update(supabasePriceTable)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setPriceTables((prev) => 
        prev.map((table) => 
          table.id === id 
            ? { ...table, ...priceTable, updatedAt: timestamp } 
            : table
        )
      );
      
      toast({
        title: "Tabela de preços atualizada",
        description: `A tabela foi atualizada com sucesso.`,
      });
    } catch (error) {
      console.error("Error updating price table:", error);
      toast({
        title: "Erro ao atualizar tabela de preços",
        description: "Ocorreu um erro ao atualizar a tabela de preços. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const deletePriceTable = async (id: string) => {
    try {
      const { error } = await supabase
        .from('price_tables')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setPriceTables((prev) => prev.filter((table) => table.id !== id));
      
      toast({
        title: "Tabela de preços removida",
        description: `A tabela foi removida com sucesso.`,
      });
    } catch (error) {
      console.error("Error deleting price table:", error);
      toast({
        title: "Erro ao remover tabela de preços",
        description: "Ocorreu um erro ao remover a tabela de preços. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const getPriceTable = (id: string) => {
    return priceTables.find((table) => table.id === id);
  };
  
  const calculateInsurance = (
    priceTableId: string, 
    invoiceValue: number, 
    isReshipment: boolean,
    cargoType: 'standard' | 'perishable'
  ) => {
    const table = getPriceTable(priceTableId);
    if (!table || !table.insurance) return 0;
    
    if (isReshipment) {
      return invoiceValue * 0.01;
    }
    
    const rate = cargoType === 'perishable' 
      ? (table.insurance.perishable || table.insurance.rate) 
      : (table.insurance.standard || table.insurance.rate);
      
    return invoiceValue * rate;
  };
  
  return (
    <PriceTablesContext.Provider value={{
      priceTables,
      addPriceTable,
      updatePriceTable,
      deletePriceTable,
      getPriceTable,
      calculateInsurance,
      loading,
    }}>
      {children}
    </PriceTablesContext.Provider>
  );
};

export const usePriceTables = () => {
  const context = useContext(PriceTablesContext);
  if (context === undefined) {
    throw new Error('usePriceTables must be used within a PriceTablesProvider');
  }
  return context;
};
